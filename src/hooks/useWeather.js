import { useState, useEffect } from 'react';

/**
 * Weather interpretation code helper (WMO Standard used by Open-Meteo)
 */
function getWeatherDescription(code) {
  if (code === 0) return 'Clear Sky ☀️';
  if (code === 1 || code === 2) return 'Partly Cloudy ⛅';
  if (code === 3) return 'Overcast / Cloudy ☁️';
  if (code >= 45 && code <= 48) return 'Foggy 🌫️';
  if (code >= 51 && code <= 55) return 'Drizzle 🌦️';
  if (code >= 61 && code <= 67) return 'Rain 🌧️';
  if (code >= 71 && code <= 77) return 'Snow ❄️';
  if (code >= 80 && code <= 82) return 'Rain Showers 🌧️';
  if (code >= 95) return 'Thunderstorm ⛈️';
  return 'Cloudy ☁️';
}

/**
 * Reusable Custom Hook: useWeather
 * 
 * Demonstrates:
 * 1. State management with useState (weather, forecast, loading, error)
 * 2. Side effects with useEffect (data fetching on initial load)
 * 3. Reusable business logic encapsulated in a custom hook function
 */
export function useWeather(defaultCity = 'Mumbai') {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cityInfo, setCityInfo] = useState({ name: defaultCity, country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Function to fetch weather for a given city name
   */
  const fetchWeather = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
      setError('Please enter a valid city name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Geocoding - convert city name to coordinates (lat, lon)
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City "${cityName}" not found. Please try another city.`);
      }

      const location = geoData.results[0];
      const { latitude, longitude, name, country } = location;

      // Update City Information
      setCityInfo({ name, country });

      // Step 2: Fetch Current Weather and 5-Day Forecast
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data from server.');
      }

      const weatherData = await weatherResponse.json();

      // Set Current Weather
      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m),
        feelsLike: Math.round(weatherData.current.apparent_temperature),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        pressure: weatherData.current.surface_pressure,
        weatherCode: weatherData.current.weather_code,
        condition: getWeatherDescription(weatherData.current.weather_code),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Set 5-Day Forecast
      if (weatherData.daily && weatherData.daily.time) {
        const dailyList = weatherData.daily.time.slice(0, 5).map((dateStr, index) => {
          const dateObj = new Date(dateStr);
          const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          return {
            date: dateStr,
            day: dayName,
            maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
            minTemp: Math.round(weatherData.daily.temperature_2m_min[index]),
            weatherCode: weatherData.daily.weather_code[index],
            condition: getWeatherDescription(weatherData.daily.weather_code[index]),
          };
        });
        setForecast(dailyList);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect Hook: Fetch default city weather once when component mounts
  useEffect(() => {
    fetchWeather(defaultCity);
  }, []);

  // Return the states and the fetch action for any component to use
  return {
    weather,
    forecast,
    cityInfo,
    loading,
    error,
    fetchWeather
  };
}
