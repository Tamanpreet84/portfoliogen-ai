// Client-side instant resume text and field extractor

export const parseResumeTextClient = (rawText, filename = 'resume.pdf') => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // Email, Phone, Social links regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const githubMatch = rawText.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = rawText.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const websiteMatch = rawText.match(/https?:\/\/(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);

  const email = emailMatch ? emailMatch[0] : "";
  const phone = phoneMatch ? phoneMatch[0] : "";
  const github = githubMatch ? githubMatch[0] : "";
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";
  const website = websiteMatch ? websiteMatch[0] : "";

  // Extract Name (First non-contact short line)
  let name = filename.replace(/\.(pdf|docx)$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  let title = "Software Engineer";

  for (const line of lines.slice(0, 5)) {
    if (!/resume|cv|curriculum|email|phone|http|@/i.test(line) && line.length < 35 && line.length > 2) {
      name = line;
      break;
    }
  }

  for (const line of lines.slice(1, 8)) {
    if (/developer|engineer|designer|manager|intern|architect|analyst|data scientist|student/i.test(line)) {
      if (line.length < 50 && line !== name) {
        title = line;
        break;
      }
    }
  }

  // Skills Extraction
  const techKeywords = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express",
    "FastAPI", "Python", "Django", "Flask", "Java", "C++", "C#", "Go", "Rust", "SQL", "PostgreSQL",
    "MongoDB", "MySQL", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "GitHub", "Tailwind CSS",
    "HTML", "CSS", "REST API", "GraphQL", "PyTorch", "TensorFlow", "Machine Learning"
  ];

  const foundSkills = techKeywords.filter(skill => 
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText)
  );

  const softKeywords = ["Problem Solving", "Leadership", "Teamwork", "Agile", "Scrum", "Communication"];
  const foundSoft = softKeywords.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(rawText));

  return {
    name: name || "Developer",
    title: title || "Software Professional",
    headline: `Passionate ${title || 'Developer'} building modern digital applications & scalable solutions`,
    shortIntro: `Hi, I'm ${name || 'there'}. Experienced in ${foundSkills.slice(0, 3).join(', ') || 'software development'} with a passion for clean code.`,
    about: rawText.length > 50 
      ? rawText.slice(0, 400) + '...'
      : `I am a dedicated ${title} focused on delivering high quality software products and robust backend systems.`,
    technicalSkills: foundSkills.length > 0 ? foundSkills : ["JavaScript", "React", "Node.js", "Python", "Git"],
    softSkills: foundSoft.length > 0 ? foundSoft : ["Problem Solving", "Team Collaboration"],
    experience: [
      {
        company: "Software Solutions",
        role: title,
        location: "Remote",
        startDate: "2023",
        endDate: "Present",
        type: "Job",
        description: ["Engineered scalable features and maintained high-code quality standards."]
      }
    ],
    projects: [
      {
        name: "Personal Portfolio",
        description: "Automated portfolio generator built with React and FastAPI.",
        technologies: foundSkills.slice(0, 4),
        githubUrl: github,
        liveUrl: website
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science / Related Field",
        institution: "University / College",
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

export const extractFileTextInstant = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result || "";
      // Strip binary non-printable control characters
      const cleanText = content.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, ' ');
      resolve(cleanText);
    };
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
};
