import React, { useState } from 'react';

/**
 * WeatherForm Component
 * 
 * Demonstrates:
 * 1. React Forms with Controlled Input (useState)
 * 2. Form Submit event handling (e.preventDefault)
 * 3. Form input validation
 * 4. Passing data back to parent component via callback props
 */
export function WeatherForm({ onSearch, unit, onToggleUnit, loading }) {
  // useState Hook to manage the input field value (Controlled Form Input)
  const [cityInput, setCityInput] = useState('');
  const [validationError, setValidationError] = useState('');

  // Popular cities for quick 1-click search
  const popularCities = ['Mumbai', 'Delhi', 'London', 'New York', 'Tokyo', 'Paris'];

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents full page reload on submit

    // Basic Form Validation
    if (!cityInput.trim()) {
      setValidationError('Please enter a city name before searching.');
      return;
    }

    setValidationError('');
    onSearch(cityInput.trim());
    setCityInput(''); // Clear input after search
  };

  // Quick City Click Handler
  const handleQuickCityClick = (city) => {
    setValidationError('');
    onSearch(city);
  };

  return (
    <div className="form-container">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="weather-form">
        <div className="input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name (e.g. London, Mumbai)..."
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={loading}
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>

        {/* Form Validation Feedback */}
        {validationError && (
          <p className="validation-error">⚠️ {validationError}</p>
        )}
      </form>

      {/* Quick Select Cities & Unit Toggle Bar */}
      <div className="form-controls">
        <div className="quick-cities">
          <span className="label">Quick Search:</span>
          {popularCities.map((city) => (
            <button
              key={city}
              type="button"
              className="btn-quick-city"
              onClick={() => handleQuickCityClick(city)}
              disabled={loading}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Unit Toggle (°C / °F) */}
        <div className="unit-toggle">
          <span className="label">Unit:</span>
          <button
            type="button"
            className={`btn-unit ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleUnit('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={`btn-unit ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleUnit('F')}
          >
            °F
          </button>
        </div>
      </div>
    </div>
  );
}
