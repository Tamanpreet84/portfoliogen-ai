import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const generateStaticHTML = (resumeData, template = 'developer', theme = 'light', sectionOrder = [], sectionVisibility = {}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0b0f19' : '#ffffff';
  const cardBg = isDark ? '#161e2e' : '#f8fafc';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#475569';
  const accentColor = template === 'developer' ? '#38bdf8' : template === 'creative' ? '#a855f7' : '#2563eb';

  const visibleSections = sectionOrder.filter(sec => sectionVisibility[sec] !== false);

  const renderHero = () => `
    <header id="hero" class="hero-section text-center py-20 px-6 max-w-4xl mx-auto">
      <div class="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold tracking-wide" style="background: ${accentColor}20; color: ${accentColor}; border: 1px solid ${accentColor}40;">
        ${resumeData.title || 'Software Professional'}
      </div>
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4" style="color: ${textPrimary};">
        ${resumeData.name || 'Your Name'}
      </h1>
      <p class="text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium" style="color: ${accentColor};">
        "${resumeData.headline || resumeData.shortIntro}"
      </p>
      <p class="text-base max-w-2xl mx-auto mb-10 leading-relaxed" style="color: ${textSecondary};">
        ${resumeData.shortIntro || ''}
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        ${sectionVisibility.projects !== false ? `<a href="#projects" class="btn btn-primary px-6 py-3 rounded-lg font-semibold shadow-lg transition" style="background: ${accentColor}; color: #ffffff;">View Projects</a>` : ''}
        ${sectionVisibility.contact !== false ? `<a href="#contact" class="btn btn-outline px-6 py-3 rounded-lg font-semibold transition" style="border: 1px solid ${accentColor}; color: ${accentColor};">Contact Me</a>` : ''}
      </div>
    </header>
  `;

  const renderAbout = () => `
    <section id="about" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> About Me
      </h2>
      <div class="p-6 md:p-8 rounded-xl leading-relaxed text-base" style="background: ${cardBg}; color: ${textSecondary}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
        <p>${resumeData.about || 'Welcome to my professional portfolio website.'}</p>
      </div>
    </section>
  `;

  const renderSkills = () => `
    <section id="skills" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> Technical & Professional Skills
      </h2>
      <div class="mb-6">
        <h3 class="text-sm uppercase tracking-wider font-bold mb-3" style="color: ${textSecondary};">Technical Skills</h3>
        <div class="flex flex-wrap gap-2">
          ${(resumeData.technicalSkills || []).map(skill => `
            <span class="px-3 py-1.5 rounded-md text-sm font-medium" style="background: ${isDark ? '#1e293b' : '#e2e8f0'}; color: ${textPrimary}; border: 1px solid ${accentColor}30;">
              ${skill}
            </span>
          `).join('')}
        </div>
      </div>
      ${(resumeData.softSkills || []).length > 0 ? `
      <div>
        <h3 class="text-sm uppercase tracking-wider font-bold mb-3" style="color: ${textSecondary};">Soft Skills & Methodologies</h3>
        <div class="flex flex-wrap gap-2">
          ${(resumeData.softSkills || []).map(s => `
            <span class="px-3 py-1.5 rounded-md text-sm font-medium" style="background: ${isDark ? '#0f172a' : '#f1f5f9'}; color: ${textSecondary}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </section>
  `;

  const renderProjects = () => `
    <section id="projects" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> Featured Projects
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${(resumeData.projects || []).map(p => `
          <div class="project-card p-6 rounded-xl flex flex-col justify-between" style="background: ${cardBg}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
            <div>
              <h3 class="text-xl font-bold mb-2" style="color: ${textPrimary};">${p.name}</h3>
              <p class="text-sm mb-4 leading-relaxed" style="color: ${textSecondary};">${p.description}</p>
              <div class="flex flex-wrap gap-1.5 mb-6">
                ${(p.technologies || []).map(tech => `
                  <span class="text-xs px-2 py-1 rounded" style="background: ${accentColor}15; color: ${accentColor}; font-weight: 500;">${tech}</span>
                `).join('')}
              </div>
            </div>
            <div class="flex gap-4 text-sm font-semibold border-t pt-4" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="hover:underline flex items-center gap-1" style="color: ${accentColor};">GitHub →</a>` : ''}
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="hover:underline flex items-center gap-1" style="color: ${accentColor};">Live Demo ↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const renderExperience = () => `
    <section id="experience" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> Work & Professional Experience
      </h2>
      <div class="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5" style="border-left: 2px solid ${isDark ? '#1e293b' : '#e2e8f0'};">
        ${(resumeData.experience || []).map(exp => `
          <div class="relative pl-8">
            <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full" style="background: ${accentColor};"></div>
            <div class="flex flex-wrap items-baseline justify-between mb-1">
              <h3 class="text-xl font-bold" style="color: ${textPrimary};">${exp.role}</h3>
              <span class="text-xs font-semibold px-2 py-0.5 rounded" style="background: ${isDark ? '#1e293b' : '#e2e8f0'}; color: ${textSecondary};">
                ${exp.startDate} - ${exp.endDate || 'Present'}
              </span>
            </div>
            <div class="text-sm font-medium mb-3" style="color: ${accentColor};">
              ${exp.company} ${exp.location ? `• ${exp.location}` : ''} (${exp.type || 'Job'})
            </div>
            <ul class="list-disc list-inside text-sm space-y-1.5 leading-relaxed" style="color: ${textSecondary};">
              ${(exp.description || []).map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const renderEducation = () => `
    <section id="education" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> Education & Academic Qualifications
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${(resumeData.education || []).map(edu => `
          <div class="p-6 rounded-xl" style="background: ${cardBg}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
            <h3 class="text-lg font-bold mb-1" style="color: ${textPrimary};">${edu.degree}</h3>
            <p class="text-sm font-medium mb-2" style="color: ${accentColor};">${edu.institution}</p>
            <p class="text-xs mb-2" style="color: ${textSecondary};">${edu.startDate || ''} ${edu.endDate ? `- ${edu.endDate}` : ''}</p>
            ${edu.details ? `<p class="text-xs italic" style="color: ${textSecondary};">${edu.details}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const renderCertifications = () => `
    <section id="certifications" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> Certifications & Credentials
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${(resumeData.certifications || []).map(c => `
          <div class="p-4 rounded-lg" style="background: ${cardBg}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
            <h3 class="font-bold text-sm mb-1" style="color: ${textPrimary};">${c.name}</h3>
            <p class="text-xs" style="color: ${textSecondary};">${c.issuer || ''} ${c.date ? `(${c.date})` : ''}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const renderAchievements = () => `
    <section id="achievements" class="section py-16 px-6 max-w-4xl mx-auto border-t" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2" style="color: ${textPrimary};">
        <span style="color: ${accentColor};">/</span> Honors & Achievements
      </h2>
      <div class="space-y-4">
        ${(resumeData.achievements || []).map(a => `
          <div class="p-4 rounded-lg flex items-start justify-between gap-4" style="background: ${cardBg}; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'};">
            <div>
              <h3 class="font-bold text-base" style="color: ${textPrimary};">${a.title}</h3>
              ${a.description ? `<p class="text-sm mt-1" style="color: ${textSecondary};">${a.description}</p>` : ''}
            </div>
            ${a.year ? `<span class="text-xs font-semibold px-2.5 py-1 rounded" style="background: ${accentColor}20; color: ${accentColor};">${a.year}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const renderContact = () => `
    <section id="contact" class="section py-20 px-6 max-w-4xl mx-auto border-t text-center" style="border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
      <h2 class="text-3xl font-bold mb-4" style="color: ${textPrimary};">Get In Touch</h2>
      <p class="text-base max-w-xl mx-auto mb-8" style="color: ${textSecondary};">
        Interested in collaborating, hiring, or discussing projects? Feel free to connect!
      </p>
      <div class="flex flex-wrap justify-center gap-4 mb-10">
        ${resumeData.contact?.email ? `<a href="mailto:${resumeData.contact.email}" class="px-6 py-3 rounded-lg font-semibold text-white transition" style="background: ${accentColor};">Email Me</a>` : ''}
        ${resumeData.contact?.github ? `<a href="${resumeData.contact.github}" target="_blank" class="px-6 py-3 rounded-lg font-semibold transition" style="border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; color: ${textPrimary};">GitHub</a>` : ''}
        ${resumeData.contact?.linkedin ? `<a href="${resumeData.contact.linkedin}" target="_blank" class="px-6 py-3 rounded-lg font-semibold transition" style="border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; color: ${textPrimary};">LinkedIn</a>` : ''}
      </div>
      <p class="text-xs" style="color: ${textSecondary};">
        © ${new Date().getFullYear()} ${resumeData.name || 'Portfolio'}. Built with PortfolioGen AI.
      </p>
    </section>
  `;

  const sectionMap = {
    hero: renderHero,
    about: renderAbout,
    skills: renderSkills,
    projects: renderProjects,
    experience: renderExperience,
    education: renderEducation,
    certifications: renderCertifications,
    achievements: renderAchievements,
    contact: renderContact
  };

  const bodyContent = visibleSections.map(sec => sectionMap[sec] ? sectionMap[sec]() : '').join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.name || 'Portfolio'} - ${resumeData.title || 'Professional Portfolio'}</title>
  <meta name="description" content="${resumeData.headline || resumeData.shortIntro || 'Personal Developer Portfolio'}">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: ${bgColor}; color: ${textPrimary}; scroll-behavior: smooth; font-family: system-ui, -apple-system, sans-serif; }
    .project-card:hover { transform: translateY(-4px); transition: transform 0.2s ease; }
  </style>
</head>
<body>
  <!-- Navigation Header -->
  <nav class="sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4" style="background: ${bgColor}d0; border-color: ${isDark ? '#1e293b' : '#e2e8f0'};">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <a href="#hero" class="font-extrabold text-lg tracking-tight" style="color: ${accentColor};">${resumeData.name || 'Portfolio'}</a>
      <div class="hidden sm:flex gap-6 text-sm font-medium" style="color: ${textSecondary};">
        <a href="#about" class="hover:text-sky-400">About</a>
        <a href="#skills" class="hover:text-sky-400">Skills</a>
        <a href="#projects" class="hover:text-sky-400">Projects</a>
        <a href="#experience" class="hover:text-sky-400">Experience</a>
        <a href="#contact" class="hover:text-sky-400">Contact</a>
      </div>
    </div>
  </nav>

  <main>
    ${bodyContent}
  </main>
</body>
</html>`;
};

export const exportPortfolioZip = async (resumeData, template, theme, sectionOrder, sectionVisibility) => {
  const zip = new JSZip();

  const htmlContent = generateStaticHTML(resumeData, template, theme, sectionOrder, sectionVisibility);
  
  zip.file('index.html', htmlContent);

  const readmeContent = `# ${resumeData.name || 'Developer'} Portfolio Website

Generated using **PortfolioGen AI**.

## How to Deploy

### Option 1: Deploy to Vercel (Recommended)
1. Install Vercel CLI: \`npm install -g vercel\`
2. Run \`vercel\` in this folder and follow prompts.
3. Your site will be live instantly!

### Option 2: Deploy to Netlify
1. Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop).

### Option 3: Deploy to GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to Repository Settings -> Pages -> Source: \`main\` branch.

Enjoy your portfolio!
`;
  zip.file('README.md', readmeContent);

  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `${(resumeData.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-portfolio.zip`;
  saveAs(blob, filename);
};
