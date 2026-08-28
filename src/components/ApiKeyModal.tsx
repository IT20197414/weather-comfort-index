import React, { useState } from 'react';
import { KeyRound, Check, X, ShieldAlert, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { customApiKey, setCustomApiKey, refreshWeather } = useWeather();
  const [inputKey, setInputKey] = useState<string>(customApiKey || '');
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);

    const trimmed = inputKey.trim();
    setCustomApiKey(trimmed);
    localStorage.setItem('fidenz_weather_custom_api_key', trimmed);

    // Trigger immediate refresh with new key
    try {
      await refreshWeather(true);
      setSuccessMessage(
        trimmed
          ? 'API Key applied successfully! Live OpenWeatherMap data fetched.'
          : 'Reverted to simulated fallback dataset.'
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setInputKey('');
    setCustomApiKey('');
    localStorage.removeItem('fidenz_weather_custom_api_key');
    refreshWeather(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                OpenWeatherMap API Key
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Configure live real-time weather feed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Enter Your API Key (appid)
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. 8a9b2c3d4e5f60718293a4b5c6d7e8f9"
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
              <span>Used directly for live OpenWeatherMap queries.</span>
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-0.5"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-2.5 h-2.5 inline" />
              </a>
            </p>
          </div>

          {/* Fallback Notice */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Automatic Fallback:</strong> If no API key is provided, the app will seamlessly run using deterministic simulated meteorological data for all 16 cities.
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {customApiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Remove Custom Key
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching Data...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply & Refresh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
