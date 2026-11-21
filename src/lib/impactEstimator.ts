import { UserHouseholdProfile } from '@/types';

/**
 * Air penetration efficiency factor (P) based on home sealing
 */
const PENETRATION_EFFICIENCY: Record<string, number> = {
  drafty: 0.82,
  moderate: 0.55,
  well_sealed: 0.30,
};

/**
 * Filtration removal efficiency rate factor (F)
 */
const FILTRATION_FACTOR: Record<string, number> = {
  none: 0.0,
  hvac_basic: 0.25,
  portable_hepa: 0.65,
  whole_home_purifier: 0.85,
};

/**
 * Breathing rates in m³/hour based on profile characteristics
 */
export function getAverageBreathingRate(profile: UserHouseholdProfile): number {
  let rate = 0.65; // baseline resting adult (m³/hr)
  if (profile.vulnerableMembers.includes('infant')) {
    rate = 0.35; // infant / young child
  } else if (profile.outdoorActivityLevel === 'heavy_athlete') {
    rate = 1.1;
  } else if (profile.outdoorActivityLevel === 'moderate') {
    rate = 0.8;
  }
  return rate;
}

/**
 * Calculates estimated indoor PM2.5 concentration (µg/m³) from outdoor concentration
 */
export function estimateIndoorPm25(
  outdoorPm25: number,
  profile: UserHouseholdProfile,
  hackBonusReductionPct: number = 0
): number {
  const p = PENETRATION_EFFICIENCY[profile.homeSealing] ?? 0.55;
  const f = FILTRATION_FACTOR[profile.existingFiltration] ?? 0.0;

  // Additional indoor sources (e.g. unvented gas stove)
  let indoorSourceBase = 0;
  if (profile.cookingSetup === 'gas_stove_unvented') {
    indoorSourceBase += 28; // µg/m³ average background spike
  } else if (profile.cookingSetup === 'gas_stove_vented') {
    indoorSourceBase += 8;
  }

  if (profile.heatingType === 'wood_fireplace') {
    indoorSourceBase += 45;
  }

  // Base indoor concentration from outdoor penetration plus indoor sources
  const baseIndoor = outdoorPm25 * p * (1 - f) + indoorSourceBase;

  // Apply DIY hack reductions
  const finalIndoor = baseIndoor * (1 - Math.min(0.85, hackBonusReductionPct / 100));

  return Math.max(2, Math.round(finalIndoor * 10) / 10);
}

/**
 * Calculates estimated respiratory intake avoided in micrograms (µg) of PM2.5 per day
 */
export function calculateAvoidedPm25IntakeUg(
  baselineIndoorPm25: number,
  optimizedIndoorPm25: number,
  hoursPerDay: number,
  breathingRateM3h: number
): number {
  const concentrationDiff = Math.max(0, baselineIndoorPm25 - optimizedIndoorPm25);
  // Intake (µg) = Diff (µg/m³) * Breathing Rate (m³/hr) * Hours (hr)
  const intakeUg = concentrationDiff * breathingRateM3h * hoursPerDay;
  return Math.round(intakeUg * 10) / 10;
}

/**
 * Calculates household vulnerability multiplier for prioritizing interventions
 */
export function getVulnerabilityScore(profile: UserHouseholdProfile): {
  score: number; // 1 to 5
  description: string;
  primaryRiskGroups: string[];
} {
  let score = 1;
  const risks: string[] = [];

  if (profile.vulnerableMembers.includes('asthma_respiratory')) {
    score += 1.8;
    risks.push('Asthma / Respiratory Sensitivity');
  }
  if (profile.vulnerableMembers.includes('infant')) {
    score += 1.5;
    risks.push('Infant (<2 years)');
  }
  if (profile.vulnerableMembers.includes('elderly')) {
    score += 1.2;
    risks.push('Elderly Family Members (65+)');
  }
  if (profile.vulnerableMembers.includes('pregnancy')) {
    score += 1.2;
    risks.push('Pregnancy (Placental Barrier Risk)');
  }
  if (profile.vulnerableMembers.includes('cardiovascular')) {
    score += 1.3;
    risks.push('Cardiovascular Sensitivity');
  }

  const finalScore = Math.min(5, Math.round(score * 10) / 10);
  let description = 'Standard Low-Risk Household';
  if (finalScore >= 3.5) {
    description = 'Extremely Sensitive Household (Urgent IAQ Safeguards Required)';
  } else if (finalScore >= 2.0) {
    description = 'Elevated Risk Household (Proactive Air Cleaning Advised)';
  }

  return {
    score: finalScore,
    description,
    primaryRiskGroups: risks.length > 0 ? risks : ['General Urban Population'],
  };
}

/**
 * Computes estimated CO2 savings from commuting and heating swaps
 */
export function estimateCo2SavingsKg(
  commuteHabit: string,
  heatingType: string,
  cookingSetup: string
): {
  dailyCo2SavingsKg: number;
  monthlyCo2SavingsKg: number;
} {
  let dailyKg = 0;

  // Commute swaps
  if (commuteHabit === 'personal_car') {
    // Shifting to electric or public transit saving ~2.4 kg CO2e / 15km roundtrip
    dailyKg += 2.4;
  } else if (commuteHabit === 'active_cycling_walking') {
    dailyKg += 0.2;
  }

  // Heating swaps
  if (heatingType === 'wood_fireplace' || heatingType === 'gas_furnace') {
    // Air sealing + lowering setpoint by 1.5C saves ~1.8 kg CO2e/day
    dailyKg += 1.8;
  } else {
    dailyKg += 0.8;
  }

  // Cooking
  if (cookingSetup.includes('gas_stove')) {
    dailyKg += 0.5;
  }

  const roundedDaily = Math.round(dailyKg * 10) / 10;
  return {
    dailyCo2SavingsKg: roundedDaily,
    monthlyCo2SavingsKg: Math.round(roundedDaily * 30 * 10) / 10,
  };
}
