import React from 'react';
import { Settings as SettingsIcon, Cpu, Key, Save, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings = () => {
  const { llmSettings, setLlmSettings, showToast } = useApp();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("Settings saved successfully!");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
          <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>System & LLM Configuration</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Configure AI/LLM API credentials, model parameters, and local NLP simulation defaults.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="space-y-1 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            AI / LLM Service Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Select between the local NLP simulation engine or connect a live LLM API (OpenAI / Groq / Gemini).
          </p>
        </div>

        <div className="space-y-4">
          {/* Provider Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Execution Mode</label>
            <select
              value={llmSettings.provider}
              onChange={(e) => setLlmSettings({ ...llmSettings, provider: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="simulation">Local NLP Simulation Engine (No API Key required)</option>
              <option value="openai">OpenAI API (GPT-4o / GPT-3.5)</option>
              <option value="groq">Groq Llama 3 API</option>
              <option value="custom">Custom OpenAI-Compatible REST Endpoint</option>
            </select>
          </div>

          {/* API Key Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>API Key</span>
              <span className="text-[10px] text-slate-500 font-normal">Stored securely in local environment</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={llmSettings.apiKey}
                onChange={(e) => setLlmSettings({ ...llmSettings, apiKey: e.target.value })}
                placeholder="sk-proj-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Model Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Model Name</label>
            <input
              type="text"
              value={llmSettings.model}
              onChange={(e) => setLlmSettings({ ...llmSettings, model: e.target.value })}
              placeholder="gpt-3.5-turbo"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* API Endpoint */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">API Endpoint URL</label>
            <input
              type="text"
              value={llmSettings.apiEndpoint}
              onChange={(e) => setLlmSettings({ ...llmSettings, apiEndpoint: e.target.value })}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Model Temperature</label>
              <span className="font-mono text-indigo-400 font-bold">{llmSettings.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={llmSettings.temperature}
              onChange={(e) => setLlmSettings({ ...llmSettings, temperature: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Settings synced locally</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
