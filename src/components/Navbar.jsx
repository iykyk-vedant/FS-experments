import React from 'react';

/**
 * Navbar Component: Navigation between Home, Dashboard, and Login
 */
export function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'login', label: '🔐 Login' }
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="text-2xl">🌦️</span>
        <h1 className="text-xl font-black text-white">Weather<span className="text-sky-400">Cast</span></h1>
      </div>

      <nav className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === item.id
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
