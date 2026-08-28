import React from 'react';
import {
  Trophy,
  Activity,
  AlertTriangle,
  Zap,
  TrendingUp,
  Flame,
  CloudRain,
  Compass,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const MetricCards: React.FC = () => {
  const { cities, tempUnit, cacheTelemetry, cacheStatusBanner } = useWeather();

  if (!cities || cities.length === 0) return null;

  const topCity = cities[0];
  const lowestCity = cities[cities.length - 1];

  const avgComfort =
    Math.round((cities.reduce((acc, c) => acc + c.comfortScore, 0) / cities.length) * 10) / 10;

  const hitRatio = cacheTelemetry?.rawCache?.hitRatio ?? 0;
  const executionTime = cacheStatusBanner?.duration ?? 12;

  const formatTemp = (celsius: number, fahrenheit: number) => {
    return tempUnit === 'C' ? `${celsius}°C` : `${fahrenheit}°F`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* CARD 1: Most Comfortable City */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            #1 Comfort Leader
          </span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {topCity.name} <span className="text-xs font-medium text-stone-500">({topCity.country})</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">
              {topCity.weatherDescription} • {formatTemp(topCity.temperatureCelsius, topCity.temperatureFahrenheit)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {topCity.comfortScore}
            </span>
            <span className="text-[10px] text-stone-400 block font-medium">/100 pts</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Average Comfort Index */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Global Avg Comfort
          </span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                {avgComfort}
              </span>
              <span className="text-xs font-semibold text-stone-500">/ 100</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Across {cities.length} global test cities
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {avgComfort >= 70 ? 'Favorable' : avgComfort >= 50 ? 'Moderate' : 'Challenging'}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: Climate Outlier / Harsh Conditions */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Thermal Outlier
          </span>
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {lowestCity.name} <span className="text-xs font-medium text-stone-500">({lowestCity.country})</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Rank #{lowestCity.rankPosition} • {formatTemp(lowestCity.temperatureCelsius, lowestCity.temperatureFahrenheit)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {lowestCity.comfortScore}
            </span>
            <span className="text-[10px] text-stone-400 block font-medium">/100 pts</span>
          </div>
        </div>
      </div>

      {/* CARD 4: Server Cache Telemetry */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            5-Min Server Cache
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {hitRatio}%
              </span>
              <span className="text-xs text-stone-500 font-medium">Hit Rate</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Compute latency: <strong className="text-stone-700 dark:text-stone-300 font-mono">{executionTime}ms</strong>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                cacheStatusBanner?.status === 'HIT'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}
            >
              Cache {cacheStatusBanner?.status || 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
