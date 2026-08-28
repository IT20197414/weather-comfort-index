import React, { useEffect, useState } from 'react';
import {
  X,
  Server,
  Zap,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Database,
  Activity,
  Layers,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { CacheTelemetry } from '../types';

interface CacheTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CacheTelemetryModal: React.FC<CacheTelemetryModalProps> = ({ isOpen, onClose }) => {
  const { clearServerCache, refreshWeather, loading } = useWeather();
  const [telemetry, setTelemetry] = useState<CacheTelemetry | null>(null);
  const [fetching, setFetching] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchTelemetryData = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/cache-status');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.telemetry);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetryData();
      const interval = setInterval(fetchTelemetryData, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearCache = async () => {
    setClearing(true);
    await clearServerCache();
    await fetchTelemetryData();
    setClearing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Server-Side Cache Telemetry</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                  5-Min TTL (300s)
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Live inspection of in-memory Raw Weather API & Processed Score layers
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Raw Cache Hits
              </span>
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {telemetry?.rawCache?.hits ?? 0}
              </span>
              <span className="text-[10px] text-stone-500 block">Total Hit count</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Raw Cache Misses
              </span>
              <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                {telemetry?.rawCache?.misses ?? 0}
              </span>
              <span className="text-[10px] text-stone-500 block">Network fetches</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Hit Efficiency
              </span>
              <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                {telemetry?.rawCache?.hitRatio ?? 0}%
              </span>
              <span className="text-[10px] text-stone-500 block">Cache ratio</span>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Active Keys
              </span>
              <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                {telemetry?.rawCache?.totalEntries ?? 0}
              </span>
              <span className="text-[10px] text-stone-500 block">Cached cities</span>
            </div>
          </div>

          {/* Processed Cache Layer Status */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Processed Output Cache Layer</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                Hits: {telemetry?.processedCache?.hits ?? 0} | Misses: {telemetry?.processedCache?.misses ?? 0}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Stores composite Comfort Index calculations, normalized ranking order, and sub-score metrics. Invalidates concurrently with raw cache expirations.
            </p>
          </div>

          {/* Active Keys & TTL Countdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>In-Memory Cache Registry & Expirations</span>
              </h4>
              <button
                onClick={fetchTelemetryData}
                className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${fetching ? 'animate-spin' : ''}`} />
                <span>Poll Now</span>
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 dark:border-stone-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 text-[10px] uppercase font-semibold sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Cache Key</th>
                    <th className="px-3 py-2 text-right">Age</th>
                    <th className="px-3 py-2 text-right">TTL Remaining</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                  {telemetry?.rawCache?.keys && telemetry.rawCache.keys.length > 0 ? (
                    telemetry.rawCache.keys.map((k) => (
                      <tr key={k.key} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                        <td className="px-3 py-1.5 font-mono text-[11px]">{k.key}</td>
                        <td className="px-3 py-1.5 text-right font-mono text-[11px] text-stone-500">
                          {k.ageSeconds}s ago
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {k.ttlRemainingSeconds}s
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            CACHED
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-stone-400 text-xs">
                        No active keys currently in cache. Trigger a refresh to populate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
          <button
            onClick={handleClearCache}
            disabled={clearing || loading}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{clearing ? 'Clearing...' : 'Flush All Caches'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
