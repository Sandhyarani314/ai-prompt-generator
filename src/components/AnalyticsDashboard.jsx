import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  Wand2, 
  ShieldCheck, 
  PieChart as PieIcon, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from './StatCard';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AnalyticsDashboard = () => {
  const { analytics, savedPrompts, activeDataset } = useApp();

  // 1. Line Chart Data: Generation Trend Over Time
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Prompts Generated',
        data: [4, 8, 12, 19, 15, 24, analytics.totalGenerated || 28],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#cbd5e1' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
    }
  };

  // 2. Doughnut Chart Data: Domain Distribution
  const domainLabels = Object.keys(analytics.domainCounts || { "Software": 6, "Marketing": 4, "Data Science": 3, "Business": 2 });
  const domainValues = Object.values(analytics.domainCounts || { "Software": 6, "Marketing": 4, "Data Science": 3, "Business": 2 });

  const doughnutData = {
    labels: domainLabels,
    datasets: [
      {
        data: domainValues,
        backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'],
        borderWidth: 0
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#cbd5e1', font: { size: 11 } } }
    }
  };

  // 3. Bar Chart Data: Quality Metrics Breakdown
  const barQualityData = {
    labels: ['Clarity', 'Context', 'Structure', 'Specificity', 'Overall Avg'],
    datasets: [
      {
        label: 'Quality Score (%)',
        data: [94, 88, 96, 90, 92],
        backgroundColor: ['#10b981', '#6366f1', '#a855f7', '#f59e0b', '#ec4899'],
        borderRadius: 8
      }
    ]
  };

  const barQualityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { max: 100, grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Evaluation & Usage Analytics</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Prompt Analytics Dashboard
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Track prompt generation volume, quality metrics, domain breakdown, and dataset effectiveness.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Generated" value={analytics.totalGenerated} subtitle="Prompts synthesized" icon={Sparkles} color="indigo" />
        <StatCard title="Prompts Optimized" value={analytics.totalOptimized} subtitle="Quality enhancements" icon={Wand2} color="purple" />
        <StatCard title="Saved Prompts" value={savedPrompts.length} subtitle="In library" icon={BookOpen} color="emerald" />
        <StatCard title="Avg Prompt Quality" value="92%" subtitle="Evaluation rating" icon={ShieldCheck} color="amber" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Generation Trend */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Prompt Generation Activity Trend
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Chart 2: Domain Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              Domain & Category Distribution
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Categorized</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Chart 3: Quality Metrics Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Quality Score Breakdown (%)
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Clarity vs Context</span>
          </div>
          <div className="h-64 w-full">
            <Bar data={barQualityData} options={barQualityOptions} />
          </div>
        </div>

        {/* Chart 4: Dataset & Recommendation Effectiveness */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Dataset & Recommendation Effectiveness
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Active CSV Dataset:</span>
                <span className="font-bold text-white">{activeDataset?.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Dataset Records:</span>
                <span className="font-bold font-mono text-indigo-400">{activeDataset?.rowCount} rows</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Average Similarity Match:</span>
                <span className="font-bold font-mono text-emerald-400">88.4%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">TF-IDF Vector Density:</span>
                <span className="font-bold font-mono text-purple-400">High (Cleaned)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Dataset vector index optimized for fast cosine similarity search.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
