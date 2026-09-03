import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { useWeather, WeatherContext } from './hooks/useWeather';

/**
 * Main App: Experiment 2 (React Hooks, Forms, Data Fetching, useContext & Custom Hooks)
 */
export default function App() {
  // Navigation state between pages
  const [activeTab, setActiveTab] = useState('home');

  // Weather custom hook state
  const weatherProps = useWeather('Mumbai');

  return (
    <WeatherContext.Provider value={weatherProps}>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto flex flex-col min-h-[90vh]">
          {/* Navigation Bar */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dynamic Page Views */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <Home setActiveTab={setActiveTab} />
            )}

            {activeTab === 'login' && (
              <Login onLoginSuccess={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard />
            )}
          </main>

          {/* Footer */}
          <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 mt-8">
            Weather Dashboard • Built with React 19 & Tailwind CSS
          </footer>
        </div>
      </div>
    </WeatherContext.Provider>
  );
}
