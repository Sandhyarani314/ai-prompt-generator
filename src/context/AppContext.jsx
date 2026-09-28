import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATASETS, INITIAL_SAVED_PROMPTS } from '../data/sampleDatasets.js';
import { cleanDataset, calculateDatasetStats } from '../utils/csvProcessor.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Datasets State
  const [datasets, setDatasets] = useState(() => {
    const local = localStorage.getItem('prompt_gen_datasets');
    return local ? JSON.parse(local) : INITIAL_DATASETS;
  });

  const [activeDatasetId, setActiveDatasetId] = useState(() => {
    return datasets[0]?.id || "dataset-software-ai";
  });

  // Saved Prompts State
  const [savedPrompts, setSavedPrompts] = useState(() => {
    const local = localStorage.getItem('prompt_gen_saved_prompts');
    return local ? JSON.parse(local) : INITIAL_SAVED_PROMPTS;
  });

  // Recent History State
  const [recentPrompts, setRecentPrompts] = useState(() => {
    const local = localStorage.getItem('prompt_gen_recent');
    return local ? JSON.parse(local) : [];
  });

  // LLM Settings State
  const [llmSettings, setLlmSettings] = useState(() => {
    const local = localStorage.getItem('prompt_gen_settings');
    return local ? JSON.parse(local) : {
      provider: 'simulation',
      apiKey: '',
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      temperature: 0.7
    };
  });

  // Analytics counter state
  const [analytics, setAnalytics] = useState(() => {
    const local = localStorage.getItem('prompt_gen_analytics');
    return local ? JSON.parse(local) : {
      totalGenerated: 14,
      totalOptimized: 8,
      savedCount: INITIAL_SAVED_PROMPTS.length,
      domainCounts: {
        "Software Development": 6,
        "Marketing": 3,
        "Data Science": 3,
        "Business": 2
      }
    };
  });

  // Generator pre-filled state (for when user clicks "Reuse / Generate from this")
  const [generatorDraft, setGeneratorDraft] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('prompt_gen_datasets', JSON.stringify(datasets));
  }, [datasets]);

  useEffect(() => {
    localStorage.setItem('prompt_gen_saved_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem('prompt_gen_recent', JSON.stringify(recentPrompts));
  }, [recentPrompts]);

  useEffect(() => {
    localStorage.setItem('prompt_gen_settings', JSON.stringify(llmSettings));
  }, [llmSettings]);

  useEffect(() => {
    localStorage.setItem('prompt_gen_analytics', JSON.stringify(analytics));
  }, [analytics]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const activeDataset = datasets.find(d => d.id === activeDatasetId) || datasets[0];

  // Actions
  const addSavedPrompt = (newPrompt) => {
    const promptItem = {
      id: `saved-${Date.now()}`,
      title: newPrompt.title || "Untitled Generated Prompt",
      domain: newPrompt.domain || "General AI",
      content: newPrompt.content,
      qualityScore: newPrompt.qualityScore || 90,
      metrics: newPrompt.metrics || { clarity: 90, context: 90, structure: 90, specificity: 90 },
      date: new Date().toISOString().split('T')[0],
      isFavorite: false,
      tags: newPrompt.tags || [newPrompt.domain || "AI Prompt"]
    };
    setSavedPrompts(prev => [promptItem, ...prev]);
    setAnalytics(prev => ({ ...prev, savedCount: prev.savedCount + 1 }));
    showToast("Prompt saved to your Library successfully!");
  };

  const deleteSavedPrompt = (id) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
    showToast("Prompt deleted from library.", "info");
  };

  const toggleFavoritePrompt = (id) => {
    setSavedPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const recordGeneration = (promptObj) => {
    const historyItem = {
      id: `gen-${Date.now()}`,
      title: promptObj.title || promptObj.requirement?.slice(0, 40) + "...",
      requirement: promptObj.requirement,
      content: promptObj.content,
      domain: promptObj.domain || "General AI",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    setRecentPrompts(prev => [historyItem, ...prev.slice(0, 19)]);
    setAnalytics(prev => {
      const dom = promptObj.domain || "General AI";
      return {
        ...prev,
        totalGenerated: prev.totalGenerated + 1,
        domainCounts: {
          ...prev.domainCounts,
          [dom]: (prev.domainCounts[dom] || 0) + 1
        }
      };
    });
  };

  const recordOptimization = () => {
    setAnalytics(prev => ({ ...prev, totalOptimized: prev.totalOptimized + 1 }));
  };

  const uploadDataset = (newDataset) => {
    setDatasets(prev => [newDataset, ...prev]);
    setActiveDatasetId(newDataset.id);
    showToast(`Uploaded dataset "${newDataset.name}" with ${newDataset.rowCount} rows!`);
  };

  const deleteDataset = (id) => {
    if (datasets.length <= 1) {
      showToast("Cannot delete the only dataset.", "error");
      return;
    }
    const filtered = datasets.filter(d => d.id !== id);
    setDatasets(filtered);
    if (activeDatasetId === id) {
      setActiveDatasetId(filtered[0].id);
    }
    showToast("Dataset deleted.", "info");
  };

  const cleanActiveDatasetOptions = (cleaningOptions) => {
    if (!activeDataset) return;

    const cleanedData = cleanDataset(activeDataset.data, activeDataset.detectedPromptCol, cleaningOptions);
    const newStats = calculateDatasetStats(cleanedData, activeDataset.detectedPromptCol);

    setDatasets(prev => prev.map(d => {
      if (d.id === activeDatasetId) {
        return {
          ...d,
          data: cleanedData,
          rowCount: cleanedData.length,
          stats: newStats
        };
      }
      return d;
    }));

    showToast("Dataset cleaning applied successfully!");
  };

  const loadPromptToGenerator = (promptText, domain) => {
    setGeneratorDraft({ requirement: promptText, domain });
    setActiveTab('generator');
    showToast("Prompt loaded into Generator!");
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      datasets,
      activeDatasetId,
      setActiveDatasetId,
      activeDataset,
      savedPrompts,
      addSavedPrompt,
      deleteSavedPrompt,
      toggleFavoritePrompt,
      recentPrompts,
      recordGeneration,
      recordOptimization,
      uploadDataset,
      deleteDataset,
      cleanActiveDatasetOptions,
      analytics,
      llmSettings,
      setLlmSettings,
      generatorDraft,
      setGeneratorDraft,
      loadPromptToGenerator,
      showToast,
      toast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
