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

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <MainContent />
        </main>
      </div>
    </PortfolioProvider>
  );
}
