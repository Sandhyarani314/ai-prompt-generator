import React, { useState } from 'react';
import { 
  Database, 
  UploadCloud, 
  FileSpreadsheet, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Sparkles, 
  Layers, 
  Filter, 
  Check, 
  BarChart3,
  RefreshCw,
  Table
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseCSVData } from '../utils/csvProcessor';
import { StatCard } from './StatCard';

export const DatasetManager = () => {
  const { 
    datasets, 
    activeDatasetId, 
    setActiveDatasetId, 
    activeDataset, 
    uploadDataset, 
    deleteDataset, 
    cleanActiveDatasetOptions,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'clean' | 'upload'
  const [dragOver, setDragOver] = useState(false);
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Data cleaning options checkboxes
  const [cleaningOpts, setCleaningOpts] = useState({
    cleanSpaces: true,
    removeMissing: true,
    removeDuplicates: true,
    normalizeText: false
  });

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      showToast("Please select a valid .csv file.", "error");
      return;
    }

    try {
      const parsed = await parseCSVData(file);
      const newDatasetObj = {
        id: `dataset-upload-${Date.now()}`,
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        rowCount: parsed.rows.length,
        columnCount: parsed.headers.length,
        detectedPromptCol: parsed.detectedPromptCol,
        domain: "Custom Upload",
        stats: parsed.stats,
        data: parsed.rows
      };

      uploadDataset(newDatasetObj);
      setActiveTab('preview');
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to process CSV file.", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const stats = activeDataset?.stats || {
    totalPrompts: activeDataset?.data?.length || 0,
    uniquePrompts: activeDataset?.data?.length || 0,
    domainsCount: 1,
    missingValues: 0,
    duplicateRecords: 0,
    avgPromptLength: 250
  };

  // Filter dataset rows for preview table
  const rows = activeDataset?.data || [];
  const headers = activeDataset?.data?.[0] ? Object.keys(activeDataset.data[0]) : [];

  const filteredRows = rows.filter(row => {
    if (!searchTableQuery) return true;
    return Object.values(row).some(val => String(val).toLowerCase().includes(searchTableQuery.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handleApplyCleaning = () => {
    cleanActiveDatasetOptions(cleaningOpts);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dataset / CSV Management Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            CSV Dataset Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Upload CSV files, auto-detect prompt columns, clean dataset noise, and view statistical analytics.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Active CSV:</span>
          <select
            value={activeDatasetId}
            onChange={(e) => {
              setActiveDatasetId(e.target.value);
              setPage(1);
            }}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 max-w-xs"
          >
            {datasets.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.rowCount} rows)</option>
            ))}
          </select>

          {datasets.length > 1 && (
            <button
              onClick={() => deleteDataset(activeDatasetId)}
              title="Delete dataset"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dataset Statistics Cards (Required: Total, Unique, Domains, Missing, Duplicates, Avg Length) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Prompts" value={stats.totalPrompts} color="indigo" />
        <StatCard title="Unique Prompts" value={stats.uniquePrompts} color="emerald" />
        <StatCard title="Domains" value={stats.domainsCount} color="purple" />
        <StatCard title="Missing Values" value={stats.missingValues} color="amber" />
        <StatCard title="Duplicates" value={stats.duplicateRecords} color="blue" />
        <StatCard title="Avg Prompt Len" value={`${stats.avgPromptLength} ch`} color="indigo" />
      </div>

      {/* Sub Tabs: Preview Table / Clean Dataset / Upload CSV */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Dataset Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('clean')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'clean'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clean Data & Operations</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload CSV</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Detected Prompt Column: <strong className="text-indigo-300 font-mono">{activeDataset?.detectedPromptCol || 'prompt_text'}</strong>
          </div>
        </div>

        {/* Tab 1: Dataset Preview Table */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTableQuery}
                  onChange={(e) => {
                    setSearchTableQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search dataset rows..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <span className="text-xs text-slate-400">
                Showing {paginatedRows.length} of {filteredRows.length} rows
              </span>
            </div>

            {/* Separate Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                    <th className="p-3 w-12 text-center">#</th>
                    {headers.slice(0, 5).map(h => (
                      <th key={h} className={`p-3 ${h === activeDataset?.detectedPromptCol ? 'text-indigo-400 font-bold' : ''}`}>
                        {h} {h === activeDataset?.detectedPromptCol ? '(Prompt)' : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {paginatedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition">
                      <td className="p-3 text-center text-slate-500 font-mono">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      {headers.slice(0, 5).map(h => (
                        <td key={h} className="p-3 max-w-xs truncate font-mono text-[11px]">
                          {String(row[h] !== undefined ? row[h] : '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-slate-200 font-semibold cursor-pointer"
              >
                Previous
              </button>
              <span className="text-slate-400 font-medium">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 text-slate-200 font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Clean Data Operations */}
        {activeTab === 'clean' && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Dataset Cleaning & Normalization</h3>
              <p className="text-xs text-slate-400">
                Perform real-time NLP text cleaning operations on the active dataset column "{activeDataset?.detectedPromptCol}".
              </p>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleaningOpts.cleanSpaces}
                  onChange={(e) => setCleaningOpts({ ...cleaningOpts, cleanSpaces: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Clean Unnecessary Spaces</span>
                  <span className="text-slate-500 text-[11px]">Strips leading/trailing whitespace and multiple space runs.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleaningOpts.removeMissing}
                  onChange={(e) => setCleaningOpts({ ...cleaningOpts, removeMissing: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Handle & Remove Missing Values</span>
                  <span className="text-slate-500 text-[11px]">Filters out rows where prompt text is empty or null.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleaningOpts.removeDuplicates}
                  onChange={(e) => setCleaningOpts({ ...cleaningOpts, removeDuplicates: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Remove Duplicate Prompts</span>
                  <span className="text-slate-500 text-[11px]">Deduplicates rows containing identical prompt strings.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleaningOpts.normalizeText}
                  onChange={(e) => setCleaningOpts({ ...cleaningOpts, normalizeText: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Normalize Text (Lowercase & Strip Special Chars)</span>
                  <span className="text-slate-500 text-[11px]">Normalizes characters to standard alphanumeric text.</span>
                </div>
              </label>
            </div>

            <button
              onClick={handleApplyCleaning}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Apply Dataset Cleaning Operations</span>
            </button>
          </div>
        )}

        {/* Tab 3: Drag & Drop CSV Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`p-12 border-2 border-dashed rounded-2xl text-center space-y-4 transition cursor-pointer ${
                dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">Drag & Drop CSV Dataset File Here</h3>
                <p className="text-xs text-slate-400">or click below to browse from your device</p>
              </div>

              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />

              <label
                htmlFor="csv-file-input"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Select CSV File</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
