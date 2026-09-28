import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Wand2, 
  BookOpen, 
  SlidersHorizontal, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ThumbsUp,
  Tag,
  ArrowRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { executeLLMPipeline } from '../services/llmService';
import { PromptEditor } from './PromptEditor';
import { PromptCard } from './PromptCard';

export const PromptGenerator = () => {
  const { 
    activeDataset, 
    llmSettings, 
    recordGeneration, 
    addSavedPrompt, 
    generatorDraft, 
    setGeneratorDraft,
    showToast,
    setActiveTab
  } = useApp();

  // Input states
  const [requirement, setRequirement] = useState('');
  const [domain, setDomain] = useState('Auto Detect');
  const [outputType, setOutputType] = useState('Markdown with Headings & Bullet Points');
  const [tone, setTone] = useState('Professional & Authoritative');
  const [targetAudience, setTargetAudience] = useState('');
  const [constraints, setConstraints] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Processing & Pipeline Output state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressState, setProgressState] = useState({ message: '', stepIndex: 0, totalSteps: 5 });
  const [pipelineResult, setPipelineResult] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Pre-fill draft if loaded from elsewhere
  useEffect(() => {
    if (generatorDraft) {
      if (generatorDraft.requirement) setRequirement(generatorDraft.requirement);
      if (generatorDraft.domain) setDomain(generatorDraft.domain);
      setGeneratorDraft(null); // clear after consumption
    }
  }, [generatorDraft, setGeneratorDraft]);

  const handleGenerate = async () => {
    if (!requirement || requirement.trim().length === 0) {
      showToast("Please enter a requirement or idea first.", "error");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const datasetRows = activeDataset?.data || [];
      const promptCol = activeDataset?.detectedPromptCol || 'prompt_text';

      const res = await executeLLMPipeline(
        {
          requirement,
          domain: domain === 'Auto Detect' ? '' : domain,
          outputType,
          tone,
          targetAudience,
          constraints,
          context: additionalContext
        },
        datasetRows,
        promptCol,
        llmSettings,
        (progress) => setProgressState(progress)
      );

      setPipelineResult(res);
      setGeneratedText(res.enhancedPrompt);

      recordGeneration({
        title: requirement.slice(0, 45) + (requirement.length > 45 ? '...' : ''),
        requirement,
        content: res.enhancedPrompt,
        domain: res.domain
      });

      showToast("Structured AI Prompt generated successfully!");

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate prompt.");
      showToast(err.message || "Generation error.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = () => {
    if (!generatedText) return;
    addSavedPrompt({
      title: requirement.slice(0, 40) + '...',
      domain: pipelineResult?.domain || domain || 'General AI',
      content: generatedText,
      qualityScore: pipelineResult?.optimization?.optimizedMetrics?.overallScore || 92,
      metrics: pipelineResult?.optimization?.optimizedMetrics
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Automated Prompt Generator</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Transform Requirements into Structured AI Prompts
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Enter a simple requirement below. NLP will analyze keywords, retrieve similar CSV templates, and synthesize an expert structured prompt.
        </p>
      </div>

      {/* 2. Requirement Input Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Requirement or Simple Idea <span className="text-red-400">*</span>
          </label>

          <span className="text-[11px] text-slate-500">
            e.g., "Create a marketing campaign for a new AI product"
          </span>
        </div>

        <textarea
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Describe your goal, task, or requirement in simple words..."
          className="w-full h-28 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
        />

        {/* 3. Configuration Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {/* Domain Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Domain / Category</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Auto Detect">Auto Detect (NLP)</option>
              <option value="Software Development">Software Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Content Creation">Content Creation</option>
              <option value="Research">Research</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Education">Education</option>
              <option value="General AI">General AI</option>
            </select>
          </div>

          {/* Desired Output Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Desired Output Structure</label>
            <select
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Markdown with Headings & Bullet Points">Markdown with Headings & Bullets</option>
              <option value="JSON Schema Payload">JSON Schema Payload</option>
              <option value="Step-by-Step Execution Guide">Step-by-Step Execution Guide</option>
              <option value="Markdown Data Table">Markdown Data Table</option>
              <option value="Code Snippets with Documentation">Code Snippets with Documentation</option>
            </select>
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Desired Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Professional & Authoritative">Professional & Authoritative</option>
              <option value="Concise & Direct">Concise & Direct</option>
              <option value="Technical & Thorough">Technical & Thorough</option>
              <option value="Creative & Engaging">Creative & Engaging</option>
              <option value="Academic & Formal">Academic & Formal</option>
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Senior Developers, C-Level Executives..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Constraints */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Constraints & Boundaries</label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. No generic advice, max 500 words..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Additional Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Additional Scenario Context</label>
            <input
              type="text"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="e.g. For a Series-A enterprise SaaS launch..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 4. Generate Button & Progress State */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {isGenerating && (
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Step {progressState.stepIndex}/5: {progressState.message}</span>
              </div>
            )}
            {!isGenerating && errorMessage && (
              <div className="flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing AI Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Structured Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Output Sections */}
      {pipelineResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* 5. NLP Analysis Summary */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              NLP Analysis Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Detected Domain</span>
                <div className="text-xs font-bold text-indigo-300">
                  {pipelineResult.nlpResult?.detectedDomain}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Identified Intent</span>
                <div className="text-xs font-bold text-purple-300">
                  {pipelineResult.nlpResult?.detectedIntent}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Requirements Clarity</span>
                <div className="text-xs font-bold text-emerald-400">
                  {pipelineResult.nlpResult?.clarityRating}% Rating
                </div>
              </div>
            </div>

            {/* Keyword Chips */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Extracted Keywords & TF-IDF Weights:</span>
              <div className="flex flex-wrap gap-1.5">
                {pipelineResult.nlpResult?.keywords?.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 flex items-center gap-1">
                    <Tag className="w-3 h-3 opacity-60" />
                    {kw.keyword} <span className="text-[10px] text-indigo-400 font-mono">({kw.weight}%)</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Recommended CSV Dataset Prompts */}
          {pipelineResult.similarPrompts && pipelineResult.similarPrompts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                Matching CSV Prompts (Cosine Similarity)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pipelineResult.similarPrompts.slice(0, 2).map((item, idx) => (
                  <PromptCard key={idx} prompt={item} similarityScore={item.similarityScore} />
                ))}
              </div>
            </div>
          )}

          {/* 7. Generated Prompt Editor */}
          <div className="space-y-4">
            <PromptEditor
              promptText={generatedText}
              setPromptText={setGeneratedText}
              onSave={handleSaveToLibrary}
              onRegenerate={handleGenerate}
              onOptimize={() => setActiveTab('optimizer')}
              isGenerating={isGenerating}
              title="Generated Structured Prompt"
            />
          </div>

          {/* 8. Optimization Suggestions */}
          {pipelineResult.optimization && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                Prompt Optimization Metrics
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Clarity Score</span>
                  <div className="text-lg font-bold text-emerald-400">
                    {pipelineResult.optimization.optimizedMetrics.clarity}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Context Score</span>
                  <div className="text-lg font-bold text-indigo-400">
                    {pipelineResult.optimization.optimizedMetrics.context}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Structure Score</span>
                  <div className="text-lg font-bold text-purple-400">
                    {pipelineResult.optimization.optimizedMetrics.structure}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Specificity Score</span>
                  <div className="text-lg font-bold text-amber-400">
                    {pipelineResult.optimization.optimizedMetrics.specificity}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Improvements Applied by AI Engine:</span>
                <ul className="space-y-1">
                  {pipelineResult.optimization.improvementsApplied?.map((imp, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
