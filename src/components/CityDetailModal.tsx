import React from 'react';
import {
  X,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Sunrise,
  Sunset,
  MapPin,
  Server,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ProcessedCityWeather, TempUnit } from '../types';
import { CountryFlag } from './CountryFlag';
import { getCountryName } from '../utils/country';

interface CityDetailModalProps {
  city: ProcessedCityWeather | null;
  tempUnit: TempUnit;
  onClose: () => void;
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({ city, tempUnit, onClose }) => {
  if (!city) return null;

  const formatTemp = (celsius: number, fahrenheit: number) => {
    return tempUnit === 'C' ? `${celsius}°C` : `${fahrenheit}°F`;
  };

  const formatTime = (unixSeconds: number) => {
    if (!unixSeconds) return '--:--';
    const date = new Date(unixSeconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const b = city.comfortBreakdown;

  const subScores = [
    {
      title: 'Thermal Comfort',
      score: b.temperatureScore,
      weight: `${Math.round(b.weights.temperature * 100)}%`,
      value: formatTemp(city.temperatureCelsius, city.temperatureFahrenheit),
      subtext: `Feels like ${formatTemp(city.feelsLikeCelsius, city.feelsLikeFahrenheit)} (Target: 22°C)`,
      color: 'bg-blue-500',
      icon: Sun,
    },
    {
      title: 'Relative Humidity',
      score: b.humidityScore,
      weight: `${Math.round(b.weights.humidity * 100)}%`,
      value: `${city.humidity}%`,
      subtext: city.humidity > 70 ? 'High mugginess' : city.humidity < 35 ? 'Dry atmosphere' : 'Balanced optimal zone',
      color: 'bg-cyan-500',
      icon: Droplets,
    },
    {
      title: 'Wind & Airflow',
      score: b.windScore,
      weight: `${Math.round(b.weights.wind * 100)}%`,
      value: `${city.windSpeed} m/s`,
      subtext: city.windSpeed < 1.0 ? 'Calm stagnation' : city.windSpeed > 6.0 ? 'Brisk / gusty' : 'Gentle refreshing breeze',
      color: 'bg-emerald-500',
      icon: Wind,
    },
    {
      title: 'Cloudiness & UV Balance',
      score: b.cloudinessScore,
      weight: `${Math.round(b.weights.cloudiness * 100)}%`,
      value: `${city.clouds}%`,
      subtext: city.clouds > 80 ? 'Heavy overcast' : city.clouds < 15 ? 'Intense clear glare' : 'Comfortable filtered light',
      color: 'bg-amber-500',
      icon: Sun,
    },
    {
      title: 'Barometric Pressure',
      score: b.pressureScore,
      weight: `${Math.round(b.weights.pressure * 100)}%`,
      value: `${city.pressure} hPa`,
      subtext: `Baseline 1013.25 hPa (${Math.abs(city.pressure - 1013)} hPa deviation)`,
      color: 'bg-purple-500',
      icon: Gauge,
    },
    {
      title: 'Air Clarity / Visibility',
      score: b.visibilityScore,
      weight: `${Math.round(b.weights.visibility * 100)}%`,
      value: `${city.visibilityKm} km`,
      subtext: city.visibilityKm >= 10 ? 'Optimal atmospheric transparency' : 'Reduced particulate clarity',
      color: 'bg-pink-500',
      icon: Eye,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-black text-xs">
                Rank #{city.rankPosition}
              </span>
              <CountryFlag countryCode={city.country} size="md" />
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {city.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium">
                {getCountryName(city.country)}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize flex items-center space-x-1.5">
              <span>{city.weatherDescription}</span>
              <span>•</span>
              <span>City Code: {city.id}</span>
            </p>
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
          {/* Top Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-emerald-500/10 to-transparent border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Comfort Index Diagnosis
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-3xl font-black text-stone-900 dark:text-stone-100 font-mono">
                  {city.comfortScore}
                </span>
                <span className="text-xs text-stone-400">/ 100 points</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                  {b.rating}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs min-w-[130px]">
              <span className="text-[11px] text-stone-400">Temperature</span>
              <span className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono">
                {formatTemp(city.temperatureCelsius, city.temperatureFahrenheit)}
              </span>
              <span className="text-[10px] text-stone-500">
                Range: {formatTemp(city.tempMinCelsius, city.tempMaxCelsius)}
              </span>
            </div>
          </div>

          {/* Sub-scores Breakdown Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              Mathematical Parameter Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subScores.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      Weight: {item.weight}
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-1">
                    <span className="text-xs text-stone-500">{item.value}</span>
                    <span className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                      {item.score}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-300`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {item.subtext}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ephemeris & Cache Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs">
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-800">
              <Sunrise className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] text-stone-400 block">Sunrise</span>
                <span className="font-mono font-medium">{formatTime(city.sunrise)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-800">
              <Sunset className="w-4 h-4 text-orange-500" />
              <div>
                <span className="text-[10px] text-stone-400 block">Sunset</span>
                <span className="font-mono font-medium">{formatTime(city.sunset)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-800 col-span-2 sm:col-span-1">
              <Server className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-[10px] text-stone-400 block">Server Cache</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  {city.cacheSource || '5-Min TTL'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end bg-stone-50 dark:bg-stone-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
