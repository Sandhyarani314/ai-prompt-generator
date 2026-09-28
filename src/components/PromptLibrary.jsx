import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Plus, 
  Download,
  Trash2,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PromptCard } from './PromptCard';

export const PromptLibrary = () => {
  const { savedPrompts, recentPrompts, deleteSavedPrompt, toggleFavoritePrompt, setActiveTab, showToast } = useApp();
  
  const [libraryTab, setLibraryTab] = useState('saved'); // 'saved' | 'recent' | 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  // Domains list
  const domains = ['All', 'Software Development', 'Data Science', 'Marketing', 'Business', 'Finance', 'HR', 'Content Creation', 'Research'];

  // Determine source array based on active library tab
  let sourcePrompts = savedPrompts;
  if (libraryTab === 'recent') sourcePrompts = recentPrompts;
  else if (libraryTab === 'favorites') sourcePrompts = savedPrompts.filter(p => p.isFavorite);

  // Apply search & domain filters
  const filteredPrompts = sourcePrompts.filter(p => {
    const textToMatch = `${p.title || ''} ${p.content || ''} ${p.domain || ''} ${p.requirement || ''}`.toLowerCase();
    const matchesSearch = textToMatch.includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || (p.domain && p.domain.toLowerCase() === selectedDomain.toLowerCase());
    return matchesSearch && matchesDomain;
  });

  const handleExportAll = () => {
    if (savedPrompts.length === 0) return;
    const jsonStr = JSON.stringify(savedPrompts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_library_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Prompt library exported as JSON!");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prompt Repository</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Prompt Library
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Browse, search, filter, edit, copy, export, and reuse your saved and generated prompt templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Library</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Prompt</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLibraryTab('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                libraryTab === 'saved'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Saved Prompts ({savedPrompts.length})</span>
            </button>

            <button
              onClick={() => setLibraryTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                libraryTab === 'favorites'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Star className="w-4 h-4 text-amber-300" />
              <span>Favorites ({savedPrompts.filter(p => p.isFavorite).length})</span>
            </button>

            <button
              onClick={() => setLibraryTab('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                libraryTab === 'recent'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recent History ({recentPrompts.length})</span>
            </button>
          </div>
        </div>

        {/* Search Input & Domain Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by title, keywords, or content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {domains.map(d => (
                <option key={d} value={d}>Filter Domain: {d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Cards Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Prompts Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedDomain !== 'All' 
              ? "Try adjusting your search query or domain filter." 
              : "Generate a new prompt or save prompts from recommendations to build your library."}
          </p>
          <button
            onClick={() => setActiveTab('generator')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
          >
            Generate Prompt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={libraryTab !== 'recent' ? deleteSavedPrompt : null}
              onFavorite={libraryTab !== 'recent' ? toggleFavoritePrompt : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};
