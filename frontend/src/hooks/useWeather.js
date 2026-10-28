import { useState, useEffect, createContext, useContext } from 'react';

// Weather code to condition text helper
const getWeatherDesc = (code) => {
  if (code === 0) return 'Clear Sky ☀️';
  if (code <= 3) return 'Partly Cloudy ⛅';
  if (code <= 48) return 'Foggy 🌫️';
  if (code <= 67) return 'Rainy 🌧️';
  if (code <= 77) return 'Snowy ❄️';
  if (code <= 82) return 'Rain Showers 🌦️';
  return 'Thunderstorm ⛈️';
};

/**
 * Reusable Custom Hook: useWeather
 * Handles API data fetching, loading, error, and weather state
 */
export function useWeather(defaultCity = 'Mumbai') {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cityInfo, setCityInfo] = useState({ name: defaultCity, country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName?.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Geocode search
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error(`City "${cityName}" not found.`);

      const { latitude, longitude, name, country } = geoData.results[0];
      setCityInfo({ name, country });

      // 2. Fetch forecast
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      if (!res.ok) throw new Error('Failed to fetch weather data.');
      const data = await res.json();

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        condition: getWeatherDesc(data.current.weather_code),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      const dailyList = data.daily.time.slice(0, 5).map((date, idx) => ({
        date,
        day: idx === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        max: Math.round(data.daily.temperature_2m_max[idx]),
        min: Math.round(data.daily.temperature_2m_min[idx]),
        condition: getWeatherDesc(data.daily.weather_code[idx])
      }));
      setForecast(dailyList);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(defaultCity);
  }, []);

  return { weather, forecast, cityInfo, loading, error, fetchWeather };
}

// 1. Create Context for global weather state
export const WeatherContext = createContext(null);

// 2. Custom hook to consume WeatherContext easily
export const useWeatherContext = () => useContext(WeatherContext);
