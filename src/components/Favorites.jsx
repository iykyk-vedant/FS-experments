import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Favorites Component: Consumes global favorites state and removeFavorite action
 */
export function Favorites({ onSelectCity }) {
  const { favorites, removeFavorite } = useContext(AppContext);

  return (
    <div className="py-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-white">
          ⭐ Saved Cities ({favorites.length})
        </h2>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center p-8 bg-slate-800/60 rounded-3xl border border-slate-700">
          <span className="text-4xl">📍</span>
          <p className="text-slate-300 font-semibold mt-3 text-sm">No saved cities yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Search for a city in the Dashboard and click "Add to Favorites" to save it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between p-4 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-md hover:border-slate-600 transition-all"
            >
              <div>
                <h3 className="font-bold text-white text-base">
                  {city.name} <span className="text-xs text-slate-400 font-normal">({city.country || 'Location'})</span>
                </h3>
                <p className="text-xs text-sky-400 font-medium mt-0.5">
                  {city.temp}°C • {city.condition}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCity(city.name)}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  View
                </button>
                <button
                  onClick={() => removeFavorite(city.id)}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-xl border border-red-500/30 transition-all cursor-pointer"
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
