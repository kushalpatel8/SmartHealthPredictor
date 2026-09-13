import React from 'react';
import { HeartPulse, AlertTriangle, ShieldCheck } from 'lucide-react';

function RiskCard({ score = 0, level = 'LOW', diagnosis = 'Cardiovascular Risk Assessment', model = 'RandomForest-AI' }) {
  const isHigh = score > 0.6 || level === 'HIGH' || level === 'CRITICAL';
  const isMed = score > 0.35 || level === 'MODERATE';

  const badgeColor = isHigh 
    ? 'bg-red-100 text-red-700 border-red-200' 
    : isMed 
    ? 'bg-amber-100 text-amber-700 border-amber-200' 
    : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  const Icon = isHigh ? AlertTriangle : isMed ? HeartPulse : ShieldCheck;

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
          {level} RISK
        </span>
        <span className="text-xs text-slate-400 font-medium">{model}</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${isHigh ? 'bg-red-50 text-red-600' : isMed ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Calculated Risk</p>
          <div className="text-3xl font-black text-slate-900">
            {(score * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-700">{diagnosis}</p>
    </div>
  );
}

export default RiskCard;