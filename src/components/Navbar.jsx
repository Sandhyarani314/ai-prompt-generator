import React from 'react';
import { Menu, Sparkles, Database, ShieldCheck, Cpu, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ setMobileOpen }) => {
  const { activeTab, setActiveTab, activeDataset, llmSettings } = useApp();

  const titles = {
    dashboard: { title: 'Dashboard Overview', desc: 'Central workspace statistics, recent generations, and quick workflows.' },
    generator: { title: 'Automated Prompt Generator', desc: 'Transform raw requirements into structured, high-performing AI prompts.' },
    nlp: { title: 'NLP Text Analysis Engine', desc: 'Extract keywords, detect intent, classify domains, and check missing context.' },
    'lip-movement': { title: 'Lip Movement to AI Prompt', desc: 'Use camera or video input to analyze lip movement, extract text, and generate an AI prompt.' },
    library: { title: 'Prompt Library & Repository', desc: 'Browse, filter, edit, and export your saved and favorite prompts.' },
    recommendations: { title: 'Prompt Recommendations', desc: 'Find TF-IDF cosine-matched prompts from active CSV datasets.' },
    optimizer: { title: 'Prompt Optimizer & Evaluation', desc: 'Analyze prompt clarity, structure, specificity, and apply AI enhancements.' },
    dataset: { title: 'CSV Dataset Management', desc: 'Upload, preview, clean, and inspect prompt datasets.' },
    analytics: { title: 'Evaluation & Usage Analytics', desc: 'Track prompt quality metrics, domain distribution, and generation trends.' },
    settings: { title: 'System & LLM Settings', desc: 'Configure LLM API keys, model choices, and defaults.' }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-16 px-4 md:px-6 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
              {current.title}
            </h2>
            {activeTab === 'generator' && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Primary Module
              </span>
            )}
          </div>
          <p className="hidden sm:block text-xs text-slate-400 font-medium truncate max-w-md">
            {current.desc}
          </p>
        </div>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Active Dataset Pill */}
        <div 
          onClick={() => setActiveTab('dataset')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition"
        >
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <div className="text-left leading-none">
            <span className="text-[10px] text-slate-400 block font-medium">Dataset</span>
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px] inline-block">
              {activeDataset?.name || 'Default CSV'}
            </span>
          </div>
        </div>

        {/* LLM Mode Pill */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition"
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200">
            {llmSettings.apiKey ? 'Live API' : 'Local NLP'}
          </span>
        </div>

        {/* Primary CTA */}
        {activeTab !== 'generator' && (
          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate</span>
          </button>
        )}
      </div>
    </header>
  );
};
