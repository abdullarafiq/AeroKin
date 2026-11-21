import { describe, it, expect } from 'vitest';
import {
  householdProfileSchema,
  aqiQuerySchema,
  recommendationRequestSchema,
} from './schemas';

describe('AeroKin Strict Zod Validation Schemas', () => {
  const validProfile = {
    id: 'profile-valid',
    name: 'Green Family',
    city: 'Salt Lake City',
    coordinates: { lat: 40.7608, lon: -111.891 },
    householdSize: 3,
    vulnerableMembers: ['child', 'elderly'],
    housingType: 'detached_house',
    homeSealing: 'moderate',
    existingFiltration: 'portable_hepa',
    heatingType: 'heat_pump',
    cookingSetup: 'electric_induction',
    commuteHabit: 'active_cycling_walking',
    outdoorActivityLevel: 'heavy_athlete',
    activeHacks: ['corsi-rosenthal-box'],
  };

  it('validates a complete and correct household profile', () => {
    const result = householdProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('rejects profiles with invalid household sizes or coordinates', () => {
    const invalidProfile = {
      ...validProfile,
      householdSize: -1,
      coordinates: { lat: 105, lon: 200 }, // invalid range
    };
    const result = householdProfileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('validates AQI query parameters correctly', () => {
    const validQuery = { city: 'New Delhi', lat: '28.61', lon: '77.20' };
    const result = aqiQuerySchema.safeParse(validQuery);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.city).toBe('New Delhi');
      expect(result.data.lat).toBe(28.61);
    }
  });

  it('validates recommendation request payload correctly', () => {
    const validReq = {
      profile: validProfile,
      currentAqi: 285,
      pm25: 235.4,
      inversionRisk: 'Severe',
      city: 'New Delhi',
    };
    const result = recommendationRequestSchema.safeParse(validReq);
    expect(result.success).toBe(true);
  });

  it('rejects recommendation requests with missing or negative AQI', () => {
    const invalidReq = {
      profile: validProfile,
      currentAqi: -10,
      pm25: 50,
      inversionRisk: 'UnknownRisk',
      city: '',
    };
    const result = recommendationRequestSchema.safeParse(invalidReq);
    expect(result.success).toBe(false);
  });
});
