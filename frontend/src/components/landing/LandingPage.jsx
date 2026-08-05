import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Upload, FileText, CheckCircle2, ArrowRight, ShieldCheck, Download, Code, Palette, Zap } from 'lucide-react';

export const LandingPage = () => {
  const { setCurrentStep, setActiveTemplate } = usePortfolio();

  const features = [
    {
      icon: FileText,
      title: "Smart Document Extraction",
      desc: "Upload PDF or DOCX resumes. Our parser extracts experience, projects, skills, education, and links instantly."
    },
    {
      icon: Sparkles,
      title: "Generative AI Wording Refiner",
      desc: "AI elevates headlines, bio summaries, and bullet points to sound executive-ready without inventing fake facts."
    },
    {
      icon: Code,
      title: "3 Professional Templates",
      desc: "Switch seamlessly between Minimal Professional, Dark Developer, and Modern Creative themes with one click."
    },
    {
      icon: Zap,
      title: "Real-time Live Preview",
      desc: "Side-by-side editing with instant live preview. Toggle section visibility, reorder sections, and preview on desktop or mobile."
    },
    {
      icon: ShieldCheck,
      title: "Fact Preservation Guarantee",
      desc: "Your data stays 100% accurate. AI is constrained to improve wording while strictly keeping your true experience."
    },
    {
      icon: Download,
      title: "One-Click Static Site Export",
      desc: "Download clean, standalone HTML, CSS, and JS zip packages ready to deploy to Vercel, Netlify, or GitHub Pages."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume to Portfolio Generator</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Turn Your Resume Into A <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Stunning Developer Portfolio
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Upload your PDF or Word resume. Our AI extracts your experience, refines your content, 
            and generates a deployable static portfolio website in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentStep('upload')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Resume & Build</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveTemplate('developer');
                setCurrentStep('editor');
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-semibold text-base transition"
            >
              Try With Sample Data
            </button>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF & DOCX Support
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Hardcoded Data
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Standalone HTML Export
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Hallucinations
            </span>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-slate-800">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-white mb-3">Everything You Need To Showcase Your Work</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">From document parsing to one-click deployment, PortfolioGen AI handles the entire workflow seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-slate-800">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-white mb-3">Choose Your Aesthetic</h2>
          <p className="text-slate-400 text-base">Select from 3 crafted, responsive portfolio templates designed for developers and tech professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Template 1 */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group hover:border-sky-500/50 transition">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Template 1</span>
              <h3 className="text-xl font-bold text-white mt-1">Minimal Professional</h3>
              <p className="text-xs text-slate-400 mt-1">Clean slate aesthetic focused on crisp typography and high legibility.</p>
            </div>
            <div className="p-6">
              <div className="h-32 bg-slate-950 rounded-lg border border-slate-800 p-3 space-y-2 text-[10px]">
                <div className="w-1/3 h-3 bg-slate-800 rounded" />
                <div className="w-2/3 h-2 bg-slate-800 rounded" />
                <div className="w-full h-10 bg-slate-900 rounded border border-slate-800 p-2" />
              </div>
              <button
                onClick={() => {
                  setActiveTemplate('minimal');
                  setCurrentStep('upload');
                }}
                className="w-full mt-4 py-2.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-white font-semibold text-xs transition"
              >
                Use Minimal Template
              </button>
            </div>
          </div>

          {/* Template 2 */}
          <div className="rounded-2xl bg-slate-900 border border-sky-500/40 overflow-hidden group shadow-lg shadow-sky-500/10">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Template 2 (Popular)</span>
              <h3 className="text-xl font-bold text-white mt-1">Developer Portfolio</h3>
              <p className="text-xs text-slate-400 mt-1">Dark theme featuring code badges, tech tags, and terminal aesthetics.</p>
            </div>
            <div className="p-6">
              <div className="h-32 bg-slate-950 rounded-lg border border-sky-500/30 p-3 space-y-2 text-[10px]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-sky-400 font-mono">const dev = "Alex Morgan";</div>
                <div className="w-full h-8 bg-sky-500/10 rounded border border-sky-500/20 p-1.5" />
              </div>
              <button
                onClick={() => {
                  setActiveTemplate('developer');
                  setCurrentStep('upload');
                }}
                className="w-full mt-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition shadow-md"
              >
                Use Developer Template
              </button>
            </div>
          </div>

          {/* Template 3 */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group hover:border-purple-500/50 transition">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Template 3</span>
              <h3 className="text-xl font-bold text-white mt-1">Modern Creative</h3>
              <p className="text-xs text-slate-400 mt-1">Glassmorphism cards with dynamic layout grids and glowing accents.</p>
            </div>
            <div className="p-6">
              <div className="h-32 bg-slate-950 rounded-lg border border-purple-500/20 p-3 space-y-2 text-[10px]">
                <div className="w-1/2 h-3 bg-purple-500/30 rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-purple-500/10 rounded border border-purple-500/20" />
                  <div className="h-10 bg-purple-500/10 rounded border border-purple-500/20" />
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTemplate('creative');
                  setCurrentStep('upload');
                }}
                className="w-full mt-4 py-2.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-white font-semibold text-xs transition"
              >
                Use Creative Template
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs text-slate-500 border-t border-slate-800">
        PortfolioGen AI • Built with FastAPI, React, and Generative AI • Open Source Repository on GitHub
      </footer>

    </div>
  );
};
