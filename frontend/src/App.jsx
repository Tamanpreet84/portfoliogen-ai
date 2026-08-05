import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { ResumeUpload } from './components/upload/ResumeUpload';
import { InformationEditor } from './components/editor/InformationEditor';
import { PortfolioBuilder } from './components/builder/PortfolioBuilder';
import { ExportCenter } from './components/export/ExportCenter';

const MainContent = () => {
  const { currentStep } = usePortfolio();

  switch (currentStep) {
    case 'upload':
      return <ResumeUpload />;
    case 'editor':
      return <InformationEditor />;
    case 'builder':
      return <PortfolioBuilder />;
    case 'export':
      return <ExportCenter />;
    case 'landing':
    default:
      return <LandingPage />;
  }
};

const AppLayout = () => {
  const { appTheme } = usePortfolio();
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      appTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar />
      <main className="flex-1">
        <MainContent />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AppLayout />
    </PortfolioProvider>
  );
}
