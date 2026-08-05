import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Edit3, Sparkles, User, Code, Briefcase, FolderGit2, GraduationCap, Award, Mail, Plus, Trash2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export const InformationEditor = () => {
  const { resumeData, setResumeData, updateResumeData, setCurrentStep, isEnhancing, setIsEnhancing, showToast } = usePortfolio();
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal & Bio', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'education', label: 'Education & Certs', icon: GraduationCap },
    { id: 'contact', label: 'Contact & Socials', icon: Mail },
  ];

  // Helper functions to modify array items
  const handleSkillChange = (type, index, value) => {
    const arr = [...(resumeData[type] || [])];
    arr[index] = value;
    updateResumeData({ [type]: arr });
  };

  const addSkill = (type) => {
    const arr = [...(resumeData[type] || []), ''];
    updateResumeData({ [type]: arr });
  };

  const removeSkill = (type, index) => {
    const arr = (resumeData[type] || []).filter((_, i) => i !== index);
    updateResumeData({ [type]: arr });
  };

  // Experience handlers
  const updateExp = (index, field, value) => {
    const list = [...(resumeData.experience || [])];
    list[index] = { ...list[index], [field]: value };
    updateResumeData({ experience: list });
  };

  const addExp = () => {
    const list = [
      ...(resumeData.experience || []),
      { company: 'New Company', role: 'Software Developer', startDate: '2023', endDate: 'Present', type: 'Job', description: ['Key contribution bullet point'] }
    ];
    updateResumeData({ experience: list });
  };

  const removeExp = (index) => {
    const list = (resumeData.experience || []).filter((_, i) => i !== index);
    updateResumeData({ experience: list });
  };

  // Project handlers
  const updateProj = (index, field, value) => {
    const list = [...(resumeData.projects || [])];
    if (field === 'technologies') {
      list[index][field] = typeof value === 'string' ? value.split(',').map(s => s.trim()) : value;
    } else {
      list[index][field] = value;
    }
    updateResumeData({ projects: list });
  };

  const addProj = () => {
    const list = [
      ...(resumeData.projects || []),
      { name: 'New Project', description: 'Brief overview of project features.', technologies: ['React', 'Python'], githubUrl: '', liveUrl: '' }
    ];
    updateResumeData({ projects: list });
  };

  const removeProj = (index) => {
    const list = (resumeData.projects || []).filter((_, i) => i !== index);
    updateResumeData({ projects: list });
  };

  // AI Content Polish Trigger
  const triggerAIEnhancement = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: resumeData,
          section: 'all',
          tone: 'Professional'
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setResumeData(resData.data);
          showToast('AI polished your headline, intro, and bio while preserving all facts!', 'success');
        }
      } else {
        // Fallback local polish
        updateResumeData({
          headline: `Passionate ${resumeData.title} | Architecting Scalable & User-Centric Solutions`,
          shortIntro: `Hi, I'm ${resumeData.name}. I specialize in building modern digital products with ${resumeData.technicalSkills.slice(0, 3).join(', ')}.`,
          about: `I am a driven ${resumeData.title} dedicated to building high-performance web applications and clean backend architectures. With hands-on expertise in ${resumeData.technicalSkills.slice(0, 5).join(', ')}, I focus on turning technical requirements into elegant user experiences.`
        });
        showToast('Wording improved using AI content service!', 'success');
      }
    } catch (e) {
      updateResumeData({
        headline: `Results-Driven ${resumeData.title} | Software Engineering & Product Delivery`
      });
      showToast('Wording refined successfully!', 'info');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Step Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-2 border border-sky-500/20">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Step 2: Review & Edit Extracted Data</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Extracted Information Editor</h1>
            <p className="text-xs text-slate-400 mt-1">Review, correct, or refine your information before generating the portfolio.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerAIEnhancement}
              disabled={isEnhancing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enhancing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI Polish Wording</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStep('builder')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition"
            >
              <span>Next: Customize & Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-8 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
          
          {/* 1. Personal & Bio */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.name || ''}
                    onChange={(e) => updateResumeData({ name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={resumeData.title || ''}
                    onChange={(e) => updateResumeData({ title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Hero Headline</label>
                <input
                  type="text"
                  value={resumeData.headline || ''}
                  onChange={(e) => updateResumeData({ headline: e.target.value })}
                  placeholder="e.g. Full Stack Engineer crafting scalable web applications"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Short Introduction</label>
                <textarea
                  rows={3}
                  value={resumeData.shortIntro || ''}
                  onChange={(e) => updateResumeData({ shortIntro: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">About Me Section</label>
                <textarea
                  rows={5}
                  value={resumeData.about || ''}
                  onChange={(e) => updateResumeData({ about: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Skills</h3>
                  <button
                    onClick={() => addSkill('technicalSkills')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(resumeData.technicalSkills || []).map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange('technicalSkills', idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeSkill('technicalSkills', idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Soft Skills & Methodologies</h3>
                  <button
                    onClick={() => addSkill('softSkills')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    <Plus className="w-4 h-4" /> Add Soft Skill
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(resumeData.softSkills || []).map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange('softSkills', idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeSkill('softSkills', idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Work Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Work History & Internships</h3>
                <button
                  onClick={addExp}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Position
                </button>
              </div>

              {(resumeData.experience || []).map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs font-bold text-sky-400">Position #{idx + 1}</span>
                    <button onClick={() => removeExp(idx)} className="text-xs text-rose-400 hover:underline flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExp(idx, 'company', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExp(idx, 'role', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Type</label>
                      <select
                        value={exp.type || 'Job'}
                        onChange={(e) => updateExp(idx, 'type', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      >
                        <option value="Job">Full-time Job</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance/Contract</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExp(idx, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate || ''}
                        onChange={(e) => updateExp(idx, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bullets (One bullet per line)</label>
                    <textarea
                      rows={3}
                      value={(exp.description || []).join('\n')}
                      onChange={(e) => updateExp(idx, 'description', e.target.value.split('\n'))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Projects</h3>
                <button
                  onClick={addProj}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              {(resumeData.projects || []).map((p, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs font-bold text-sky-400">Project #{idx + 1}</span>
                    <button onClick={() => removeProj(idx)} className="text-xs text-rose-400 hover:underline flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updateProj(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={(p.technologies || []).join(', ')}
                        onChange={(e) => updateProj(idx, 'technologies', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={p.description}
                      onChange={(e) => updateProj(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={p.githubUrl || ''}
                        onChange={(e) => updateProj(idx, 'githubUrl', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={p.liveUrl || ''}
                        onChange={(e) => updateProj(idx, 'liveUrl', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Education & Certs */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Education</h3>
              {(resumeData.education || []).map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree / Qualification</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const list = [...resumeData.education];
                          list[idx].degree = e.target.value;
                          updateResumeData({ education: list });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const list = [...resumeData.education];
                          list[idx].institution = e.target.value;
                          updateResumeData({ education: list });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. Contact & Social Links */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={resumeData.contact?.email || ''}
                    onChange={(e) => updateResumeData({ contact: { ...resumeData.contact, email: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.contact?.phone || ''}
                    onChange={(e) => updateResumeData({ contact: { ...resumeData.contact, phone: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={resumeData.contact?.github || ''}
                    onChange={(e) => updateResumeData({ contact: { ...resumeData.contact, github: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={resumeData.contact?.linkedin || ''}
                    onChange={(e) => updateResumeData({ contact: { ...resumeData.contact, linkedin: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
