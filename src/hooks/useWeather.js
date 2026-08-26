import { useState, useEffect } from 'react';

// Weather code mapping with description and dynamic background class
const weatherMetaMap = {
  0: { desc: 'Clear sky', bg: 'clear-day', icon: '☀️' },
  1: { desc: 'Mainly clear', bg: 'clear-day', icon: '🌤️' },
  2: { desc: 'Partly cloudy', bg: 'cloudy', icon: '⛅' },
  3: { desc: 'Overcast', bg: 'cloudy', icon: '☁️' },
  45: { desc: 'Foggy', bg: 'fog', icon: '🌫️' },
  48: { desc: 'Rime fog', bg: 'fog', icon: '🌫️' },
  51: { desc: 'Light drizzle', bg: 'rain', icon: '🌦️' },
  53: { desc: 'Moderate drizzle', bg: 'rain', icon: '🌦️' },
  55: { desc: 'Dense drizzle', bg: 'rain', icon: '🌧️' },
  61: { desc: 'Slight rain', bg: 'rain', icon: '🌧️' },
  63: { desc: 'Moderate rain', bg: 'rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', bg: 'rain', icon: '⛈️' },
  71: { desc: 'Slight snow', bg: 'snow', icon: '❄️' },
  73: { desc: 'Moderate snow', bg: 'snow', icon: '❄️' },
  75: { desc: 'Heavy snow', bg: 'snow', icon: '❄️' },
  80: { desc: 'Rain showers', bg: 'rain', icon: '🌧️' },
  81: { desc: 'Moderate showers', bg: 'rain', icon: '🌧️' },
  82: { desc: 'Violent showers', bg: 'rain', icon: '🌧️' },
  95: { desc: 'Thunderstorm', bg: 'thunderstorm', icon: '⛈️' },
};

function getWeatherMeta(code, isDay = 1) {
  const meta = weatherMetaMap[code] || { desc: 'Cloudy', bg: 'cloudy', icon: '☁️' };
  let bg = meta.bg;
  if (!isDay && bg === 'clear-day') bg = 'clear-night';
  return { ...meta, bg };
}

/**
 * Reusable Custom Hook: useWeather
 */
export function useWeather(defaultCity = 'Mumbai') {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [cityInfo, setCityInfo] = useState({ name: defaultCity, country: 'India' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName?.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Geocoding search
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results?.length) {
        throw new Error(`Location "${cityName}" not found.`);
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setCityInfo({ name, country: country || '' });

      // 2. Fetch full forecast from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
      const res = await fetch(weatherUrl);
      if (!res.ok) throw new Error('Failed to fetch weather forecast.');

      const data = await res.json();
      const meta = getWeatherMeta(data.current.weather_code, data.current.is_day);

      // Format sunrise and sunset times
      const formatTime = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--');

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        pressure: data.current.surface_pressure,
        uvIndex: data.daily?.uv_index_max?.[0] ?? 5,
        sunrise: formatTime(data.daily?.sunrise?.[0]),
        sunset: formatTime(data.daily?.sunset?.[0]),
        highTemp: Math.round(data.daily?.temperature_2m_max?.[0] ?? data.current.temperature_2m),
        lowTemp: Math.round(data.daily?.temperature_2m_min?.[0] ?? data.current.temperature_2m),
        condition: meta.desc,
        icon: meta.icon,
        bg: meta.bg,
        localTime: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      });

      // 7-day forecast
      if (data.daily?.time) {
        const dailyList = data.daily.time.slice(0, 7).map((date, idx) => {
          const dayMeta = getWeatherMeta(data.daily.weather_code[idx], 1);
          return {
            date,
            day: idx === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            max: Math.round(data.daily.temperature_2m_max[idx]),
            min: Math.round(data.daily.temperature_2m_min[idx]),
            condition: dayMeta.desc,
            icon: dayMeta.icon
          };
        });
        setForecast(dailyList);
      }

      // 24-hour forecast
      if (data.hourly?.time) {
        const currentHour = new Date().getHours();
        const hourlyList = data.hourly.time.slice(currentHour, currentHour + 12).map((timeStr, idx) => {
          const hourIndex = currentHour + idx;
          const hMeta = getWeatherMeta(data.hourly.weather_code[hourIndex], data.hourly.is_day[hourIndex]);
          return {
            time: new Date(timeStr).toLocaleTimeString([], { hour: 'numeric' }),
            temp: Math.round(data.hourly.temperature_2m[hourIndex]),
            icon: hMeta.icon,
            condition: hMeta.desc
          };
        });
        setHourly(hourlyList);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(defaultCity);
  }, []);

  return { weather, forecast, hourly, cityInfo, loading, error, fetchWeather };
}
