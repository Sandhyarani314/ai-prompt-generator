import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Cpu, 
  Video,
  BookOpen, 
  ThumbsUp, 
  Wand2, 
  Database, 
  BarChart3, 
  Settings,
  Bot,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, activeDataset, savedPrompts } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'Generate Prompt', icon: Sparkles, badge: 'Primary' },
    { id: 'nlp', label: 'NLP Analysis', icon: Cpu },
    { id: 'lip-movement', label: '🎥 Lip Movement', icon: Video, badge: 'New' },
    { id: 'library', label: 'Prompt Library', icon: BookOpen, count: savedPrompts.length },
    { id: 'recommendations', label: 'Recommendations', icon: ThumbsUp },
    { id: 'optimizer', label: 'Optimizer', icon: Wand2 },
    { id: 'dataset', label: 'Dataset (CSV)', icon: Database, pill: activeDataset?.name ? activeDataset.name.split('.')[0] : 'CSV' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 border-r border-slate-800/80 
        flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header Logo */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent leading-none">
                  AI Prompt Studio
                </h1>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">CSV & NLP Engine</p>
              </div>
            </div>
            
            <button 
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium 
                    transition-all duration-150 group cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-500/20 font-semibold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-slate-800 text-slate-300">
                        {item.count}
                      </span>
                    )}

                    {item.pill && (
                      <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 max-w-[70px] truncate">
                        {item.pill}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-white opacity-80" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Active Dataset Badge */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-500 font-medium">Active CSV</p>
                <p className="text-xs font-semibold text-slate-200 truncate">{activeDataset?.name || "None"}</p>
              </div>
            </div>
            <button 
              onClick={() => handleNavClick('dataset')} 
              className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 shrink-0"
            >
              Change
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
