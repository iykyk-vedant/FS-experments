import React from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Favorites Component: User-Specific Saved Cities with Auth Protection
 */
export function Favorites({ onSelectCity, setActiveTab }) {
  const { favorites, removeFavorite, backendConnected, user } = useAppContext();

  // 1. GUEST / LOGGED-OUT STATE
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl mb-4">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white">Login to View Favorites</h2>
          <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
            Your saved cities are linked securely to your user account. Please sign in or create an account to access and manage your favorites.
          </p>
          <button
            onClick={() => setActiveTab && setActiveTab('login')}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            🔐 Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // 2. LOGGED-IN STATE
  return (
    <div className="py-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            ⭐ {user.name}'s Saved Cities ({favorites.length})
          </h2>
          <p className="text-xs text-slate-400">
            Account: <span className="text-sky-400 font-mono">{user.email}</span>
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
            backendConnected
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          {backendConnected ? 'MongoDB Live' : 'Local Mode'}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center p-8 bg-slate-900/80 rounded-3xl border border-slate-800">
          <span className="text-4xl">📍</span>
          <p className="text-slate-300 font-semibold mt-3 text-sm">No saved cities yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Search for a city in the Dashboard and click "Add to Favorites" to link it to your account in MongoDB.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md hover:border-slate-700 transition-all"
            >
              <div>
                <h3 className="font-bold text-white text-base">
                  {city.name}{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    ({city.country || 'Location'})
                  </span>
                </h3>
                <p className="text-xs text-sky-400 font-medium mt-0.5">
                  {city.temp}°C • {city.condition}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCity && onSelectCity(city.name)}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={() => removeFavorite(city.id)}
                  className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition-all cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
