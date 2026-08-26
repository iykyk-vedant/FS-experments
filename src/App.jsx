import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { WeatherForm } from './components/WeatherForm';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { HooksGuide } from './components/HooksGuide';
import './App.css';

/**
 * Main App Component for Experiment 2
 * 
 * Demonstrates:
 * 1. Calling the reusable custom hook (useWeather)
 * 2. Managing component state with useState (unit toggle: C or F)
 * 3. Conditional rendering based on loading and error states
 */
export default function App() {
  // Local state to toggle temperature unit between Celsius and Fahrenheit
  const [unit, setUnit] = useState('C');

  // Using our Reusable Custom Hook (useWeather)
  const {
    weather,
    forecast,
    cityInfo,
    loading,
    error,
    fetchWeather
  } = useWeather('Mumbai');

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="app-title">🌦️ React Weather Dashboard</h1>
        <p className="app-subtitle">
          Experiment 2: React Hooks (Forms, Data Fetching & Reusable Custom Hooks)
        </p>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Search & Controls Form */}
        <WeatherForm
          onSearch={fetchWeather}
          unit={unit}
          onToggleUnit={setUnit}
          loading={loading}
        />

        {/* Loading Indicator */}
        {loading && (
          <div className="status-box loading-box">
            <div className="spinner"></div>
            <p>Fetching latest weather data...</p>
          </div>
        )}

        {/* Error Message Box */}
        {error && !loading && (
          <div className="status-box error-box">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Weather Results */}
        {!loading && weather && (
          <>
            <WeatherCard
              weather={weather}
              cityInfo={cityInfo}
              unit={unit}
            />
            <ForecastCard
              forecast={forecast}
              unit={unit}
            />
          </>
        )}

        {/* Educational Reference Guide */}
        <HooksGuide />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Full Stack Experiment 2 • Built with React 19 & Open-Meteo API</p>
      </footer>
    </div>
  );
}
