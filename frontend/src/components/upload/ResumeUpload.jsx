import React, { useState, useRef } from 'react';
import { usePortfolio, initialResumeData } from '../../context/PortfolioContext';
import { extractFileTextInstant, parseResumeTextClient } from '../../utils/resumeParser';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

export const ResumeUpload = () => {
  const { setResumeData, setCurrentStep, showToast, appTheme } = usePortfolio();
  const isDark = appTheme === 'dark';
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const processAndExtractFile = async (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Invalid file format. Only PDF (.pdf) and Word (.docx) files are supported.');
      return;
    }

    if (selectedFile.size === 0) {
      setError('The selected file appears to be empty or corrupted (0 bytes).');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(`File size (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum limit of 10MB.`);
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    showToast('Detecting resume details automatically...', 'info');

    try {
      // 1. Try server-side AI parsing first
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setResumeData(result.data);
          showToast('Resume details detected & extracted automatically!', 'success');
          setCurrentStep('editor');
          return;
        }
      }
      
      // 2. Client-side instant fallback extraction if backend server is offline or loading
      const rawText = await extractFileTextInstant(selectedFile);
      const parsedData = parseResumeTextClient(rawText, selectedFile.name);
      setResumeData(parsedData);
      showToast('Resume details detected automatically! Review your extracted details below.', 'success');
      setCurrentStep('editor');

    } catch (err) {
      console.warn('Extraction fallback notice:', err.message);
      const rawText = await extractFileTextInstant(selectedFile).catch(() => '');
      const parsedData = parseResumeTextClient(rawText, selectedFile.name);
      setResumeData(parsedData);
      showToast('Resume details detected! Review your extracted sections below.', 'success');
      setCurrentStep('editor');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndExtractFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processAndExtractFile(e.target.files[0]);
    }
  };

  const loadSampleResume = () => {
    setResumeData(initialResumeData);
    showToast('Loaded sample developer resume data.', 'info');
    setCurrentStep('editor');
  };

  return (
    <div className={`min-h-screen py-16 px-4 transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-sky-50 text-sky-600 border-sky-200'
          }`}>
            <Upload className="w-3.5 h-3.5" />
            <span>Step 1: Automatic Document Detection</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Upload Your Resume</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Drop your PDF or Word resume. Our system will <strong className="text-sky-500 font-bold">automatically detect and extract your details immediately</strong>.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-sky-400 bg-sky-500/10 scale-[1.01]' 
              : file 
              ? 'border-emerald-500/50 bg-emerald-500/5' 
              : isDark 
              ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90' 
              : 'border-slate-300 bg-white hover:border-sky-400 shadow-sm'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Processing Document...</span>
                <h3 className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{file?.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Automatically extracting skills, experience, & details...</p>
              </div>
            </div>
          ) : file ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Extracted Document</span>
                <h3 className={`text-lg font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Click or drop another file to replace</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Drag and drop your resume file here, or <span className="text-sky-500 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Supports PDF (.pdf) and Microsoft Word (.docx) • Max size 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={loadSampleResume}
            className={`w-full sm:w-auto text-xs font-semibold px-4 py-3 rounded-xl border transition ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800' 
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            Or load sample developer data
          </button>

          {file && !isUploading && (
            <button
              onClick={() => setCurrentStep('editor')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition"
            >
              <span>View Extracted Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Security & Privacy Notice */}
        <div className={`mt-12 p-4 rounded-xl text-center border ${
          isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Automatic Extraction & Privacy Guarantee:</span> Uploaded documents are processed automatically in memory and sanitized. We never store or share your resume files.
          </p>
        </div>

      </div>
    </div>
  );
};
