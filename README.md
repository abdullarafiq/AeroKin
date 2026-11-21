# AeroKin 🌬️

> **GenAI-Powered Atmospheric & Clean Air Command Center** for urban families, children, and vulnerable communities navigating severe winter smog, thermal inversions, and high PM2.5 air pollution.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Google Gemini API**.

---

## 🌟 Key Capabilities & Architecture

### 1. Location & AQI Command Center
- **US EPA AQI & Breakpoint Engine**: Accurate piecewise linear interpolation mapping PM2.5 and PM10 to EPA standard AQI categories (Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous).
- **Spectrometric Pollutant Breakdown**: Detailed tracking for **PM2.5, PM10, NO₂, O₃, CO, and SO₂** with safety benchmarks and clinical exposure implications.
- **Meteorological & Thermal Inversion Sensors**: Monitors surface cooling, ambient humidity, boundary wind speeds, atmospheric stagnation, and calculates the **Safe Ventilation Window** (when afternoon solar radiation breaks the inversion layer).
- **Diurnal 24-Hour Forecast**: Hourly forecast of smog levels highlighting when to seal the residence and when brief cross-ventilation is permissible.
- **Global Smog Hotspot Selector & City Search**: Instant loading of high-impact cities (New Delhi, Beijing, Salt Lake City, Lahore, Krakow, London, etc.) with custom search support.

### 2. Household Lifestyle & Exposure Profiler
- **Vulnerability Multiplier**: Calibrates exposure risk based on high-risk members (infants, young children, elderly 65+, asthma/COPD, cardiovascular conditions, pregnancy).
- **Aerosol Penetration Dynamics**: Models indoor particulate equilibrium $C_{in}$ based on housing type, envelope air tightness (drafty vs well-sealed), and filtration level.
- **Indoor Combustion Auditing**: Tracks indoor pollution from unvented gas stovetops, biomass/wood fireplaces, and radiator systems.
- **Archetype Presets**: One-click configuration for realistic profiles (e.g., *New Delhi Multi-Gen Family with Asthmatic Elder*, *Salt Lake City Winter Cyclist*, *Downtown Apartment with Toddler*).

### 3. GenAI Routine & Sustainable Swaps Generator
- **Harmonized Daily Timeline**: Structured, time-slotted routines aligned with atmospheric boundary layers:
  - *Morning Inversion Defense & Commute Shielding (06:30 - 08:30)*
  - *Solar Inversion Lift: Controlled Rapid Ventilation Window (12:30 - 15:00)*
  - *Cooking Emission Defense & Evening Rush Shielding (17:30 - 19:30)*
  - *Bedroom Clean Sanctuary Nighttime Protocol (21:00 - 06:30)*
- **Direct Impact Cards**: Every routine slot and swap quantifies:
  - Percentage indoor PM2.5 exposure reduction (-40% to -75%)
  - Estimated alveolar microgram particulate intake avoided ($\sim 115\ \mu\text{g}$)
  - Daily greenhouse gas emissions saved ($\text{kg CO}_2$)
  - Clinical and pulmonary rationale
- **Targeted Sustainable Swaps**: Practical commute, home heating, cooking, and lifestyle alternatives with monthly cost savings and physical mechanisms.
- **Google Gemini API Integration**: Server-side route handler with `@google/generative-ai`, strict JSON schema enforcement, rate-limiting protection, and intelligent deterministic fallback.

### 4. Indoor Air Quality (IAQ) Hack Library & Cumulative Meter
- **8 Science-Backed DIY Interventions**:
  1. *DIY Corsi-Rosenthal Air Scrubber* (580 m³/h CADR, -65% PM2.5)
  2. *Perimeter Weatherstripping & Silicone Sweep* (-28% outdoor infiltration)
  3. *Range Hood Exhaust Baffle & Induction Protocol* (-40% cooking spikes)
  4. *Electrostatic Microfiber Wet-Dusting Protocol* (-22% re-suspension)
  5. *Master Bedroom Clean Sanctuary Isolation* (-55% sleep exposure)
  6. *Science-Backed Phyto-Filtering Plant Canopy* (-15% PM2.5, CAM O₂ cycle)
  7. *Sealed HEPA Vacuuming Technique* (-35% sub-micron soot leakage)
  8. *DIY Granular Activated Carbon VOC Adsorber* (-20% toxic combustion gases)
- **Cumulative Household Impact Meter**:
  - Combined indoor particulate reduction percentage (diminishing returns model)
  - Boosted Clean Air Delivery Rate (CADR in m³/h)
  - Annual respiratory burden reduction %
  - Estimated annual dollar savings vs commercial air purifiers

---

## 🔬 Scientific Modeling & Impact Formulas

### Indoor PM2.5 Penetration Model
$$C_{in} = C_{out} \cdot P \cdot (1 - \eta) + C_{source}$$
Where:
- $P$ is the envelope penetration coefficient ($0.30$ well-sealed, $0.55$ moderate, $0.82$ drafty)
- $\eta$ is the filtration removal efficiency ($0.65$ portable HEPA, $0.25$ basic HVAC, $0.0$ none)
- $C_{source}$ represents indoor cooking and heating combustion emissions

### Avoided Particulate Inhalation Intake ($\mu\text{g}$)
$$\Delta \text{Intake} = (C_{baseline} - C_{optimized}) \times \dot{V}_E \times \Delta t$$
Where:
- $\dot{V}_E$ is the minute ventilation volume ($0.35\ \text{m}^3/\text{h}$ for infants, $0.65\ \text{m}^3/\text{h}$ for resting adults, $1.1\ \text{m}^3/\text{h}$ for active adults)
- $\Delta t$ is duration of exposure in hours

---

## ♿ Accessibility (WCAG 2.1 AA Compliant)

- **Contrast-Compliant Severity Indicators**: Custom color matrix guaranteeing $>4.5:1$ contrast ratio for text and $>3:1$ for UI badges across all AQI tiers.
- **Screen Reader Announcements**: Live region (`aria-live="polite"`, `aria-atomic="true"`) announcing atmospheric changes and safety alerts.
- **Keyboard Navigation**: Skip-to-content bypass link, tab navigation, ARIA modal dialogs with focus trapping, and keyboard-operable checkboxes.
- **Semantic HTML**: Strict document landmark structure (`header[role=banner]`, `main[role=main]`, `section[aria-labelledby]`, `footer[role=contentinfo]`).

---

## 🛡️ Security & Performance

- **Zero `any` Strict TypeScript**: Explicit interfaces for all data structures, profiles, and API payloads.
- **Server & Client Zod Validation**: All form inputs, coordinates, and API query parameters are validated with Zod schemas.
- **In-Memory Rate Limiter**: Sliding-window rate limiting on `/api/recommendations` to prevent quota abuse.
- **HTTP Caching**: `/api/aqi` implements `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`.
- **Zero Cumulative Layout Shift (CLS)**: Fixed structural grid containers and instant deterministic fallbacks.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm or pnpm

### 2. Environment Configuration
Create a `.env.local` file:
```bash
cp .env.example .env.local
```
Optionally provide your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If omitted, AeroKin seamlessly activates its built-in local aerosol simulation engine).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npm test
```
Runs 26 comprehensive unit and integration tests across 5 test suites with Vitest and React Testing Library.

### 5. Production Build
```bash
npm run build
npm start
```
