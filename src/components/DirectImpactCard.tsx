import React from 'react';
import { ShieldCheck, Leaf, HeartPulse, DollarSign } from 'lucide-react';

interface DirectImpactCardProps {
  pm25ReductionPct: number;
  co2SavedKg?: number;
  estimatedIntakeAvoidedUg?: number;
  economicSavings?: string;
  healthRationale?: string;
  variant?: 'compact' | 'detailed';
}

export const DirectImpactCard: React.FC<DirectImpactCardProps> = ({
  pm25ReductionPct,
  co2SavedKg,
  estimatedIntakeAvoidedUg,
  economicSavings,
  healthRationale,
  variant = 'compact',
}) => {
  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/20 p-4 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
          Direct Health & Carbon Impact
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        {/* PM2.5 Reduction */}
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
            <span>PM2.5 Shield</span>
          </div>
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
            -{pm25ReductionPct}%
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Indoor exposure cut</p>
        </div>

        {/* CO2 Saved */}
        {co2SavedKg !== undefined && (
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span>CO₂ Avoided</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {co2SavedKg} kg
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">GHG emissions saved</p>
          </div>
        )}

        {/* Particulate intake avoided */}
        {estimatedIntakeAvoidedUg !== undefined && (
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" aria-hidden="true" />
              <span>Inhaled Soot</span>
            </div>
            <div className="text-lg font-extrabold text-teal-700 dark:text-teal-400">
              ~{estimatedIntakeAvoidedUg} µg
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Alveolar intake avoided</p>
          </div>
        )}

        {/* Economic Savings */}
        {economicSavings && (
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>Cost Benefit</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              {economicSavings}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Direct wallet savings</p>
          </div>
        )}
      </div>

      {healthRationale && (
        <div className="text-xs text-emerald-950 dark:text-emerald-200/90 bg-emerald-100/50 dark:bg-emerald-900/30 p-2.5 rounded-lg leading-relaxed">
          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
            Medical Rationale:{' '}
          </strong>
          {healthRationale}
        </div>
      )}
    </div>
  );
};
