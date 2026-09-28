import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';

import { Dashboard } from './components/Dashboard';
import { PromptGenerator } from './components/PromptGenerator';
import { NLPAnalysis } from './components/NLPAnalysis';
import { LipMovement } from './components/LipMovement';
import { PromptLibrary } from './components/PromptLibrary';
import { Recommendations } from './components/Recommendations';
import { PromptOptimizer } from './components/PromptOptimizer';
import { DatasetManager } from './components/DatasetManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Settings } from './components/Settings';

const MainContent = () => {
  const { activeTab } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'generator':
        return <PromptGenerator />;
      case 'nlp':
        return <NLPAnalysis />;
      case 'lip-movement':
        return <LipMovement />;
      case 'library':
        return <PromptLibrary />;
      case 'recommendations':
        return <Recommendations />;
      case 'optimizer':
        return <PromptOptimizer />;
      case 'dataset':
        return <DatasetManager />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
