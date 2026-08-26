import React from 'react';

/**
 * Home Page Component
 */
export function Home({ setActiveTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-8 sm:p-12 max-w-3xl shadow-xl">
        <span className="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-xs font-semibold mb-4">
          React Hooks Weather Platform
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Real-Time Weather Intelligence & Forecasts
        </h2>
        <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Get hyper-local current conditions, temperature insights, and 5-day forecasts powered by Open-Meteo API.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            Open Live Dashboard →
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className="px-6 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            Sign In to Account
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="text-2xl">⚡</span>
            <h3 className="font-bold text-white mt-2 text-sm">Live Weather</h3>
            <p className="text-xs text-slate-400 mt-1">Instant updates with temperature, wind, and humidity.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="text-2xl">📅</span>
            <h3 className="font-bold text-white mt-2 text-sm">5-Day Outlook</h3>
            <p className="text-xs text-slate-400 mt-1">Daily highs, lows, and weather conditions.</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="text-2xl">🔍</span>
            <h3 className="font-bold text-white mt-2 text-sm">Global Search</h3>
            <p className="text-xs text-slate-400 mt-1">Search any city worldwide in real time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
