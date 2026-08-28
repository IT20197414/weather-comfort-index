import React from 'react';
import {
  X,
  BookOpen,
  Award,
  Database,
  ShieldCheck,
  Video,
  ExternalLink,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Fidenz Technologies - Technical Assessment Brief</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Full-Stack Weather Comfort Index System • Trainee Software Engineer Assignment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 text-stone-700 dark:text-stone-300 text-xs sm:text-sm">
          {/* Section 1: Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Assignment Objectives & Scope</span>
            </h3>
            <p className="leading-relaxed text-stone-600 dark:text-stone-300">
              This application was engineered to fulfill all requirements for the Fidenz Technologies Trainee Software Engineer Take-Home Assessment. It retrieves weather data for city codes defined in <code className="font-mono bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">cities.json</code>, computes a biometeorological <strong>Comfort Index (0-100)</strong> on the backend, implements a strict <strong>5-minute server cache</strong> with raw and processed storage layers, and enforces secure <strong>MFA-restricted authentication</strong>.
            </p>
          </div>

          {/* Section 2: Algorithm Specification */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Comfort Index Mathematical Formulation</span>
            </h4>
            <div className="font-mono text-xs bg-stone-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
              Comfort Score = (0.40 × TempScore) + (0.25 × HumidityScore) + (0.15 × WindScore) + (0.10 × CloudScore) + (0.05 × PressureScore) + (0.05 × VisibilityScore)
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 list-disc list-inside">
              <li><strong>Thermal Comfort (40%):</strong> Gaussian continuous bell curve centered at optimal 22.0°C (71.6°F) with standard deviation σ=6.5°C.</li>
              <li><strong>Relative Humidity (25%):</strong> Optimal band of 45-55% RH; penalizes humid oppression and respiratory dryness.</li>
              <li><strong>Wind Speed (15%):</strong> Gentle breeze (2.0 - 3.5 m/s) is optimal; penalizes still stagnation (&lt;0.5 m/s) and gusts (&gt;6.0 m/s).</li>
              <li><strong>Cloud Cover (10%):</strong> Optimal at 20-40% for light diffusion without blocking daylight.</li>
              <li><strong>Atmospheric Pressure (5%):</strong> Target baseline 1013.25 hPa sea-level standard.</li>
              <li><strong>Clarity & Visibility (5%):</strong> Max score for 10km (10,000m) horizon clarity.</li>
            </ul>
          </div>

          {/* Section 3: Caching Architecture */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Server-Side Caching (5-Minute TTL)</span>
            </h3>
            <p className="leading-relaxed text-stone-600 dark:text-stone-300">
              The backend maintains two distinct memory cache tiers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                <div className="font-semibold text-stone-900 dark:text-stone-100 text-xs">1. Raw API Cache</div>
                <p className="text-[11px] text-stone-500 mt-1">Caches individual OpenWeatherMap API responses for each city code for 300s to respect API rate quotas.</p>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                <div className="font-semibold text-stone-900 dark:text-stone-100 text-xs">2. Processed Analytics Cache</div>
                <p className="text-[11px] text-stone-500 mt-1">Caches the sorted ranking, composite comfort scores, and breakdown metrics to deliver sub-millisecond responses.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Part 3 Screen Recording Assistant */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2">
            <h4 className="font-bold text-amber-800 dark:text-amber-200 flex items-center space-x-1.5 text-xs">
              <Video className="w-4 h-4 text-amber-600" />
              <span>Assignment Part 3: 5-7 Min Screen Recording Instructions</span>
            </h4>
            <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">
              For Part 3 of the take-home challenge, you are asked to record a 5-7 minute screen recording demonstrating code architecture and live algorithm extension. You can use the built-in <strong>Algorithm Simulator</strong> modal to live-adjust weights and explain parameter sensitivity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end bg-stone-50 dark:bg-stone-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
