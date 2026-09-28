import React, { useState } from 'react';
import { Copy, Check, Star, Trash2, ArrowUpRight, Wand2, Tag, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromptCard = ({ 
  prompt, 
  onDelete, 
  onFavorite, 
  similarityScore, 
  showReuse = true 
}) => {
  const { showToast, loadPromptToGenerator } = useApp();
  const [copied, setCopied] = useState(false);

  const title = prompt.title || prompt.promptTitle || "Prompt Template";
  const domain = prompt.domain || prompt.category || "General AI";
  const content = prompt.content || prompt.prompt_text || prompt.text || "";
  const score = prompt.qualityScore || prompt.similarityScore || similarityScore;
  const isFav = prompt.isFavorite;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4">
      {/* Header Badge & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 max-w-[150px] truncate">
            {domain}
          </span>

          <div className="flex items-center gap-1.5">
            {score !== undefined && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 ${
                score >= 80 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : score >= 60 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
              }`}>
                {similarityScore !== undefined && <Percent className="w-2.5 h-2.5" />}
                {score}% {similarityScore !== undefined ? 'Match' : 'Score'}
              </span>
            )}

            {onFavorite && (
              <button
                onClick={() => onFavorite(prompt.id)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
              >
                <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(prompt.id)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
          {title}
        </h3>
      </div>

      {/* Body Content Snippet */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed line-clamp-4 min-h-[72px]">
        {content}
      </div>

      {/* Tags if available */}
      {prompt.tags && Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 text-[9px] font-medium text-slate-400 bg-slate-800/60 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[10px] text-slate-500">
          {prompt.date || prompt.complexity || 'Ready to use'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {showReuse && (
            <button
              onClick={() => loadPromptToGenerator(content, domain)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <span>Use</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
