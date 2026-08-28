import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { WeatherDashboard } from './components/WeatherDashboard';
import { DocumentationModal } from './components/DocumentationModal';
import { CacheTelemetryModal } from './components/CacheTelemetryModal';
import { FormulaPlaygroundModal } from './components/FormulaPlaygroundModal';
import { UnitTestModal } from './components/UnitTestModal';
import { ApiKeyModal } from './components/ApiKeyModal';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fidenz_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showCacheModal, setShowCacheModal] = useState(false);
  const [showPlaygroundModal, setShowPlaygroundModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fidenz_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fidenz_theme', 'light');
    }
  }, [darkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        onOpenCache={() => setShowCacheModal(true)}
        onOpenPlayground={() => setShowPlaygroundModal(true)}
        onOpenTests={() => setShowTestsModal(true)}
        onOpenDocs={() => setShowDocsModal(true)}
        onOpenApiKey={() => setShowApiKeyModal(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main View Area (Auth Protected) */}
      <div className="flex-1">
        {user ? (
          <WeatherDashboard
            showCacheModal={showCacheModal}
            setShowCacheModal={setShowCacheModal}
            showPlaygroundModal={showPlaygroundModal}
            setShowPlaygroundModal={setShowPlaygroundModal}
            showTestsModal={showTestsModal}
            setShowTestsModal={setShowTestsModal}
            showDocsModal={showDocsModal}
            setShowDocsModal={setShowDocsModal}
          />
        ) : (
          <>
            <LoginView />
            <DocumentationModal
              isOpen={showDocsModal}
              onClose={() => setShowDocsModal(false)}
            />
            <UnitTestModal
              isOpen={showTestsModal}
              onClose={() => setShowTestsModal(false)}
            />
            <CacheTelemetryModal
              isOpen={showCacheModal}
              onClose={() => setShowCacheModal(false)}
            />
            <FormulaPlaygroundModal
              isOpen={showPlaygroundModal}
              onClose={() => setShowPlaygroundModal(false)}
            />
          </>
        )}

        {/* Global API Key Configuration Modal */}
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
        />
      </div>

      {/* Bottom Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Fidenz Technologies • Trainee Software Engineer Take-Home Technical Evaluation
          </span>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>OpenWeatherMap API 2.5</span>
            <span>•</span>
            <span>Auth0 / JWT + MFA</span>
            <span>•</span>
            <span>Server Caching (300s TTL)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </AuthProvider>
  );
}
