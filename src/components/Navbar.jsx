import React from 'react';

/**
 * Navbar Component (Matches Experiment 1 Visuals)
 */
export function Navbar({ activeTab, setActiveTab, unit, setUnit }) {
  const navItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'login', label: '🔐 Login' }
  ];

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        <div className="p-2.5 rounded-2xl bg-white/15 border border-white/20 shadow-lg backdrop-blur-md">
          <svg className="w-8 h-8 text-amber-300 animate-pulse-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
            BadWeather<span className="text-sky-300 font-light">Cast</span>
          </h1>
          <p className="text-xs text-white/70">React Hooks Weather Intelligence</p>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav className="flex items-center gap-1.5 p-1 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === item.id
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Unit Switcher */}
      <div className="flex items-center gap-2">
        <div className="bg-black/20 p-1 rounded-2xl border border-white/20 backdrop-blur-md flex items-center">
          <button
            onClick={() => setUnit('C')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              unit === 'C' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              unit === 'F' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
