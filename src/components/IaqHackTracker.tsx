'use client';

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Leaf,
  DollarSign,
  HeartPulse,
  Wind,
  Layers,
  BookOpen,
  Check,
} from 'lucide-react';
import { IAQHack } from '@/types';
import { IAQ_HACKS, calculateCumulativeHackImpact } from '@/lib/iaqHacks';

interface IaqHackTrackerProps {
  activeHacks: string[];
  onToggleHack: (hackId: string) => void;
}

export const IaqHackTracker: React.FC<IaqHackTrackerProps> = ({
  activeHacks,
  onToggleHack,
}) => {
  const [expandedHackId, setExpandedHackId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const cumulativeImpact = calculateCumulativeHackImpact(activeHacks);

  const categories = [
    'All',
    'DIY Filtration',
    'Sealing & Drafts',
    'Cooking & Ventilation',
    'Cleaning Protocol',
    'Plants & Nature',
  ];

  const filteredHacks =
    selectedCategory === 'All'
      ? IAQ_HACKS
      : IAQ_HACKS.filter((h) => h.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedHackId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="iaq-hacks-heading"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Wrench className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2
                id="iaq-hacks-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
              >
                Indoor Air Quality (IAQ) Hack Library & Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Low-cost, science-backed DIY air cleaning interventions and household sealing protocols
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {activeHacks.length} of {IAQ_HACKS.length} Interventions Active
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Cumulative Household Impact Meter */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <HeartPulse className="w-4 h-4" aria-hidden="true" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Cumulative Household Impact Meter
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Real-time Aerosol Simulation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* PM2.5 Cut */}
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                Total PM2.5 Shield
              </span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                -{cumulativeImpact.totalPm25ReductionPct}%
              </div>
              <p className="text-[10px] text-slate-500">Peak indoor smog reduction</p>
            </div>

            {/* Total CADR */}
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                Clean Air Delivery Rate
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                +{cumulativeImpact.totalCadrBoostM3h}
                <span className="text-xs font-semibold text-slate-500 ml-1">m³/h</span>
              </div>
              <p className="text-[10px] text-slate-500">Filtered air throughput</p>
            </div>

            {/* Annual Respiratory Protection */}
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                Respiratory Burden Drop
              </span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                -{cumulativeImpact.annualRespiratoryBurdenReducedPct}%
              </div>
              <p className="text-[10px] text-slate-500">Clinical airway inflammation cut</p>
            </div>

            {/* Annual Wallet Savings */}
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                Estimated Annual Savings
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                ${cumulativeImpact.annualSavingsUsd}
              </div>
              <p className="text-[10px] text-slate-500">vs commercial HEPA purifiers</p>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hacks Interactive Checklist List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHacks.map((hack) => {
            const isActive = activeHacks.includes(hack.id);
            const isExpanded = expandedHackId === hack.id;

            return (
              <div
                key={hack.id}
                className={`rounded-xl border transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    {/* Checkbox & Name */}
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleHack(hack.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                          isActive
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                        role="checkbox"
                        aria-checked={isActive}
                        aria-label={`Toggle ${hack.name}`}
                      >
                        {isActive && <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {hack.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {hack.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {hack.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Cost Badge */}
                    <span className="px-2 py-1 rounded-md text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 flex-shrink-0">
                      ~${hack.estimatedCostUsd}
                    </span>
                  </div>

                  {/* Impact Quick Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">PM2.5 Cut</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        -{hack.pm25ReductionPct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">CADR Boost</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        +{hack.cadrBoostM3h} m³/h
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Difficulty</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        {hack.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Expand / Collapse Button */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(hack.id)}
                    className="w-full mt-3 pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 hover:text-emerald-700 focus-visible:ring-1 focus-visible:ring-emerald-500"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide DIY Instructions' : 'View Materials & Assembly Guide'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Expanded Detailed Step-by-Step Instructions */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs space-y-3">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {hack.description}
                    </p>

                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1">
                        Required Materials:
                      </strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                        {hack.materials.map((mat, i) => (
                          <li key={i}>{mat}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1">
                        Step-by-Step Assembly Protocol:
                      </strong>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {hack.instructions.map((step, i) => (
                          <li key={i} className="leading-snug">{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 italic">
                      Scientific Validation: {hack.scientificSource}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
