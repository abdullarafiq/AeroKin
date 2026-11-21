import { AQIData, HourlyForecastItem, Pollutants, WeatherData } from '@/types';
import { calculateAqiFromPm25, getAqiCategory, determineDominantPollutant } from './aqiCalculator';

interface PredefinedCity {
  city: string;
  country: string;
  lat: number;
  lon: number;
  basePm25: number;
  basePm10: number;
  baseNo2: number;
  baseO3: number;
  baseCo: number;
  baseSo2: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  inversionRisk: 'Low' | 'Moderate' | 'Severe';
  stagnation: boolean;
  weatherDesc: string;
}

export const KNOWN_CITIES: Record<string, PredefinedCity> = {
  'delhi': {
    city: 'New Delhi',
    country: 'India',
    lat: 28.6139,
    lon: 77.209,
    basePm25: 325.4,
    basePm10: 440.0,
    baseNo2: 78.5,
    baseO3: 24.0,
    baseCo: 4.8,
    baseSo2: 28.0,
    tempC: 14.5,
    humidity: 78,
    windSpeedKmh: 3.2,
    inversionRisk: 'Severe',
    stagnation: true,
    weatherDesc: 'Severe nocturnal surface temperature inversion trapping crop stubble & vehicle emissions',
  },
  'new delhi': {
    city: 'New Delhi',
    country: 'India',
    lat: 28.6139,
    lon: 77.209,
    basePm25: 325.4,
    basePm10: 440.0,
    baseNo2: 78.5,
    baseO3: 24.0,
    baseCo: 4.8,
    baseSo2: 28.0,
    tempC: 14.5,
    humidity: 78,
    windSpeedKmh: 3.2,
    inversionRisk: 'Severe',
    stagnation: true,
    weatherDesc: 'Severe nocturnal surface temperature inversion trapping crop stubble & vehicle emissions',
  },
  'lahore': {
    city: 'Lahore',
    country: 'Pakistan',
    lat: 31.5204,
    lon: 74.3587,
    basePm25: 360.2,
    basePm10: 480.0,
    baseNo2: 82.0,
    baseO3: 20.0,
    baseCo: 5.2,
    baseSo2: 32.0,
    tempC: 15.0,
    humidity: 82,
    windSpeedKmh: 2.8,
    inversionRisk: 'Severe',
    stagnation: true,
    weatherDesc: 'Hazardous winter photochemical smog cap with near-zero boundary layer mixing',
  },
  'salt lake city': {
    city: 'Salt Lake City',
    country: 'USA',
    lat: 40.7608,
    lon: -111.891,
    basePm25: 68.5,
    basePm10: 95.0,
    baseNo2: 45.0,
    baseO3: 32.0,
    baseCo: 1.8,
    baseSo2: 8.0,
    tempC: -2.0,
    humidity: 68,
    windSpeedKmh: 4.0,
    inversionRisk: 'Severe',
    stagnation: true,
    weatherDesc: 'Valley cold-air pool persistent inversion trapping urban traffic and wood smoke',
  },
  'beijing': {
    city: 'Beijing',
    country: 'China',
    lat: 39.9042,
    lon: 116.4074,
    basePm25: 128.0,
    basePm10: 175.0,
    baseNo2: 55.0,
    baseO3: 38.0,
    baseCo: 2.1,
    baseSo2: 14.0,
    tempC: 2.0,
    humidity: 52,
    windSpeedKmh: 6.5,
    inversionRisk: 'Moderate',
    stagnation: false,
    weatherDesc: 'Northern plain winter heating particulate haze with moderate boundary dispersal',
  },
  'krakow': {
    city: 'Krakow',
    country: 'Poland',
    lat: 50.0647,
    lon: 19.945,
    basePm25: 92.0,
    basePm10: 130.0,
    baseNo2: 48.0,
    baseO3: 25.0,
    baseCo: 2.4,
    baseSo2: 36.0,
    tempC: -1.5,
    humidity: 85,
    windSpeedKmh: 3.5,
    inversionRisk: 'Moderate',
    stagnation: true,
    weatherDesc: 'Vistula river basin thermal stagnation exacerbated by solid fuel home heating boilers',
  },
  'bangkok': {
    city: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lon: 100.5018,
    basePm25: 78.0,
    basePm10: 112.0,
    baseNo2: 42.0,
    baseO3: 45.0,
    baseCo: 1.6,
    baseSo2: 9.0,
    tempC: 31.0,
    humidity: 70,
    windSpeedKmh: 5.0,
    inversionRisk: 'Moderate',
    stagnation: false,
    weatherDesc: 'Tropical dry season high-pressure stagnation trapping traffic diesel and regional biomass burns',
  },
  'london': {
    city: 'London',
    country: 'UK',
    lat: 51.5074,
    lon: -0.1278,
    basePm25: 24.5,
    basePm10: 36.0,
    baseNo2: 38.0,
    baseO3: 28.0,
    baseCo: 0.8,
    baseSo2: 4.0,
    tempC: 8.0,
    humidity: 84,
    windSpeedKmh: 14.0,
    inversionRisk: 'Low',
    stagnation: false,
    weatherDesc: 'Maritime moisture with active Atlantic wind dispersion and localized urban traffic NO2',
  },
  'new york': {
    city: 'New York City',
    country: 'USA',
    lat: 40.7128,
    lon: -74.006,
    basePm25: 21.0,
    basePm10: 32.0,
    baseNo2: 31.0,
    baseO3: 35.0,
    baseCo: 0.7,
    baseSo2: 3.0,
    tempC: 6.0,
    humidity: 62,
    windSpeedKmh: 16.5,
    inversionRisk: 'Low',
    stagnation: false,
    weatherDesc: 'Coastal urban airflow with moderate background fine particulate dispersion',
  },
};

