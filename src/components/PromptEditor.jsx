import React, { useState } from 'react';
import { Copy, Check, Save, Sparkles, Download, Edit3, Wand2, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromptEditor = ({ 
  promptText, 
  setPromptText, 
  onSave, 
  onOptimize, 
  onRegenerate, 
  isGenerating = false,
  title = "Generated Prompt Specification" 
}) => {
  const { showToast, setActiveTab } = useApp();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const wordCount = promptText ? promptText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = promptText ? promptText.length : 0;
  const tokenEstimate = Math.round(wordCount * 1.3);

  const handleCopy = () => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    showToast("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format) => {
    if (!promptText) return;
    let filename = `prompt_${Date.now()}.${format}`;
    let content = promptText;
    let mime = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify({ prompt: promptText, exportedAt: new Date().toISOString() }, null, 2);
      mime = 'application/json';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported as ${format.toUpperCase()}`);
  };

  const lines = promptText ? promptText.split('\n') : [''];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
      {/* Editor Header Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            {title}
          </span>
        </div>

        {/* Real-time stats */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>{lines.length} Lines</span>
          <span>•</span>
          <span>{wordCount} Words</span>
          <span>•</span>
          <span>{charCount} Chars</span>
          <span>•</span>
          <span className="text-indigo-400">~{tokenEstimate} Tokens</span>
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="relative min-h-[320px] max-h-[500px] flex overflow-y-auto bg-slate-950 font-mono text-xs sm:text-sm">
        {/* Line Numbers Column */}
        <div className="w-10 sm:w-12 py-4 bg-slate-950/60 border-r border-slate-800/80 text-slate-600 text-right pr-3 select-none shrink-0 leading-relaxed font-mono text-xs">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area / Render */}
        <div className="flex-1 p-4 overflow-x-auto text-slate-100 leading-relaxed">
          {isEditing ? (
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Your generated prompt will appear here..."
              className="w-full h-full min-h-[300px] bg-transparent text-slate-100 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-0 border-none leading-relaxed"
              spellCheck={false}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-200">
              {promptText}
            </pre>
          )}
        </div>
      </div>

      {/* Editor Actions Toolbar */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Regenerate</span>
            </button>
          )}

          {onOptimize && (
            <button
              onClick={onOptimize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Optimize Prompt</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown / Buttons */}
          <button
            onClick={() => handleExport('md')}
            title="Export as Markdown"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/80 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>.MD</span>
          </button>

          <button
            onClick={() => handleExport('txt')}
            title="Export as Text"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/80 cursor-pointer"
          >
            <span>.TXT</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Prompt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
