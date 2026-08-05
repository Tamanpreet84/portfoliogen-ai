import React, { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export const initialResumeData = {
  name: "Alex Morgan",
  title: "Full Stack Software Engineer",
  headline: "Passionate Full Stack Engineer building high-performance web applications & AI integrations",
  shortIntro: "Hi, I'm Alex. I specialize in React, Node.js, Python, and cloud systems, transforming complex ideas into intuitive digital experiences.",
  about: "I am a Full Stack Software Engineer with 3+ years of experience building modern scalable applications. Highly skilled in frontend craftsmanship and robust backend API architecture. Fast learner committed to clean code, performance optimization, and continuous growth.",
  technicalSkills: ["JavaScript", "TypeScript", "React", "Next.js", "Python", "FastAPI", "Node.js", "Tailwind CSS", "PostgreSQL", "Docker", "Git"],
  softSkills: ["Problem Solving", "Team Leadership", "Agile Development", "System Design"],
  experience: [
    {
      company: "Apex Tech Innovations",
      role: "Senior Frontend Developer",
      location: "San Francisco, CA (Remote)",
      startDate: "2023",
      endDate: "Present",
      type: "Job",
      description: [
        "Architected responsive React web applications reducing initial page load times by 40%.",
        "Engineered real-time dashboard visualization tools serving 50k+ active monthly users.",
        "Mentored junior developers and led weekly code review sprints."
      ]
    },
    {
      company: "CloudScale Systems",
      role: "Software Engineering Intern",
      location: "Austin, TX",
      startDate: "2022",
      endDate: "2022",
      type: "Internship",
      description: [
        "Built automated REST API test pipelines using Python and Docker.",
        "Collaborated with backend teams to optimize SQL queries for analytics reports."
      ]
    }
  ],
  projects: [
    {
      name: "PortfolioGen AI",
      description: "Full-stack Generative AI application converting resumes into deployable personal portfolios using FastAPI and React.",
      technologies: ["React", "FastAPI", "Python", "Tailwind CSS", "Gemini API"],
      githubUrl: "https://github.com/Tamanpreet84/portfoliogen-ai",
      liveUrl: "https://portfoliogen-ai.vercel.app"
    },
    {
      name: "DevMetrics Dashboard",
      description: "Real-time analytics monitor tracking developer productivity metrics, GitHub actions, and deployment health.",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind CSS"],
      githubUrl: "https://github.com/alexmorgan/devmetrics",
      liveUrl: ""
    }
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2019",
      endDate: "2023",
      details: "GPA: 3.8/4.0 | Dean's Honor List"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialUrl: ""
    }
  ],
  achievements: [
    {
      title: "1st Place Winner - Berkeley Hackathon 2022",
      description: "Built an accessibility tool for visually impaired web users in 36 hours.",
      year: "2022"
    }
  ],
  contact: {
    email: "alex.morgan.dev@gmail.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    github: "https://github.com/alexmorgan",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    website: "https://alexmorgan.dev",
    twitter: ""
  }
};

export const defaultSectionOrder = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'achievements',
  'contact'
];

export const PortfolioProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState('landing'); // 'landing', 'upload', 'editor', 'builder', 'export'
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [activeTemplate, setActiveTemplate] = useState('developer'); // 'minimal', 'developer', 'creative'
  const [portfolioTheme, setPortfolioTheme] = useState('light'); // 'light', 'dark'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'mobile'
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
    achievements: true,
    contact: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateResumeData = (newFields) => {
    setResumeData(prev => ({ ...prev, ...newFields }));
  };

  const toggleSectionVisibility = (secKey) => {
    setSectionVisibility(prev => ({
      ...prev,
      [secKey]: !prev[secKey]
    }));
  };

  const moveSection = (secKey, direction) => {
    const idx = sectionOrder.indexOf(secKey);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return;
    
    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);
    setSectionOrder(newOrder);
  };

  return (
    <PortfolioContext.Provider value={{
      currentStep,
      setCurrentStep,
      resumeData,
      setResumeData,
      updateResumeData,
      activeTemplate,
      setActiveTemplate,
      portfolioTheme,
      setPortfolioTheme,
      previewMode,
      setPreviewMode,
      sectionOrder,
      setSectionOrder,
      moveSection,
      sectionVisibility,
      toggleSectionVisibility,
      isProcessing,
      setIsProcessing,
      isEnhancing,
      setIsEnhancing,
      toastMessage,
      showToast
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
