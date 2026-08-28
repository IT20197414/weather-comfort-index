import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ProcessedCityWeather, TempUnit, HourlyTrendPoint } from '../types';
import { CountryFlag } from './CountryFlag';
import { getCountryName } from '../utils/country';
import {
  TrendingUp,
  Droplets,
  CloudRain,
  Sun,
  Thermometer,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface CityTrendChartProps {
  cities: ProcessedCityWeather[];
  tempUnit: TempUnit;
  initialCityId?: number;
  standalone?: boolean;
}

export const CityTrendChart: React.FC<CityTrendChartProps> = ({
  cities,
  tempUnit,
  initialCityId,
  standalone = true,
}) => {
  const [selectedId, setSelectedId] = useState<number>(() => {
    if (initialCityId) return initialCityId;
    return cities[0]?.id || 1248991; // Default to Colombo or first city
  });

  const [activeMetric, setActiveMetric] = useState<'temp' | 'feelsLike' | 'comfort' | 'both'>('both');

  const currentCity = cities.find((c) => c.id === selectedId) || cities[0];
  if (!currentCity) return null;

  const rawTrend: HourlyTrendPoint[] = currentCity.hourlyTrend || [];

  // Format data for Recharts
  const chartData = rawTrend.map((point) => {
    const temp = tempUnit === 'C' ? point.tempCelsius : point.tempFahrenheit;
    const feelsLike = tempUnit === 'C' ? point.feelsLikeCelsius : point.feelsLikeFahrenheit;

    return {
      time: point.time,
      hour: point.hour,
      temp,
      feelsLike,
      humidity: point.humidity,
      pop: point.pop,
      rainMm: point.rainMm,
      comfortScore: point.comfortScore,
      condition: point.condition,
      icon: point.icon,
    };
  });

  // Calculate statistics for the city trend
  const temps = chartData.map((d) => d.temp);
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const avgTemp = temps.length > 0 ? Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10 : 0;

  const maxComfortPoint = chartData.reduce(
    (max, p) => (p.comfortScore > (max?.comfortScore ?? -1) ? p : max),
    chartData[0]
  );

  return (
    <div
      className={`${
        standalone
          ? 'bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm'
          : 'p-4 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800'
      }`}
    >
      {/* Header with City Selector & Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Hourly Temperature Trend & Curve
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            24-hour time series progression (Past hours & forecast timeline per city)
          </p>
        </div>

        {standalone && (
          <div className="flex flex-wrap items-center gap-2">
            {/* City Dropdown Selector */}
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(Number(e.target.value))}
                className="pl-3 pr-8 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({getCountryName(city.country)})
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Toggle */}
            <div className="inline-flex rounded-lg border border-stone-200 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveMetric('both')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeMetric === 'both'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                Temp & Feels Like
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('comfort')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeMetric === 'comfort'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                }`}
              >
                Comfort Index Curve
              </button>
            </div>
          </div>
        )}
      </div>

      {/* City Highlight Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4 text-xs">
        <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex flex-col justify-between overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 block truncate">
            Selected City
          </span>
          <div className="flex items-center space-x-1.5 mt-1 font-bold text-stone-900 dark:text-stone-100 text-sm whitespace-nowrap overflow-hidden">
            <CountryFlag countryCode={currentCity.country} size="xs" />
            <span className="truncate">{currentCity.name}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/50 flex flex-col justify-between overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block truncate">
            24h Min / Max
          </span>
          <div className="flex items-center space-x-1.5 mt-1 font-mono font-bold text-stone-800 dark:text-stone-200 text-xs sm:text-sm whitespace-nowrap">
            <span className="text-blue-600 dark:text-blue-400 inline-flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
              <span>{Math.round(minTemp)}°</span>
            </span>
            <span className="text-stone-300 dark:text-stone-600">/</span>
            <span className="text-amber-600 dark:text-amber-400 inline-flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
              <span>{Math.round(maxTemp)}°</span>
            </span>
            <span className="text-[10px] text-stone-400 font-sans font-normal ml-0.5">
              {tempUnit === 'C' ? 'C' : 'F'}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/50 flex flex-col justify-between overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block truncate">
            Peak Comfort Hour
          </span>
          <div className="flex items-center space-x-1.5 mt-1 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm whitespace-nowrap overflow-hidden">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
            <span className="tracking-tight whitespace-nowrap">{maxComfortPoint?.time || 'Mid-day'}</span>
            {maxComfortPoint && (
              <span className="text-[10px] font-mono font-normal text-stone-400 dark:text-stone-500 whitespace-nowrap">
                ({Math.round(maxComfortPoint.comfortScore)} pts)
              </span>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/50 flex flex-col justify-between overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block truncate">
            Atmosphere
          </span>
          <div className="mt-1 font-semibold text-stone-800 dark:text-stone-200 text-xs sm:text-sm capitalize truncate">
            {currentCity.weatherDescription}
          </div>
        </div>
      </div>

      {/* Quick City Selector Pills (standalone view) */}
      {standalone && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          <span className="text-[11px] text-stone-400 font-medium shrink-0 mr-1">Quick Select:</span>
          {cities.slice(0, 10).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 flex items-center space-x-1 transition-all ${
                selectedId === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <CountryFlag countryCode={c.country} size="xs" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Temperature & Timeline Curve */}
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.35} />
            <XAxis
              dataKey="time"
              interval={1}
              tick={{ fontSize: 11, fill: '#888888' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="tempAxis"
              domain={[Math.floor(minTemp - 3), Math.ceil(maxTemp + 3)]}
              tick={{ fontSize: 11, fill: '#888888' }}
              unit={`°`}
              orientation="left"
            />
            <YAxis
              yAxisId="secondaryAxis"
              domain={[0, 100]}
              orientation="right"
              tick={{ fontSize: 10, fill: '#888888' }}
              unit="%"
              hide={activeMetric !== 'comfort'}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1c1917',
                border: '1px solid #44403c',
                borderRadius: '10px',
                color: '#fafaf9',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
              formatter={(val: any, name: any) => {
                if (name === 'Temperature') return [`${val}°${tempUnit}`, name];
                if (name === 'Feels Like') return [`${val}°${tempUnit}`, name];
                if (name === 'Comfort Score') return [`${val} / 100 pts`, name];
                if (name === 'Humidity') return [`${val}%`, name];
                if (name === 'Precipitation Chance') return [`${val}%`, name];
                return [val, name];
              }}
              labelFormatter={(label: any, items: any[]) => {
                const item = items?.[0]?.payload;
                return `${currentCity.name} • ${label} (${item?.condition || 'Weather'})`;
              }}
            />

            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            {/* Precipitation probability subtle bar indicator */}
            <Bar
              yAxisId="secondaryAxis"
              dataKey="pop"
              name="Precipitation Chance"
              fill="#0ea5e9"
              opacity={0.25}
              radius={[3, 3, 0, 0]}
              barSize={12}
            />

            {/* Primary Temperature Area Curve */}
            {(activeMetric === 'both' || activeMetric === 'temp') && (
              <Area
                yAxisId="tempAxis"
                type="natural"
                dataKey="temp"
                name="Temperature"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            )}

            {/* Feels Like Temperature Line */}
            {activeMetric === 'both' && (
              <Line
                yAxisId="tempAxis"
                type="natural"
                dataKey="feelsLike"
                name="Feels Like"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: '#f59e0b' }}
              />
            )}

            {/* Comfort Index Progression Curve */}
            {activeMetric === 'comfort' && (
              <Area
                yAxisId="secondaryAxis"
                type="natural"
                dataKey="comfortScore"
                name="Comfort Score"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#comfortGradient)"
                dot={{ r: 3, fill: '#10b981' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Weather Scrubber Strip (Matching Mobile Weather App Style) */}
      <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
          Hourly Weather Strip
        </span>
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {chartData.map((pt, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-between p-2 rounded-xl min-w-[62px] text-center transition-all ${
                pt.time === 'Now'
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <span className={`text-[11px] font-semibold ${pt.time === 'Now' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-stone-500'}`}>
                {pt.time}
              </span>
              <span className="text-base my-1" title={pt.condition}>
                {pt.pop > 50 ? '🌧️' : pt.humidity > 75 ? '⛅' : '☀️'}
              </span>
              <span className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
                {pt.temp}°
              </span>
              <div className="flex items-center space-x-0.5 text-[10px] text-cyan-600 dark:text-cyan-400 mt-1">
                <Droplets className="w-2.5 h-2.5" />
                <span>{pt.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
