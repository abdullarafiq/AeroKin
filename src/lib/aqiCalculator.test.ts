import { describe, it, expect } from 'vitest';
import {
  calculateAqiFromPm25,
  getAqiCategory,
  determineDominantPollutant,
  getAqiCategoryDetails,
} from './aqiCalculator';
import { Pollutants } from '@/types';

describe('AQI Risk Level Calculator & Breakpoint Engine', () => {
  it('correctly calculates AQI in "Good" category (0 - 12.0 µg/m³)', () => {
    expect(calculateAqiFromPm25(0)).toBe(0);
    expect(calculateAqiFromPm25(6.0)).toBe(25);
    expect(calculateAqiFromPm25(12.0)).toBe(50);
    expect(getAqiCategory(50)).toBe('Good');
  });

  it('correctly calculates AQI in "Moderate" category (12.1 - 35.4 µg/m³)', () => {
    const aqiLow = calculateAqiFromPm25(12.1);
    expect(aqiLow).toBeGreaterThanOrEqual(51);
    const aqiHigh = calculateAqiFromPm25(35.4);
    expect(aqiHigh).toBe(100);
    expect(getAqiCategory(aqiHigh)).toBe('Moderate');
  });

  it('correctly calculates AQI in "Unhealthy for Sensitive Groups" (35.5 - 55.4 µg/m³)', () => {
    const aqi = calculateAqiFromPm25(45.0);
    expect(aqi).toBeGreaterThanOrEqual(101);
    expect(aqi).toBeLessThanOrEqual(150);
    expect(getAqiCategory(aqi)).toBe('Unhealthy for Sensitive Groups');
  });

  it('correctly calculates AQI in "Unhealthy" (55.5 - 150.4 µg/m³)', () => {
    const aqi = calculateAqiFromPm25(110.0);
    expect(aqi).toBeGreaterThanOrEqual(151);
    expect(aqi).toBeLessThanOrEqual(200);
    expect(getAqiCategory(aqi)).toBe('Unhealthy');
  });

  it('correctly calculates AQI in "Very Unhealthy" (150.5 - 250.4 µg/m³)', () => {
    const aqi = calculateAqiFromPm25(200.0);
    expect(aqi).toBeGreaterThanOrEqual(201);
    expect(aqi).toBeLessThanOrEqual(300);
    expect(getAqiCategory(aqi)).toBe('Very Unhealthy');
  });

  it('correctly calculates AQI in "Hazardous" category (>250.5 µg/m³)', () => {
    const aqi = calculateAqiFromPm25(350.0);
    expect(aqi).toBeGreaterThan(300);
    expect(getAqiCategory(aqi)).toBe('Hazardous');
  });

  it('returns appropriate category badge and WCAG-compliant styling', () => {
    const details = getAqiCategoryDetails('Hazardous');
    expect(details.badgeBg).toContain('rose');
    expect(details.actionGuidance).toContain('Stay indoors');
  });

  it('determines the dominant atmospheric pollutant correctly', () => {
    const pollutants: Pollutants = {
      pm25: 180.0,
      pm10: 80.0,
      no2: 20.0,
      o3: 15.0,
      co: 1.0,
      so2: 5.0,
    };
    expect(determineDominantPollutant(pollutants)).toBe('pm25');
  });
});
