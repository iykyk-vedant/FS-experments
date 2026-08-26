import './style.css';

// State
const state = {
  currentUnit: 'C',
  city: 'Mumbai'
};

const popularCities = ['Mumbai', 'Delhi', 'London', 'Tokyo', 'New York', 'Paris'];

// Weather code description helper
function getWeatherDesc(code) {
  if (code === 0) return 'Clear Sky ☀️';
  if (code <= 3) return 'Partly Cloudy ⛅';
  if (code <= 48) return 'Foggy 🌫️';
  if (code <= 67) return 'Rainy 🌧️';
  if (code <= 77) return 'Snowy ❄️';
  if (code <= 82) return 'Rain Showers 🌦️';
  return 'Thunderstorm ⛈️';
}

function toUnit(celsius) {
  if (state.currentUnit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// Fetch and render weather
async function loadWeather(cityName) {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    if (!geoData.results?.length) {
      alert(`City "${cityName}" not found.`);
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    const data = await weatherRes.json();

    state.currentData = data;
    state.currentCity = { name, country };

    renderWeather();
  } catch (err) {
    console.error('Failed to load weather:', err);
  }
}

function renderWeather() {
  if (!state.currentData || !state.currentCity) return;
  const { current, daily } = state.currentData;

  document.getElementById('location-name').textContent = state.currentCity.name;
  document.getElementById('location-country').textContent = `📍 ${state.currentCity.country || 'Location'}`;
  document.getElementById('current-condition-text').textContent = getWeatherDesc(current.weather_code);
  document.getElementById('current-temp').textContent = toUnit(current.temperature_2m);
  document.getElementById('temp-unit-symbol').textContent = `°${state.currentUnit}`;
  document.getElementById('current-apparent-temp').textContent = `${toUnit(current.apparent_temperature)}°${state.currentUnit}`;
  document.getElementById('metric-humidity').textContent = `💧 ${current.relative_humidity_2m}%`;
  document.getElementById('metric-wind').textContent = `💨 ${current.wind_speed_10m} km/h`;
  document.getElementById('local-time').textContent = `Updated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // Render 5-day forecast
  const forecastContainer = document.getElementById('daily-forecast-container');
  forecastContainer.innerHTML = '';

  daily.time.slice(0, 5).forEach((dateStr, idx) => {
    const dayName = idx === 0 ? 'Today' : new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
    const max = toUnit(daily.temperature_2m_max[idx]);
    const min = toUnit(daily.temperature_2m_min[idx]);
    const cond = getWeatherDesc(daily.weather_code[idx]);

    const card = document.createElement('div');
    card.className = 'bg-slate-900/70 border border-slate-700/80 p-3 rounded-xl text-center';
    card.innerHTML = `
      <span class="text-xs font-bold text-white block">${dayName}</span>
      <span class="text-xs text-slate-400 my-1 block">${cond}</span>
      <div class="text-xs font-bold text-sky-400 mt-1">
        ${max}° / <span class="text-slate-500">${min}°</span>
      </div>
    `;
    forecastContainer.appendChild(card);
  });
}

// Navigation View Switcher
function setupNavigation() {
  const views = {
    home: document.getElementById('view-home'),
    login: document.getElementById('view-login'),
    dashboard: document.getElementById('view-dashboard')
  };

  const navBtns = {
    home: document.getElementById('nav-btn-home'),
    login: document.getElementById('nav-btn-login'),
    dashboard: document.getElementById('nav-btn-dashboard')
  };

  function switchView(target) {
    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === target) {
          views[key].classList.remove('hidden');
        } else {
          views[key].classList.add('hidden');
        }
      }
    });

    Object.keys(navBtns).forEach(key => {
      if (navBtns[key]) {
        if (key === target) {
          navBtns[key].className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-sky-500 text-white shadow-md font-bold';
        } else {
          navBtns[key].className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all text-slate-300 hover:text-white hover:bg-slate-700/50';
        }
      }
    });
  }

  navBtns.home?.addEventListener('click', () => switchView('home'));
  navBtns.dashboard?.addEventListener('click', () => switchView('dashboard'));
  navBtns.login?.addEventListener('click', () => switchView('login'));
  document.getElementById('brand-logo')?.addEventListener('click', () => switchView('home'));
  document.getElementById('home-cta-dashboard')?.addEventListener('click', () => switchView('dashboard'));
  document.getElementById('home-cta-login')?.addEventListener('click', () => switchView('login'));

  // Login form handler
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('login-alert');
    alertBox.className = 'mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs block';
    alertBox.textContent = '✅ Logged in successfully! Redirecting...';
    setTimeout(() => {
      alertBox.className = 'hidden';
      switchView('dashboard');
    }, 800);
  });
}

// Quick City Buttons
function setupQuickCities() {
  const container = document.getElementById('quick-cities');
  container.innerHTML = '';
  popularCities.forEach(city => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-2.5 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-all cursor-pointer';
    btn.textContent = city;
    btn.addEventListener('click', () => loadWeather(city));
    container.appendChild(btn);
  });
}

// Setup Event Listeners
function init() {
  setupNavigation();
  setupQuickCities();

  // Search form
  document.getElementById('search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
      loadWeather(query);
      document.getElementById('search-input').value = '';
    }
  });

  // Unit switcher
  const btnC = document.getElementById('unit-c');
  const btnF = document.getElementById('unit-f');

  btnC?.addEventListener('click', () => {
    state.currentUnit = 'C';
    btnC.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-sky-500 text-white';
    btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400';
    renderWeather();
  });

  btnF?.addEventListener('click', () => {
    state.currentUnit = 'F';
    btnF.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-sky-500 text-white';
    btnC.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-400';
    renderWeather();
  });

  // Initial load
  loadWeather('Mumbai');
}

init();
