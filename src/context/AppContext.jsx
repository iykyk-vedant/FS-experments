import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (city) => {
    if (!favorites.some((item) => item.name.toLowerCase() === city.name.toLowerCase())) {
      setFavorites([...favorites, { id: Date.now(), ...city }]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
