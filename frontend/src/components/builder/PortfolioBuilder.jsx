import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { Layout, Smartphone, Monitor, Moon, Sun, ArrowUp, ArrowDown, Eye, EyeOff, Sparkles, Download, ArrowRight, Palette } from 'lucide-react';

export const PortfolioBuilder = () => {
  const {
    resumeData,
    activeTemplate,
    setActiveTemplate,
    portfolioTheme,
    setPortfolioTheme,
    previewMode,
    setPreviewMode,
    sectionOrder,
    moveSection,
    sectionVisibility,
    toggleSectionVisibility,
    setCurrentStep
  } = usePortfolio();

  const templates = [
    { id: 'minimal', label: 'Minimal Professional' },
    { id: 'developer', label: 'Developer Portfolio' },
    { id: 'creative', label: 'Modern Creative' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Builder Sub-header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Live Portfolio Builder</h2>
            <p className="text-[10px] text-slate-400">Customize layout, themes, & section ordering in real-time.</p>
          </div>
        </div>

        {/* Viewport & Theme controls */}
        <div className="flex items-center gap-3">
          {/* Desktop/Mobile mode toggle */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                previewMode === 'desktop' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                previewMode === 'mobile' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          {/* Light/Dark mode toggle */}
          <button
            onClick={() => setPortfolioTheme(portfolioTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs"
          >
            {portfolioTheme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="capitalize">{portfolioTheme} Mode</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setCurrentStep('export')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export & Deploy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Workspace (Split View) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Sidebar Control Panel */}
        <div className="lg:col-span-4 p-6 bg-slate-900/60 border-r border-slate-800 overflow-y-auto space-y-6">
          
          {/* Template Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-sky-400" /> Portfolio Template
            </label>
            <div className="grid grid-cols-1 gap-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`p-3 rounded-xl text-left border text-xs font-bold flex items-center justify-between transition ${
                    activeTemplate === t.id
                      ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{t.label}</span>
                  {activeTemplate === t.id && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section Ordering & Visibility */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Section Layout & Visibility
            </label>
            <div className="space-y-2">
              {sectionOrder.map((sec, idx) => {
                const isVisible = sectionVisibility[sec] !== false;
                return (
                  <div
                    key={sec}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <span className={`font-semibold capitalize ${isVisible ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                      {sec}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSection(sec, 'up')}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        disabled={idx === sectionOrder.length - 1}
                        onClick={() => moveSection(sec, 'down')}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => toggleSectionVisibility(sec)}
                        className={`p-1 rounded ml-1 transition ${
                          isVisible ? 'text-sky-400 hover:text-sky-300' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Information Quick Edit Link */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2">Want to change text details?</p>
            <button
              onClick={() => setCurrentStep('editor')}
              className="text-xs font-bold text-sky-400 hover:underline"
            >
              ← Back to Information Editor
            </button>
          </div>

        </div>

        {/* Right Live Preview Frame */}
        <div className="lg:col-span-8 bg-slate-950 p-4 md:p-8 flex justify-center items-center overflow-y-auto">
          <div className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 ${
            previewMode === 'mobile' 
              ? 'w-[375px] h-[700px] my-auto overflow-y-auto rounded-[36px] border-4 border-slate-800 shadow-sky-500/10' 
              : 'w-full h-full max-w-5xl rounded-xl overflow-y-auto'
          }`}>
            <TemplateRenderer
              activeTemplate={activeTemplate}
              resumeData={resumeData}
              portfolioTheme={portfolioTheme}
              sectionVisibility={sectionVisibility}
              sectionOrder={sectionOrder}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
