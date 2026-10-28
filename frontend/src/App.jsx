import React, { useState } from 'react';
import { DockerBanner } from './components/DockerBanner';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Favorites } from './components/Favorites';
import { useWeather, WeatherContext } from './hooks/useWeather';

/**
 * Main App: Full-Stack Docker Application
 * Integrates the Weather Forecast System with Dockerization verification
 */
export default function App() {
  // Navigation state between pages
  const [activeTab, setActiveTab] = useState('home');

  // Weather custom hook state
  const weatherProps = useWeather('Mumbai');

  return (
    <WeatherContext.Provider value={weatherProps}>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto flex flex-col min-h-[90vh]">
          {/* Experiment 7 Docker Verification Banner */}
          <DockerBanner />

          {/* Navigation Bar */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dynamic Page Views */}
          <main className="flex-1 mt-6">
            {activeTab === 'home' && (
              <Home setActiveTab={setActiveTab} />
            )}

            {activeTab === 'login' && (
              <Login onLoginSuccess={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard />
            )}

            {activeTab === 'favorites' && (
              <Favorites
                onSelectCity={(city) => {
                  weatherProps.fetchWeather(city);
                  setActiveTab('dashboard');
                }}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 mt-8">
            WeatherCast Application • Containerized with Docker & Docker Compose
          </footer>
        </div>
      </div>
    </WeatherContext.Provider>
  );
}
