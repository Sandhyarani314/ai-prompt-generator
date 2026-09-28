import React, { useState } from 'react';
import { 
  Wand2, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Save, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { optimizePrompt, evaluatePromptQuality } from '../utils/promptOptimizerEngine';

export const PromptOptimizer = () => {
  const { addSavedPrompt, showToast, recordOptimization } = useApp();

  const [inputPrompt, setInputPrompt] = useState(
    "Write a python script to refactor code and make it faster."
  );

  const [optimizationResult, setOptimizationResult] = useState(() => {
    return optimizePrompt("Write a python script to refactor code and make it faster.");
  });

  const handleOptimize = () => {
    if (!inputPrompt || inputPrompt.trim().length === 0) {
      showToast("Please enter a prompt to optimize.", "error");
      return;
    }
    const result = optimizePrompt(inputPrompt);
    setOptimizationResult(result);
    recordOptimization();
    showToast("Prompt optimization complete!");
  };

  const handleCopyOptimized = () => {
    if (!optimizationResult.optimizedText) return;
    navigator.clipboard.writeText(optimizationResult.optimizedText);
    showToast("Optimized prompt copied to clipboard!");
  };

  const handleSaveOptimized = () => {
    if (!optimizationResult.optimizedText) return;
    addSavedPrompt({
      title: "Optimized Prompt",
      domain: "General AI",
      content: optimizationResult.optimizedText,
      qualityScore: optimizationResult.optimizedMetrics.overallScore,
      metrics: optimizationResult.optimizedMetrics
    });
  };

  const originalMetrics = optimizationResult.originalMetrics || evaluatePromptQuality(inputPrompt);
  const optimizedMetrics = optimizationResult.optimizedMetrics || evaluatePromptQuality(optimizationResult.optimizedText);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Prompt Optimizer & Quality Evaluator</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Prompt Quality Audit & Side-by-Side Optimizer
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Paste any existing prompt to evaluate structure, clarity, specificity, and apply AI enhancements.
        </p>
      </div>

      {/* Input Prompt Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          Prompt Input for Optimization Analysis
        </label>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Paste any prompt here to analyze and optimize..."
          className="w-full h-28 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500 resize-none font-mono leading-relaxed"
        />
        <div className="flex justify-end">
          <button
            onClick={handleOptimize}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 transition cursor-pointer flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Optimize & Evaluate Quality</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Section (Desktop: side-by-side, Mobile: stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Original Prompt */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Original Prompt
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
                Score: {originalMetrics.overallScore}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 min-h-[220px] whitespace-pre-wrap leading-relaxed">
              {inputPrompt}
            </div>

            {/* Metric breakdown bars */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400">Quality Breakdown (Original):</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Clarity:</span>
                  <span className="font-mono font-bold text-slate-200">{originalMetrics.clarity}%</span>
                </div>
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Context:</span>
                  <span className="font-mono font-bold text-slate-200">{originalMetrics.context}%</span>
                </div>
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Structure:</span>
                  <span className="font-mono font-bold text-slate-200">{originalMetrics.structure}%</span>
                </div>
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Specificity:</span>
                  <span className="font-mono font-bold text-slate-200">{originalMetrics.specificity}%</span>
                </div>
              </div>
            </div>

            {/* Identified Flaws */}
            {originalMetrics.flaws && originalMetrics.flaws.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Identified Weaknesses:
                </span>
                <ul className="space-y-1">
                  {originalMetrics.flaws.map((flaw, i) => (
                    <li key={i} className="text-[11px] text-slate-400 bg-red-950/30 p-1.5 rounded border border-red-500/20">
                      <strong>{flaw.type}:</strong> {flaw.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Optimized Prompt */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/40 flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                Optimized Prompt
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Score: {optimizedMetrics.overallScore}% (+{optimizedMetrics.overallScore - originalMetrics.overallScore}%)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 font-mono text-xs text-slate-100 min-h-[220px] whitespace-pre-wrap leading-relaxed">
              {optimizationResult.optimizedText}
            </div>

            {/* Metric breakdown bars */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400">Quality Breakdown (Optimized):</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Clarity:</span>
                  <span className="font-mono font-bold text-emerald-400">{optimizedMetrics.clarity}%</span>
                </div>
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Context:</span>
                  <span className="font-mono font-bold text-emerald-400">{optimizedMetrics.context}%</span>
                </div>
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Structure:</span>
                  <span className="font-mono font-bold text-emerald-400">{optimizedMetrics.structure}%</span>
                </div>
                <div className="p-2 rounded bg-slate-950 flex justify-between">
                  <span className="text-slate-400">Specificity:</span>
                  <span className="font-mono font-bold text-emerald-400">{optimizedMetrics.specificity}%</span>
                </div>
              </div>
            </div>

            {/* Improvements Applied */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Applied AI Enhancements:
              </span>
              <ul className="space-y-1">
                {optimizationResult.improvementsApplied?.map((imp, i) => (
                  <li key={i} className="text-[11px] text-slate-300 bg-emerald-950/30 p-1.5 rounded border border-emerald-500/20">
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={handleCopyOptimized}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Optimized</span>
            </button>

            <button
              onClick={handleSaveOptimized}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save to Library</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
