import { describe, it, expect } from 'vitest';
import {
  estimateIndoorPm25,
  calculateAvoidedPm25IntakeUg,
  getVulnerabilityScore,
  estimateCo2SavingsKg,
} from './impactEstimator';
import { UserHouseholdProfile } from '@/types';

const mockProfile: UserHouseholdProfile = {
  id: 'test-profile-1',
  name: 'Test Family',
  city: 'New Delhi',
  coordinates: { lat: 28.6139, lon: 77.209 },
  householdSize: 4,
  vulnerableMembers: ['infant', 'asthma_respiratory'],
  housingType: 'apartment',
  homeSealing: 'drafty',
  existingFiltration: 'none',
  heatingType: 'radiator_steam',
  cookingSetup: 'gas_stove_unvented',
  commuteHabit: 'personal_car',
  outdoorActivityLevel: 'moderate',
  activeHacks: [],
};

describe('AeroKin Direct Health & Environmental Impact Estimators', () => {
  it('estimates indoor PM2.5 penetration accurately based on draftiness & gas cooking', () => {
    const outdoorPm25 = 200;
    const indoor = estimateIndoorPm25(outdoorPm25, mockProfile, 0);

    // drafty (0.82) * 200 + gas_stove_unvented (28) = 192 µg/m³
    expect(indoor).toBeGreaterThan(150);
    expect(indoor).toBeLessThan(220);
  });

  it('reflects significant indoor PM2.5 drop when DIY hacks are active', () => {
    const outdoorPm25 = 200;
    const indoorBaseline = estimateIndoorPm25(outdoorPm25, mockProfile, 0);
    const indoorWithHacks = estimateIndoorPm25(outdoorPm25, mockProfile, 60);

    expect(indoorWithHacks).toBeLessThan(indoorBaseline * 0.5);
  });

  it('calculates avoided particulate intake (µg) according to ventilation volume', () => {
    const baseline = 180;
    const optimized = 35;
    const hours = 8;
    const breathingRate = 0.65; // m³/h

    const avoidedUg = calculateAvoidedPm25IntakeUg(baseline, optimized, hours, breathingRate);
    // (180 - 35) * 0.65 * 8 = 754 µg
    expect(avoidedUg).toBeCloseTo(754, 0);
  });

  it('computes vulnerability multiplier correctly for asthma and infant members', () => {
    const vuln = getVulnerabilityScore(mockProfile);
    expect(vuln.score).toBeGreaterThanOrEqual(3.5);
    expect(vuln.primaryRiskGroups).toContain('Asthma / Respiratory Sensitivity');
    expect(vuln.primaryRiskGroups).toContain('Infant (<2 years)');
  });

  it('estimates daily and monthly CO2 emission reductions for commute & heating swaps', () => {
    const savings = estimateCo2SavingsKg('personal_car', 'gas_furnace', 'gas_stove_vented');
    expect(savings.dailyCo2SavingsKg).toBeGreaterThan(3.0);
    expect(savings.monthlyCo2SavingsKg).toBeGreaterThan(90.0);
  });
});
