'use client';

import React, { useState } from 'react';
import {
  Users,
  Home,
  Flame,
  Bike,
  ShieldAlert,
  Sparkles,
  Check,
  X,
  HeartPulse,
} from 'lucide-react';
import {
  UserHouseholdProfile,
  VulnerabilityType,
  HousingType,
  HomeSealing,
  ExistingFiltration,
  HeatingType,
  CookingSetup,
  CommuteHabit,
  OutdoorActivityLevel,
} from '@/types';
import { getVulnerabilityScore, estimateIndoorPm25 } from '@/lib/impactEstimator';

interface HouseholdProfilerProps {
  profile: UserHouseholdProfile;
  onSaveProfile: (profile: UserHouseholdProfile) => void;
  isOpen: boolean;
  onClose: () => void;
  currentOutdoorPm25: number;
}

export const PRESET_PROFILES: UserHouseholdProfile[] = [
  {
    id: 'preset-delhi-multigen',
    name: 'New Delhi Multi-Gen Family',
    city: 'New Delhi',
    coordinates: { lat: 28.6139, lon: 77.209 },
    householdSize: 5,
    vulnerableMembers: ['infant', 'elderly', 'asthma_respiratory'],
    housingType: 'apartment',
    homeSealing: 'drafty',
    existingFiltration: 'none',
    heatingType: 'electric_baseboard',
    cookingSetup: 'gas_stove_unvented',
    commuteHabit: 'public_transit',
    outdoorActivityLevel: 'moderate',
    activeHacks: ['corsi-rosenthal-box', 'range-hood-cross-vent'],
  },
  {
    id: 'preset-slc-cyclist',
    name: 'Salt Lake City Winter Cyclist',
    city: 'Salt Lake City',
    coordinates: { lat: 40.7608, lon: -111.891 },
    householdSize: 2,
    vulnerableMembers: ['asthma_respiratory'],
    housingType: 'detached_house',
    homeSealing: 'moderate',
    existingFiltration: 'hvac_basic',
    heatingType: 'gas_furnace',
    cookingSetup: 'gas_stove_vented',
    commuteHabit: 'active_cycling_walking',
    outdoorActivityLevel: 'heavy_athlete',
    activeHacks: ['weatherstrip-draft-barrier', 'microfiber-wet-dusting'],
  },
  {
    id: 'preset-urban-toddler',
    name: 'Urban Apartment with Toddler',
    city: 'Beijing',
    coordinates: { lat: 39.9042, lon: 116.4074 },
    householdSize: 3,
    vulnerableMembers: ['infant', 'child'],
    housingType: 'apartment',
    homeSealing: 'well_sealed',
    existingFiltration: 'portable_hepa',
    heatingType: 'radiator_steam',
    cookingSetup: 'electric_induction',
    commuteHabit: 'public_transit',
    outdoorActivityLevel: 'sedentary',
    activeHacks: ['bedroom-clean-sanctuary', 'nasa-indoor-phyto-cleaners'],
  },
];

