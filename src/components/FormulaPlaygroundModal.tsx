import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  Code2,
  Video,
  CheckCircle2,
  RefreshCw,
  Info,
  ArrowRight,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { CountryFlag } from './CountryFlag';
import { getCountryName } from '../utils/country';

interface FormulaPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaPlaygroundModal: React.FC<FormulaPlaygroundModalProps> = ({ isOpen, onClose }) => {
  const { cities } = useWeather();

  const [weights, setWeights] = useState({
    temperature: 40,
    humidity: 25,
    wind: 15,
    cloudiness: 10,
    pressure: 5,
    visibility: 5,
  });

  const [includePressure, setIncludePressure] = useState(true);
  const [includeVisibility, setIncludeVisibility] = useState(true);

  if (!isOpen) return null;

  const totalWeight =
    weights.temperature +
    weights.humidity +
    weights.wind +
    weights.cloudiness +
    (includePressure ? weights.pressure : 0) +
    (includeVisibility ? weights.visibility : 0);

  // Recalculate preview scores for top 5 cities based on slider weights
  const previewRankings = cities.map((city) => {
    const b = city.comfortBreakdown;
    const rawScore =
      (b.temperatureScore * weights.temperature +
        b.humidityScore * weights.humidity +
        b.windScore * weights.wind +
        b.cloudinessScore * weights.cloudiness +
        (includePressure ? b.pressureScore * weights.pressure : 0) +
        (includeVisibility ? b.visibilityScore * weights.visibility : 0)) /
      totalWeight;

    const newScore = Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));
    return {
      id: city.id,
      name: city.name,
      country: city.country,
      originalScore: city.comfortScore,
      originalRank: city.rankPosition,
      newScore,
    };
  });

  previewRankings.sort((a, b) => b.newScore - a.newScore);

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
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Comfort Index Algorithm & Screen Recording Assistant</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Interactive parameter weighting sandbox & live extension simulator (Part 3 Guide)
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
        <div className="p-5 sm:p-6 space-y-6">
          {/* Part 3 Take-Home Screen Recording Helper Card */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-200">
              <Video className="w-4 h-4 text-amber-600" />
              <span>Assignment Part 3: 5-7 Min Screen Recording Task Guidelines</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              In your 5-7 minute recording, you must live-demonstrate incorporating an additional parameter (e.g. Pressure or Visibility) and explain your reasoning. You can use the sliders below to demonstrate how weights shift the ranking in real-time.
            </p>
          </div>

          {/* Weight Sliders */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Adjust Parameter Weights (%)
            </h4>

            {/* Temperature */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Thermal Temperature (Gaussian Bell at 22°C)</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{weights.temperature}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={weights.temperature}
                onChange={(e) => setWeights({ ...weights, temperature: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Humidity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Relative Humidity (Optimal 45-55%)</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">{weights.humidity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.humidity}
                onChange={(e) => setWeights({ ...weights, humidity: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
            </div>

            {/* Wind */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Wind Speed (Gentle Breeze 2.0-3.5 m/s)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{weights.wind}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={weights.wind}
                onChange={(e) => setWeights({ ...weights, wind: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Cloudiness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Cloudiness / Sun Glare (Optimal 20-40%)</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">{weights.cloudiness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.cloudiness}
                onChange={(e) => setWeights({ ...weights, cloudiness: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Parameter Extensions Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold">Include Pressure (1013 hPa)</div>
                  <div className="text-[10px] text-stone-500">Weight: {weights.pressure}%</div>
                </div>
                <input
                  type="checkbox"
                  checked={includePressure}
                  onChange={(e) => setIncludePressure(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold">Include Visibility (10 km)</div>
                  <div className="text-[10px] text-stone-500">Weight: {weights.visibility}%</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeVisibility}
                  onChange={(e) => setIncludeVisibility(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Ranking Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Recalculated City Ranking Preview
            </h4>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 dark:border-stone-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 text-[10px] uppercase font-semibold sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-center">New Rank</th>
                    <th className="px-3 py-2">City</th>
                    <th className="px-3 py-2 text-right">Recalculated Score</th>
                    <th className="px-3 py-2 text-right">Original Score</th>
                    <th className="px-3 py-2 text-center">Rank Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                  {previewRankings.slice(0, 8).map((city, idx) => {
                    const newRank = idx + 1;
                    const shift = city.originalRank - newRank;

                    return (
                      <tr key={city.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="px-3 py-2 text-center font-bold font-mono">#{newRank}</td>
                        <td className="px-3 py-2 font-semibold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                          <CountryFlag countryCode={city.country} size="xs" />
                          <span>{city.name}</span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {city.newScore}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-stone-400">
                          {city.originalScore}
                        </td>
                        <td className="px-3 py-2 text-center font-mono font-semibold">
                          {shift > 0 ? (
                            <span className="text-emerald-600">▲ +{shift}</span>
                          ) : shift < 0 ? (
                            <span className="text-rose-600">▼ {shift}</span>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-900">
          <button
            onClick={() =>
              setWeights({
                temperature: 40,
                humidity: 25,
                wind: 15,
                cloudiness: 10,
                pressure: 5,
                visibility: 5,
              })
            }
            className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
          >
            Reset Default Weights
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
