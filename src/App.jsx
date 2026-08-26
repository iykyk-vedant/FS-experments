import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { WeatherForm } from './components/WeatherForm';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import './App.css';

/**
 * Main App Component
 * 
 * Uses:
 * 1. Custom hook (useWeather) for data fetching and state management
 * 2. useState for local temperature unit toggle (Celsius / Fahrenheit)
 * 3. Controlled form and modular display components
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
        <h1 className="app-title">🌦️ Weather Dashboard</h1>
        <p className="app-subtitle">
          Real-time weather forecast & 5-day outlook
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
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Weather Dashboard • Powered by Open-Meteo API</p>
      </footer>
    </div>
  );
}
