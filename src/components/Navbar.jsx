import React from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Navbar Component: Navigation between Home, Dashboard, Favorites, Live Chat, and Auth State
 */
export function Navbar({ activeTab, setActiveTab }) {
  const { favorites, user, logout } = useAppContext();

  const navItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'favorites', label: `⭐ Favorites (${favorites.length})` },
    { id: 'chat', label: '💬 Live Chat' }
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: '🛡️ Admin' });
  }

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };

  return (
    <header className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="text-2xl">🌦️</span>
        <h1 className="text-xl font-black text-white">Weather<span className="text-sky-400">Cast</span></h1>
      </div>

      {/* Nav items */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <nav className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Dynamic Auth Section (Separation between logged-in and guest) */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-medium transition"
                title="View Profile"
              >
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold">{user.name}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                    user.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {user.role}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition"
                title="Sign out"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                activeTab === 'login'
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                  : 'bg-slate-900 text-sky-400 border-sky-500/30 hover:bg-sky-500/10'
              }`}
            >
              🔐 Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
