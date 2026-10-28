import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext();

const API_BASE = 'http://127.0.0.1:5000/api/weather';
const AUTH_BASE = 'http://127.0.0.1:5000/api/auth';

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fs_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('fs_token') || null;
  });

  // Login handler connecting to backend /api/auth/login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('fs_token', data.token);
      localStorage.setItem('fs_user', JSON.stringify(data.user));

      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      return { success: false, message: 'Server connection failed. Is backend running?' };
    }
  };

  // Register handler connecting to backend /api/auth/register
  const register = async ({ name, email, password, role = 'user' }) => {
    try {
      const res = await fetch(`${AUTH_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server connection failed. Is backend running?' };
    }
  };

  // Logout handler: clears token, user, and wipes cached favorites immediately
  const logout = () => {
    setUser(null);
    setToken(null);
    setFavorites([]);
    localStorage.removeItem('fs_token');
    localStorage.removeItem('fs_user');
  };

  // Sync Favorites per User: Load user-specific favorites whenever authenticated user changes
  useEffect(() => {
    if (!user || !token) {
      // User is logged out -> clear favorites
      setFavorites([]);
      return;
    }

    async function loadUserFavorites() {
      try {
        const res = await fetch(API_BASE, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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
        console.warn('Backend API unreachable:', err.message);
        setBackendConnected(false);
      }
    }

    loadUserFavorites();
  }, [user, token]);

  const addFavorite = async (city) => {
    if (!user || !token) {
      return { success: false, requireLogin: true };
    }

    if (favorites.some((item) => item.name.toLowerCase() === city.name.toLowerCase())) {
      return { success: true, alreadyExists: true };
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
        return { success: true };
      }
    } catch (e) {
      console.warn('Could not persist to MongoDB:', e.message);
    }

    setFavorites((prev) => [...prev, { id: String(Date.now()), ...city }]);
    return { success: true };
  };

  const removeFavorite = async (id) => {
    if (!token) return;

    try {
      if (id && id.length === 24) {
        await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.warn('Could not delete from MongoDB:', e.message);
    }

    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        backendConnected,
        user,
        token,
        login,
        register,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
