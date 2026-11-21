import React from 'react';
import { Shield, ExternalLink, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm py-12 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* AeroKin Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Aero<span className="text-emerald-600 dark:text-emerald-400">Kin</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                Open Clean Air
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              AeroKin is a public-interest GenAI clean air command center designed to empower
              vulnerable families, children, and elderly residents navigating severe urban winter smog,
              thermal temperature inversions, and high PM2.5 hazards through scientifically validated,
              low-emission daily routines and DIY hacks.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                WCAG 2.1 AA Compliant
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                Zero-Any Strict TypeScript
              </span>
            </div>
          </div>

          {/* Scientific Reference Standards */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Standards & Research
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-emerald-500"
                >
                  WHO Air Quality Guidelines 2021
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.airnow.gov/aqi/aqi-basics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-emerald-500"
                >
                  US EPA AQI Technical Guide
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Corsi%E2%80%93Rosenthal_Box"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-emerald-500"
                >
                  Corsi-Rosenthal Box Validation
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://indoor.lbl.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-emerald-500"
                >
                  Lawrence Berkeley Nat\'l Lab IAQ
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Privacy */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Medical Disclaimer
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              AeroKin provides atmospheric modeling, exposure reduction estimations, and engineering
              hacks for informational harm-reduction. It does not replace individualized clinical
              advice from your pulmonary physician or pediatrician.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AeroKin. Built for urban atmospheric resilience.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" aria-hidden="true" /> for vulnerable urban communities.
          </p>
        </div>
      </div>
    </footer>
  );
};
