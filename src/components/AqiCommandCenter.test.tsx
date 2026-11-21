import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AqiCommandCenter } from './AqiCommandCenter';
import { getAQIDataForLocation } from '@/lib/aqiData';

describe('AqiCommandCenter Component', () => {
  const mockAqiData = getAQIDataForLocation('New Delhi');

  it('renders city name, AQI score, and category badge', () => {
    const handleCityChange = vi.fn();
    render(<AqiCommandCenter aqiData={mockAqiData} onCityChange={handleCityChange} />);

    expect(screen.getByRole('heading', { name: /Atmospheric & AQI Command Center/i })).toBeInTheDocument();
    expect(screen.getAllByText(/New Delhi/i).length).toBeGreaterThan(0);
    expect(screen.getByText(mockAqiData.category)).toBeInTheDocument();
    expect(screen.getByText(String(mockAqiData.aqi))).toBeInTheDocument();
  });

  it('displays meteorological inversion advisory and wind sensors', () => {
    const handleCityChange = vi.fn();
    render(<AqiCommandCenter aqiData={mockAqiData} onCityChange={handleCityChange} />);

    expect(screen.getByText(/Inversion Severity:/i)).toBeInTheDocument();
    expect(screen.getByText(/Boundary Wind/i)).toBeInTheDocument();
    expect(screen.getByText(/Safe Vent Window/i)).toBeInTheDocument();
  });

  it('triggers onCityChange when clicking a quick-city chip', () => {
    const handleCityChange = vi.fn();
    render(<AqiCommandCenter aqiData={mockAqiData} onCityChange={handleCityChange} />);

    const beijingButton = screen.getByRole('button', { name: /Beijing/i });
    fireEvent.click(beijingButton);

    expect(handleCityChange).toHaveBeenCalledWith('Beijing');
  });

  it('triggers onCityChange when submitting the search form', () => {
    const handleCityChange = vi.fn();
    render(<AqiCommandCenter aqiData={mockAqiData} onCityChange={handleCityChange} />);

    const input = screen.getByPlaceholderText(/Search city/i);
    fireEvent.change(input, { target: { value: 'London' } });

    const submitBtn = screen.getByRole('button', { name: /Analyze/i });
    fireEvent.click(submitBtn);

    expect(handleCityChange).toHaveBeenCalledWith('London');
  });
});
