import React from 'react';

/**
 * Home Component (Matches Experiment 1 Visuals)
 */
export function Home({ setActiveTab }) {
  return (
    <section className="flex-1 flex flex-col justify-center py-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-xs font-semibold text-sky-200 mb-4 backdrop-blur-md">
          🚀 Next-Gen Weather Intelligence Platform
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Next-Generation Weather Intelligence & Forecasting
        </h2>

        <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
          Experience real-time weather analytics with hyper-accurate hourly forecasts, interactive 7-day outlooks, and dynamic atmospheric visualizations.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:scale-105 transition-all cursor-pointer"
          >
            Open Weather Dashboard →
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-sm backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
          >
            Sign In to Account
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
            <div className="text-2xl">⚡</div>
            <h3 className="font-bold text-base text-white">Live Updates</h3>
            <p className="text-xs text-white/70">Real-time temperature, humidity, wind, and atmospheric pressure at zero latency.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
            <div className="text-2xl">📅</div>
            <h3 className="font-bold text-base text-white">7-Day Forecast</h3>
            <p className="text-xs text-white/70">Plan your week with daily temperature highs, lows, and precipitation probabilities.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
            <div className="text-2xl">📱</div>
            <h3 className="font-bold text-base text-white">Fully Responsive</h3>
            <p className="text-xs text-white/70">Pixel-perfect layout designed for desktop, tablet, and mobile with Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
