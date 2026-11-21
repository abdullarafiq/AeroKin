import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GenAIRecommendationResponse,
  DailyRoutineSlot,
  SustainableSwap,
  UserHouseholdProfile,
  InversionRisk,
} from '@/types';
import { estimateIndoorPm25, calculateAvoidedPm25IntakeUg, getAverageBreathingRate } from './impactEstimator';

interface GenerationContext {
  profile: UserHouseholdProfile;
  currentAqi: number;
  pm25: number;
  inversionRisk: InversionRisk;
  city: string;
}

/**
 * Intelligent deterministic fallback generator when Gemini API key is missing or calls are throttled.
 * Computes scientifically grounded daily routines and sustainable swaps based on the user's specific inputs.
 */
export function generateSmartFallbackRecommendations(
  context: GenerationContext
): GenAIRecommendationResponse {
  const { profile, currentAqi, pm25, inversionRisk, city } = context;

  const baselineIndoor = estimateIndoorPm25(pm25, profile, 0);
  const optimizedIndoor = estimateIndoorPm25(pm25, profile, 45); // assumes adoption of routines & hacks
  const breathingRate = getAverageBreathingRate(profile);

  const hasAsthma = profile.vulnerableMembers.includes('asthma_respiratory');
  const hasInfant = profile.vulnerableMembers.includes('infant');
  const hasElderly = profile.vulnerableMembers.includes('elderly');

  let alert: string | null = null;
  if (currentAqi >= 250) {
    alert = `EMERGENCY WINTER SMOG ADVISORY FOR ${city.toUpperCase()}: Ground-level temperature inversion has trapped severe combustion particulate (${pm25} µg/m³ PM2.5). Vulnerable members must shelter indoors with continuous air cleaning.`;
  } else if (hasAsthma && currentAqi >= 150) {
    alert = `HIGH HEALTH ALERT: Sensitive respiratory members identified in ${profile.name}. Outdoor PM2.5 is at ${pm25} µg/m³; eliminate unvented cooking and seal all exterior drafts.`;
  }

  // Build targeted daily routine tailored to household habits & weather
  const routine: DailyRoutineSlot[] = [
    {
      timeSlot: '06:30 - 08:30',
      title: 'Morning Inversion Air Scrubbing & Commute Shielding',
      activity:
        profile.commuteHabit === 'active_cycling_walking'
          ? 'Delay active outdoor commute or switch to sealed public transit. Morning radiation inversion holds heavy exhaust at pedestrian height.'
          : 'Seal vehicle cabin in recirculate mode or work from home during peak morning boundary stagnation.',
      inversionContext: `Severe nocturnal boundary layer capping in ${city}. Outdoor particulate is concentrated near surface until ground warms.`,
      ventilationGuidance: 'Keep all windows, trickle vents, and draft dampers completely closed. Run bedroom air scrubber on medium speed.',
      directImpact: {
        pm25ExposureReductionPct: 48,
        co2SavedKg: profile.commuteHabit === 'personal_car' ? 2.2 : 0.4,
        estimatedIntakeAvoidedUg: calculateAvoidedPm25IntakeUg(baselineIndoor, optimizedIndoor, 2, breathingRate),
        healthRationale: 'Prevents acute peak morning particulate deposition in bronchioles and alveolar capillaries.',
      },
    },
    {
      timeSlot: '12:30 - 15:00',
      title: 'Solar Inversion Lift: Controlled Rapid Ventilation Window',
      activity:
        'Midday solar radiation breaks ground-level cold air pool, producing maximum vertical air mixing and lowest daily outdoor PM2.5.',
      inversionContext: 'Atmospheric mixing height rises from ~150m to >800m. Outdoor particulate is diluted significantly.',
      ventilationGuidance:
        currentAqi > 250
          ? 'Air quality remains hazardous even during mixing; keep windows closed and flush air only with filtered mechanical ventilation.'
          : 'Perform brief 10 to 15-minute cross-ventilation through opposite windows to flush built-up indoor CO2 and moisture, then seal and turn purifiers to max.',
      directImpact: {
        pm25ExposureReductionPct: 30,
        co2SavedKg: 0.3,
        estimatedIntakeAvoidedUg: calculateAvoidedPm25IntakeUg(baselineIndoor, optimizedIndoor, 2.5, breathingRate),
        healthRationale: 'Flushes indoor metabolic CO2 below 800 ppm to maintain cognitive function without loading rooms with peak smog.',
      },
    },
    {
      timeSlot: '17:30 - 19:30',
      title: 'Cooking Emission Defense & Evening Rush Shielding',
      activity:
        profile.cookingSetup.includes('gas_stove')
          ? 'Use rear burners only with range hood on HIGH 2 mins prior to ignition, or switch dinner prep to electric countertop induction.'
          : 'Prepare dinner using induction/oven; keep kitchen door closed to prevent aerosol migration into sleeping quarters.',
      inversionContext: 'Evening surface cooling initiates nocturnal thermal inversion while rush hour traffic creates a secondary PM2.5 spike.',
      ventilationGuidance: 'Run range hood exhaust directly outside. Never open kitchen windows to street during evening rush hour.',
      directImpact: {
        pm25ExposureReductionPct: 55,
        co2SavedKg: 0.8,
        estimatedIntakeAvoidedUg: calculateAvoidedPm25IntakeUg(baselineIndoor, optimizedIndoor, 2, breathingRate),
        healthRationale:
          'Eliminates indoor nitrogen dioxide (NO2) spikes of up to 250 ppb that directly trigger nocturnal bronchial spasms in children and asthmatics.',
      },
    },
    {
      timeSlot: '21:00 - 06:30',
      title: 'Bedroom Sanctuary Nighttime Recovery Protocol',
      activity:
        'Seal master and children bedroom doors with weighted draft stoppers. Activate bedside DIY Corsi-Rosenthal or HEPA air scrubber on whisper/low mode.',
      inversionContext: 'Nocturnal inversion reaches maximum intensity. Temperature drops create stagnant ground fog and smoke pooling.',
      ventilationGuidance: 'Keep sleeping rooms isolated from the rest of the residence to maintain an ultra-clean air micro-climate under 5 µg/m³ PM2.5.',
      directImpact: {
        pm25ExposureReductionPct: 65,
        co2SavedKg: 1.1,
        estimatedIntakeAvoidedUg: calculateAvoidedPm25IntakeUg(baselineIndoor, optimizedIndoor, 9.5, breathingRate),
        healthRationale:
          'Deep sleep is when cellular respiratory repair occurs. Clean air sleeping drops resting heart rate variability stress and systemic C-reactive protein (CRP) markers.',
      },
    },
  ];

  // Build sustainable swaps tailored to the household
  const swaps: SustainableSwap[] = [
    {
      id: 'swap-commute-transit',
      category: 'Commute',
      currentPractice: profile.commuteHabit === 'personal_car' ? 'Solo gasoline vehicle commute during smog peak' : 'Unfiltered outdoor active commuting during inversion',
      recommendedSwap:
        profile.commuteHabit === 'personal_car'
          ? 'Transition to electrified metro/bus transit or 2-day remote hybrid schedule during high-AQI alerts.'
          : 'Equip certified N95/FFP2 respirator with silicone exhalation valve, or shift outdoor cycling to mid-afternoon (13:30 - 15:00).',
      directImpact: {
        pm25ExposureReductionPct: 42,
        co2SavedKgPerWeek: profile.commuteHabit === 'personal_car' ? 14.5 : 2.5,
        economicBenefitMonthly: profile.commuteHabit === 'personal_car' ? '$110 saved in fuel and congestion fees' : '$35 saved in medical inhaler refills',
        scientificMechanism: 'Avoids roadway microenvironment air pockets where ultrafine black carbon concentrations are 4x higher than urban background monitors.',
      },
    },
    {
      id: 'swap-heating-draft',
      category: 'Home Heating',
      currentPractice:
        profile.heatingType === 'wood_fireplace'
          ? 'Burning wood or biomass logs in home fireplace for supplementary warmth'
          : 'High thermostat setpoint (22°C+) compensating for window and door cold drafts',
      recommendedSwap:
        profile.heatingType === 'wood_fireplace'
          ? 'Cease all wood burning immediately; use radiant ceramic heat panels and draft snakes.'
          : 'Apply EPDM foam weatherstripping to exterior sashes and reduce thermostat to 19.5°C while wearing thermal layers.',
      directImpact: {
        pm25ExposureReductionPct: profile.heatingType === 'wood_fireplace' ? 75 : 22,
        co2SavedKgPerWeek: profile.heatingType === 'wood_fireplace' ? 18.2 : 9.5,
        economicBenefitMonthly: '$45 - $80 reduction on monthly heating energy bills',
        scientificMechanism: 'Woodsmoke contains carcinogenic benzo[a]pyrene and particulate matter that penetrates unsealed rooms within seconds.',
      },
    },
    {
      id: 'swap-cooking-induction',
      category: 'Cooking',
      currentPractice: profile.cookingSetup.includes('gas_stove') ? 'High-temperature wok or pan frying on unvented natural gas range' : 'Cooking without pre-exhaust ventilation',
      recommendedSwap: 'Adopt portable induction burner and cook on rear burners with backdraft shields.',
      directImpact: {
        pm25ExposureReductionPct: 52,
        co2SavedKgPerWeek: 3.5,
        economicBenefitMonthly: '$15 saved in gas utility consumption',
        scientificMechanism: 'Eliminates unburned methane leakage and toxic nitrogen dioxide (NO2) combustion byproducts entirely at source.',
      },
    },
    {
      id: 'swap-lifestyle-laundry',
      category: 'Waste/Lifestyle',
      currentPractice: 'Hanging laundry outdoors or on balconies during winter days',
      recommendedSwap: 'Indoor drying rack placed in a designated heated room with moisture absorber or mechanical condenser drying.',
      directImpact: {
        pm25ExposureReductionPct: 25,
        co2SavedKgPerWeek: 1.2,
        economicBenefitMonthly: '$20 saved in fabric wear and allergen treatment',
        scientificMechanism: 'Outdoor damp textiles act as high-efficiency particulate collectors, adsorbing airborne polycyclic aromatic hydrocarbons directly into wearable fibers.',
      },
    },
  ];

  const totalAvoidedUg = routine.reduce((sum, r) => sum + r.directImpact.estimatedIntakeAvoidedUg, 0);
  const totalCo2Kg = routine.reduce((sum, r) => sum + r.directImpact.co2SavedKg, 0);

  let indoorSafetyScore = 75;
  if (profile.existingFiltration === 'portable_hepa' || profile.existingFiltration === 'whole_home_purifier') {
    indoorSafetyScore += 15;
  }
  if (profile.homeSealing === 'well_sealed') {
    indoorSafetyScore += 8;
  } else if (profile.homeSealing === 'drafty') {
    indoorSafetyScore -= 12;
  }
  indoorSafetyScore = Math.min(98, Math.max(20, indoorSafetyScore));

  let profileDesc = `${profile.name} (${profile.householdSize} residents in ${city})`;
  if (hasAsthma || hasInfant || hasElderly) {
    const list: string[] = [];
    if (hasAsthma) list.push('Asthma/Respiratory');
    if (hasInfant) list.push('Infants');
    if (hasElderly) list.push('Elderly');
    profileDesc += ` • High-Risk Vulnerabilities: ${list.join(', ')}`;
  }

  return {
    generatedAt: new Date().toISOString(),
    isMockFallback: true,
    targetedProfileSummary: profileDesc,
    emergencyAlert: alert,
    dailyRoutine: routine,
    sustainableSwaps: swaps,
    cumulativeDailyBenefits: {
      totalDailyCo2ReductionKg: Math.round(totalCo2Kg * 10) / 10,
      totalDailyPm25IntakeReductionUg: Math.round(totalAvoidedUg),
      indoorSafetyScore,
    },
  };
}