/**
 * Generates a 24-hour diurnal curve for air pollution.
 * Smog typically peaks at 06:00 - 09:00 (morning inversion + rush hour)
 * Dips at 13:00 - 16:00 (solar heating breaks thermal inversion layer)
 * Re-accumulates from 19:00 - 23:00 (evening cooling + heating emissions)
 */
export function generateHourlyDiurnalForecast(basePm25: number): HourlyForecastItem[] {
  const currentHour = new Date().getHours();
  const forecast: HourlyForecastItem[] = [];

  const hourMultipliers: Record<number, number> = {
    0: 0.95,
    1: 0.92,
    2: 0.90,
    3: 0.92,
    4: 1.05,
    5: 1.25,
    6: 1.45, // morning peak inversion
    7: 1.55,
    8: 1.50,
    9: 1.35,
    10: 1.15,
    11: 0.90,
    12: 0.75, // solar thermal mixing begins
    13: 0.65, // lowest PM2.5 window
    14: 0.60, // lowest PM2.5 window
    15: 0.65,
    16: 0.80,
    17: 1.05,
    18: 1.30, // evening rush + wood/gas heating
    19: 1.40,
    20: 1.35,
    21: 1.20,
    22: 1.10,
    23: 1.00,
  };

  for (let i = 0; i < 24; i++) {
    const targetHour = (currentHour + i) % 24;
    const factor = hourMultipliers[targetHour] ?? 1.0;
    const pm25 = Math.round(basePm25 * factor * 10) / 10;
    const aqi = calculateAqiFromPm25(pm25);
    const riskCategory = getAqiCategory(aqi);

    const isSafe = aqi <= 100 && (targetHour >= 12 && targetHour <= 16);
    let recommendation = 'High risk: Keep windows shut & air purifiers running.';
    if (isSafe) {
      recommendation = 'Optimal window: Brief 15-minute cross-ventilation permissible if HEPA active.';
    } else if (targetHour >= 6 && targetHour <= 9) {
      recommendation = 'Severe morning inversion peak. Avoid all outdoor exercise.';
    } else if (targetHour >= 18 && targetHour <= 22) {
      recommendation = 'Evening particulate buildup. Seal exterior door sweeps.';
    }

    const formattedTime = `${targetHour.toString().padStart(2, '0')}:00`;

    forecast.push({
      time: formattedTime,
      aqi,
      pm25,
      riskCategory,
      isOutdoorSafe: isSafe,
      recommendation,
    });
  }

  return forecast;
}

/**
 * Retrieves or dynamically generates comprehensive AQI payload for requested location
 */
