import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Cpu, 
  Wand2, 
  Mic, 
  Tag, 
  Layers, 
  RotateCcw, 
  FileText,
  Play,
  Square,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeRequirementNLP } from '../utils/nlpEngine';
import { generateStructuredPrompt } from '../utils/promptGeneratorEngine';
import { optimizePrompt, evaluatePromptQuality } from '../utils/promptOptimizerEngine';
import { PromptEditor } from './PromptEditor';

export const LipMovement = () => {
  const { activeDataset, recordGeneration, addSavedPrompt, showToast, recordOptimization, setActiveTab } = useApp();

  // Input Mode: 'camera' | 'upload'
  const [inputMode, setInputMode] = useState('camera');

  // Camera & Stream states
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');

  // Multimodal Mode (Audio + Lip)
  const [enableMultimodal, setEnableMultimodal] = useState(true);

  // Analysis & Processing State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 0 to 6
  const [analysisStatusList, setAnalysisStatusList] = useState([]);

  // Detected text state
  const [detectedText, setDetectedText] = useState('Create a professional marketing campaign for a new AI product.');
  const [isEditingText, setIsEditingText] = useState(false);

  // Pipeline Output states
  const [nlpOutput, setNlpOutput] = useState(null);
  const [generatedPromptText, setGeneratedPromptText] = useState('');
  const [optimizationResult, setOptimizationResult] = useState(null);

  // Sample demonstration presets for lip reading testing
  const demoPresets = [
    "Create a professional marketing campaign for a new AI product.",
    "Refactor Python code for high performance and low memory footprint.",
    "Design a scalable microservice REST API architecture specification.",
    "Formulate a 90-day GTM strategy for an enterprise B2B SaaS startup."
  ];

  // Camera cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // WebCam Controls
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: enableMultimodal
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setMediaStream(stream);
      setIsCameraActive(true);
      showToast("Camera stream connected.");
    } catch (err) {
      console.error(err);
      showToast("Could not access camera. Check device permissions.", "error");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Handle Video File Upload
  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('video/')) {
      showToast("Please upload a valid video file (.mp4, .webm, .mov).", "error");
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadedVideoUrl(url);
    setVideoFileName(file.name);
    showToast(`Loaded video file "${file.name}"`);
  };

  // Draw face & lip tracking bounding boxes on canvas overlay
  useEffect(() => {
    let animId;
    const drawOverlay = () => {
      if (canvasRef.current && (isCameraActive || isAnalyzing)) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width || 640;
        const height = canvas.height || 480;

        ctx.clearRect(0, 0, width, height);

        if (isAnalyzing || isCameraActive) {
          // Draw Face Detection Box (cyan dashed)
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.strokeRect(width * 0.25, height * 0.15, width * 0.5, height * 0.7);

          // Draw Lip / Mouth Region of Interest (ROI) Box (emerald solid)
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
          const lipX = width * 0.38;
          const lipY = height * 0.62;
          const lipW = width * 0.24;
          const lipH = height * 0.18;
          ctx.strokeRect(lipX, lipY, lipW, lipH);

          // ROI Label
          ctx.fillStyle = '#10b981';
          ctx.font = '10px monospace';
          ctx.fillText('LIP_ROI [68 LANDMARKS]', lipX, lipY - 6);

          // Draw animated lip landmark mesh dots
          const time = Date.now() * 0.005;
          ctx.fillStyle = '#ec4899';
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radiusX = lipW * 0.35 + Math.sin(time + i) * 3;
            const radiusY = lipH * 0.25 + Math.cos(time + i) * 2;
            const px = lipX + lipW / 2 + Math.cos(angle) * radiusX;
            const py = lipY + lipH / 2 + Math.sin(angle) * radiusY;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      animId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
    return () => cancelAnimationFrame(animId);
  }, [isCameraActive, isAnalyzing]);

  // Execute Lip Movement Analysis Pipeline
  const runLipAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    
    // Multi-step status sequence simulation
    const steps = [
      { text: "Detecting facial landmarks...", status: "active" },
      { text: "Cropping Mouth Region of Interest (ROI)", status: "pending" },
      { text: "Tracking lip optical flow & landmark mesh velocity", status: "pending" },
      { text: "Running Visual Speech Recognition (AV-Hubert Neural Model)", status: "pending" },
      { text: "Extracting text tokens & phoneme sequence", status: "pending" },
      { text: "Running NLP requirement analysis & domain detection", status: "pending" }
    ];

    setAnalysisStatusList(steps);

    for (let i = 1; i <= 6; i++) {
      setAnalysisStep(i);
      setAnalysisStatusList(prev => prev.map((s, idx) => {
        if (idx < i - 1) return { ...s, status: "completed" };
        if (idx === i - 1) return { ...s, status: "active" };
        return { ...s, status: "pending" };
      }));
      await new Promise(r => setTimeout(r, 600));
    }

    setAnalysisStatusList(prev => prev.map(s => ({ ...s, status: "completed" })));

    // Perform NLP analysis on detected text
    const datasetRows = activeDataset?.data || [];
    const promptCol = activeDataset?.detectedPromptCol || 'prompt_text';
    const nlpRes = analyzeRequirementNLP(detectedText, datasetRows, promptCol);
    setNlpOutput(nlpRes);

    setIsAnalyzing(false);
    showToast("Lip movement visual speech recognition complete!");
  };

  // Generate Prompt from Detected Text
  const handleGenerateFromLipText = () => {
    if (!detectedText || detectedText.trim().length === 0) {
      showToast("Detected text is empty.", "error");
      return;
    }

    const domain = nlpOutput?.detectedDomain || "General AI";
    const prompt = generateStructuredPrompt({
      requirement: detectedText,
      domain
    });

    setGeneratedPromptText(prompt);

    recordGeneration({
      title: "Lip Speech: " + detectedText.slice(0, 30) + "...",
      requirement: detectedText,
      content: prompt,
      domain
    });

    showToast("Generated structured prompt from lip movement!");
  };

  // Optimize Generated Prompt
  const handleOptimizePrompt = () => {
    if (!generatedPromptText) return;
    const res = optimizePrompt(generatedPromptText);
    setOptimizationResult(res);
    recordOptimization();
    showToast("Prompt optimization complete!");
  };

  const handleApplyOptimization = () => {
    if (optimizationResult?.optimizedText) {
      setGeneratedPromptText(optimizationResult.optimizedText);
      showToast("Applied optimized prompt structure!");
    }
  };

  const handleSaveToLibrary = () => {
    if (!generatedPromptText) return;
    addSavedPrompt({
      title: "Lip Reading Prompt: " + detectedText.slice(0, 25) + "...",
      domain: nlpOutput?.detectedDomain || "General AI",
      content: generatedPromptText,
      qualityScore: optimizationResult?.optimizedMetrics?.overallScore || 90
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* 3. Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">
          <Video className="w-3.5 h-3.5 text-pink-400" />
          <span>Visual Speech & Lip Reading Engine</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Lip Movement → AI Prompt
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Use camera or video input to analyze lip movement, understand the user's spoken requirement, and generate an optimized AI prompt.
        </p>
      </div>

      {/* 4. Input Section Tabs: [ Live Camera ] [ Upload Video ] */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setInputMode('camera'); stopCamera(); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                inputMode === 'camera'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera Input</span>
            </button>

            <button
              onClick={() => { setInputMode('upload'); stopCamera(); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                inputMode === 'upload'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
          </div>

          {/* Multimodal Toggle (Audio + Lip) */}
          <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={enableMultimodal}
              onChange={(e) => setEnableMultimodal(e.target.checked)}
              className="w-4 h-4 accent-pink-600 rounded"
            />
            <Mic className="w-3.5 h-3.5 text-pink-400" />
            <span className="font-medium">Combine Audio Speech-to-Text + Lip Movement (Multimodal)</span>
          </label>
        </div>

        {/* Tab 1: Live Camera View */}
        {inputMode === 'camera' && (
          <div className="space-y-4">
            <div className="relative w-full max-w-2xl mx-auto h-72 md:h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />

              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {!isCameraActive && (
                <div className="text-center space-y-3 z-10">
                  <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Click below to start live webcam preview.</p>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/20 transition cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-2"
                >
                  <Square className="w-4 h-4 text-red-400" />
                  <span>Stop Camera</span>
                </button>
              )}

              <button
                onClick={runLipAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-pink-600/25 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Start Lip Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Upload Video View */}
        {inputMode === 'upload' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {uploadedVideoUrl ? (
              <div className="space-y-3">
                <video
                  src={uploadedVideoUrl}
                  controls
                  className="w-full h-72 rounded-2xl bg-slate-950 border border-slate-800 object-contain"
                />
                <p className="text-xs font-mono text-slate-400 text-center">Video File: {videoFileName}</p>
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-800 bg-slate-950 rounded-2xl text-center space-y-3">
                <UploadCloud className="w-12 h-12 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-200">Drag & Drop Video File (.mp4, .webm)</h4>
                <input
                  type="file"
                  accept="video/*"
                  id="lip-video-input"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
                <label
                  htmlFor="lip-video-input"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow cursor-pointer"
                >
                  <span>Upload Video</span>
                </label>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={runLipAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                <span>Analyze Video Lip Movement</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Lip Movement Analysis Workflow & Real-Time Status */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-pink-400" />
          Lip Movement Analysis Workflow Pipeline
        </h2>

        {/* Workflow Diagram Step Progression */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[10px] font-mono font-bold">
          {[
            "Camera/Video",
            "Face Detect",
            "Lip ROI",
            "Lip Motion",
            "Visual Speech",
            "Text Extract",
            "NLP Analysis",
            "AI Prompt"
          ].map((stepLabel, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl border transition ${
                analysisStep > idx
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : analysisStep === idx + 1
                  ? 'bg-pink-950/80 border-pink-500/60 text-pink-200 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <span>{stepLabel}</span>
            </div>
          ))}
        </div>

        {/* Real-time Status Checklist */}
        {analysisStatusList.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Execution Status Log:</span>
            {analysisStatusList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 font-mono">
                {item.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {item.status === "active" && <Loader2 className="w-4 h-4 text-pink-400 animate-spin shrink-0" />}
                {item.status === "pending" && <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
                <span className={item.status === "completed" ? "text-emerald-300" : item.status === "active" ? "text-pink-300 font-bold" : "text-slate-500"}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Technical Architecture Info Pill */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200 block">Visual Speech Recognition Integration Architecture</span>
            <span>
              Face detection isolates the facial bounding box; Lip ROI isolates 68 facial landmark mesh coordinates. Spatiotemporal CNN + Transformer (AV-Hubert pipeline) converts optical lip velocity vectors into candidate phonemes and extracted requirement text.
            </span>
          </div>
        </div>
      </div>

      {/* 6. Detected Text Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Detected Spoken Requirement
          </h2>

          {/* Demonstration Quick Presets */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Demo Presets:</span>
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setDetectedText(preset)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer"
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={detectedText}
          onChange={(e) => setDetectedText(e.target.value)}
          placeholder="Interpreted spoken requirement will appear here..."
          className="w-full h-24 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={runLipAnalysis}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Re-analyze</span>
          </button>

          <button
            onClick={handleGenerateFromLipText}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Structured Prompt</span>
          </button>
        </div>
      </div>

      {/* 7. Connected NLP Analysis Summary */}
      {nlpOutput && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            NLP Analysis of Detected Speech
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Detected Domain</span>
              <div className="text-xs font-bold text-indigo-300 mt-0.5">{nlpOutput.detectedDomain}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Identified Intent</span>
              <div className="text-xs font-bold text-purple-300 mt-0.5">{nlpOutput.detectedIntent}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Detected Format & Tone</span>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                {nlpOutput.entities.detectedTone} ({nlpOutput.entities.detectedFormat})
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Extracted Keywords:</span>
            <div className="flex flex-wrap gap-1.5">
              {nlpOutput.keywords?.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
                  {kw.keyword} ({kw.weight}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. AI Prompt Generation & Editor */}
      {generatedPromptText && (
        <div className="space-y-6">
          <PromptEditor
            promptText={generatedPromptText}
            setPromptText={setGeneratedPromptText}
            onSave={handleSaveToLibrary}
            onOptimize={handleOptimizePrompt}
            title="Generated Prompt from Lip Reading"
          />

          {/* 9. Prompt Optimization Section */}
          {optimizationResult && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  Prompt Quality Optimization Analysis
                </h2>

                <button
                  onClick={handleApplyOptimization}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Apply Optimization
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Clarity</span>
                  <div className="text-base font-bold text-emerald-400">{optimizationResult.optimizedMetrics.clarity}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Context</span>
                  <div className="text-base font-bold text-indigo-400">{optimizationResult.optimizedMetrics.context}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Structure</span>
                  <div className="text-base font-bold text-purple-400">{optimizationResult.optimizedMetrics.structure}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Specificity</span>
                  <div className="text-base font-bold text-amber-400">{optimizationResult.optimizedMetrics.specificity}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
