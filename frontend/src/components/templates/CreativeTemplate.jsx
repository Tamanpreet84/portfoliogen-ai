import React from 'react';
import { Sparkles, ArrowUpRight, Code, Briefcase, GraduationCap, Mail } from 'lucide-react';

export const CreativeTemplate = ({ resumeData, theme = 'dark', sectionVisibility = {}, sectionOrder = [] }) => {
  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
  const gradientText = 'bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent';

  const visibleSections = sectionOrder.filter(sec => sectionVisibility[sec] !== false);

  const renderHero = () => (
    <section id="hero" key="hero" className="py-20 px-6 max-w-4xl mx-auto text-center relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 blur-2xl opacity-30 absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none" />
      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
        {resumeData.title}
      </span>
      <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-4 ${gradientText}`}>
        {resumeData.name}
      </h1>
      <p className={`text-lg md:text-xl max-w-2xl mx-auto font-medium mb-6 ${textMuted}`}>
        "{resumeData.headline || resumeData.shortIntro}"
      </p>
    </section>
  );

  const renderAbout = () => (
    <section id="about" key="about" className="py-10 px-6 max-w-4xl mx-auto">
      <div className={`p-8 rounded-3xl border ${cardBg} shadow-xl`}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> About
        </h2>
        <p className={`text-base leading-relaxed ${textMuted}`}>{resumeData.about}</p>
      </div>
    </section>
  );

  const renderSkills = () => (
    <section id="skills" key="skills" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Code className="w-5 h-5 text-pink-400" /> Core Skills & Technologies
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {(resumeData.technicalSkills || []).map((s, i) => (
          <span key={i} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 border border-purple-500/20 shadow-sm">
            {s}
          </span>
        ))}
      </div>
    </section>
  );

  const renderProjects = () => (
    <section id="projects" key="projects" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(resumeData.projects || []).map((p, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${cardBg} hover:scale-[1.01] transition shadow-lg`}>
            <h3 className="text-lg font-bold mb-2">{p.name}</h3>
            <p className={`text-xs ${textMuted} mb-4 leading-relaxed`}>{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(p.technologies || []).map((t, ti) => (
                <span key={ti} className="text-[10px] px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 font-semibold">
                  {t}
                </span>
              ))}
            </div>
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:underline">
                View Project <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const renderExperience = () => (
    <section id="experience" key="experience" className="py-10 px-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Experience</h2>
      <div className="space-y-4">
        {(resumeData.experience || []).map((exp, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-base font-bold">{exp.role} <span className="text-purple-400">@ {exp.company}</span></h3>
              <span className="text-xs text-slate-500">{exp.startDate} - {exp.endDate || 'Present'}</span>
            </div>
            <ul className={`list-disc list-inside text-xs ${textMuted} space-y-1`}>
              {(exp.description || []).map((b, bi) => <li key={bi}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const renderContact = () => (
    <section id="contact" key="contact" className="py-16 px-6 max-w-4xl mx-auto text-center">
      <h2 className={`text-3xl font-black mb-4 ${gradientText}`}>Let's Build Something Together</h2>
      <div className="flex justify-center gap-4 text-xs font-bold">
        {resumeData.contact?.email && <a href={`mailto:${resumeData.contact.email}`} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">{resumeData.contact.email}</a>}
      </div>
    </section>
  );

  const sectionMap = {
    hero: renderHero,
    about: renderAbout,
    skills: renderSkills,
    projects: renderProjects,
    experience: renderExperience,
    contact: renderContact
  };

  return (
    <div className={`min-h-full font-sans transition-colors ${bg}`}>
      {visibleSections.map(sec => sectionMap[sec] ? sectionMap[sec]() : null)}
    </div>
  );
};