export function getAQIDataForLocation(cityQuery?: string, lat?: number, lon?: number): AQIData {
  let matchedCity: PredefinedCity | undefined;

  if (cityQuery) {
    const normalized = cityQuery.trim().toLowerCase();
    matchedCity = KNOWN_CITIES[normalized];

    if (!matchedCity) {
      // Partial match
      const key = Object.keys(KNOWN_CITIES).find((k) => normalized.includes(k) || k.includes(normalized));
      if (key) {
        matchedCity = KNOWN_CITIES[key];
      }
    }
  }

  // Fallback or generic synthesis for unknown city
  const cityData: PredefinedCity = matchedCity || {
    city: cityQuery ? cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1) : 'Urban Center',
    country: 'Global Region',
    lat: lat ?? 28.6139,
    lon: lon ?? 77.209,
    basePm25: 145.0,
    basePm10: 210.0,
    baseNo2: 54.0,
    baseO3: 34.0,
    baseCo: 2.2,
    baseSo2: 16.0,
    tempC: 11.0,
    humidity: 72,
    windSpeedKmh: 4.5,
    inversionRisk: 'Severe',
    stagnation: true,
    weatherDesc: 'Winter low-level atmospheric boundary stagnation with suppressed vertical thermal mixing',
  };

  const pollutants: Pollutants = {
    pm25: cityData.basePm25,
    pm10: cityData.basePm10,
    no2: cityData.baseNo2,
    o3: cityData.baseO3,
    co: cityData.baseCo,
    so2: cityData.baseSo2,
  };

  const aqi = calculateAqiFromPm25(pollutants.pm25);
  const category = getAqiCategory(aqi);
  const dominantPollutant = determineDominantPollutant(pollutants);
  const hourlyForecast = generateHourlyDiurnalForecast(pollutants.pm25);

  const weather: WeatherData = {
    tempC: cityData.tempC,
    humidity: cityData.humidity,
    windSpeedKmh: cityData.windSpeedKmh,
    inversionRisk: cityData.inversionRisk,
    atmosphericStagnation: cityData.stagnation,
    description: cityData.weatherDesc,
  };

  let advisorySummary = '';
  let healthImplications = '';

  if (aqi > 300) {
    advisorySummary = `CRITICAL SMOG ALERT: Severe temperature inversion over ${cityData.city} is holding toxic combustion soot and fine aerosol near ground level.`;
    healthImplications = 'Severe risk of acute bronchospasm, elevated arterial blood pressure, and systemic microvascular inflammation. Strict containment advised.';
  } else if (aqi > 200) {
    advisorySummary = `VERY UNHEALTHY: Dangerous fine particulate accumulation in ${cityData.city}. Wind speeds of ${cityData.windSpeedKmh} km/h provide insufficient dispersion.`;
    healthImplications = 'Significant aggravation of asthma, COPD, and cardiovascular risk. General public advised against prolonged outdoor exposure.';
  } else if (aqi > 150) {
    advisorySummary = `UNHEALTHY: Elevated PM2.5 levels across ${cityData.city}. Respiratory irritation probable for active urban residents.`;
    healthImplications = 'Increased cough, airway reactivity, and eye irritation. Vulnerable groups must remain indoors with active air filtration.';
  } else if (aqi > 100) {
    advisorySummary = `UNHEALTHY FOR SENSITIVE GROUPS: Moderate particulate haze. Sensitive members should avoid outdoor cardio.`;
    healthImplications = 'Children and asthmatics may experience shortness of breath and wheezing. Maintain indoor bedroom air scrubbing.';
  } else if (aqi > 50) {
    advisorySummary = `MODERATE: Air quality is acceptable for the majority of the population in ${cityData.city}.`;
    healthImplications = 'Minimal health risk for healthy individuals. Extremely sensitive individuals may notice mild throat dryness.';
  } else {
    advisorySummary = `GOOD: Crisp, clean air across ${cityData.city}. Ideal conditions for natural ventilation.`;
    healthImplications = 'Zero significant health risk. Optimal time for open-window home air flushing.';
  }

  return {
    city: cityData.city,
    country: cityData.country,
    coordinates: {
      lat: cityData.lat,
      lon: cityData.lon,
    },
    aqi,
    category,
    dominantPollutant,
    pollutants,
    weather,
    hourlyForecast,
    advisorySummary,
    healthImplications,
    ventilationSafeHours: '13:00 - 15:30 (Thermal inversion breakdown window)',
    lastUpdated: new Date().toISOString(),
  };
}