export const HouseholdProfiler: React.FC<HouseholdProfilerProps> = ({
  profile,
  onSaveProfile,
  isOpen,
  onClose,
  currentOutdoorPm25,
}) => {
  const [formData, setFormData] = useState<UserHouseholdProfile>(profile);

  if (!isOpen) return null;

  const vulnerability = getVulnerabilityScore(formData);
  const baselineIndoor = estimateIndoorPm25(currentOutdoorPm25, formData, 0);

  const toggleVulnerability = (vuln: VulnerabilityType) => {
    setFormData((prev) => {
      const exists = prev.vulnerableMembers.includes(vuln);
      return {
        ...prev,
        vulnerableMembers: exists
          ? prev.vulnerableMembers.filter((v) => v !== vuln)
          : [...prev.vulnerableMembers, vuln],
      };
    });
  };

  const handleApplyPreset = (preset: UserHouseholdProfile) => {
    setFormData({ ...preset, id: formData.id });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profiler-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-600 text-white">
              <Users className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="profiler-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Household Lifestyle & Exposure Profiler
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrates aerosol penetration models, breathing volumes, and clinical vulnerability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Close profiler dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="px-6 py-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Quick Archetype Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROFILES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  type="button"
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profiler Form Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Realtime Vulnerability Summary Banner */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" aria-hidden="true" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Vulnerability Multiplier: {vulnerability.score}x
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {vulnerability.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Simulated Unfiltered Indoor PM2.5
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {baselineIndoor} µg/m³
              </div>
            </div>
          </div>

          {/* Profile Name & Household Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-name-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Household / Family Name
              </label>
              <input
                id="profile-name-input"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="household-size-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Number of Residents
              </label>
              <input
                id="household-size-input"
                type="number"
                min={1}
                max={20}
                value={formData.householdSize}
                onChange={(e) =>
                  setFormData({ ...formData, householdSize: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 1: Vulnerable Family Members */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              High-Risk Vulnerable Family Members (Select all that apply)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'infant', label: 'Infant (<2 years)' },
                { id: 'child', label: 'Young Children' },
                { id: 'elderly', label: 'Elderly (65+)' },
                { id: 'asthma_respiratory', label: 'Asthma / COPD' },
                { id: 'cardiovascular', label: 'Heart Conditions' },
                { id: 'pregnancy', label: 'Pregnancy' },
              ].map((item) => {
                const checked = formData.vulnerableMembers.includes(
                  item.id as VulnerabilityType
                );
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleVulnerability(item.id as VulnerabilityType)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                      checked
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    {checked && <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Housing & Sealing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="housing-type-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Housing Type
              </label>
              <select
                id="housing-type-select"
                value={formData.housingType}
                onChange={(e) =>
                  setFormData({ ...formData, housingType: e.target.value as HousingType })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="apartment">Apartment / Flat</option>
                <option value="detached_house">Detached Single Family</option>
                <option value="townhouse">Townhouse / Rowhouse</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="home-sealing-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Envelope Sealing (Drafts)
              </label>
              <select
                id="home-sealing-select"
                value={formData.homeSealing}
                onChange={(e) =>
                  setFormData({ ...formData, homeSealing: e.target.value as HomeSealing })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="drafty">Drafty (Older windows, air leaks)</option>
                <option value="moderate">Moderate (Standard weatherstripping)</option>
                <option value="well_sealed">Well-Sealed (Double pane, tight doors)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="existing-filtration-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Existing Filtration
              </label>
              <select
                id="existing-filtration-select"
                value={formData.existingFiltration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    existingFiltration: e.target.value as ExistingFiltration,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="none">None / Open Natural Air</option>
                <option value="hvac_basic">Basic HVAC (MERV 8)</option>
                <option value="portable_hepa">Portable Room HEPA</option>
                <option value="whole_home_purifier">Whole-Home True HEPA</option>
              </select>
            </div>
          </div>

          {/* Section 3: Combustion & Commute */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="cooking-setup-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Kitchen Cooking Setup
              </label>
              <select
                id="cooking-setup-select"
                value={formData.cookingSetup}
                onChange={(e) =>
                  setFormData({ ...formData, cookingSetup: e.target.value as CookingSetup })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="gas_stove_unvented">Gas Range (Recirculating / No Hood)</option>
                <option value="gas_stove_vented">Gas Range (Outdoor Ducted Hood)</option>
                <option value="electric_induction">Electric / Induction Stovetop</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="heating-type-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Winter Heating Source
              </label>
              <select
                id="heating-type-select"
                value={formData.heatingType}
                onChange={(e) =>
                  setFormData({ ...formData, heatingType: e.target.value as HeatingType })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="radiator_steam">Steam / Hot Water Radiators</option>
                <option value="heat_pump">Heat Pump / Inverter Mini-Split</option>
                <option value="gas_furnace">Forced Air Gas Furnace</option>
                <option value="wood_fireplace">Wood Stove / Open Fireplace</option>
                <option value="electric_baseboard">Electric Baseboard / Radiant</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="commute-habit-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Commuting Pattern
              </label>
              <select
                id="commute-habit-select"
                value={formData.commuteHabit}
                onChange={(e) =>
                  setFormData({ ...formData, commuteHabit: e.target.value as CommuteHabit })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="personal_car">Personal Vehicle / Ride Hailing</option>
                <option value="public_transit">Public Transit (Metro / Bus)</option>
                <option value="active_cycling_walking">Bicycle / Walking Commuter</option>
                <option value="hybrid_wfh">Hybrid / Remote Work from Home</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Save & Recalibrate Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
