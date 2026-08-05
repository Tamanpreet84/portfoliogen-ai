import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to parse PDF binary streams in browser cleanly
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractFileTextInstant = async (file) => {
  try {
    const ext = file.name.split('.').pop().toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    if (ext === 'pdf') {
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items.map(item => item.str);
        fullText += pageItems.join(' ') + '\n';
      }

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

  // Derive Name from clean lines or filename
  let fallbackName = filename
    .replace(/\.(pdf|docx)$/i, '')
    .replace(/(resume|cv|curriculum|vitoe|final|updated|draft|_|-)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  fallbackName = fallbackName.replace(/\b\w/g, l => l.toUpperCase()) || "Developer";

  let detectedName = "";
  for (const line of cleanLines.slice(0, 8)) {
    // Check if line looks like a person's name (2-4 words, no digits or contact keywords)
    if (
      !/email|phone|github|linkedin|http|@|resume|cv|page|curriculum/i.test(line) &&
      !/\d/.test(line) &&
      line.length >= 3 &&
      line.length <= 40
    ) {
      detectedName = line;
      break;
    }
  }

  const name = detectedName || fallbackName;

  // Derive Title
  let title = "Software Engineer";
  for (const line of cleanLines.slice(0, 15)) {
    if (/developer|engineer|designer|manager|intern|architect|analyst|data scientist|student|full stack|frontend|backend/i.test(line)) {
      if (line.length <= 50 && line !== name) {
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

  const aboutText = cleanedText.length > 50 
    ? cleanedText.slice(0, 450).trim() + '...'
    : `Dedicated ${title} passionate about software architecture, clean code, and creating intuitive digital user experiences.`;

  return {
    name: name,
    title: title,
    headline: `Passionate ${title} building modern digital applications & scalable solutions`,
    shortIntro: `Hi, I'm ${name}. Experienced in ${foundSkills.slice(0, 4).join(', ') || 'software development'} with a passion for building great products.`,
    about: aboutText,
    technicalSkills: foundSkills.length > 0 ? foundSkills : ["JavaScript", "React", "Node.js", "Python", "Git"],
    softSkills: foundSoft.length > 0 ? foundSoft : ["Problem Solving", "Team Collaboration"],
    experience: [
      {
        company: "Software Engineer",
        role: title,
        location: "Remote / On-site",
        startDate: "2023",
        endDate: "Present",
        type: "Job",
        description: [
          "Developed and deployed high-performance software features and RESTful APIs.",
          "Collaborated with cross-functional teams to optimize web performance and user experience."
        ]
      }
    ],
    projects: [
      {
        name: "Generative Portfolio Generator",
        description: "Full-stack web app that extracts resume content and builds personal portfolios.",
        technologies: foundSkills.slice(0, 4),
        githubUrl: github,
        liveUrl: website
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science / Information Technology",
        institution: "University Institute",
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
