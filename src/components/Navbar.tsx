import React from 'react';
import {
  CloudSun,
  ShieldCheck,
  Server,
  Sliders,
  CheckCircle2,
  BookOpen,
  LogOut,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';

interface NavbarProps {
  onOpenCache: () => void;
  onOpenPlayground: () => void;
  onOpenTests: () => void;
  onOpenDocs: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCache,
  onOpenPlayground,
  onOpenTests,
  onOpenDocs,
  darkMode,
  setDarkMode,
}) => {
  const { user, logout } = useAuth();
  const { cacheTelemetry, cacheStatusBanner } = useWeather();

  const hitRatio = cacheTelemetry?.rawCache?.hitRatio ?? 0;

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-sm">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-lg tracking-tight">
                  FIDENZ
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  Analytics
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                Weather Analytics & Comfort Index Engine
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Cache Telemetry Trigger */}
            <button
              id="btn-nav-cache"
              onClick={onOpenCache}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title="Inspect 5-Minute Server Cache Telemetry"
            >
              <Server className="w-3.5 h-3.5 text-emerald-500" />
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title="Live Formula Tuning & Parameter Extensions"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Algorithm</span>
            </button>

            {/* Unit Tests Trigger */}
            <button
              id="btn-nav-tests"
              onClick={onOpenTests}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title="Run Mathematical Unit Tests"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
              <span className="hidden md:inline">Unit Tests</span>
            </button>

            {/* Documentation / README Trigger */}
            <button
              id="btn-nav-docs"
              onClick={onOpenDocs}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title="Assignment Briefing & README"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">README</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-dark-mode"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* User Profile / Logout */}
            {user && (
              <div className="flex items-center pl-2 border-l border-stone-200 dark:border-stone-800 space-x-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[120px]">
                    {user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5 inline" /> MFA Active
                  </span>
                </div>
                <button
                  id="btn-logout"
                  onClick={logout}
                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
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
