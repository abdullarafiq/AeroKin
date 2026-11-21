import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroKin | Urban Smog & Clean Air Command Center',
  description:
    'GenAI-powered clean air intelligence for urban families navigating severe winter smog, thermal inversions, and high PM2.5 air pollution.',
  keywords: [
    'AQI',
    'smog defense',
    'PM2.5',
    'thermal inversion',
    'air quality hacks',
    'Corsi-Rosenthal',
    'indoor air quality',
    'AeroKin',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {/* Skip to Content Link for WCAG 2.1 AA Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        {children}
      </body>
    </html>
  );
}
