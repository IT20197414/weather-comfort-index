import React from 'react';
import { Eye, ArrowRight, Sun, Cloud, Trophy } from 'lucide-react';
import { ProcessedCityWeather, TempUnit } from '../types';

interface CityTableViewProps {
  cities: ProcessedCityWeather[];
  tempUnit: TempUnit;
  onSelect: (city: ProcessedCityWeather) => void;
}

export const CityTableView: React.FC<CityTableViewProps> = ({ cities, tempUnit, onSelect }) => {
  const formatTemp = (celsius: number, fahrenheit: number) => {
    return tempUnit === 'C' ? `${celsius}°C` : `${fahrenheit}°F`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 font-black';
    if (score >= 70) return 'text-teal-600 dark:text-teal-400 font-bold';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 font-bold';
    if (score >= 35) return 'text-orange-600 dark:text-orange-400 font-bold';
    return 'text-rose-600 dark:text-rose-400 font-bold';
  };

  const ratingBadgeColor = {
    Optimal: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    Pleasant: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    Moderate: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    Uncomfortable: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    Harsh: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">Rank</th>
              <th scope="col" className="px-4 py-3">City & Country</th>
              <th scope="col" className="px-4 py-3">Condition</th>
              <th scope="col" className="px-4 py-3">Temp</th>
              <th scope="col" className="px-4 py-3">Humidity</th>
              <th scope="col" className="px-4 py-3">Wind</th>
              <th scope="col" className="px-4 py-3">Pressure</th>
              <th scope="col" className="px-4 py-3">Visibility</th>
              <th scope="col" className="px-4 py-3 text-right">Comfort Score</th>
              <th scope="col" className="px-4 py-3 text-center">Rating</th>
              <th scope="col" className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
            {cities.map((city) => (
              <tr
                key={city.id}
                className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-center font-bold font-mono">
                  {city.rankPosition === 1 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 text-xs font-black">
                      #1
                    </span>
                  ) : (
                    <span className="text-stone-500">#{city.rankPosition}</span>
                  )}
                </td>

                <td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">
                  <div className="flex items-center space-x-1.5">
                    <span>{city.name}</span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
                      {city.country}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 capitalize text-stone-600 dark:text-stone-300 text-xs">
                  {city.weatherDescription}
                </td>

                <td className="px-4 py-3 font-mono font-semibold text-stone-900 dark:text-stone-100">
                  {formatTemp(city.temperatureCelsius, city.temperatureFahrenheit)}
                </td>

                <td className="px-4 py-3 font-mono text-stone-600 dark:text-stone-300">
                  {city.humidity}%
                </td>

                <td className="px-4 py-3 font-mono text-stone-600 dark:text-stone-300">
                  {city.windSpeed} m/s
                </td>

                <td className="px-4 py-3 font-mono text-stone-600 dark:text-stone-300">
                  {city.pressure} hPa
                </td>

                <td className="px-4 py-3 font-mono text-stone-600 dark:text-stone-300">
                  {city.visibilityKm} km
                </td>

                <td className={`px-4 py-3 text-right font-mono text-base ${getScoreColor(city.comfortScore)}`}>
                  {city.comfortScore}
                  <span className="text-[10px] text-stone-400 font-normal ml-0.5">/100</span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      ratingBadgeColor[city.comfortBreakdown.rating]
                    }`}
                  >
                    {city.comfortBreakdown.rating}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onSelect(city)}
                    className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-stone-600 hover:text-blue-600 dark:text-stone-300 dark:hover:text-blue-400 transition-colors"
                    title="View Breakdown"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
