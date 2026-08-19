// WMO Weather Interpretation Codes mapping (Open-Meteo standard)
export const weatherCodeMap = {
  0: { description: 'Clear sky', icon: 'sun', bg: 'clear-day', isNightAlt: 'moon' },
  1: { description: 'Mainly clear', icon: 'sun', bg: 'clear-day', isNightAlt: 'moon' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun', bg: 'cloudy', isNightAlt: 'cloud-moon' },
  3: { description: 'Overcast', icon: 'cloud', bg: 'cloudy', isNightAlt: 'cloud' },
  45: { description: 'Foggy', icon: 'cloud-fog', bg: 'fog', isNightAlt: 'cloud-fog' },
  48: { description: 'Depositing rime fog', icon: 'cloud-fog', bg: 'fog', isNightAlt: 'cloud-fog' },
  51: { description: 'Light drizzle', icon: 'cloud-drizzle', bg: 'rain', isNightAlt: 'cloud-drizzle' },
  53: { description: 'Moderate drizzle', icon: 'cloud-drizzle', bg: 'rain', isNightAlt: 'cloud-drizzle' },
  55: { description: 'Dense drizzle', icon: 'cloud-rain', bg: 'rain', isNightAlt: 'cloud-rain' },
  56: { description: 'Light freezing drizzle', icon: 'cloud-snow', bg: 'snow', isNightAlt: 'cloud-snow' },
  57: { description: 'Dense freezing drizzle', icon: 'cloud-snow', bg: 'snow', isNightAlt: 'cloud-snow' },
  61: { description: 'Slight rain', icon: 'cloud-rain', bg: 'rain', isNightAlt: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain', bg: 'rain', isNightAlt: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-lightning', bg: 'rain', isNightAlt: 'cloud-lightning' },
  66: { description: 'Freezing rain', icon: 'cloud-snow', bg: 'snow', isNightAlt: 'cloud-snow' },
  67: { description: 'Heavy freezing rain', icon: 'cloud-snow', bg: 'snow', isNightAlt: 'cloud-snow' },
  71: { description: 'Slight snow fall', icon: 'snowflake', bg: 'snow', isNightAlt: 'snowflake' },
  73: { description: 'Moderate snow fall', icon: 'snowflake', bg: 'snow', isNightAlt: 'snowflake' },
  75: { description: 'Heavy snow fall', icon: 'snowflake', bg: 'snow', isNightAlt: 'snowflake' },
  77: { description: 'Snow grains', icon: 'snowflake', bg: 'snow', isNightAlt: 'snowflake' },
  80: { description: 'Slight rain showers', icon: 'cloud-rain', bg: 'rain', isNightAlt: 'cloud-rain' },
  81: { description: 'Moderate rain showers', icon: 'cloud-rain', bg: 'rain', isNightAlt: 'cloud-rain' },
  82: { description: 'Violent rain showers', icon: 'cloud-rain-wind', bg: 'rain', isNightAlt: 'cloud-rain-wind' },
  85: { description: 'Slight snow showers', icon: 'cloud-snow', bg: 'snow', isNightAlt: 'cloud-snow' },
  86: { description: 'Heavy snow showers', icon: 'cloud-snow', bg: 'snow', isNightAlt: 'cloud-snow' },
  95: { description: 'Thunderstorm', icon: 'zap', bg: 'thunderstorm', isNightAlt: 'zap' },
  96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning', bg: 'thunderstorm', isNightAlt: 'cloud-lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning', bg: 'thunderstorm', isNightAlt: 'cloud-lightning' },
};

export function getWeatherMeta(code, isDay = 1) {
  const meta = weatherCodeMap[code] || {
    description: 'Unknown',
    icon: 'cloud',
    bg: 'cloudy',
    isNightAlt: 'cloud'
  };

  let icon = meta.icon;
  let bg = meta.bg;

  if (!isDay) {
    icon = meta.isNightAlt || meta.icon;
    if (bg === 'clear-day') bg = 'clear-night';
  }

  return { ...meta, icon, bg };
}

/**
 * Geocode search using Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search locations');
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetch Forecast Data from Open-Meteo
 */
export async function fetchWeatherData(lat, lon, timezone = 'auto') {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=${encodeURIComponent(timezone)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather forecast');
  return await res.json();
}
