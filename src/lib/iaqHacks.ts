import { IAQHack, CumulativeHackImpact } from '@/types';

export const IAQ_HACKS: IAQHack[] = [
  {
    id: 'corsi-rosenthal-box',
    name: 'DIY Corsi-Rosenthal Air Scrubber',
    category: 'DIY Filtration',
    difficulty: 'Intermediate',
    estimatedCostUsd: 45,
    pm25ReductionPct: 65,
    cadrBoostM3h: 580,
    co2SavedKgMonthly: 4.2,
    tagline: 'High-volume DIY HEPA-alternative using a 20" box fan and MERV 13 filters.',
    description:
      'The Corsi-Rosenthal Box delivers massive Clean Air Delivery Rates (CADR) equivalent to $600 commercial air purifiers. Built by taping 4 or 5 MERV 13 furnace filters into a cube with a 20" box fan on top, it creates low air resistance and captures over 85% of PM2.5 particulates on each pass.',
    materials: [
      '1x 20-inch standard box fan',
      '4x 20x20x1 or 20x20x2 MERV 13 air filters',
      '1x 20x20 cardboard sheet (for the base)',
      '1x Roll of duct tape or painter\'s tape',
      '1x Cardboard circular shroud ring (15" inner diameter)',
    ],
    instructions: [
      'Tape 4 MERV 13 filters together in a cube structure with all airflow arrows pointing INWARD toward the center.',
      'Tape the bottom cardboard square securely to close off the underside.',
      'Place the 20" box fan on top facing OUTWARD (blowing upward) and tape the perimeter tightly to prevent air bypass leaks.',
      'Cut a cardboard circular shroud ring with a 15-inch opening and tape it over the front grill of the fan to eliminate eddy-current backflow and boost airflow velocity by 20%.',
      'Run on speed 1 or 2 continuously in central living spaces or high-traffic rooms during peak winter smog.',
    ],
    scientificSource: 'Corsi, R. & Rosenthal, J. (UC Davis / Portland State Univ. IAQ Engineering Validation, 2021)',
  },
  {
    id: 'weatherstrip-draft-barrier',
    name: 'Perimeter Weatherstripping & Silicone Sweep',
    category: 'Sealing & Drafts',
    difficulty: 'Beginner',
    estimatedCostUsd: 18,
    pm25ReductionPct: 28,
    cadrBoostM3h: 120,
    co2SavedKgMonthly: 12.5,
    tagline: 'Stops outdoor smog infiltration at exterior door and window crevices.',
    description:
      'During severe winter inversions, up to 60% of indoor PM2.5 enters through micro-gaps around door frames, baseboards, and window sashes. High-density rubber foam and silicone sweeps dramatically lower your home\'s outdoor infiltration rate while cutting thermal heating loss.',
    materials: [
      'Self-adhesive silicone door bottom sweep',
      'High-density D-profile EPDM weatherstripping tape',
      'Draft stopper snake for entryway threshold',
      'Isopropyl alcohol wipe for surface prep',
    ],
    instructions: [
      'Clean window sills and door frames with alcohol wipes to ensure maximum adhesive bonding.',
      'Apply D-profile EPDM foam along the top and latch sides of the exterior door jamb, ensuring firm compression when closed.',
      'Fasten the silicone door bottom sweep flush against the interior base of the door so it creates a continuous seal against the threshold without jamming.',
      'Check windows with an incense stick or lighter flame; if the smoke wavers when windows are shut, apply foam tape to the mating sash joints.',
    ],
    scientificSource: 'ASHRAE Standard 62.2 & Lawrence Berkeley National Laboratory Infiltration Studies',
  },
  {
    id: 'range-hood-cross-vent',
    name: 'Range Hood Exhaust Baffle & Induction Protocol',
    category: 'Cooking & Ventilation',
    difficulty: 'Beginner',
    estimatedCostUsd: 5,
    pm25ReductionPct: 40,
    cadrBoostM3h: 210,
    co2SavedKgMonthly: 3.8,
    tagline: 'Mitigate indoor cooking particulate spikes and combustion NO2 emissions.',
    description:
      'Cooking—especially on unvented gas burners or high-heat frying—can cause indoor PM2.5 spikes exceeding 300 µg/m³ within 15 minutes. Using the rear burners, adding side cardboard deflector baffles, and running portable induction tops during inversion hours prevents toxic gas accumulation.',
    materials: [
      'Heavy-duty aluminum foil or fold-out splash splatter guard',
      'Portable single-burner induction cooktop (optional upgrade)',
      'Rear burner cookware positioning',
    ],
    instructions: [
      'Always cook on the rear burners where standard overhead range hoods capture up to 80% of fumes compared to only 30% on front burners.',
      'Turn the range hood fan on LOW 2 minutes before igniting burners to establish thermal updraft pressure.',
      'Set fold-out splatter shields on either side of the pan to act as laminar airflow baffles, directing plumes straight into the exhaust intake.',
      'For boiling or simmering, switch to a countertop plug-in induction burner to eliminate indoor nitrogen dioxide (NO2) generation entirely.',
    ],
    scientificSource: 'LBNL Cooking Emissions Study (Singer et al., Environmental Health Perspectives)',
  },
  {
    id: 'microfiber-wet-dusting',
    name: 'Electrostatic Wet-Dusting & Mopping Protocol',
    category: 'Cleaning Protocol',
    difficulty: 'Beginner',
    estimatedCostUsd: 8,
    pm25ReductionPct: 22,
    cadrBoostM3h: 90,
    co2SavedKgMonthly: 0.5,
    tagline: 'Prevents settled hazardous toxic particulates from aerosolizing back into your lungs.',
    description:
      'Dry feather dusters and conventional brooms do not remove PM2.5—they re-suspend toxic dust into breathable air where it remains suspended for up to 6 hours. Microfiber damp-mopping binds particulates electrostatically, locking them into washable fibers.',
    materials: [
      'Damp split-microfiber cloths (300+ GSM)',
      'Flat microfiber damp mop',
      'Water with a drop of mild dish soap (surfactant)',
    ],
    instructions: [
      'Never dry sweep during winter smog episodes. Always mist floors lightly with water surfactant or use a damp mop.',
      'Fold microfiber cloths into quarters, wiping surfaces in continuous S-pattern motions rather than circular rubbing.',
      'Flip to a clean cloth surface after each table or shelf to prevent transferring particulates.',
      'Wash used cloths immediately in warm water; avoid fabric softeners which coat fibers and destroy electrostatic attraction.',
    ],
    scientificSource: 'WHO Guidelines for Indoor Air Quality & EPA Resuspension Dynamics',
  },
  {
    id: 'bedroom-clean-sanctuary',
    name: 'Master Bedroom "Clean Air Sanctuary" Isolation',
    category: 'DIY Filtration',
    difficulty: 'Intermediate',
    estimatedCostUsd: 30,
    pm25ReductionPct: 55,
    cadrBoostM3h: 340,
    co2SavedKgMonthly: 2.1,
    tagline: 'Creates an ultra-pure breathing haven for the 8 hours you sleep and recover.',
    description:
      'You spend one-third of your life in your bedroom. Even if your whole house cannot be filtered due to large volume or drafts, isolating the bedroom creates an ultra-low PM2.5 sanctuary that allows lungs and cardiovascular systems to detoxify overnight.',
    materials: [
      'Weighted draft-snake door threshold blocker',
      'HEPA filter or miniature Corsi-Rosenthal unit',
      'Window plastic shrink insulation film',
    ],
    instructions: [
      'Keep bedroom doors and windows firmly shut at all times during high-AQI winter weeks.',
      'Place a draft snake firmly against the bottom of the bedroom door to prevent hallway air infiltration.',
      'Run a dedicated air purifier on medium speed 45 minutes before bedtime and keep it on low throughout the night.',
      'Keep pets, wool blankets, and unwashed outdoor jackets outside the bedroom sanctuary to minimize particulate loading.',
    ],
    scientificSource: 'Harvard T.H. Chan School of Public Health: Nighttime Sleep Air Quality & Cardiovascular Recovery',
  },
  {
    id: 'nasa-indoor-phyto-cleaners',
    name: 'Science-Backed Phyto-Filtering Plant Canopy',
    category: 'Plants & Nature',
    difficulty: 'Beginner',
    estimatedCostUsd: 25,
    pm25ReductionPct: 15,
    cadrBoostM3h: 60,
    co2SavedKgMonthly: 3.2,
    tagline: 'Stomatal gas exchange and leaf surface particulate adsorption.',
    description:
      'While plants cannot replace high-volume mechanical filters for heavy PM2.5 smog, dense broad-leafed and trichome-bearing plants (Spider Plants, Snake Plants, Areca Palms) collect coarse particles on leaf surfaces while balancing dry winter humidity, causing floating particles to aggregate and settle.',
    materials: [
      '2x Snake Plants (Sansevieria trifasciata - nocturnal oxygen producers)',
      '1x Spider Plant (Chlorophytum comosum)',
      '1x Peace Lily (Spathiphyllum) or Areca Palm',
      'Misting spray bottle and damp sponge for leaf wiping',
    ],
    instructions: [
      'Position Snake Plants in bedrooms as they perform Crassulacean Acid Metabolism (CAM), absorbing CO2 and releasing oxygen during the night.',
      'Wipe down top and bottom leaf surfaces with a damp cloth every two weeks to remove accumulated particulate dust and keep stomata pores clear.',
      'Avoid overwatering to prevent mold fungal spores in soil; use coconut coir or pebbles on top of potting soil to suppress mold.',
    ],
    scientificSource: 'NASA Clean Air Study & Royal Horticultural Society Particulate Adsorption Metrics',
  },
  {
    id: 'hepa-vacuum-slow-sweep',
    name: 'Sealed HEPA Vacuuming Technique',
    category: 'Cleaning Protocol',
    difficulty: 'Intermediate',
    estimatedCostUsd: 35,
    pm25ReductionPct: 35,
    cadrBoostM3h: 180,
    co2SavedKgMonthly: 1.0,
    tagline: 'Avoid aerosolizing fine lung-penetrating sub-micron soot when vacuuming.',
    description:
      'Standard bagless vacuums leak fine PM2.5 through motor exhaust vents, creating dramatic indoor air pollution spikes during cleaning. A true sealed HEPA vacuum with slow, overlapping strokes extracts allergens without polluting room air.',
    materials: [
      'Certified sealed-system HEPA vacuum cleaner or MERV 16 vacuum bags',
      'Exhaust vent HEPA filter replacement',
    ],
    instructions: [
      'Check that the vacuum housing is sealed (no air blowing out of cracks before passing the exhaust filter).',
      'Move the vacuum head forward and backward slowly (at least 20 seconds per square meter) to allow suction velocity to dislodge deep pile particulates.',
      'Empty canisters or change bags outside of your living area (e.g., outdoors or balcony) while wearing an N95 mask.',
      'Vacuum carpets twice weekly during smog season and immediately run your air scrubber on high for 20 minutes afterward.',
    ],
    scientificSource: 'Journal of Exposure Science & Environmental Epidemiology: Vacuum Exhaust Aerosol Studies',
  },
  {
    id: 'activated-carbon-voc-adsorption',
    name: 'DIY Granular Activated Carbon VOC Adsorber',
    category: 'DIY Filtration',
    difficulty: 'Advanced',
    estimatedCostUsd: 22,
    pm25ReductionPct: 20,
    cadrBoostM3h: 140,
    co2SavedKgMonthly: 2.0,
    tagline: 'Target toxic winter smog chemical gases, woodsmoke VOCs, and ozone.',
    description:
      'HEPA filters capture solid particles but cannot trap toxic gaseous pollutants like benzene, formaldehyde, and nitrogen dioxide. Granular activated carbon has a vast microscopic pore network that chemically adsorbs gaseous molecules from smog.',
    materials: [
      '2 lbs acid-washed virgin granular activated carbon (coconut shell base)',
      'Fine mesh zipper laundry bag or pantyhose sleeve',
      'Zip ties or cable ties',
    ],
    instructions: [
      'Rinse activated carbon lightly with water outside to remove loose carbon dust, then let it dry thoroughly.',
      'Pour granular carbon into the mesh sleeve, spreading it out into an even 1/2-inch thick flat layer.',
      'Mount the carbon sleeve onto the intake side of your box fan or existing air purifier using zip ties.',
      'Replace or regenerate carbon media every 3 to 4 months during severe winter smog seasons.',
    ],
    scientificSource: 'EPA Technical Note: Gas-Phase Adsorption for Indoor Air Pollution Control',
  },
];

