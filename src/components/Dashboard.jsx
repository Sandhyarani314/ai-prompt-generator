import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Video,
  Wand2, 
  Database, 
  BookOpen, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  BarChart2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from './StatCard';
import { PromptCard } from './PromptCard';

export const Dashboard = () => {
  const { 
    setActiveTab, 
    savedPrompts, 
    recentPrompts, 
    activeDataset, 
    analytics,
    loadPromptToGenerator 
  } = useApp();

  const quickActions = [
    {
      id: 'generator',
      title: 'Generate Prompt',
      desc: 'Convert simple ideas into structured, high-impact prompts.',
      icon: Sparkles,
      color: 'from-indigo-600 to-purple-600 text-white',
      badge: 'Primary Feature'
    },
    {
      id: 'lip-movement',
      title: 'Lip Movement to Prompt',
      desc: 'Convert lip movement or visual speech into text and automatically generate an AI prompt.',
      icon: Video,
      color: 'from-pink-900/60 to-slate-900 text-pink-300 border-pink-500/30',
      btnLabel: 'Try Now →',
      badge: 'Visual Speech'
    },
    {
      id: 'nlp',
      title: 'Analyze Text (NLP)',
      desc: 'Extract keywords, intent, entities, and domain context.',
      icon: Cpu,
      color: 'from-purple-900/60 to-slate-900 text-purple-300 border-purple-500/30'
    },
    {
      id: 'optimizer',
      title: 'Optimize Prompt',
      desc: 'Refine clarity, specificity, and quality side-by-side.',
      icon: Wand2,
      color: 'from-blue-900/60 to-slate-900 text-blue-300 border-blue-500/30'
    },
    {
      id: 'dataset',
      title: 'Upload Dataset',
      desc: 'Upload CSV, auto-detect columns, and clean data.',
      icon: Database,
      color: 'from-emerald-900/60 to-slate-900 text-emerald-300 border-emerald-500/30'
    }
  ];


  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome / Project Overview */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Prompt Engineering Platform</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            AI Prompt Generator Using CSV & NLP
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Enter a simple requirement, let NLP analyze keywords and intent, retrieve cosine-matched prompt templates from CSV datasets, and let AI generate an optimized, production-ready structured prompt.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-xl shadow-indigo-500/25 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Prompt Generation</span>
            </button>

            <button
              onClick={() => setActiveTab('dataset')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Manage CSV Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Workflows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>{action.btnLabel || 'Open'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Statistics Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Generated"
            value={analytics.totalGenerated}
            subtitle="Prompts created"
            icon={Sparkles}
            color="indigo"
            trend="+12%"
          />
          <StatCard
            title="Saved Prompts"
            value={savedPrompts.length}
            subtitle="In user library"
            icon={BookOpen}
            color="emerald"
          />
          <StatCard
            title="Active Dataset"
            value={activeDataset?.rowCount || 0}
            subtitle={`${activeDataset?.name ? activeDataset.name.split('.')[0] : 'CSV'} rows`}
            icon={Database}
            color="amber"
          />
          <StatCard
            title="Avg Quality Score"
            value="92%"
            subtitle="Clarity & Structure"
            icon={ShieldCheck}
            color="purple"
            trend="High"
          />
        </div>
      </div>

      {/* 4. Recent Prompts & Recommended Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Prompts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Recently Generated Prompts
            </h2>
            <button 
              onClick={() => setActiveTab('library')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View Library
            </button>
          </div>

          {recentPrompts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No recent prompts generated yet.</p>
              <button
                onClick={() => setActiveTab('generator')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Generate First Prompt
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPrompts.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 overflow-hidden">
                    <span className="px-2 py-0.5 text-[9px] font-semibold rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.domain}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.requirement}</p>
                  </div>
                  <button
                    onClick={() => loadPromptToGenerator(item.content, item.domain)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 shrink-0 cursor-pointer"
                  >
                    Reuse
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Prompts Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              Top Dataset Prompts
            </h2>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeDataset?.data?.slice(0, 2).map((item, idx) => (
              <PromptCard key={idx} prompt={item} similarityScore={95 - idx * 4} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
