import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  Shield,
  Video,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'formula' | 'cache' | 'auth' | 'recording'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-800/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Fidenz Take-Home Assignment Technical Briefing
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Architecture, algorithm specifications, caching design, and submission guidelines
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

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-800/20 overflow-x-auto shrink-0 py-2">
          {[
            { key: 'overview', label: '1. Overview', icon: CheckCircle2 },
            { key: 'formula', label: '2. Comfort Formula', icon: Cpu },
            { key: 'cache', label: '3. 5-Min Caching', icon: Layers },
            { key: 'auth', label: '4. Auth & MFA', icon: Shield },
            { key: 'recording', label: '5. Screen Recording (Part 3)', icon: Video },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs">
                <strong>Assignment Goal:</strong> Develop a secure weather analytics application that retrieves weather data for at least 10 cities from <code>cities.json</code>, computes a custom backend Comfort Index score (0-100), caches API responses for 5 minutes with debug telemetry, and restricts dashboard access via MFA and authentication.
              </div>

              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                  Deliverable Checklist
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-xs">
                  <li><strong>City Extraction:</strong> Parses 16 global test cities from <code>cities.json</code>.</li>
                  <li><strong>OpenWeatherMap Integration:</strong> Fetches live meteorological conditions with resilient failover simulation.</li>
                  <li><strong>Server-Side Comfort Score:</strong> 0-100 point scale ranking from "Most Comfortable" to "Least Comfortable".</li>
                  <li><strong>Two-Tier Server Caching:</strong> 5-minute TTL on raw API data and separated processed cache with debug stats.</li>
                  <li><strong>Authentication (Auth0/JWT):</strong> Login/logout flow, restricted signups with whitelisting, and email MFA verification.</li>
                  <li><strong>Responsive UI & Dark Mode:</strong> Desktop and mobile friendly layout with sorting, filtering, and metric visualizers.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs">
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                  Evaluation Reviewers Repository Access:
                </span>
                <code className="text-[11px] block font-mono text-stone-600 dark:text-stone-300">
                  kanishka.d@fidenz.com, srimal.w@fidenz.com, narada.a@fidenz.com, amindu.l@fidenz.com, niroshanan.s@fidenz.com
                </code>
              </div>
            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                  Comfort Index Mathematical Formula
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
                  The Comfort Index composite score synthesizes 6 physical meteorological indicators into a unified 0-100 score:
                </p>
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl font-mono text-xs text-blue-600 dark:text-blue-400">
                  Score = 0.40·S(Temp) + 0.25·S(Humidity) + 0.15·S(Wind) + 0.10·S(Clouds) + 0.05·S(Pressure) + 0.05·S(Visibility)
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <strong>1. Thermal Comfort (Weight: 40%):</strong> Modeled via Gaussian distribution centered at 22°C (σ = 6.5°C). <code>100 * exp(-(T - 22)^2 / (2 * 6.5^2))</code>. Penalizes harsh freezing temperatures and excessive heat.
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <strong>2. Relative Humidity (Weight: 25%):</strong> Optimal zone between 45%-55%. Penalizes mugginess (&gt;60%) and dry air (&lt;40%).
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <strong>3. Wind Speed (Weight: 15%):</strong> Optimal gentle breeze between 2.0 - 3.5 m/s. Stagnant air (0 m/s) scores 70. Strong gale winds (&gt;8 m/s) are penalized.
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <strong>4. Cloudiness & UV Balance (Weight: 10%):</strong> Peak comfort at 20-40% cloud cover for natural daylight without solar glare.
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <strong>5. Pressure & Visibility (Weight: 10% combined):</strong> Baseline 1013.25 hPa and 10,000m clarity.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cache' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                  Server-Side Caching Architecture (Step 5)
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  To prevent rate limiting and optimize network throughput, a dual-layer in-memory cache is implemented:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                    Layer 1: Raw Weather Cache
                  </span>
                  <p className="text-stone-500 dark:text-stone-400">
                    Caches unmodified OpenWeatherMap API responses for <strong>5 minutes (300 seconds)</strong> by city ID key.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                    Layer 2: Processed Analytics Cache
                  </span>
                  <p className="text-stone-500 dark:text-stone-400">
                    Stores computed comfort sub-scores and sorted ranking lists to reduce CPU recalculation overhead.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs space-y-1">
                <strong>Debug Endpoints:</strong>
                <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                  GET /api/cache-status (Returns HIT/MISS counters, active keys, and remaining TTL)
                </div>
                <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                  POST /api/cache/clear (Flushes all server caches for live refresh)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                  Authentication, Whitelisting & MFA (Part 2)
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Dashboard access is strictly guarded with multi-layer authorization:
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                  <strong>1. Whitelist Verification (Step 3):</strong> Public registration is disabled. Only pre-approved emails (e.g. <code>careers@fidenz.com</code>, reviewer addresses) are permitted.
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                  <strong>2. Email Multi-Factor Authentication (Step 2):</strong> Secondary verification via a 6-digit one-time passcode with 10-minute validity.
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                  <strong>3. Cryptographic JWT Tokens:</strong> Issued with 24-hour expiration for stateless server authorization.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recording' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <strong className="block mb-1">Part 3 Screen Recording (5 to 7 Minutes) Requirements:</strong>
                Must be a single, unedited take with audible voiceover explaining trade-offs and live-demonstrating adding an additional parameter to the formula.
              </div>

              <div>
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                  Suggested Screen Recording Flow (5 Minutes)
                </h4>
                <ol className="list-decimal pl-4 space-y-1.5 text-xs">
                  <li><strong>Minutes 0:00 - 1:30 (Architecture & Trade-offs):</strong> Introduce the application, demonstrate login with test user (<code>careers@fidenz.com</code>), MFA step, and explain why temperature and humidity dominate the Comfort Index.</li>
                  <li><strong>Minutes 1:30 - 2:30 (Caching Layer):</strong> Open the Cache Telemetry modal, demonstrate the 5-minute TTL, HIT/MISS ratio, and explain how server caching protects API quotas.</li>
                  <li><strong>Minutes 2:30 - 4:30 (Live Extension Demonstration):</strong> Open the Algorithm Playground (or edit <code>server/comfort-index.ts</code>), add or modify a parameter (such as increasing Visibility weight or adding Barometric Pressure), and show how the city leaderboard rank positions immediately update.</li>
                  <li><strong>Minutes 4:30 - 5:30 (Wrap-up):</strong> Run the automated Unit Test suite to confirm all boundary assertions remain 100% green.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end bg-stone-50 dark:bg-stone-900 shrink-0">
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
