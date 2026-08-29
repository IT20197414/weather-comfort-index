import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { MetricCards } from './MetricCards';
import { ControlsBar } from './ControlsBar';
import { CityCard } from './CityCard';
import { CityTableView } from './CityTableView';
import { AnalyticsCharts } from './AnalyticsCharts';
import { CityDetailModal } from './CityDetailModal';
import { CacheTelemetryModal } from './CacheTelemetryModal';
import { FormulaPlaygroundModal } from './FormulaPlaygroundModal';
import { UnitTestModal } from './UnitTestModal';
import { CloudRain, RefreshCw, AlertCircle } from 'lucide-react';

interface WeatherDashboardProps {
  showCacheModal: boolean;
  setShowCacheModal: (val: boolean) => void;
  showPlaygroundModal: boolean;
  setShowPlaygroundModal: (val: boolean) => void;
  showTestsModal: boolean;
  setShowTestsModal: (val: boolean) => void;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  showCacheModal,
  setShowCacheModal,
  showPlaygroundModal,
  setShowPlaygroundModal,
  showTestsModal,
  setShowTestsModal,
}) => {
  const {
    filteredCities,
    cities,
    loading,
    error,
    tempUnit,
    selectedCity,
    setSelectedCity,
    viewMode,
    refreshWeather,
  } = useWeather();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Metric Overview Cards */}
      <MetricCards />

      {/* Control Filter & Sorting Toolbar */}
      <ControlsBar />

      {/* Error state if any */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refreshWeather(false)}
            className="underline font-semibold hover:text-red-900 dark:hover:text-red-100"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Loading state indicator */}
      {loading && cities.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
            Fetching OpenWeatherMap data & Computing Comfort Index scores...
          </p>
          <span className="text-xs text-stone-400">Applying 5-minute server-side caching</span>
        </div>
      ) : filteredCities.length === 0 ? (
        /* Empty Filter state */
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8">
          <CloudRain className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No matching cities found
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search query or comfort level filter pills above.
          </p>
        </div>
      ) : (
        /* Main Visual Views */
        <div>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  tempUnit={tempUnit}
                  onSelect={(c) => setSelectedCity(c)}
                />
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <CityTableView
              cities={filteredCities}
              tempUnit={tempUnit}
              onSelect={(c) => setSelectedCity(c)}
            />
          )}

          {viewMode === 'analytics' && (
            <AnalyticsCharts cities={filteredCities} tempUnit={tempUnit} />
          )}
        </div>
      )}

      {/* Modals & Dialogs */}
      <CityDetailModal
        city={selectedCity}
        tempUnit={tempUnit}
        onClose={() => setSelectedCity(null)}
      />

      <CacheTelemetryModal
        isOpen={showCacheModal}
        onClose={() => setShowCacheModal(false)}
      />

      <FormulaPlaygroundModal
        isOpen={showPlaygroundModal}
        onClose={() => setShowPlaygroundModal(false)}
      />

      <UnitTestModal
        isOpen={showTestsModal}
        onClose={() => setShowTestsModal(false)}
      />
    </main>
  );
};
