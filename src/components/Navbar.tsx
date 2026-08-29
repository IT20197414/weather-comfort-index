import React from 'react';
import {
  CloudSun,
  ShieldCheck,
  Server,
  Sliders,
  CheckCircle2,
  LogOut,
  Moon,
  Sun,
  Zap,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';

interface NavbarProps {
  onOpenCache: () => void;
  onOpenPlayground: () => void;
  onOpenTests: () => void;
  onOpenApiKey: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCache,
  onOpenPlayground,
  onOpenTests,
  onOpenApiKey,
  darkMode,
  setDarkMode,
}) => {
  const { user, logout } = useAuth();
  const { cacheTelemetry, cacheStatusBanner, customApiKey } = useWeather();

  const hitRatio = cacheTelemetry?.rawCache?.hitRatio ?? 0;

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs shrink-0">
              <CloudSun className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg tracking-tight whitespace-nowrap">
                  Weather Forecast
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 whitespace-nowrap shrink-0">
                  Live Global
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden xl:block whitespace-nowrap">
                Real-time Weather & Biometeorological Comfort Index
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Cache Telemetry Trigger */}
            <button
              id="btn-nav-cache"
              onClick={onOpenCache}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors whitespace-nowrap shrink-0"
              title="Inspect 5-Minute Server Cache Telemetry"
            >
              <Server className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="hidden md:inline">Cache</span>
              {cacheStatusBanner && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                    cacheStatusBanner.status === 'HIT'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {cacheStatusBanner.status}
                </span>
              )}
            </button>

            {/* Formula Playground Trigger */}
            <button
              id="btn-nav-playground"
              onClick={onOpenPlayground}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors whitespace-nowrap shrink-0"
              title="Live Formula Tuning & Parameter Extensions"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="hidden lg:inline">Algorithm</span>
            </button>

            {/* Unit Tests Trigger */}
            <button
              id="btn-nav-tests"
              onClick={onOpenTests}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors whitespace-nowrap shrink-0"
              title="Run Mathematical Unit Tests"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              <span className="hidden lg:inline">Unit Tests</span>
            </button>

            {/* API Key Modal Trigger */}
            <button
              id="btn-nav-apikey"
              onClick={onOpenApiKey}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                customApiKey
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700'
              }`}
              title={customApiKey ? 'Custom OpenWeather API Key Active' : 'Configure OpenWeather API Key'}
            >
              <KeyRound className={`w-3.5 h-3.5 shrink-0 ${customApiKey ? 'text-amber-500' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">{customApiKey ? 'API Key (Active)' : 'API Key'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-dark-mode"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors shrink-0"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* User Profile / Logout */}
            {user && (
              <div className="flex items-center pl-1.5 sm:pl-2 border-l border-stone-200 dark:border-stone-800 space-x-1.5 sm:space-x-2 shrink-0">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[100px]">
                    {user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-end whitespace-nowrap">
                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5 inline shrink-0" /> MFA Active
                  </span>
                </div>
                <button
                  id="btn-logout"
                  onClick={logout}
                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
