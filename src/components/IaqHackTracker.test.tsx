import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IaqHackTracker } from './IaqHackTracker';

describe('IaqHackTracker Component & Cumulative Meter', () => {
  it('renders hack library heading and cumulative meter', () => {
    const handleToggle = vi.fn();
    render(<IaqHackTracker activeHacks={[]} onToggleHack={handleToggle} />);

    expect(screen.getByRole('heading', { name: /Indoor Air Quality \(IAQ\) Hack Library/i })).toBeInTheDocument();
    expect(screen.getByText(/Cumulative Household Impact Meter/i)).toBeInTheDocument();
  });

  it('calculates and displays cumulative CADR and PM2.5 shield when hacks are active', () => {
    const handleToggle = vi.fn();
    const activeHacks = ['corsi-rosenthal-box', 'weatherstrip-draft-barrier'];

    render(<IaqHackTracker activeHacks={activeHacks} onToggleHack={handleToggle} />);

    // 2 active hacks
    expect(screen.getByText(/2 of 8 Interventions Active/i)).toBeInTheDocument();
    // Total CADR: 580 + 120 = 700 m³/h
    expect(screen.getByText(/\+700/i)).toBeInTheDocument();
  });

  it('calls onToggleHack when user clicks checkbox on a hack', () => {
    const handleToggle = vi.fn();
    render(<IaqHackTracker activeHacks={[]} onToggleHack={handleToggle} />);

    const toggleButtons = screen.getAllByRole('checkbox');
    fireEvent.click(toggleButtons[0]);

    expect(handleToggle).toHaveBeenCalled();
  });

  it('expands DIY assembly instructions on demand', () => {
    const handleToggle = vi.fn();
    render(<IaqHackTracker activeHacks={[]} onToggleHack={handleToggle} />);

    const expandBtn = screen.getAllByRole('button', { name: /View Materials & Assembly Guide/i })[0];
    fireEvent.click(expandBtn);

    expect(screen.getByText(/Required Materials:/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-Step Assembly Protocol:/i)).toBeInTheDocument();
  });
});
