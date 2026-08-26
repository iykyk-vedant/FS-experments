import './style.css';
import { searchLocations, fetchWeatherData, getWeatherMeta } from './src/weatherService.js';

// Application State
const state = {
  currentUnit: 'C', // 'C' or 'F'
  currentLocation: {
    name: 'Mumbai',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata'
  },
  weatherData: null,
  trendingCities: [
    { name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' },
    { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
    { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
    { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
    { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
    { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
    { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' }
  ]
};

// Unit Conversion Helpers
function formatTemp(celsius) {
  if (celsius === undefined || celsius === null) return '--';
  if (state.currentUnit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
}

// Icon rendering helper with pure SVG icons
function getSvgIcon(iconName, customClass = 'w-6 h-6') {
  switch (iconName) {
    case 'sun':
      return `<svg class="${customClass} text-amber-300 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
    case 'moon':
      return `<svg class="${customClass} text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    case 'cloud-sun':
      return `<svg class="${customClass} text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`;
    case 'cloud-moon':
      return `<svg class="${customClass} text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`;
    case 'cloud':
      return `<svg class="${customClass} text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`;
    case 'cloud-rain':
    case 'cloud-drizzle':
    case 'cloud-rain-wind':
      return `<svg class="${customClass} text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-2 4m-4-4l-2 4m-4-4l-2 4M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`;
    case 'cloud-snow':
    case 'snowflake':
      return `<svg class="${customClass} text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18m-18 0l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3"/></svg>`;
    case 'zap':
    case 'cloud-lightning':
      return `<svg class="${customClass} text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;
    case 'cloud-fog':
      return `<svg class="${customClass} text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h16M4 18h16M7 10h10a4 4 0 00-4-4 4 4 0 00-3.9 3.1A3 3 0 007 10z"/></svg>`;
    default:
      return `<svg class="${customClass} text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`;
  }
}

// Atmospheric animations injector
function updateAtmosphericBackground(weatherMeta) {
  document.body.className = `min-h-screen weather-bg-${weatherMeta.bg} text-white transition-colors duration-700 antialiased selection:bg-white/20 selection:text-white relative overflow-x-hidden`;

  const container = document.getElementById('weather-effect-container');
  container.innerHTML = '';

  if (weatherMeta.bg.includes('rain')) {
    // Generate rain particles
    for (let i = 0; i < 30; i++) {
      const drop = document.createElement('div');
      drop.className = 'absolute bg-blue-200/40 rounded-full';
      drop.style.width = '1.5px';
      drop.style.height = `${Math.random() * 20 + 15}px`;
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = `${Math.random() * 100}%`;
      drop.style.animation = `floatSlow ${Math.random() * 1 + 0.8}s linear infinite`;
      container.appendChild(drop);
    }
  } else if (weatherMeta.bg.includes('snow')) {
    // Generate snow particles
    for (let i = 0; i < 25; i++) {
      const flake = document.createElement('div');
      flake.className = 'absolute bg-white/60 rounded-full';
      flake.style.width = `${Math.random() * 5 + 3}px`;
      flake.style.height = flake.style.width;
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.top = `${Math.random() * 100}%`;
      flake.style.animation = `floatSlow ${Math.random() * 3 + 2}s ease-in-out infinite`;
      container.appendChild(flake);
    }
  }
}

// Render UI Components
function renderWeatherUI() {
  if (!state.weatherData) return;
  const current = state.weatherData.current;
  const daily = state.weatherData.daily;
  const hourly = state.weatherData.hourly;

  const weatherMeta = getWeatherMeta(current.weather_code, current.is_day);
  updateAtmosphericBackground(weatherMeta);

  // Top info
  document.getElementById('location-name').textContent = state.currentLocation.name;
  document.getElementById('location-country').textContent = state.currentLocation.country || 'Location';

  // Format local time
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  try {
    document.getElementById('local-time').textContent = new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: state.currentLocation.timezone || undefined
    }).format(now);
  } catch {
    document.getElementById('local-time').textContent = now.toLocaleString();
  }

  // Hero Card
  document.getElementById('current-temp').textContent = formatTemp(current.temperature_2m);
  document.getElementById('temp-unit-symbol').textContent = `°${state.currentUnit}`;
  document.getElementById('current-condition-text').textContent = weatherMeta.description;
  document.getElementById('current-weather-icon-box').innerHTML = getSvgIcon(weatherMeta.icon, 'w-10 h-10');

  document.getElementById('current-apparent-temp').textContent = `${formatTemp(current.apparent_temperature)}°${state.currentUnit}`;
  
  if (daily && daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined) {
    document.getElementById('current-high-low').textContent = `${formatTemp(daily.temperature_2m_max[0])}° / ${formatTemp(daily.temperature_2m_min[0])}°`;
  }

  // Metrics
  document.getElementById('metric-wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.getElementById('metric-wind-dir').textContent = `${getWindDirection(current.wind_direction_10m)} • ${Math.round(current.wind_direction_10m)}°`;
  document.getElementById('metric-humidity').textContent = `${current.relative_humidity_2m}%`;

  if (daily && daily.uv_index_max && daily.uv_index_max[0] !== undefined) {
    const uv = daily.uv_index_max[0];
    let uvRating = 'Low';
    if (uv >= 3 && uv < 6) uvRating = 'Mod';
    else if (uv >= 6 && uv < 8) uvRating = 'High';
    else if (uv >= 8) uvRating = 'Very High';
    document.getElementById('metric-uv').innerHTML = `${Math.round(uv)} <span class="text-xs font-normal text-amber-300">${uvRating}</span>`;
  }

  document.getElementById('metric-pressure').textContent = `${Math.round(current.surface_pressure)} hPa`;

  if (daily && daily.sunrise && daily.sunrise[0]) {
    const sunriseTime = new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('metric-sunrise').textContent = sunriseTime;
    document.getElementById('metric-sunset').textContent = sunsetTime;
  }

  // Render 24-Hour Forecast
  renderHourlyForecast(hourly);

  // Render 7-Day Forecast
  renderDailyForecast(daily);
}

function renderHourlyForecast(hourly) {
  const track = document.getElementById('hourly-forecast-track');
  track.innerHTML = '';
  if (!hourly || !hourly.time) return;

  const currentHour = new Date().getHours();
  // Display next 24 hourly steps
  for (let i = 0; i < 24; i++) {
    const timeStr = hourly.time[i];
    const temp = hourly.temperature_2m[i];
    const code = hourly.weather_code[i];
    const isDay = hourly.is_day[i];
    const pop = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;

    const date = new Date(timeStr);
    const hourLabel = i === 0 ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const meta = getWeatherMeta(code, isDay);

    const card = document.createElement('div');
    card.className = `flex-shrink-0 w-20 p-3 rounded-2xl flex flex-col items-center justify-between gap-2 border transition-all ${
      i === 0 ? 'bg-white/25 border-white/40 shadow-lg scale-105' : 'bg-white/10 border-white/10 hover:bg-white/20'
    }`;

    card.innerHTML = `
      <span class="text-xs font-medium text-white/80">${hourLabel}</span>
      <div class="my-1">${getSvgIcon(meta.icon, 'w-6 h-6')}</div>
      <span class="text-sm font-bold text-white">${formatTemp(temp)}°</span>
      ${pop > 10 ? `<span class="text-[10px] text-sky-300 font-semibold flex items-center gap-0.5">💧${pop}%</span>` : ''}
    `;

    track.appendChild(card);
  }
}

function renderDailyForecast(daily) {
  const container = document.getElementById('daily-forecast-container');
  container.innerHTML = '';
  if (!daily || !daily.time) return;

  for (let i = 0; i < daily.time.length; i++) {
    const date = new Date(daily.time[i]);
    const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const maxTemp = daily.temperature_2m_max[i];
    const minTemp = daily.temperature_2m_min[i];
    const code = daily.weather_code[i];
    const pop = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;
    const meta = getWeatherMeta(code, 1);

    const row = document.createElement('div');
    row.className = 'pt-2.5 flex items-center justify-between gap-3 text-sm hover:bg-white/5 px-2 py-1.5 rounded-xl transition-colors';

    row.innerHTML = `
      <div class="w-24">
        <span class="font-bold text-white block">${dayName}</span>
        <span class="text-xs text-white/60 block">${formattedDate}</span>
      </div>
      <div class="flex items-center gap-2 flex-1 justify-center">
        ${getSvgIcon(meta.icon, 'w-5 h-5')}
        <span class="text-xs text-white/80 hidden sm:inline truncate max-w-[100px]">${meta.description}</span>
      </div>
      ${pop > 15 ? `<span class="text-xs text-sky-300 font-medium">💧 ${pop}%</span>` : '<span class="text-xs text-transparent">00%</span>'}
      <div class="flex items-center gap-2 font-semibold text-right">
        <span class="text-white">${formatTemp(maxTemp)}°</span>
        <span class="text-white/50 text-xs">${formatTemp(minTemp)}°</span>
      </div>
    `;

    container.appendChild(row);
  }
}

function renderTrendingCities() {
  const container = document.getElementById('quick-cities');
  container.innerHTML = '';

  state.trendingCities.forEach(city => {
    const btn = document.createElement('button');
    btn.className = `px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border transition-all whitespace-nowrap ${
      city.name === state.currentLocation.name
        ? 'bg-white text-slate-900 border-white shadow-md'
        : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/20'
    }`;
    btn.textContent = city.name;
    btn.addEventListener('click', () => selectLocation(city));
    container.appendChild(btn);
  });
}

// Load Weather Routine
async function loadWeather(location) {
  try {
    state.currentLocation = location;
    renderTrendingCities();
    const data = await fetchWeatherData(location.latitude, location.longitude, location.timezone);
    state.weatherData = data;
    renderWeatherUI();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function selectLocation(loc) {
  loadWeather(loc);
  const dropdown = document.getElementById('suggestions-dropdown');
  dropdown.classList.add('hidden');
  document.getElementById('search-input').value = '';
}

// Event Listeners Setup
function initApp() {
  setupNavigation();
  renderTrendingCities();
  loadWeather(state.currentLocation);

  // Unit Switcher
  const btnC = document.getElementById('unit-c');
  const btnF = document.getElementById('unit-f');

  btnC.addEventListener('click', () => {
    if (state.currentUnit === 'C') return;
    state.currentUnit = 'C';
    btnC.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-900 shadow-md';
    btnF.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all text-white/80 hover:text-white';
    renderWeatherUI();
  });

  btnF.addEventListener('click', () => {
    if (state.currentUnit === 'F') return;
    state.currentUnit = 'F';
    btnF.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-white text-slate-900 shadow-md';
    btnC.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all text-white/80 hover:text-white';
    renderWeatherUI();
  });

  // Search input debounced autocomplete
  const searchInput = document.getElementById('search-input');
  const dropdown = document.getElementById('suggestions-dropdown');
  let debounceTimeout = null;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    const val = e.target.value.trim();
    if (val.length < 2) {
      dropdown.classList.add('hidden');
      return;
    }

    debounceTimeout = setTimeout(async () => {
      try {
        const results = await searchLocations(val);
        if (!results || results.length === 0) {
          dropdown.innerHTML = '<div class="p-3 text-xs text-white/70 text-center">No locations found</div>';
          dropdown.classList.remove('hidden');
          return;
        }

        dropdown.innerHTML = '';
        results.forEach(item => {
          const opt = document.createElement('div');
          opt.className = 'p-3 hover:bg-white/15 cursor-pointer flex items-center justify-between text-xs transition-colors';
          opt.innerHTML = `
            <div>
              <span class="font-bold text-white">${item.name}</span>
              ${item.admin1 ? `<span class="text-white/60">, ${item.admin1}</span>` : ''}
            </div>
            <span class="text-white/50">${item.country || ''}</span>
          `;
          opt.addEventListener('click', () => {
            selectLocation({
              name: item.name,
              country: item.country || '',
              latitude: item.latitude,
              longitude: item.longitude,
              timezone: item.timezone || 'auto'
            });
          });
          dropdown.appendChild(opt);
        });

        dropdown.classList.remove('hidden');
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
  });

  // Search form enter key
  document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    const results = await searchLocations(query);
    if (results && results.length > 0) {
      selectLocation({
        name: results[0].name,
        country: results[0].country || '',
        latitude: results[0].latitude,
        longitude: results[0].longitude,
        timezone: results[0].timezone || 'auto'
      });
    }
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-form') && !e.target.closest('#suggestions-dropdown')) {
      dropdown.classList.add('hidden');
    }
  });

  // Geolocation button
  document.getElementById('locate-me-btn')?.addEventListener('click', () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          loadWeather({
            name: 'My Location',
            country: 'GPS Coords',
            latitude: lat,
            longitude: lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        },
        (err) => {
          alert('Unable to retrieve your location. Please check browser permissions.');
        }
      );
    }
  });
}

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

  function switchView(targetView) {
    // Toggle active views
    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === targetView) {
          views[key].classList.remove('hidden');
        } else {
          views[key].classList.add('hidden');
        }
      }
    });

    // Toggle nav button active styles
    Object.keys(navBtns).forEach(key => {
      if (navBtns[key]) {
        if (key === targetView) {
          navBtns[key].className = 'px-4 py-2 rounded-xl text-sm font-bold transition-all bg-white text-slate-900 shadow-md';
        } else {
          navBtns[key].className = 'px-4 py-2 rounded-xl text-sm font-semibold transition-all text-white/80 hover:text-white';
        }
      }
    });
  }

  // Nav button listeners
  navBtns.home?.addEventListener('click', () => switchView('home'));
  navBtns.dashboard?.addEventListener('click', () => switchView('dashboard'));
  navBtns.login?.addEventListener('click', () => switchView('login'));
  document.getElementById('brand-logo')?.addEventListener('click', () => switchView('dashboard'));

  // Home CTA listeners
  document.getElementById('home-cta-dashboard')?.addEventListener('click', () => switchView('dashboard'));
  document.getElementById('home-cta-login')?.addEventListener('click', () => switchView('login'));

  // Login form handler
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Logged in successfully! Redirecting to Dashboard...');
    switchView('dashboard');
  });

  document.getElementById('login-switch-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Registration form will be connected in future backend experiment.');
  });
}

// Start app
initApp();