/**
 * Calls Google Gemini API if API key is configured, or uses smart fallback generator
 */
export async function generateAeroKinRecommendations(
  context: GenerationContext
): Promise<GenAIRecommendationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return generateSmartFallbackRecommendations(context);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const systemPrompt = `You are AeroKin's Chief Environmental Epidemiologist and Urban Aerodynamics AI.
Your mission is to generate a personalized low-emission daily routine and sustainable household swaps for urban families facing severe winter smog and thermal inversions.

Input Data:
- City: ${context.city}
- Current AQI: ${context.currentAqi} (PM2.5: ${context.pm25} µg/m³)
- Inversion Risk: ${context.inversionRisk}
- Household: ${JSON.stringify(context.profile, null, 2)}

Requirements:
Output strictly valid JSON matching this schema:
{
  "emergencyAlert": string or null,
  "targetedProfileSummary": string,
  "dailyRoutine": [
    {
      "timeSlot": string (e.g. "07:00 - 08:30"),
      "title": string,
      "activity": string,
      "inversionContext": string,
      "ventilationGuidance": string,
      "directImpact": {
        "pm25ExposureReductionPct": number (between 10 and 80),
        "co2SavedKg": number (between 0.1 and 5.0),
        "estimatedIntakeAvoidedUg": number (between 10 and 300),
        "healthRationale": string
      }
    }
  ],
  "sustainableSwaps": [
    {
      "id": string,
      "category": "Commute" | "Home Heating" | "Cooking" | "Fitness" | "Waste/Lifestyle",
      "currentPractice": string,
      "recommendedSwap": string,
      "directImpact": {
        "pm25ExposureReductionPct": number,
        "co2SavedKgPerWeek": number,
        "economicBenefitMonthly": string,
        "scientificMechanism": string
      }
    }
  ],
  "cumulativeDailyBenefits": {
    "totalDailyCo2ReductionKg": number,
    "totalDailyPm25IntakeReductionUg": number,
    "indoorSafetyScore": number (0 to 100)
  }
}

Ensure all direct impacts are mathematically plausible and scientifically grounded in urban aerosol physics.`;

    const result = await model.generateContent(systemPrompt);
    const textResponse = result.response.text();
    const parsed = JSON.parse(textResponse);

    return {
      generatedAt: new Date().toISOString(),
      isMockFallback: false,
      targetedProfileSummary: parsed.targetedProfileSummary || `${context.profile.name} in ${context.city}`,
      emergencyAlert: parsed.emergencyAlert || null,
      dailyRoutine: parsed.dailyRoutine || [],
      sustainableSwaps: parsed.sustainableSwaps || [],
      cumulativeDailyBenefits: parsed.cumulativeDailyBenefits || {
        totalDailyCo2ReductionKg: 3.5,
        totalDailyPm25IntakeReductionUg: 140,
        indoorSafetyScore: 82,
      },
    };
  } catch (error) {
    console.error('Gemini API call failed or timed out. Falling back to AeroKin local intelligence:', error);
    return generateSmartFallbackRecommendations(context);
  }
}
