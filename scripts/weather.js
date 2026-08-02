// ==========================================
// CONFIGURATION ARCHITECTURE & CONFIG STRINGS
// ==========================================
// TODO: Replace this string placeholder with your active 32-character OpenWeather account key
const API_KEY = "YOUR_VALID_OPENWEATHER_API_KEY"; 

// Absolute coordinates for Teton, Idaho (43.8138° N, 111.6708° W)
const TETON_LAT = "43.8138";
const TETON_LON = "-111.6708";

/**
 * Consumes the OpenWeather API endpoint and drives weather template data binding
 */
async function fetchTetonWeather() {
  // Construct the URL dynamically inside the call execution boundary
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${TETON_LAT}&lon=${TETON_LON}&appid=${API_KEY}&units=imperial`;
  
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`API Gateway Network Response Failure: Status ${response.status}`);
    }
    
    const data = await response.json();
    displayWeatherResults(data);
    
  } catch (error) {
    // Fail gracefully on the UI without breaking global code execution loops
    const descriptionEl = document.getElementById('weather-description');
    if (descriptionEl) {
      descriptionEl.textContent = "Weather display temporarily unavailable.";
    }
  }
}

/**
 * Parses the weather response object safely into DOM targeted text/image hooks
 * @param {Object} weatherData - Clean JSON payload map from OpenWeather API
 */
function displayWeatherResults(weatherData) {
  const currentTempEl = document.getElementById('weather-currentTemp');
  const iconEl = document.getElementById('weather-icon');
  const descriptionEl = document.getElementById('weather-description');

  // Verify elements exist in current workspace scope to prevent fatal crash loops
  if (!currentTempEl || !iconEl || !descriptionEl) return;

  // 1. Map Current Temperature - rounded cleanly to whole integers
  if (weatherData.main && typeof weatherData.main.temp !== 'undefined') {
    currentTempEl.innerHTML = `${Math.round(weatherData.main.temp)}&deg;F`;
  }

  // 2. Map Weather Condition Arrays safely checking structural bounds
  if (weatherData.weather && weatherData.weather.length > 0) {
    const weatherDetails = weatherData.weather[0];
    
    // Assign raw description string (CSS handling capitalization layout rules)
    descriptionEl.textContent = weatherDetails.description;
    
    // Construct high-density icon asset parameters
    const iconCode = weatherDetails.icon;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = `Current Weather Condition: ${weatherDetails.description}`;
  }
}

/**
 * Dynamically formats and displays the real-time calendar date inside header nodes
 */
function displayCurrentDate() {
  const dateEl = document.getElementById('current-date');
  if (!dateEl) return;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  
  // Outputs clear scannable format (e.g., "Wednesday, July 8, 2026")
  dateEl.textContent = today.toLocaleDateString('en-US', options);
}

/**
 * Binds active event logic to the Grid vs. List multi-view layout controls
 */
function setupDirectoryViewControls() {
  const gridBtn = document.getElementById('grid-toggle');
  const listBtn = document.getElementById('list-toggle');
  const displayContainer = document.getElementById('directory-display');

  // Skip execution quietly if the user is loading the Home or Join page frameworks
  if (!gridBtn || !listBtn || !displayContainer) return;

  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('active-btn');
    listBtn.classList.remove('active-btn');
    displayContainer.className = 'directory-grid-layout';
  });

  listBtn.addEventListener('click', () => {
    listBtn.classList.add('active-btn');
    gridBtn.classList.remove('active-btn');
    displayContainer.className = 'directory-list-layout';
  });
}

// ==========================================
// RUNTIME BOOTSTRAP INITIALIZATION ENGINE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  displayCurrentDate();
  setupDirectoryViewControls();

  // Auto-populate hidden form submission date for tracking seniority
  const timestampEl = document.getElementById('submission-date');
  if (timestampEl) {
    timestampEl.value = new Date().toISOString();
  }
  
  // Execute API weather collection sequence if container target handles exist on page
  if (document.getElementById('weather-currentTemp')) {
    fetchTetonWeather();
  }
});