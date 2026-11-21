'use client';

import React from 'react';
import {
  Sparkles,
  Clock,
  ArrowRight,
  ShieldAlert,
  Leaf,
  CheckCircle,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';
import {
  GenAIRecommendationResponse,
  UserHouseholdProfile,
  AQIData,
} from '@/types';
import { DirectImpactCard } from './DirectImpactCard';

interface GenAiRoutineGeneratorProps {
  recommendations: GenAIRecommendationResponse | null;
  onGenerate: () => void;
  isGenerating: boolean;
  profile: UserHouseholdProfile;
  aqiData: AQIData;
}

export const GenAiRoutineGenerator: React.FC<GenAiRoutineGeneratorProps> = ({
  recommendations,
  onGenerate,
  isGenerating,
  profile,
  aqiData,
}) => {
  return (
    <section
      aria-labelledby="genai-routine-heading"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2
                id="genai-routine-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
              >
                GenAI Low-Emission Routine & Sustainable Swaps
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Customized daily schedule harmonized with atmospheric boundary inversion layers
            </p>
          </div>

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            type="button"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Synthesizing Tailored Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Generate Smart Routine</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Emergency Alert Banner if applicable */}
        {recommendations?.emergencyAlert && (
          <div
            role="alert"
            className="p-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Critical Exposure Hazard Detected
                </strong>
                <p className="text-xs mt-1 leading-relaxed">
                  {recommendations.emergencyAlert}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cumulative Daily Benefits Header Bar */}
        {recommendations && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Target Profile Calibrated
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {recommendations.targetedProfileSummary}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Daily CO₂ Cut
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {recommendations.cumulativeDailyBenefits.totalDailyCo2ReductionKg} kg
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Avoided Inhaled PM2.5
                </span>
                <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                  ~{recommendations.cumulativeDailyBenefits.totalDailyPm25IntakeReductionUg} µg
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Indoor Safety Score
                </span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                  {recommendations.cumulativeDailyBenefits.indoorSafetyScore}/100
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Routine Schedule Slots */}
        {recommendations ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Low-Emission Daily Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.dailyRoutine.map((slot, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
                >
                  <div>
                    {/* Time Slot Badge & Title */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        {slot.timeSlot}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {slot.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {slot.activity}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs mb-3 space-y-1.5">
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        <strong className="font-semibold text-slate-700 dark:text-slate-300">
                          Atmospheric Dynamic:{' '}
                        </strong>
                        {slot.inversionContext}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Ventilation Guidance:{' '}
                        </strong>
                        {slot.ventilationGuidance}
                      </div>
                    </div>
                  </div>

                  {/* Direct Impact Card */}
                  <DirectImpactCard
                    pm25ReductionPct={slot.directImpact.pm25ExposureReductionPct}
                    co2SavedKg={slot.directImpact.co2SavedKg}
                    estimatedIntakeAvoidedUg={slot.directImpact.estimatedIntakeAvoidedUg}
                    healthRationale={slot.directImpact.healthRationale}
                  />
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <Sparkles className="w-10 h-10 text-emerald-600 mx-auto mb-3 opacity-80" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Routine Generated Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Click &quot;Generate Smart Routine&quot; above to calculate an atmospheric-aligned schedule
              optimized for {profile.name} in {aqiData.city}.
            </p>
          </div>
        )}

        {/* Sustainable Swaps Grid */}
        {recommendations && recommendations.sustainableSwaps.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Targeted Sustainable Swaps & Long-Term Interventions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.sustainableSwaps.map((swap) => (
                <div
                  key={swap.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {swap.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        -{swap.directImpact.pm25ExposureReductionPct}% PM2.5 Exposure
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-slate-500 line-through">
                        {swap.currentPractice}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                        <span>{swap.recommendedSwap}</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact Summary Pill Grid */}
                  <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Carbon Reduction:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        {swap.directImpact.co2SavedKgPerWeek} kg CO₂ / week
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Economic Dividend:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {swap.directImpact.economicBenefitMonthly}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                      <strong className="text-slate-700 dark:text-slate-300">Mechanism: </strong>
                      {swap.directImpact.scientificMechanism}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
