import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  ArrowRight,
  Sun,
  Cloud,
  Award,
  Sparkles,
} from 'lucide-react';
import { ProcessedCityWeather, TempUnit } from '../types';

interface CityCardProps {
  city: ProcessedCityWeather;
  tempUnit: TempUnit;
  onSelect: (city: ProcessedCityWeather) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, tempUnit, onSelect }) => {
  const formatTemp = (celsius: number, fahrenheit: number) => {
    return tempUnit === 'C' ? `${celsius}°C` : `${fahrenheit}°F`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 70) return 'text-teal-600 dark:text-teal-400 border-teal-500 bg-teal-50 dark:bg-teal-950/40';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
    if (score >= 35) return 'text-orange-600 dark:text-orange-400 border-orange-500 bg-orange-50 dark:bg-orange-950/40';
    return 'text-rose-600 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/40';
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-amber-950 shadow-amber-300/50 shadow-sm font-black';
    if (rank === 2) return 'bg-slate-300 text-slate-900 font-bold';
    if (rank === 3) return 'bg-amber-700 text-amber-100 font-bold';
    return 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300';
  };

  const ratingBadgeColor = {
    Optimal: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
    Pleasant: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 border-teal-300 dark:border-teal-800',
    Moderate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    Uncomfortable: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200 border-orange-300 dark:border-orange-800',
    Harsh: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300 dark:border-rose-800',
  }[city.comfortBreakdown.rating] || 'bg-stone-100 text-stone-800';

  return (
    <div
      id={`card-city-${city.id}`}
      className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
    >
      {/* Top Header: Rank, City Name, Country */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${getRankBadgeStyle(
                city.rankPosition
              )}`}
              title={`Rank #${city.rankPosition}`}
            >
              #{city.rankPosition}
            </span>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {city.name}
              </h3>
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                {city.country}
              </span>
            </div>
          </div>

          {/* Rating Pill */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${ratingBadgeColor}`}
          >
            {city.comfortBreakdown.rating}
          </span>
        </div>

        {/* Middle Section: Temperature & Weather Icon */}
        <div className="flex items-center justify-between my-4 py-2 border-y border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center border border-stone-200 dark:border-stone-700/60 text-2xl">
              {city.weatherMain === 'Clear' ? (
                <Sun className="w-7 h-7 text-amber-500 animate-pulse" />
              ) : (
                <Cloud className="w-7 h-7 text-blue-400" />
              )}
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                {formatTemp(city.temperatureCelsius, city.temperatureFahrenheit)}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">
                {city.weatherDescription}
              </p>
            </div>
          </div>

          {/* Comfort Gauge Badge */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[72px] ${getScoreColor(
              city.comfortScore
            )}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">Score</span>
            <span className="text-xl font-black font-mono leading-none my-0.5">
              {city.comfortScore}
            </span>
            <span className="text-[9px] opacity-80">/ 100</span>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300 mb-4">
          <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-stone-400">Humidity:</span>
            <strong className="font-semibold text-stone-800 dark:text-stone-200">{city.humidity}%</strong>
          </div>
          <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span className="text-stone-400">Wind:</span>
            <strong className="font-semibold text-stone-800 dark:text-stone-200">{city.windSpeed} m/s</strong>
          </div>
          <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <Gauge className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="text-stone-400">Pressure:</span>
            <strong className="font-semibold text-stone-800 dark:text-stone-200">{city.pressure} hPa</strong>
          </div>
          <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-stone-400">Visibility:</span>
            <strong className="font-semibold text-stone-800 dark:text-stone-200">{city.visibilityKm} km</strong>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <button
        id={`btn-details-${city.id}`}
        onClick={() => onSelect(city)}
        className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-blue-50 dark:bg-stone-800 dark:hover:bg-blue-950/40 text-stone-700 hover:text-blue-600 dark:text-stone-300 dark:hover:text-blue-400 text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center justify-center space-x-1.5"
      >
        <span>Inspect Comfort Metrics</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
