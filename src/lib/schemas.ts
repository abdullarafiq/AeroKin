import { z } from 'zod';

export const vulnerabilitySchema = z.enum([
  'infant',
  'child',
  'elderly',
  'asthma_respiratory',
  'cardiovascular',
  'pregnancy',
]);

export const housingTypeSchema = z.enum([
  'apartment',
  'detached_house',
  'townhouse',
]);

export const homeSealingSchema = z.enum([
  'drafty',
  'moderate',
  'well_sealed',
]);

export const existingFiltrationSchema = z.enum([
  'none',
  'hvac_basic',
  'portable_hepa',
  'whole_home_purifier',
]);

export const heatingTypeSchema = z.enum([
  'radiator_steam',
  'heat_pump',
  'gas_furnace',
  'wood_fireplace',
  'electric_baseboard',
]);

export const cookingSetupSchema = z.enum([
  'gas_stove_unvented',
  'gas_stove_vented',
  'electric_induction',
]);

export const commuteHabitSchema = z.enum([
  'active_cycling_walking',
  'public_transit',
  'personal_car',
  'hybrid_wfh',
]);

export const outdoorActivityLevelSchema = z.enum([
  'sedentary',
  'moderate',
  'heavy_athlete',
]);

export const householdProfileSchema = z.object({
  id: z.string().min(1, 'Profile ID is required'),
  name: z.string().min(1, 'Profile name is required').max(60, 'Profile name too long'),
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
  householdSize: z.number().int().min(1, 'Household must have at least 1 member').max(20, 'Maximum 20 members'),
  vulnerableMembers: z.array(vulnerabilitySchema),
  housingType: housingTypeSchema,
  homeSealing: homeSealingSchema,
  existingFiltration: existingFiltrationSchema,
  heatingType: heatingTypeSchema,
  cookingSetup: cookingSetupSchema,
  commuteHabit: commuteHabitSchema,
  outdoorActivityLevel: outdoorActivityLevelSchema,
  activeHacks: z.array(z.string()).default([]),
});

export const aqiQuerySchema = z.object({
  city: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
});

export const directImpactMetricsSchema = z.object({
  pm25ExposureReductionPct: z.number().min(0).max(100),
  co2SavedKg: z.number().min(0),
  estimatedIntakeAvoidedUg: z.number().min(0),
  healthRationale: z.string().min(1),
});

export const dailyRoutineSlotSchema = z.object({
  timeSlot: z.string().min(1),
  title: z.string().min(1),
  activity: z.string().min(1),
  inversionContext: z.string().min(1),
  ventilationGuidance: z.string().min(1),
  directImpact: directImpactMetricsSchema,
});

export const sustainableSwapSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['Commute', 'Home Heating', 'Cooking', 'Fitness', 'Waste/Lifestyle']),
  currentPractice: z.string().min(1),
  recommendedSwap: z.string().min(1),
  directImpact: z.object({
    pm25ExposureReductionPct: z.number().min(0).max(100),
    co2SavedKgPerWeek: z.number().min(0),
    economicBenefitMonthly: z.string().min(1),
    scientificMechanism: z.string().min(1),
  }),
});

export const recommendationRequestSchema = z.object({
  profile: householdProfileSchema,
  currentAqi: z.number().min(0).max(1000),
  pm25: z.number().min(0),
  inversionRisk: z.enum(['Low', 'Moderate', 'Severe']),
  city: z.string().min(1),
});

export const recommendationResponseSchema = z.object({
  generatedAt: z.string(),
  isMockFallback: z.boolean(),
  targetedProfileSummary: z.string(),
  emergencyAlert: z.string().nullable(),
  dailyRoutine: z.array(dailyRoutineSlotSchema),
  sustainableSwaps: z.array(sustainableSwapSchema),
  cumulativeDailyBenefits: z.object({
    totalDailyCo2ReductionKg: z.number().min(0),
    totalDailyPm25IntakeReductionUg: z.number().min(0),
    indoorSafetyScore: z.number().min(0).max(100),
  }),
});

export type HouseholdProfileInput = z.infer<typeof householdProfileSchema>;
export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;
