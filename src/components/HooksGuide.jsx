import React from 'react';

/**
 * HooksGuide Component
 * 
 * Simple educational component explaining the React concepts implemented in this experiment.
 */
export function HooksGuide() {
  return (
    <div className="hooks-guide-card">
      <h3 className="guide-title">📚 React Hooks Concepts Used in this Experiment</h3>
      <div className="guide-grid">
        <div className="guide-box">
          <h4>1. <code>useState</code> Hook</h4>
          <p>
            Used for handling local state such as <strong>form input text</strong>, <strong>temperature unit (°C / °F)</strong>, and loading/error states.
          </p>
        </div>

        <div className="guide-box">
          <h4>2. <code>useEffect</code> Hook</h4>
          <p>
            Used for <strong>side effects</strong> (data fetching). Runs when the component mounts to automatically fetch initial weather data.
          </p>
        </div>

        <div className="guide-box">
          <h4>3. Reusable Custom Hook (<code>useWeather</code>)</h4>
          <p>
            Encapsulates the <strong>fetch API logic</strong>, loading state, error handling, and refetching into a clean, reusable function.
          </p>
        </div>

        <div className="guide-box">
          <h4>4. Controlled Forms</h4>
          <p>
            Form inputs are controlled using React state with <code>value</code> and <code>onChange</code>, submitted cleanly with <code>e.preventDefault()</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
