import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Upload, Edit3, Layout, Download, Sun, Moon } from 'lucide-react';
import { Github } from '../common/SocialIcons';

export const Navbar = () => {
  const { currentStep, setCurrentStep, toastMessage, appTheme, toggleAppTheme } = usePortfolio();

  const steps = [
    { id: 'upload', label: '1. Upload Resume', icon: Upload },
    { id: 'editor', label: '2. Review & Edit', icon: Edit3 },
    { id: 'builder', label: '3. Customize & Preview', icon: Layout },
    { id: 'export', label: '4. Export Site', icon: Download },
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 lg:px-8 py-3 transition-colors ${
      appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentStep('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className={`text-lg font-black tracking-tight flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              PortfolioGen <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-500 border border-sky-500/30">AI</span>
            </span>
            <p className={`text-[10px] hidden sm:block font-medium ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Resume to Portfolio Website Generator</p>
          </div>
        </button>

        {/* Wizard Steps Breadcrumbs (Visible when not on landing) */}
        {currentStep !== 'landing' && (
          <div className={`hidden md:flex items-center gap-1 p-1.5 rounded-xl border ${
            appTheme === 'dark' ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
          }`}>
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                      : appTheme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Action, UI Theme Toggle, & GitHub Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global UI Light/Dark Mode Switcher */}
          <button
            onClick={toggleAppTheme}
            title="Toggle Application Theme (Light / Dark)"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition ${
              appTheme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300 shadow-sm'
            }`}
          >
            {appTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          <a
            href="https://github.com/Tamanpreet84/portfoliogen-ai"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition ${
              appTheme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Github className="w-4 h-4" />
            <span className="hidden lg:inline">GitHub</span>
          </a>
          
          {currentStep === 'landing' ? (
            <button
              onClick={() => setCurrentStep('upload')}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition"
            >
              <Upload className="w-4 h-4" />
              Build My Portfolio
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep('builder')}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-sky-500/20 text-sky-500 border border-sky-500/30 hover:bg-sky-500/30 transition"
            >
              Live Preview
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-3 transition-all ${
          toastMessage.type === 'error' 
            ? 'bg-rose-950/90 border-rose-800 text-rose-200' 
            : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
        }`}>
          <span>{toastMessage.message}</span>
        </div>
      )}
    </nav>
  );
};
