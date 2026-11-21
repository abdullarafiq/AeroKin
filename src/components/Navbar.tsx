'use client';

import React from 'react';
import { Wind, ShieldAlert, Sparkles, SlidersHorizontal, BookOpen } from 'lucide-react';
import { AQICategory } from '@/types';

interface NavbarProps {
  currentCity: string;
  aqiCategory: AQICategory;
  aqiValue: number;
  onOpenProfiler: () => void;
  activeProfileName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  aqiCategory,
  aqiValue,
  onOpenProfiler,
  activeProfileName,
}) => {
  // WCAG AA compliant badge color mapping
  const getBadgeStyle = () => {
    switch (aqiCategory) {
      case 'Good':
        return 'bg-emerald-700 text-white';
      case 'Moderate':
        return 'bg-amber-700 text-white';
      case 'Unhealthy for Sensitive Groups':
        return 'bg-orange-700 text-white';
      case 'Unhealthy':
        return 'bg-red-700 text-white';
      case 'Very Unhealthy':
        return 'bg-purple-800 text-white';
      case 'Hazardous':
      default:
        return 'bg-rose-950 text-white border border-rose-500';
    }
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Wind className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Aero<span className="text-emerald-600 dark:text-emerald-400">Kin</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  GenAI Clean Air
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
                Urban Smog & Inversion Defense for Families
              </p>
            </div>
          </div>

          {/* Quick Stats & Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Live City & AQI Indicator */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
              role="status"
              aria-label={`Current air quality for ${currentCity}: AQI ${aqiValue}, ${aqiCategory}`}
            >
              <div className="text-right">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentCity}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  AQI {aqiValue}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold tracking-wide shadow-sm ${getBadgeStyle()}`}
              >
                {aqiCategory}
              </span>
            </div>

            {/* Household Profiler Button */}
            <button
              onClick={onOpenProfiler}
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Household profile: ${activeProfileName}. Click to edit.`}
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span className="hidden lg:inline">{activeProfileName}</span>
              <span className="lg:hidden">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
