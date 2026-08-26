import React from 'react';

/**
 * ForecastCard Component
 * 
 * Demonstrates:
 * 1. Rendering list data with array .map()
 * 2. Proper React key props on list items
 * 3. Responsive display of forecast data
 */
export function ForecastCard({ forecast, unit }) {
  if (!forecast || forecast.length === 0) return null;

  // Temperature unit conversion helper
  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((dayItem, index) => (
          <div key={dayItem.date || index} className="forecast-day-card">
            <div className="forecast-day-name">{dayItem.day}</div>
            <div className="forecast-condition">{dayItem.condition}</div>
            <div className="forecast-temps">
              <span className="max-temp">{convertTemp(dayItem.maxTemp)}°{unit}</span>
              <span className="min-temp">{convertTemp(dayItem.minTemp)}°{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
