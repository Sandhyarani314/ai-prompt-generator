import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = "indigo", trend }) => {
  const colors = {
    indigo: "from-indigo-600/20 to-purple-600/10 border-indigo-500/30 text-indigo-400",
    emerald: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-400",
    purple: "from-purple-600/20 to-pink-600/10 border-purple-500/30 text-purple-400",
    blue: "from-blue-600/20 to-cyan-600/10 border-blue-500/30 text-blue-400"
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${colors[color] || colors.indigo} border bg-slate-900/80 backdrop-blur-md shadow-lg flex items-center justify-between`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          {trend && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
