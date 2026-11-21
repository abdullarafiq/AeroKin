'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { AqiCommandCenter } from '@/components/AqiCommandCenter';
import { HouseholdProfiler, PRESET_PROFILES } from '@/components/HouseholdProfiler';
import { GenAiRoutineGenerator } from '@/components/GenAiRoutineGenerator';
import { IaqHackTracker } from '@/components/IaqHackTracker';
import { Footer } from '@/components/Footer';
import { AQIData, UserHouseholdProfile, GenAIRecommendationResponse } from '@/types';
import { getAQIDataForLocation } from '@/lib/aqiData';
import { generateSmartFallbackRecommendations } from '@/lib/geminiService';
import { ShieldAlert, Sparkles, Wind } from 'lucide-react';

export default function Home() {
  // Initial default state
  const defaultProfile = PRESET_PROFILES[0]; // New Delhi Multi-Gen Family
  const [profile, setProfile] = useState<UserHouseholdProfile>(defaultProfile);
  const [aqiData, setAqiData] = useState<AQIData>(() =>
    getAQIDataForLocation(defaultProfile.city)
  );
  const [recommendations, setRecommendations] =
    useState<GenAIRecommendationResponse | null>(null);

  const [isProfilerOpen, setIsProfilerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAqiLoading, setIsAqiLoading] = useState(false);

  // Restore saved profile from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aerokin_household_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
      }
    } catch (e) {
      console.warn('Unable to read profile from localStorage:', e);
    }
  }, []);

  // Fetch AQI for a given city
  const fetchCityAqi = useCallback(async (cityName: string) => {
    setIsAqiLoading(true);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data: AQIData = await res.json();
        setAqiData(data);
      } else {
        // Fallback local calculation
        setAqiData(getAQIDataForLocation(cityName));
      }
    } catch {
      setAqiData(getAQIDataForLocation(cityName));
    } finally {
      setIsAqiLoading(false);
    }
  }, []);

  // Generate Recommendations via API with graceful local fallback
  const handleGenerateRecommendations = useCallback(async () => {
    setIsGenerating(true);
    try {
      const payload = {
        profile,
        currentAqi: aqiData.aqi,
        pm25: aqiData.pollutants.pm25,
        inversionRisk: aqiData.weather.inversionRisk,
        city: aqiData.city,
      };

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data: GenAIRecommendationResponse = await res.json();
        setRecommendations(data);
      } else {
        // Fallback to local intelligent generator
        const fallbackData = generateSmartFallbackRecommendations({
          profile,
          currentAqi: aqiData.aqi,
          pm25: aqiData.pollutants.pm25,
          inversionRisk: aqiData.weather.inversionRisk,
          city: aqiData.city,
        });
        setRecommendations(fallbackData);
      }
    } catch (error) {
      console.warn('Recommendation API call fell back to local engine:', error);
      const fallbackData = generateSmartFallbackRecommendations({
        profile,
        currentAqi: aqiData.aqi,
        pm25: aqiData.pollutants.pm25,
        inversionRisk: aqiData.weather.inversionRisk,
        city: aqiData.city,
      });
      setRecommendations(fallbackData);
    } finally {
      setIsGenerating(false);
    }
  }, [profile, aqiData]);

  // Automatically generate on first mount
  useEffect(() => {
    handleGenerateRecommendations();
  }, [handleGenerateRecommendations]);

  // Handle Profile Save
  const handleSaveProfile = (newProfile: UserHouseholdProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('aerokin_household_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Unable to persist profile to localStorage:', e);
    }

    // If city changed, update AQI
    if (newProfile.city.toLowerCase() !== aqiData.city.toLowerCase()) {
      fetchCityAqi(newProfile.city);
    }
  };

  // Handle toggling DIY IAQ Hacks
  const handleToggleHack = (hackId: string) => {
    setProfile((prev) => {
      const exists = prev.activeHacks.includes(hackId);
      const updatedHacks = exists
        ? prev.activeHacks.filter((id) => id !== hackId)
        : [...prev.activeHacks, hackId];

      const updated = { ...prev, activeHacks: updatedHacks };
      try {
        localStorage.setItem('aerokin_household_profile', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const isSevereSmog = aqiData.aqi > 200;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Accessible Navbar */}
      <Navbar
        currentCity={aqiData.city}
        aqiCategory={aqiData.category}
        aqiValue={aqiData.aqi}
        onOpenProfiler={() => setIsProfilerOpen(true)}
        activeProfileName={profile.name}
      />

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Severe Smog Inversion Alert Callout */}
        {isSevereSmog && (
          <div
            role="region"
            aria-label="High pollution severe alert"
            className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 sm:p-5 text-rose-900 dark:text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-rose-600 text-white flex-shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                  Critical Winter Smog & Thermal Inversion Warning: {aqiData.city}
                </h3>
                <p className="text-xs text-rose-900 dark:text-rose-200 mt-1 max-w-3xl leading-relaxed">
                  Surface cold air pool is trapping {aqiData.pollutants.pm25} µg/m³ of combustion PM2.5.
                  Atmospheric stagnation is active. Keep windows sealed, run indoor air scrubbers, and avoid outdoor physical exertion.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsProfilerOpen(true)}
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 transition-colors shadow-xs flex-shrink-0 focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Verify Household Defense
            </button>
          </div>
        )}

        {/* 1. Location & AQI Command Center */}
        <AqiCommandCenter
          aqiData={aqiData}
          onCityChange={(city) => {
            fetchCityAqi(city);
          }}
          isLoading={isAqiLoading}
        />

        {/* 2. GenAI Routine & Sustainable Alternative Generator */}
        <GenAiRoutineGenerator
          recommendations={recommendations}
          onGenerate={handleGenerateRecommendations}
          isGenerating={isGenerating}
          profile={profile}
          aqiData={aqiData}
        />

        {/* 3. Indoor Air Quality (IAQ) Hack Library & Tracker */}
        <IaqHackTracker
          activeHacks={profile.activeHacks}
          onToggleHack={handleToggleHack}
        />
      </main>

      {/* Household Lifestyle Profiler Modal */}
      <HouseholdProfiler
        profile={profile}
        onSaveProfile={handleSaveProfile}
        isOpen={isProfilerOpen}
        onClose={() => setIsProfilerOpen(false)}
        currentOutdoorPm25={aqiData.pollutants.pm25}
      />

      {/* Accessible Footer */}
      <Footer />
    </div>
  );
}
