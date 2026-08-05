import React from 'react';
import { Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { Github, Linkedin } from '../common/SocialIcons';

export const MinimalTemplate = ({ resumeData, theme = 'light', sectionVisibility = {}, sectionOrder = [] }) => {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';
  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
  const accent = 'text-blue-500';

  const visibleSections = sectionOrder.filter(sec => sectionVisibility[sec] !== false);

  const renderHero = () => (
    <section id="hero" key="hero" className="py-16 px-6 max-w-4xl mx-auto">
      <span className={`text-xs font-bold uppercase tracking-widest ${accent}`}>
        {resumeData.title || 'Professional Portfolio'}
      </span>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-2 mb-4">
        {resumeData.name}
      </h1>
      <p className={`text-lg md:text-xl font-medium ${accent} mb-6 leading-relaxed`}>
        {resumeData.headline || resumeData.shortIntro}
      </p>
      <p className={`text-base leading-relaxed ${textMuted} mb-8 max-w-2xl`}>
        {resumeData.shortIntro}
      </p>
      <div className="flex flex-wrap gap-4">
        {resumeData.contact?.email && (
          <a href={`mailto:${resumeData.contact.email}`} className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition">
            Get In Touch
          </a>
        )}
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" key="about" className={`py-12 px-6 max-w-4xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4">About</h2>
      <p className={`text-base leading-relaxed ${textMuted}`}>{resumeData.about}</p>
    </section>
  );

  const renderSkills = () => (
    <section id="skills" key="skills" className={`py-12 px-6 max-w-4xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Skills & Competencies</h2>
      <div className="flex flex-wrap gap-2">
        {(resumeData.technicalSkills || []).map((s, i) => (
          <span key={i} className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${cardBg}`}>
            {s}
          </span>
        ))}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section id="projects" key="projects" className={`py-12 px-6 max-w-4xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Selected Projects</h2>
      <div className="space-y-6">
        {(resumeData.projects || []).map((p, i) => (
          <div key={i} className={`p-6 rounded-xl border ${cardBg}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{p.name}</h3>
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className={`text-sm ${textMuted} mb-4 leading-relaxed`}>{p.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.technologies || []).map((tech, ti) => (
                <span key={ti} className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
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
    <section id="experience" key="experience" className={`py-12 px-6 max-w-4xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Experience</h2>
      <div className="space-y-6">
        {(resumeData.experience || []).map((exp, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-base font-bold">{exp.role} <span className="text-blue-500 font-normal">@ {exp.company}</span></h3>
              <span className={`text-xs ${textMuted}`}>{exp.startDate} - {exp.endDate || 'Present'}</span>
            </div>
            <ul className={`list-disc list-inside text-sm ${textMuted} space-y-1`}>
              {(exp.description || []).map((b, bi) => <li key={bi}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const renderEducation = () => (
    <section id="education" key="education" className={`py-12 px-6 max-w-4xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-6">Education</h2>
      <div className="space-y-4">
        {(resumeData.education || []).map((edu, i) => (
          <div key={i}>
            <h3 className="text-base font-bold">{edu.degree}</h3>
            <p className={`text-sm ${textMuted}`}>{edu.institution} {edu.endDate ? `(${edu.endDate})` : ''}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderContact = () => (
    <section id="contact" key="contact" className={`py-16 px-6 max-w-4xl mx-auto border-t text-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <p className={`text-sm ${textMuted} mb-6`}>Reach out directly via email or connect on social platforms.</p>
      <div className="flex justify-center gap-4 text-xs font-semibold">
        {resumeData.contact?.email && <a href={`mailto:${resumeData.contact.email}`} className="text-blue-500 hover:underline">{resumeData.contact.email}</a>}
        {resumeData.contact?.github && <a href={resumeData.contact.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">GitHub</a>}
        {resumeData.contact?.linkedin && <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">LinkedIn</a>}
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
