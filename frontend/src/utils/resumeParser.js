import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to parse PDF binary streams in browser cleanly
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractPdfPageLines = (textContent) => {
  const lineMap = new Map();
  for (const item of textContent.items) {
    if (!item.str || !item.str.trim()) continue;
    // Round Y-coordinate to group items on the same visual line
    const y = item.transform ? Math.round(item.transform[5] / 4) * 4 : 0;
    if (!lineMap.has(y)) {
      lineMap.set(y, []);
    }
    lineMap.get(y).push(item);
  }

  // Sort lines from top of page to bottom (descending Y)
  const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);

  return sortedY
    .map(y => {
      // Sort items on the same line from left to right (ascending X)
      const items = lineMap.get(y).sort((a, b) => (a.transform ? a.transform[4] : 0) - (b.transform ? b.transform[4] : 0));
      return items.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
    })
    .filter(line => line.length > 0);
};

export const extractFileTextInstant = async (file) => {
  try {
    const ext = file.name.split('.').pop().toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    if (ext === 'pdf') {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      let pageLines = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const lines = extractPdfPageLines(textContent);
        pageLines.push(...lines);
      }

      const fullText = pageLines.join('\n');
      if (fullText.trim().length > 10) {
        return fullText;
      }
    }

    // DOCX or fallback plain text decoder
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(arrayBuffer));
    return decoded
      .replace(/<[^>]+>/g, ' ')
      .replace(/%PDF-[\s\S]*?obj/gi, '')
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, ' ');

  } catch (err) {
    console.warn('PDF.js browser parser warning:', err.message);
    const text = await file.text().catch(() => '');
    return text
      .replace(/%PDF-[\s\S]*?obj/gi, '')
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, ' ');
  }
};

export const parseResumeTextClient = (rawText, filename = 'resume.pdf') => {
  // Filter out any leftover raw PDF object lines
  const cleanLines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => {
      if (!l) return false;
      if (/^%PDF/i.test(l)) return false;
      if (/^\d+ \d+ obj/i.test(l)) return false;
      if (/^<</.test(l) || /^>>/.test(l)) return false;
      if (/^endobj/i.test(l) || /^stream/i.test(l) || /^endstream/i.test(l)) return false;
      if (/^\/(Type|Pages|Catalog|Font|Length|Filter|MediaBox)/i.test(l)) return false;
      return true;
    });

  const cleanedText = cleanLines.join('\n');

  // Contact Regexes
  const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = cleanedText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const githubMatch = cleanedText.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = cleanedText.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const websiteMatch = cleanedText.match(/https?:\/\/(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);

  const email = emailMatch ? emailMatch[0] : "";
  const phone = phoneMatch ? phoneMatch[0] : "";
  const github = githubMatch ? githubMatch[0] : "";
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";
  const website = websiteMatch ? websiteMatch[0] : "";

  // 1. Detect Real Name from CV Top Lines
  let detectedName = "";
  for (const line of cleanLines.slice(0, 10)) {
    if (/email|phone|github|linkedin|http|@|resume|cv|curriculum|page|contact|address|cgpa|gpa|profile/i.test(line)) {
      continue;
    }
    if (/\d/.test(line)) continue;
    
    const wordCount = line.split(/\s+/).length;
    if (wordCount >= 1 && wordCount <= 4 && line.length >= 2 && line.length <= 35) {
      detectedName = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
      if (detectedName) break;
    }
  }

  // 2. Name Fallback from Email Address (e.g. tamanpreet.singh@gmail.com -> Tamanpreet Singh)
  let emailNameFallback = "";
  if (!detectedName && email) {
    const handle = email.split('@')[0].replace(/[._-]/g, ' ');
    if (handle.length > 2) {
      emailNameFallback = handle.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  // 3. Fallback from Filename (Cleaning out words like 'resume', 'cv', 'cgpa', 'new', 'final')
  let filenameFallback = filename
    .replace(/\.(pdf|docx)$/i, '')
    .replace(/(resume|cv|curriculum|vitoe|final|updated|draft|cgpa|gpa|_|-)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  filenameFallback = filenameFallback.replace(/\b\w/g, l => l.toUpperCase()) || "Developer";

  const name = detectedName || emailNameFallback || filenameFallback;

  // Derive Title
  let title = "Software Engineer";
  for (const line of cleanLines.slice(0, 15)) {
    if (/developer|engineer|designer|manager|intern|architect|analyst|data scientist|student|full stack|frontend|backend/i.test(line)) {
      if (line.length <= 60 && line !== name) {
        title = line;
        break;
      }
    }
  }

  // Tech Skills Extraction
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express",
    "FastAPI", "Python", "Django", "Flask", "Java", "C++", "C#", "Go", "Rust", "SQL", "PostgreSQL",
    "MongoDB", "MySQL", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "GitHub", "Tailwind CSS",
    "HTML", "CSS", "REST API", "GraphQL", "PyTorch", "TensorFlow", "Machine Learning"
  ];

  const foundSkills = techKeywords.filter(skill => 
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(cleanedText)
  );

  const softKeywords = ["Problem Solving", "Leadership", "Teamwork", "Agile", "Scrum", "Communication"];
  const foundSoft = softKeywords.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(cleanedText));

  // Extract Summary / About section from CV text
  let aboutText = "";
  for (let i = 0; i < cleanLines.length; i++) {
    const l = cleanLines[i];
    if (/summary|about|profile|objective/i.test(l) && l.length < 30) {
      aboutText = cleanLines.slice(i + 1, i + 5).join(' ');
      break;
    }
  }

  if (!aboutText || aboutText.length < 20) {
    aboutText = cleanLines.slice(0, 6).filter(l => l !== name && l !== title).join(' ');
  }

  if (!aboutText || aboutText.length < 20) {
    aboutText = `Passionate ${title} with expertise in building scalable web applications, clean code architecture, and high-performance software.`;
  } else if (aboutText.length > 400) {
    aboutText = aboutText.slice(0, 400) + '...';
  }

  return {
    name: name,
    title: title,
    headline: `Passionate ${title} | Architecting Scalable & User-Centric Solutions`,
    shortIntro: `Hi, I'm ${name}. Experienced in ${foundSkills.slice(0, 4).join(', ') || 'software development'} with a passion for clean code.`,
    about: aboutText,
    technicalSkills: foundSkills.length > 0 ? foundSkills : ["Python", "Flask", "Java", "React", "Git"],
    softSkills: foundSoft.length > 0 ? foundSoft : ["Problem Solving", "Team Collaboration"],
    experience: [
      {
        company: "Software Developer",
        role: title,
        location: "Remote / On-site",
        startDate: "2023",
        endDate: "Present",
        type: "Job",
        description: [
          "Engineered scalable applications and maintained high code quality standards.",
          "Collaborated with cross-functional teams to build intuitive user experiences."
        ]
      }
    ],
    projects: [
      {
        name: "Personal Portfolio Application",
        description: "Automated web application that extracts resume details and builds personal portfolios.",
        technologies: foundSkills.slice(0, 4),
        githubUrl: github,
        liveUrl: website
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science / Software Engineering",
        institution: "University / Institute",
        location: "",
        startDate: "",
        endDate: ""
      }
    ],
    certifications: [],
    achievements: [],
    contact: {
      email,
      phone,
      github,
      linkedin,
      website
    }
  };
};
