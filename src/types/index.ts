export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export type InversionRisk = 'Low' | 'Moderate' | 'Severe';

export interface Pollutants {
  pm25: number; // in µg/m³
  pm10: number; // in µg/m³
  no2: number;  // in ppb
  o3: number;   // in ppb
  co: number;   // in ppm
  so2: number;  // in ppb
}

export interface WeatherData {
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  inversionRisk: InversionRisk;
  atmosphericStagnation: boolean;
  description: string;
}

export interface HourlyForecastItem {
  time: string;
  aqi: number;
  pm25: number;
  riskCategory: AQICategory;
  isOutdoorSafe: boolean;
  recommendation: string;
}

export interface AQIData {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  aqi: number;
  category: AQICategory;
  dominantPollutant: keyof Pollutants;
  pollutants: Pollutants;
  weather: WeatherData;
  hourlyForecast: HourlyForecastItem[];
  advisorySummary: string;
  healthImplications: string;
  ventilationSafeHours: string;
  lastUpdated: string;
}

export type VulnerabilityType =
  | 'infant'
  | 'child'
  | 'elderly'
  | 'asthma_respiratory'
  | 'cardiovascular'
  | 'pregnancy';

export type HousingType = 'apartment' | 'detached_house' | 'townhouse';
export type HomeSealing = 'drafty' | 'moderate' | 'well_sealed';
export type ExistingFiltration =
  | 'none'
  | 'hvac_basic'
  | 'portable_hepa'
  | 'whole_home_purifier';
export type HeatingType =
  | 'radiator_steam'
  | 'heat_pump'
  | 'gas_furnace'
  | 'wood_fireplace'
  | 'electric_baseboard';
export type CookingSetup =
  | 'gas_stove_unvented'
  | 'gas_stove_vented'
  | 'electric_induction';
export type CommuteHabit =
  | 'active_cycling_walking'
  | 'public_transit'
  | 'personal_car'
  | 'hybrid_wfh';
export type OutdoorActivityLevel = 'sedentary' | 'moderate' | 'heavy_athlete';

export interface UserHouseholdProfile {
  id: string;
  name: string;
  city: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  householdSize: number;
  vulnerableMembers: VulnerabilityType[];
  housingType: HousingType;
  homeSealing: HomeSealing;
  existingFiltration: ExistingFiltration;
  heatingType: HeatingType;
  cookingSetup: CookingSetup;
  commuteHabit: CommuteHabit;
  outdoorActivityLevel: OutdoorActivityLevel;
  activeHacks: string[]; // hack IDs
}

export interface DirectImpactMetrics {
  pm25ExposureReductionPct: number; // e.g. 42
  co2SavedKg: number; // e.g. 1.8
  estimatedIntakeAvoidedUg: number; // e.g. 115
  healthRationale: string;
}

export interface DailyRoutineSlot {
  timeSlot: string; // "07:00 - 08:30"
  title: string;
  activity: string;
  inversionContext: string;
  ventilationGuidance: string;
  directImpact: DirectImpactMetrics;
}

export interface SustainableSwap {
  id: string;
  category: 'Commute' | 'Home Heating' | 'Cooking' | 'Fitness' | 'Waste/Lifestyle';
  currentPractice: string;
  recommendedSwap: string;
  directImpact: {
    pm25ExposureReductionPct: number;
    co2SavedKgPerWeek: number;
    economicBenefitMonthly: string;
    scientificMechanism: string;
  };
}

export interface GenAIRecommendationResponse {
  generatedAt: string;
  isMockFallback: boolean;
  targetedProfileSummary: string;
  emergencyAlert: string | null;
  dailyRoutine: DailyRoutineSlot[];
  sustainableSwaps: SustainableSwap[];
  cumulativeDailyBenefits: {
    totalDailyCo2ReductionKg: number;
    totalDailyPm25IntakeReductionUg: number;
    indoorSafetyScore: number; // 0 - 100
  };
}

export interface IAQHack {
  id: string;
  name: string;
  category:
    | 'DIY Filtration'
    | 'Sealing & Drafts'
    | 'Cooking & Ventilation'
    | 'Cleaning Protocol'
    | 'Plants & Nature';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedCostUsd: number;
  pm25ReductionPct: number;
  cadrBoostM3h: number;
  co2SavedKgMonthly: number;
  tagline: string;
  description: string;
  materials: string[];
  instructions: string[];
  scientificSource: string;
}

export interface CumulativeHackImpact {
  activeCount: number;
  totalPm25ReductionPct: number;
  totalCadrBoostM3h: number;
  totalCo2SavedKgMonthly: number;
  annualRespiratoryBurdenReducedPct: number;
  annualSavingsUsd: number;
}
