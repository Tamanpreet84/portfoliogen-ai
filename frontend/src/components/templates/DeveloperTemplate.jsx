import React from 'react';
import { Terminal, Code2, Cpu, GitBranch, ExternalLink, Mail } from 'lucide-react';
import { Github, Linkedin } from '../common/SocialIcons';

export const DeveloperTemplate = ({ resumeData, theme = 'dark', sectionVisibility = {}, sectionOrder = [] }) => {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900';
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
  const accent = 'text-sky-400';

  const visibleSections = sectionOrder.filter(sec => sectionVisibility[sec] !== false);

  const renderHero = () => (
    <section id="hero" key="hero" className="py-16 px-6 max-w-4xl mx-auto">
      {/* Terminal Window Frame */}
      <div className={`rounded-2xl border ${cardBg} overflow-hidden shadow-2xl mb-8`}>
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-500">developer@portfolio:~</span>
        </div>

        <div className="p-6 md:p-8 font-mono space-y-4">
          <div className="text-xs text-emerald-400">$ bio --init</div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {resumeData.name}
          </h1>
          <p className="text-sm md:text-base text-sky-400 font-semibold">
            &gt; {resumeData.title}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
            "{resumeData.headline || resumeData.shortIntro}"
          </p>
        </div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" key="about" className="py-10 px-6 max-w-4xl mx-auto">
      <div className={`p-6 rounded-2xl border ${cardBg}`}>
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-4">
          <span className={accent}>//</span> About Me
        </h2>
        <p className={`text-sm leading-relaxed ${textMuted}`}>{resumeData.about}</p>
      </div>
    </section>
  );

  const renderSkills = () => (
    <section id="skills" key="skills" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-6">
        <span className={accent}>//</span> Tech Stack & Tools
      </h2>
      <div className="flex flex-wrap gap-2">
        {(resumeData.technicalSkills || []).map((s, i) => (
          <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {s}
          </span>
        ))}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section id="projects" key="projects" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-6">
        <span className={accent}>//</span> Featured Repositories & Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(resumeData.projects || []).map((p, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-between hover:border-sky-500/40 transition`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white font-mono">{p.name}</h3>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5" /> Code
                  </a>
                )}
              </div>
              <p className={`text-xs ${textMuted} mb-4 leading-relaxed`}>{p.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800">
              {(p.technologies || []).map((tech, ti) => (
                <span key={ti} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderExperience = () => (
    <section id="experience" key="experience" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-6">
        <span className={accent}>//</span> Career Timeline
      </h2>
      <div className="space-y-6 border-l-2 border-slate-800 pl-6 ml-2">
        {(resumeData.experience || []).map((exp, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-sky-400 border-4 border-slate-950" />
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-bold text-white">{exp.role}</h3>
              <span className="text-xs font-mono text-slate-500">{exp.startDate} - {exp.endDate || 'Present'}</span>
            </div>
            <p className="text-xs font-mono text-sky-400 mb-2">{exp.company} ({exp.type || 'Job'})</p>
            <ul className={`list-disc list-inside text-xs ${textMuted} space-y-1`}>
              {(exp.description || []).map((b, bi) => <li key={bi}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section id="education" key="education" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2 mb-6">
        <span className={accent}>//</span> Education
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(resumeData.education || []).map((edu, i) => (
          <div key={i} className={`p-4 rounded-xl border ${cardBg}`}>
            <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
            <p className="text-xs text-sky-400 font-mono mt-0.5">{edu.institution}</p>
            {edu.details && <p className="text-[11px] text-slate-500 italic mt-2">{edu.details}</p>}
          </div>
        ))}
      </div>
    </section>
  );

  const renderContact = () => (
    <section id="contact" key="contact" className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white font-mono mb-3">Connect & Collaborate</h2>
      <p className={`text-xs ${textMuted} mb-6`}>Open for software engineering opportunities and projects.</p>
      <div className="flex justify-center gap-4 text-xs font-mono">
        {resumeData.contact?.email && <a href={`mailto:${resumeData.contact.email}`} className="px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20">{resumeData.contact.email}</a>}
        {resumeData.contact?.github && <a href={resumeData.contact.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white">GitHub</a>}
        {resumeData.contact?.linkedin && <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white">LinkedIn</a>}
      </div>
    </section>
  );

  const sectionMap = {
    hero: renderHero,
    about: renderAbout,
    skills: renderSkills,
    projects: renderProjects,
    experience: renderExperience,
    education: renderEducation,
    contact: renderContact
  };

  return (
    <div className={`min-h-full font-sans transition-colors ${bg}`}>
      {visibleSections.map(sec => sectionMap[sec] ? sectionMap[sec]() : null)}
    </div>
  );
};
