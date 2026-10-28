import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api/weather';

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);

  // Fetch initial favorites from Docker Backend API on mount
  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch(API_BASE);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item) => ({
            id: item._id,
            name: item.cityName,
            country: item.country,
            temp: item.temperature,
            condition: item.condition
          }));
          setFavorites(mapped);
          setBackendConnected(true);
        }
      } catch (err) {
        console.warn('Backend API not reachable, using local state:', err.message);
        setBackendConnected(false);
      }
    }

    loadFavorites();
  }, []);

  const addFavorite = async (city) => {
    // Check if already in favorites list
    if (favorites.some((item) => item.name.toLowerCase() === city.name.toLowerCase())) {
      return;
    }

    try {
      const payload = {
        cityName: city.name,
        country: city.country || 'Unknown',
        temperature: city.temp || 0,
        condition: city.condition || 'Clear',
        humidity: city.humidity || 50,
        windSpeed: city.windSpeed || 10,
        isFavorite: true
      };

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setFavorites((prev) => [
          ...prev,
          {
            id: saved._id,
            name: saved.cityName,
            country: saved.country,
            temp: saved.temperature,
            condition: saved.condition
          }
        ]);
        setBackendConnected(true);
        return;
      }
    } catch (e) {
      console.warn('Could not persist to backend, saving in memory:', e.message);
    }

    // Fallback to local ID if backend is unavailable
    setFavorites((prev) => [...prev, { id: String(Date.now()), ...city }]);
  };

  const removeFavorite = async (id) => {
    try {
      if (id) {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.warn('Could not delete from backend, removing from local state:', e.message);
    }

    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider value={{ favorites, addFavorite, removeFavorite, backendConnected }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
