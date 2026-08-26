import React from 'react';

/**
 * WeatherCard Component
 * 
 * Demonstrates:
 * 1. Rendering props passed down from state/custom hook
 * 2. Performing simple data formatting and unit conversions
 */
export function WeatherCard({ weather, cityInfo, unit }) {
  if (!weather) return null;

  // Temperature unit conversion helper
  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const currentTemp = convertTemp(weather.temperature);
  const feelsLikeTemp = convertTemp(weather.feelsLike);

  return (
    <div className="weather-card">
      <div className="card-header">
        <div>
          <span className="location-badge">📍 {cityInfo.country || 'Location'}</span>
          <h2 className="city-title">{cityInfo.name}</h2>
          <p className="update-time">Last updated at {weather.time}</p>
        </div>
        <div className="weather-condition-badge">
          <span className="condition-text">{weather.condition}</span>
        </div>
      </div>

      <div className="card-main">
        <div className="temp-display">
          <span className="temp-number">{currentTemp}</span>
          <span className="temp-unit">°{unit}</span>
        </div>

        <div className="temp-details">
          <div className="detail-item">
            <span className="detail-label">Feels Like</span>
            <span className="detail-value">{feelsLikeTemp}°{unit}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">💧 {weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">💨 {weather.windSpeed} km/h</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Air Pressure</span>
            <span className="detail-value">⏲️ {weather.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
