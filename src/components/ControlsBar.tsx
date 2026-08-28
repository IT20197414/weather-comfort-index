import React from 'react';
import {
  Search,
  ArrowUpDown,
  Filter,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  BarChart3,
  Thermometer,
  Trash2,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { ComfortFilter, SortField } from '../types';

export const ControlsBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    comfortFilter,
    setComfortFilter,
    tempUnit,
    setTempUnit,
    viewMode,
    setViewMode,
    loading,
    refreshWeather,
    clearServerCache,
    filteredCities,
    cities,
  } = useWeather();

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as SortField);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filters: Array<{ key: ComfortFilter; label: string }> = [
    { key: 'ALL', label: 'All Cities' },
    { key: 'Optimal', label: 'Optimal (85+)' },
    { key: 'Pleasant', label: 'Pleasant (70-84)' },
    { key: 'Moderate', label: 'Moderate (50-69)' },
    { key: 'Uncomfortable', label: 'Uncomfortable (<50)' },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 mb-6 shadow-sm space-y-4">
      {/* Top Row: Search, Sort, View Modes, Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            id="input-search-city"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city (e.g. Colombo, London, Tokyo, Cairns)..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Controls Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1.5">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
            <select
              id="select-sort-field"
              value={sortField}
              onChange={handleSortFieldChange}
              className="bg-transparent text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="rank">Comfort Rank (#1 to #N)</option>
              <option value="comfort">Comfort Index Score</option>
              <option value="temp">Temperature</option>
              <option value="humidity">Humidity %</option>
              <option value="wind">Wind Speed</option>
              <option value="name">City Name (A-Z)</option>
            </select>
            <button
              id="btn-toggle-sort-order"
              onClick={toggleSortOrder}
              className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded"
              title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Temperature Unit Switcher */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 border border-stone-200 dark:border-stone-700">
            <button
              id="btn-unit-celsius"
              onClick={() => setTempUnit('C')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                tempUnit === 'C'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
              }`}
            >
              °C
            </button>
            <button
              id="btn-unit-fahrenheit"
              onClick={() => setTempUnit('F')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                tempUnit === 'F'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
              }`}
            >
              °F
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 border border-stone-200 dark:border-stone-700">
            <button
              id="btn-view-grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="btn-view-table"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-stone-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
              }`}
              title="Data Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              id="btn-view-analytics"
              onClick={() => setViewMode('analytics')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-white dark:bg-stone-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
              }`}
              title="Analytics Charts"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh / Clear Cache Buttons */}
          <button
            id="btn-refresh-weather"
            onClick={() => refreshWeather(false)}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors disabled:opacity-50"
            title="Fetch weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            id="btn-flush-cache"
            onClick={clearServerCache}
            disabled={loading}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-medium border border-amber-300/50 dark:border-amber-700 transition-colors"
            title="Invalidate 5-Min Server Cache and recalculate"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Flush Cache</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Comfort Tier Filter Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-stone-500 flex items-center mr-1">
            <Filter className="w-3 h-3 mr-1" /> Filter:
          </span>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setComfortFilter(f.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                comfortFilter === f.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400">
          Showing <strong className="text-stone-900 dark:text-stone-100">{filteredCities.length}</strong> of{' '}
          <strong className="text-stone-900 dark:text-stone-100">{cities.length}</strong> cities
        </div>
      </div>
    </div>
  );
};
