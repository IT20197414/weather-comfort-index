import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts';
import { ProcessedCityWeather, TempUnit } from '../types';

interface AnalyticsChartsProps {
  cities: ProcessedCityWeather[];
  tempUnit: TempUnit;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ cities, tempUnit }) => {
  if (!cities || cities.length === 0) return null;

  // Chart 1 data: Comfort Scores ranked
  const rankingData = cities.map((c) => ({
    name: c.name,
    score: c.comfortScore,
    rank: c.rankPosition,
    country: c.country,
  }));

  // Chart 2 data: Temperature vs Comfort
  const tempComfortData = [...cities]
    .sort((a, b) => a.temperatureCelsius - b.temperatureCelsius)
    .map((c) => ({
      name: c.name,
      tempC: c.temperatureCelsius,
      temp: tempUnit === 'C' ? c.temperatureCelsius : c.temperatureFahrenheit,
      comfortScore: c.comfortScore,
      humidity: c.humidity,
    }));

  // Chart 3 data: Average Sub-scores across all cities
  const avgTempScore = Math.round((cities.reduce((acc, c) => acc + c.comfortBreakdown.temperatureScore, 0) / cities.length) * 10) / 10;
  const avgHumidityScore = Math.round((cities.reduce((acc, c) => acc + c.comfortBreakdown.humidityScore, 0) / cities.length) * 10) / 10;
  const avgWindScore = Math.round((cities.reduce((acc, c) => acc + c.comfortBreakdown.windScore, 0) / cities.length) * 10) / 10;
  const avgCloudScore = Math.round((cities.reduce((acc, c) => acc + c.comfortBreakdown.cloudinessScore, 0) / cities.length) * 10) / 10;
  const avgPressureScore = Math.round((cities.reduce((acc, c) => acc + c.comfortBreakdown.pressureScore, 0) / cities.length) * 10) / 10;
  const avgVisScore = Math.round((cities.reduce((acc, c) => acc + c.comfortBreakdown.visibilityScore, 0) / cities.length) * 10) / 10;

  const parameterData = [
    { parameter: 'Thermal Comfort (40%)', averageScore: avgTempScore, color: '#3b82f6' },
    { parameter: 'Relative Humidity (25%)', averageScore: avgHumidityScore, color: '#06b6d4' },
    { parameter: 'Wind Airflow (15%)', averageScore: avgWindScore, color: '#10b981' },
    { parameter: 'Cloudiness & UV (10%)', averageScore: avgCloudScore, color: '#f59e0b' },
    { parameter: 'Barometric Press. (5%)', averageScore: avgPressureScore, color: '#8b5cf6' },
    { parameter: 'Air Visibility (5%)', averageScore: avgVisScore, color: '#ec4899' },
  ];

  const getBarColor = (score: number) => {
    if (score >= 85) return '#10b981'; // Emerald
    if (score >= 70) return '#14b8a6'; // Teal
    if (score >= 50) return '#f59e0b'; // Amber
    if (score >= 35) return '#f97316'; // Orange
    return '#f43f5e'; // Rose
  };

  return (
    <div className="space-y-6 mb-8">
      {/* CHART 1: Comfort Index Ranking Leaderboard */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              City Comfort Index Leaderboard
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ranked from Most Comfortable (#1) to Least Comfortable (#16)
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-stone-500 mt-2 sm:mt-0">
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span> Optimal (85+)
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span> Moderate (50-69)
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1"></span> Challenging (&lt;50)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#888888' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888888' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  color: '#fafaf9',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} pts`, 'Comfort Score']}
                labelFormatter={(label: any) => `City: ${label}`}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {rankingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of 2 Sub-charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 2: Temperature vs Comfort Score Correlation */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Thermal Curve vs Comfort Response
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Illustrates optimal scoring peak near 22°C (71.6°F) and penalties at extremes
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempComfortData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 10, fill: '#888888' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: '1px solid #44403c',
                    borderRadius: '8px',
                    color: '#fafaf9',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="comfortScore" stroke="#10b981" strokeWidth={2.5} name="Comfort Score (0-100)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name={`Temperature (°${tempUnit})`} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Global Parameter Sub-Score Performance */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Average Sub-Score Component Breakdown
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Composite weighting breakdown across all meteorological parameters
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parameterData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#888888' }} />
                <YAxis type="category" dataKey="parameter" tick={{ fontSize: 10, fill: '#888888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: '1px solid #44403c',
                    borderRadius: '8px',
                    color: '#fafaf9',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} / 100`, 'Avg Score']}
                />
                <Bar dataKey="averageScore" radius={[0, 4, 4, 0]}>
                  {parameterData.map((entry, index) => (
                    <Cell key={`cell-p-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
