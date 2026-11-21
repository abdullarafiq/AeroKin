'use client';

import React, { useState } from 'react';
import {
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  SunMedium,
  Clock,
  Search,
  CheckCircle2,
  Info,
  ArrowUpRight,
} from 'lucide-react';
import { AQIData, AQICategory, Pollutants } from '@/types';
import { KNOWN_CITIES } from '@/lib/aqiData';

interface AqiCommandCenterProps {
  aqiData: AQIData;
  onCityChange: (cityName: string) => void;
  isLoading?: boolean;
}

export const AqiCommandCenter: React.FC<AqiCommandCenterProps> = ({
  aqiData,
  onCityChange,
  isLoading = false,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onCityChange(searchInput.trim());
      setSearchInput('');
    }
  };

  // Contrast-compliant badges for WCAG 2.1 AA (4.5:1 ratio)
  const getCategoryTheme = (category: AQICategory) => {
    switch (category) {
      case 'Good':
        return {
          bg: 'bg-emerald-700 text-white',
          border: 'border-emerald-600',
          accentText: 'text-emerald-700 dark:text-emerald-400',
          gaugeColor: 'stroke-emerald-600',
          label: 'Good (Air Quality is Healthy)',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-700 text-white',
          border: 'border-amber-600',
          accentText: 'text-amber-700 dark:text-amber-400',
          gaugeColor: 'stroke-amber-600',
          label: 'Moderate (Acceptable for Most)',
        };
      case 'Unhealthy for Sensitive Groups':
        return {
          bg: 'bg-orange-700 text-white',
          border: 'border-orange-600',
          accentText: 'text-orange-700 dark:text-orange-400',
          gaugeColor: 'stroke-orange-600',
          label: 'Unhealthy for Sensitive Groups',
        };
      case 'Unhealthy':
        return {
          bg: 'bg-red-700 text-white',
          border: 'border-red-600',
          accentText: 'text-red-700 dark:text-red-400',
          gaugeColor: 'stroke-red-600',
          label: 'Unhealthy (Action Required)',
        };
      case 'Very Unhealthy':
        return {
          bg: 'bg-purple-800 text-white',
          border: 'border-purple-700',
          accentText: 'text-purple-800 dark:text-purple-300',
          gaugeColor: 'stroke-purple-700',
          label: 'Very Unhealthy (Health Alert)',
        };
      case 'Hazardous':
      default:
        return {
          bg: 'bg-rose-950 text-white border border-rose-500',
          border: 'border-rose-900',
          accentText: 'text-rose-900 dark:text-rose-400',
          gaugeColor: 'stroke-rose-900',
          label: 'Hazardous (Emergency Warning)',
        };
    }
  };

  const theme = getCategoryTheme(aqiData.category);

  // Pollutant standards guide (EPA thresholds)
  const pollutantDetails: Array<{
    key: keyof Pollutants;
    name: string;
    value: number;
    unit: string;
    safeThreshold: number;
    description: string;
  }> = [
    {
      key: 'pm25',
      name: 'Fine Particulates (PM2.5)',
      value: aqiData.pollutants.pm25,
      unit: 'µg/m³',
      safeThreshold: 12.0,
      description: 'Microscopic soot penetrating deep alveolar capillaries and bloodstream.',
    },
    {
      key: 'pm10',
      name: 'Coarse Dust (PM10)',
      value: aqiData.pollutants.pm10,
      unit: 'µg/m³',
      safeThreshold: 54.0,
      description: 'Inhalable road dust, pollen, and industrial mechanical particulates.',
    },
    {
      key: 'no2',
      name: 'Nitrogen Dioxide (NO₂)',
      value: aqiData.pollutants.no2,
      unit: 'ppb',
      safeThreshold: 53.0,
      description: 'Traffic tailpipe emissions and indoor unvented gas cooking combustion.',
    },
    {
      key: 'o3',
      name: 'Ground Ozone (O₃)',
      value: aqiData.pollutants.o3,
      unit: 'ppb',
      safeThreshold: 70.0,
      description: 'Photochemical smog gas that oxidizes and inflames lung tissue.',
    },
    {
      key: 'co',
      name: 'Carbon Monoxide (CO)',
      value: aqiData.pollutants.co,
      unit: 'ppm',
      safeThreshold: 9.0,
      description: 'Toxic odorless combustion gas reducing blood oxygen carrying capacity.',
    },
    {
      key: 'so2',
      name: 'Sulfur Dioxide (SO₂)',
      value: aqiData.pollutants.so2,
      unit: 'ppb',
      safeThreshold: 75.0,
      description: 'Industrial emissions from coal burning and heavy sulfur heating oil.',
    },
  ];

  const quickCities = [
    { name: 'New Delhi', label: 'New Delhi (Severe Smog)' },
    { name: 'Beijing', label: 'Beijing (Winter Haze)' },
    { name: 'Salt Lake City', label: 'Salt Lake City (Valley Inversion)' },
    { name: 'Lahore', label: 'Lahore (Critical Smog)' },
    { name: 'Krakow', label: 'Krakow (Coal Smoke)' },
    { name: 'London', label: 'London (Urban Traffic)' },
  ];

  return (
    <section
      aria-labelledby="command-center-heading"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
    >
      {/* Screen Reader Live Region for Dynamic AQI Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Air quality in ${aqiData.city} is currently ${aqiData.category} with an AQI of ${aqiData.aqi}. PM2.5 is ${aqiData.pollutants.pm25} micrograms per cubic meter. ${aqiData.advisorySummary}`}
      </div>

      {/* Header & Quick Selector */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Wind className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2
                id="command-center-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
              >
                Atmospheric & AQI Command Center
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time ground aerosol measurements, boundary layer meteorology, and winter inversion tracking
            </p>
          </div>

          {/* City Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <label htmlFor="city-search-input" className="sr-only">
                Search urban area or city
              </label>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="city-search-input"
                type="text"
                placeholder="Search city (e.g., Delhi, Salt Lake City, Beijing)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-xs disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Analyze
            </button>
          </form>
        </div>

        {/* Quick City Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-slate-400 mr-1 font-medium">
            High-Impact Cities:
          </span>
          {quickCities.map((c) => (
            <button
              key={c.name}
              onClick={() => onCityChange(c.name)}
              type="button"
              className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                aqiData.city.toLowerCase() === c.name.toLowerCase()
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Command Center Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Giant AQI Dial Card */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800/40 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>Location: <strong>{aqiData.city}, {aqiData.country}</strong></span>
              <span>Updated live</span>
            </div>

            {/* AQI Score Dial Display */}
            <div className="text-center my-4">
              <div
                className="inline-flex flex-col items-center justify-center p-6 rounded-full w-44 h-44 border-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-inner relative"
                role="figure"
                aria-label={`Air Quality Index is ${aqiData.aqi}, classified as ${aqiData.category}`}
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  US EPA AQI
                </span>
                <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white my-1">
                  {aqiData.aqi}
                </span>
                <span className="text-xs text-slate-500">
                  PM2.5: {aqiData.pollutants.pm25} µg
                </span>
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold shadow-xs ${theme.bg}`}
                >
                  {aqiData.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {aqiData.healthImplications}
            </p>
          </div>

          {/* Meteorological Inversion Advisory Callout */}
          <div className="mt-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
              <span>Inversion Severity: {aqiData.weather.inversionRisk}</span>
            </div>
            <p className="text-amber-950 dark:text-amber-200/90 leading-snug">
              {aqiData.weather.description}
            </p>
          </div>
        </div>

        {/* Right: Meteorological Sensors & Detailed Pollutant Breakdown */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          {/* Weather & Inversion Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Thermometer className="w-4 h-4 text-orange-500" aria-hidden="true" />
                <span>Ambient Temp</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {aqiData.weather.tempC}°C
              </div>
              <p className="text-[10px] text-slate-500">Surface layer cooling</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Droplets className="w-4 h-4 text-blue-500" aria-hidden="true" />
                <span>Relative Humidity</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {aqiData.weather.humidity}%
              </div>
              <p className="text-[10px] text-slate-500">Hydroscopic particle growth</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <Wind className="w-4 h-4 text-teal-500" aria-hidden="true" />
                <span>Boundary Wind</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {aqiData.weather.windSpeedKmh} km/h
              </div>
              <p className="text-[10px] text-slate-500">
                {aqiData.weather.windSpeedKmh < 6 ? 'Atmospheric Stagnation' : 'Active Ventilation'}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/20">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
                <Clock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Safe Vent Window</span>
              </div>
              <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                13:00 - 15:30
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Peak thermal mixing</p>
            </div>
          </div>

          {/* 6 Pollutants Matrix */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Spectrometric Pollutant Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pollutantDetails.map((p) => {
                const ratio = p.value / p.safeThreshold;
                const isElevated = ratio > 1.0;
                return (
                  <div
                    key={p.key}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {p.name}
                      </span>
                      {isElevated && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {ratio > 2.5 ? 'Severe' : 'Elevated'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {p.value}
                      </span>
                      <span className="text-xs text-slate-500">{p.unit}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 24-Hour Diurnal Forecast & Ventilation Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                24-Hour Inversion & PM2.5 Forecast
              </h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Ventilation Safe Slot Marked in Green
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 overflow-x-auto py-1">
              {aqiData.hourlyForecast.slice(0, 12).map((item, idx) => {
                const isGreen = item.isOutdoorSafe;
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg text-center border transition-all ${
                      isGreen
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-700 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                    }`}
                    title={`${item.time} - AQI: ${item.aqi} (${item.riskCategory}) - ${item.recommendation}`}
                  >
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {item.time}
                    </div>
                    <div
                      className={`text-sm font-extrabold my-0.5 ${
                        isGreen
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.aqi}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {Math.round(item.pm25)}µg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
