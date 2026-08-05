import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { exportPortfolioZip, generateStaticHTML } from '../../utils/exportBundle';
import { Download, Copy, Check, ExternalLink, Globe, Rocket, ShieldCheck, ArrowLeft, Code } from 'lucide-react';

export const ExportCenter = () => {
  const { resumeData, activeTemplate, portfolioTheme, sectionOrder, sectionVisibility, setCurrentStep, showToast, appTheme } = usePortfolio();
  const isDark = appTheme === 'dark';
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const rawHTML = generateStaticHTML(resumeData, activeTemplate, portfolioTheme, sectionOrder, sectionVisibility);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await exportPortfolioZip(resumeData, activeTemplate, portfolioTheme, sectionOrder, sectionVisibility);
      showToast('Downloaded static portfolio ZIP package!', 'success');
    } catch (err) {
      showToast('Failed to generate ZIP: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(rawHTML);
    setCopied(true);
    showToast('Copied raw HTML to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={`min-h-screen py-16 px-4 transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setCurrentStep('builder')}
              className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Customizer & Preview
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Export & Deployment Center</h1>
            <p className="text-slate-400 text-xs mt-1">Your personal portfolio website is ready to be exported and published.</p>
          </div>

          <button
            disabled={isExporting}
            onClick={handleDownloadZip}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Packaging Website...' : 'Download Static Website (.zip)'}</span>
          </button>
        </div>

        {/* Deployment Guides Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Vercel */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">▲</div>
            <h3 className="text-lg font-bold text-white">Vercel Deployment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1. Extract your downloaded ZIP file.<br />
              2. Open terminal in folder and run `npx vercel`.<br />
              3. Select default settings to publish instantly.
            </p>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline pt-2"
            >
              Deploy on Vercel <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Netlify */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Netlify Drop</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1. Extract your downloaded ZIP file.<br />
              2. Go to app.netlify.com/drop.<br />
              3. Drag and drop the unzipped folder to deploy in 5 seconds.
            </p>
            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:underline pt-2"
            >
              Netlify Drop <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* GitHub Pages */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">GitHub Pages</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              1. Create a GitHub repo named `yourusername.github.io`.<br />
              2. Push index.html to the repo.<br />
              3. Enable Pages under Repository Settings.
            </p>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:underline pt-2"
            >
              Create GitHub Repo <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* HTML Source Preview & Copy Box */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Generated Static HTML Output</h3>
            </div>

            <button
              onClick={copyHTML}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="h-64 rounded-xl bg-slate-950 p-4 border border-slate-800 overflow-y-auto font-mono text-[11px] text-slate-400 leading-relaxed scrollbar-thin">
            <pre>{rawHTML}</pre>
          </div>
        </div>

      </div>
    </div>
  );
};