/**
 * Calculates cumulative impact when multiple hacks are enabled
 */
export function calculateCumulativeHackImpact(activeHackIds: string[]): CumulativeHackImpact {
  const activeHacks = IAQ_HACKS.filter((hack) => activeHackIds.includes(hack.id));

  if (activeHacks.length === 0) {
    return {
      activeCount: 0,
      totalPm25ReductionPct: 0,
      totalCadrBoostM3h: 0,
      totalCo2SavedKgMonthly: 0,
      annualRespiratoryBurdenReducedPct: 0,
      annualSavingsUsd: 0,
    };
  }

  // Diminishing returns formula for combined filtration percentage:
  // Combined = 1 - (1 - r1) * (1 - r2) * ...
  let remainingFraction = 1.0;
  let totalCadr = 0;
  let totalCo2Monthly = 0;
  let totalCostUsd = 0;

  for (const hack of activeHacks) {
    remainingFraction *= 1 - hack.pm25ReductionPct / 100;
    totalCadr += hack.cadrBoostM3h;
    totalCo2Monthly += hack.co2SavedKgMonthly;
    totalCostUsd += hack.estimatedCostUsd;
  }

  const combinedReductionPct = Math.min(88, Math.round((1 - remainingFraction) * 100));

  // Annual respiratory burden reduction is correlated with sustained indoor PM2.5 drop
  const annualRespiratoryBurden = Math.round(combinedReductionPct * 0.92);

  // Commercial purifier equivalent annual savings (commercial purifiers cost ~$450 upfront + $120/yr filters + $90/yr electricity)
  const annualSavingsUsd = Math.max(
    60,
    Math.round(activeHacks.length * 85 + (totalCadr / 100) * 40 - totalCostUsd * 0.3)
  );

  return {
    activeCount: activeHacks.length,
    totalPm25ReductionPct: combinedReductionPct,
    totalCadrBoostM3h: totalCadr,
    totalCo2SavedKgMonthly: Math.round(totalCo2Monthly * 10) / 10,
    annualRespiratoryBurdenReducedPct: annualRespiratoryBurden,
    annualSavingsUsd,
  };
}
