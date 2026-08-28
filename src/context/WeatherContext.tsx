import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProcessedCityWeather, CacheTelemetry, TempUnit, SortField, SortOrder, ComfortFilter } from '../types';

interface WeatherContextType {
  cities: ProcessedCityWeather[];
  filteredCities: ProcessedCityWeather[];
  selectedCity: ProcessedCityWeather | null;
  setSelectedCity: (city: ProcessedCityWeather | null) => void;
  loading: boolean;
  error: string | null;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  comfortFilter: ComfortFilter;
  setComfortFilter: (filter: ComfortFilter) => void;
  viewMode: 'grid' | 'table' | 'analytics';
  setViewMode: (mode: 'grid' | 'table' | 'analytics') => void;
  cacheTelemetry: CacheTelemetry | null;
  refreshWeather: (force?: boolean) => Promise<void>;
  clearServerCache: () => Promise<boolean>;
  fetchCacheTelemetry: () => Promise<void>;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  lastFetched: Date | null;
  cacheStatusBanner: { status: string; duration: number } | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<ProcessedCityWeather[]>([]);
  const [selectedCity, setSelectedCity] = useState<ProcessedCityWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [comfortFilter, setComfortFilter] = useState<ComfortFilter>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'analytics'>('grid');
  const [cacheTelemetry, setCacheTelemetry] = useState<CacheTelemetry | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [cacheStatusBanner, setCacheStatusBanner] = useState<{ status: string; duration: number } | null>(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/cache-status');
      if (res.ok) {
        const data = await res.json();
        setCacheTelemetry(data.telemetry);
      }
    } catch (err) {
      console.warn('Failed to fetch cache telemetry:', err);
    }
  }, []);

  const refreshWeather = useCallback(
    async (force: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/weather?refresh=${force ? 'true' : 'false'}`;
        if (customApiKey.trim()) {
          url += `&apiKey=${encodeURIComponent(customApiKey.trim())}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load weather data (${res.status})`);
        }

        const data = await res.json();
        if (data.cities && Array.isArray(data.cities)) {
          setCities(data.cities);
          setLastFetched(new Date());
          setCacheStatusBanner({
            status: data.cacheStatus,
            duration: data.executionTimeMs,
          });

          // Sync selected city if open
          if (selectedCity) {
            const updated = data.cities.find((c: ProcessedCityWeather) => c.id === selectedCity.id);
            if (updated) setSelectedCity(updated);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching weather data');
      } finally {
        setLoading(false);
        fetchTelemetry();
      }
    },
    [customApiKey, selectedCity, fetchTelemetry]
  );

  const clearServerCache = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/cache/clear', { method: 'POST' });
      if (res.ok) {
        await refreshWeather(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Clear cache error:', err);
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    refreshWeather(false);
  }, []);

  // Filter & Sort computation
  const filteredCities = React.useMemo(() => {
    let result = [...cities];

    // Filter by text search (name or country)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.weatherDescription.toLowerCase().includes(q)
      );
    }

    // Filter by Comfort Rating tier
    if (comfortFilter !== 'ALL') {
      result = result.filter((c) => c.comfortBreakdown.rating === comfortFilter);
    }

    // Sort order
    result.sort((a, b) => {
      let valA: any = a.rankPosition;
      let valB: any = b.rankPosition;

      if (sortField === 'rank') {
        valA = a.rankPosition;
        valB = b.rankPosition;
      } else if (sortField === 'comfort') {
        valA = a.comfortScore;
        valB = b.comfortScore;
      } else if (sortField === 'temp') {
        valA = a.temperatureCelsius;
        valB = b.temperatureCelsius;
      } else if (sortField === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortField === 'humidity') {
        valA = a.humidity;
        valB = b.humidity;
      } else if (sortField === 'wind') {
        valA = a.windSpeed;
        valB = b.windSpeed;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [cities, searchQuery, comfortFilter, sortField, sortOrder]);

  return (
    <WeatherContext.Provider
      value={{
        cities,
        filteredCities,
        selectedCity,
        setSelectedCity,
        loading,
        error,
        tempUnit,
        setTempUnit,
        searchQuery,
        setSearchQuery,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        comfortFilter,
        setComfortFilter,
        viewMode,
        setViewMode,
        cacheTelemetry,
        refreshWeather,
        clearServerCache,
        fetchCacheTelemetry: fetchTelemetry,
        customApiKey,
        setCustomApiKey,
        lastFetched,
        cacheStatusBanner,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
