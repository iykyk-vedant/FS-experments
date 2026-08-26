import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { useWeather } from './hooks/useWeather';

/**
 * Main App: Experiment 2 (React Hooks, Forms, Data Fetching, Reusable Custom Hook)
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [unit, setUnit] = useState('C');

  // Reusable custom hook for weather data fetching & state management
  const weatherProps = useWeather('Mumbai');

  const currentBg = weatherProps.weather?.bg || 'clear-day';

  return (
    <div className={`min-h-screen weather-bg-${currentBg} text-white transition-colors duration-700 antialiased selection:bg-white/20 selection:text-white relative overflow-x-hidden`}>
      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unit={unit}
          setUnit={setUnit}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 flex flex-col">
          {activeTab === 'home' && (
            <Home setActiveTab={setActiveTab} />
          )}

          {activeTab === 'login' && (
            <Login onLoginSuccess={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              {...weatherProps}
              unit={unit}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Experiment 2: React Hooks (Forms, Data Fetching & Reusable Custom Hooks)</p>
          <p>Powered by Open-Meteo API</p>
        </footer>
      </div>
    </div>
  );
}
