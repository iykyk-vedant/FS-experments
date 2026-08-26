import React, { useState } from 'react';

/**
 * Dashboard Component (Matches Experiment 1 Visuals + React Hooks)
 */
export function Dashboard({ weather, forecast, hourly, cityInfo, loading, error, fetchWeather, unit }) {
  const [searchInput, setSearchInput] = useState('');

  const trendingCities = ['Mumbai', 'London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const toUnit = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    return unit === 'F' ? Math.round((celsius * 9) / 5 + 32) : celsius;
  };

  return (
    <div className="flex-1 flex flex-col my-2">
      {/* Search Bar & Quick Cities */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city (e.g., Tokyo, London, Mumbai)..."
              className="w-full pl-11 pr-10 py-2.5 bg-white/15 hover:bg-white/20 focus:bg-white/25 border border-white/25 rounded-2xl text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all shadow-inner backdrop-blur-md"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {loading ? '...' : 'Go'}
            </button>
          </form>
        </div>

        {/* Quick Cities Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          <span className="text-xs text-white/60 whitespace-nowrap">Trending:</span>
          <div className="flex items-center gap-2">
            {trendingCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => fetchWeather(city)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white transition-all whitespace-nowrap backdrop-blur-md cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Status */}
      {loading && (
        <div className="p-6 glass-panel rounded-3xl text-center text-white font-medium my-4 animate-pulse">
          ⏳ Fetching latest weather data...
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="p-4 bg-red-500/30 border border-red-400/40 rounded-2xl text-white text-sm my-4 backdrop-blur-md">
          ⚠️ {error}
        </div>
      )}

      {/* Weather Forecast Grid */}
      {!loading && weather && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
          {/* Left Column (Hero Card + Weather Metrics Grid + Hourly) */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            {/* Main Weather Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-xs font-medium backdrop-blur-md mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{cityInfo.country || 'Location'}</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">{cityInfo.name}</h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">{weather.localTime}</p>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-3xl sm:text-4xl rounded-3xl bg-white/15 border border-white/20 backdrop-blur-lg shadow-lg">
                    {weather.icon}
                  </div>
                  <span className="text-lg sm:text-xl font-bold capitalize text-white">{weather.condition}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 relative z-10">
                <div className="flex items-baseline">
                  <span className="text-6xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-md">
                    {toUnit(weather.temperature)}
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold ml-1 text-white/90">°{unit}</span>
                </div>

                <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-white/90 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 backdrop-blur-md">
                  <div>
                    <span className="text-white/60 text-xs block">Feels Like</span>
                    <span>{toUnit(weather.feelsLike)}°{unit}</span>
                  </div>
                  <div className="h-6 w-px bg-white/20"></div>
                  <div>
                    <span className="text-white/60 text-xs block">High / Low</span>
                    <span>{toUnit(weather.highTemp)}° / {toUnit(weather.lowTemp)}°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics 6-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Wind</span>
                  <span>💨</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{weather.windSpeed} km/h</div>
              </div>

              <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Humidity</span>
                  <span>💧</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{weather.humidity}%</div>
              </div>

              <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">UV Index</span>
                  <span>☀️</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{weather.uvIndex}</div>
              </div>

              <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Pressure</span>
                  <span>⏲️</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{weather.pressure} hPa</div>
              </div>

              <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Sunrise</span>
                  <span>🌅</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{weather.sunrise}</div>
              </div>

              <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">Sunset</span>
                  <span>🌇</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{weather.sunset}</div>
              </div>
            </div>

            {/* Hourly Forecast Carousel */}
            {hourly.length > 0 && (
              <div className="glass-panel rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Hourly Forecast
                  </h3>
                  <span className="text-xs text-white/60 font-medium">Next 12 Hours</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                  {hourly.map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white/10 border border-white/15 min-w-[85px] backdrop-blur-md text-center">
                      <span className="text-xs font-semibold text-white/80">{item.time}</span>
                      <span className="text-2xl my-2">{item.icon}</span>
                      <span className="text-sm font-bold text-white">{toUnit(item.temp)}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Column (7-Day Forecast) */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel rounded-3xl p-6 shadow-2xl flex flex-col h-full">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                📅 7-Day Forecast
              </h3>

              <div className="flex flex-col gap-2.5 divide-y divide-white/10">
                {forecast.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between text-sm">
                    <span className="font-semibold text-white/90 w-16">{item.day}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs text-white/70">{item.condition}</span>
                    </div>
                    <div className="text-right font-bold text-white">
                      <span>{toUnit(item.max)}°</span>
                      <span className="text-white/50 text-xs ml-1.5">{toUnit(item.min)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
