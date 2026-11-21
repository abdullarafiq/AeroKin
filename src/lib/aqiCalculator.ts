import { AQICategory, Pollutants } from '@/types';

/**
 * US EPA Breakpoints for PM2.5 (µg/m³) and corresponding AQI
 */
interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
  category: AQICategory;
  badgeBg: string;
  badgeText: string;
  ariaDescription: string;
}

const PM25_BREAKPOINTS: Breakpoint[] = [
  {
    cLow: 0.0,
    cHigh: 12.0,
    iLow: 0,
    iHigh: 50,
    category: 'Good',
    badgeBg: 'bg-emerald-700 text-white',
    badgeText: 'text-emerald-700',
    ariaDescription: 'Air quality is satisfactory and poses little or no risk.',
  },
  {
    cLow: 12.1,
    cHigh: 35.4,
    iLow: 51,
    iHigh: 100,
    category: 'Moderate',
    badgeBg: 'bg-amber-700 text-white',
    badgeText: 'text-amber-700',
    ariaDescription: 'Air quality is acceptable; however, sensitive individuals may experience mild respiratory symptoms.',
  },
  {
    cLow: 35.5,
    cHigh: 55.4,
    iLow: 101,
    iHigh: 150,
    category: 'Unhealthy for Sensitive Groups',
    badgeBg: 'bg-orange-700 text-white',
    badgeText: 'text-orange-700',
    ariaDescription: 'Members of sensitive groups (infants, elderly, asthmatics) may experience health effects. General public less likely affected.',
  },
  {
    cLow: 55.5,
    cHigh: 150.4,
    iLow: 151,
    iHigh: 200,
    category: 'Unhealthy',
    badgeBg: 'bg-red-700 text-white',
    badgeText: 'text-red-700',
    ariaDescription: 'Some members of the general public may experience health effects; sensitive groups may experience more serious effects.',
  },
  {
    cLow: 150.5,
    cHigh: 250.4,
    iLow: 201,
    iHigh: 300,
    category: 'Very Unhealthy',
    badgeBg: 'bg-purple-800 text-white',
    badgeText: 'text-purple-800',
    ariaDescription: 'Health alert: The risk of health effects is increased for everyone.',
  },
  {
    cLow: 250.5,
    cHigh: 500.4,
    iLow: 301,
    iHigh: 500,
    category: 'Hazardous',
    badgeBg: 'bg-rose-950 text-white border border-rose-600',
    badgeText: 'text-rose-900',
    ariaDescription: 'Health warning of emergency conditions: The entire population is more likely to be severely affected.',
  },
];

/**
 * Calculates AQI from PM2.5 concentration using EPA piecewise linear formula:
 * I = ((I_high - I_low) / (C_high - C_low)) * (C - C_low) + I_low
 */
export function calculateAqiFromPm25(pm25: number): number {
  if (pm25 < 0) return 0;
  const roundedConcentration = Math.floor(pm25 * 10) / 10;

  for (const bp of PM25_BREAKPOINTS) {
    if (roundedConcentration >= bp.cLow && roundedConcentration <= bp.cHigh) {
      const aqi =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
          (roundedConcentration - bp.cLow) +
        bp.iLow;
      return Math.min(500, Math.round(aqi));
    }
  }

  // Beyond 500 µg/m³
  if (roundedConcentration > 500.4) {
    const excess = roundedConcentration - 500.4;
    return Math.min(999, Math.round(500 + excess * 0.8));
  }

  return 0;
}

export function getAqiCategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAqiCategoryDetails(category: AQICategory): {
  badgeBg: string;
  badgeText: string;
  description: string;
  actionGuidance: string;
} {
  switch (category) {
    case 'Good':
      return {
        badgeBg: 'bg-emerald-700 text-white',
        badgeText: 'text-emerald-700',
        description: 'Air quality is ideal. Great day for outdoor activities and fresh-air ventilation.',
        actionGuidance: 'Open windows for cross-ventilation. No air filtration emergency needed.',
      };
    case 'Moderate':
      return {
        badgeBg: 'bg-amber-700 text-white',
        badgeText: 'text-amber-800',
        description: 'Acceptable air quality. Unusually sensitive individuals should monitor respiratory symptoms.',
        actionGuidance: 'Keep ventilation windows to mid-afternoon hours when inversion lifts.',
      };
    case 'Unhealthy for Sensitive Groups':
      return {
        badgeBg: 'bg-orange-700 text-white',
        badgeText: 'text-orange-800',
        description: 'Vulnerable members (infants, elderly, asthmatics) should limit prolonged outdoor exertion.',
        actionGuidance: 'Run DIY or HEPA filtration in bedrooms; avoid burning wood or incense indoors.',
      };
    case 'Unhealthy':
      return {
        badgeBg: 'bg-red-700 text-white',
        badgeText: 'text-red-700',
        description: 'Everyone may begin to experience health effects; sensitive groups face serious risk.',
        actionGuidance: 'Seal windows and drafts; wear well-fitted N95/KF94 masks outdoors; run air purifiers continuously.',
      };
    case 'Very Unhealthy':
      return {
        badgeBg: 'bg-purple-800 text-white',
        badgeText: 'text-purple-800',
        description: 'Significant health alert. Active children and adults should avoid all outdoor exertion.',
        actionGuidance: 'Deploy Corsi-Rosenthal boxes; seal air gaps under doors; activate bedroom clean sanctuary.',
      };
    case 'Hazardous':
    default:
      return {
        badgeBg: 'bg-rose-950 text-white border border-rose-500',
        badgeText: 'text-rose-950',
        description: 'Emergency health warning. Entire population faces severe respiratory distress risk.',
        actionGuidance: 'Stay indoors strictly with continuous high CADR air filtration; close all dampers.',
      };
  }
}

/**
 * Finds dominant pollutant among pollutants record
 */
export function determineDominantPollutant(pollutants: Pollutants): keyof Pollutants {
  // Normalize each to approximate EPA ratio to index
  const ratios = {
    pm25: pollutants.pm25 / 35.4,
    pm10: pollutants.pm10 / 154,
    no2: pollutants.no2 / 100,
    o3: pollutants.o3 / 70,
    co: pollutants.co / 9,
    so2: pollutants.so2 / 75,
  };

  let maxKey: keyof Pollutants = 'pm25';
  let maxRatio = ratios.pm25;

  for (const [key, val] of Object.entries(ratios) as [keyof Pollutants, number][]) {
    if (val > maxRatio) {
      maxRatio = val;
      maxKey = key;
    }
  }

  return maxKey;
}
