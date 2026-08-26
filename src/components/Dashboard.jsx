import React, { useState } from 'react';

/**
 * Dashboard Component: Search form, unit toggle, and weather forecast display
 */
export function Dashboard({ weather, forecast, cityInfo, loading, error, fetchWeather }) {
  const [searchInput, setSearchInput] = useState('');
  const [unit, setUnit] = useState('C');

  const popularCities = ['Mumbai', 'Delhi', 'London', 'Tokyo', 'New York', 'Paris'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const toUnit = (celsius) => (unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius);

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Search Bar & Controls */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city (e.g. London, Tokyo)..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        {/* Quick Select Cities & Unit Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-700/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Quick:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => fetchWeather(city)}
                className="px-2.5 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-all cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setUnit('C')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${unit === 'C' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${unit === 'F' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Error Status */}
      {loading && (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl text-center text-sky-400 text-sm">
          ⏳ Loading weather data...
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Weather Results */}
      {!loading && weather && (
        <div className="flex flex-col gap-6">
          {/* Main Weather Card */}
          <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                  📍 {cityInfo.country || 'Location'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">{cityInfo.name}</h2>
                <p className="text-xs text-slate-400 mt-1">Updated at {weather.time}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-sky-400">{weather.condition}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="flex items-baseline">
                <span className="text-6xl sm:text-7xl font-black text-white">{toUnit(weather.temperature)}</span>
                <span className="text-3xl font-bold text-slate-400 ml-1">°{unit}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs w-full sm:w-auto">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="text-slate-400 block">Feels Like</span>
                  <span className="font-bold text-white text-sm">{toUnit(weather.feelsLike)}°{unit}</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="text-slate-400 block">Humidity</span>
                  <span className="font-bold text-white text-sm">💧 {weather.humidity}%</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="text-slate-400 block">Wind</span>
                  <span className="font-bold text-white text-sm">💨 {weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          {forecast.length > 0 && (
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">📅 5-Day Outlook</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {forecast.map((item) => (
                  <div key={item.date} className="bg-slate-900/70 border border-slate-700/80 p-3 rounded-xl text-center">
                    <span className="text-xs font-bold text-white block">{item.day}</span>
                    <span className="text-xs text-slate-400 my-1 block">{item.condition}</span>
                    <div className="text-xs font-bold text-sky-400 mt-1">
                      {toUnit(item.max)}° / <span className="text-slate-500">{toUnit(item.min)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
