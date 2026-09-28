import React, { useState } from 'react';
import { 
  Cpu, 
  Tag, 
  Compass, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsUp, 
  BarChart3, 
  FileText,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeRequirementNLP } from '../utils/nlpEngine';
import { PromptCard } from './PromptCard';

export const NLPAnalysis = () => {
  const { activeDataset, loadPromptToGenerator } = useApp();
  const [inputText, setInputText] = useState("Act as a Senior Python Software Architect. Refactor the following code for memory efficiency, add type hints, clean docstrings, and handle edge cases.");
  const [nlpOutput, setNlpOutput] = useState(() => {
    return analyzeRequirementNLP(
      "Act as a Senior Python Software Architect. Refactor the following code for memory efficiency, add type hints, clean docstrings, and handle edge cases.",
      activeDataset?.data || [],
      activeDataset?.detectedPromptCol || "prompt_text"
    );
  });

  const handleAnalyze = () => {
    if (!inputText || inputText.trim().length === 0) return;
    const result = analyzeRequirementNLP(
      inputText,
      activeDataset?.data || [],
      activeDataset?.detectedPromptCol || "prompt_text"
    );
    setNlpOutput(result);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>NLP Text Analysis Module</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Natural Language Processing Analyzer
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Deconstruct prompts into keywords, TF-IDF weights, intent, domain, entity structures, and vector similarity.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          Input Requirement or Prompt Text
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type any requirement/prompt text to analyze..."
          className="w-full h-28 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition cursor-pointer flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Run NLP Analysis</span>
          </button>
        </div>
      </div>

      {/* 6 Required UI Sections */}
      {nlpOutput && (
        <div className="space-y-8 animate-fadeIn">
          {/* 1. Input Text & Stats Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              1. Input Text Summary
            </h2>
            <p className="p-3 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 leading-relaxed">
              "{nlpOutput.inputText}"
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Word Count: <strong className="text-white">{nlpOutput.wordCount}</strong></span>
              <span>•</span>
              <span>Character Count: <strong className="text-white">{nlpOutput.charCount}</strong></span>
              <span>•</span>
              <span>Clarity Rating: <strong className="text-emerald-400">{nlpOutput.clarityRating}%</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2. Extracted Keywords */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                2. Extracted Keywords
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {nlpOutput.keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 flex items-center gap-1">
                    {kw.keyword}
                    <span className="text-[10px] text-indigo-400 font-mono">({kw.weight}%)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Detected Domain */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                3. Detected Domain
              </h2>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold inline-block">
                  {nlpOutput.detectedDomain}
                </span>
                <p className="text-[11px] text-slate-400 pt-1">Categorized using keyword vector weighting.</p>
              </div>
            </div>

            {/* 4. Intent & Entities */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                4. Intent & Entities
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-950">
                  <span className="text-slate-400">Intent:</span>
                  <span className="font-semibold text-amber-300">{nlpOutput.detectedIntent}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950">
                  <span className="text-slate-400">Tone:</span>
                  <span className="font-semibold text-slate-200">{nlpOutput.entities.detectedTone}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-950">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-semibold text-slate-200">{nlpOutput.entities.detectedFormat}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Similar Prompts from CSV */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              5. Similar CSV Prompts (Cosine Similarity Vector Matching)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nlpOutput.similarPrompts.map((item, idx) => (
                <PromptCard key={idx} prompt={item} similarityScore={item.similarityScore} />
              ))}
            </div>
          </div>

          {/* 6. NLP Insights & Missing Info */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              6. NLP Insights & Missing Context Detection
            </h2>

            {nlpOutput.missingContext.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Great prompt! No missing critical parameters detected.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Recommendations to improve prompt clarity before execution:</p>
                <ul className="space-y-1">
                  {nlpOutput.missingContext.map((msg, i) => (
                    <li key={i} className="text-xs text-amber-300 flex items-center gap-2 p-2 rounded bg-amber-950/30 border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => loadPromptToGenerator(nlpOutput.inputText, nlpOutput.detectedDomain)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Generate Prompt from this Input
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
