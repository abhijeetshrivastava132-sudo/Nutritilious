const locationBtn = document.getElementById('locationBtn');
const locationSheet = document.getElementById('locationSheet');
const locationBackdrop = document.getElementById('locationBackdrop');
const locationCloseBtn = document.getElementById('locationCloseBtn');
const detectLocationBtn = document.getElementById('detectLocationBtn');
const manualLocationForm = document.getElementById('manualLocationForm');
const manualLocationInput = document.getElementById('manualLocationInput');
const locationTitle = document.getElementById('locationTitle');
const locationSub = document.getElementById('locationSub');
const locationStatus = document.getElementById('locationStatus');

const STORAGE_KEY = 'nutritiliousLocation';
const defaultLocation = {
  title: 'Lajpat Nagar Metro Station',
  sub: 'Lajpat Nagar, Ring Road, New Delhi',
  source: 'default'
};

function setStatus(message, type = '') {
  if (!locationStatus) return;
  locationStatus.textContent = message;
  locationStatus.className = `location-status ${type}`.trim();
}

function getSavedLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function saveLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    setStatus('Location saved for this session only. Browser storage is blocked.', 'error');
  }
}

function updateHeaderLocation(location) {
  const selectedLocation = location || defaultLocation;
  locationTitle.textContent = selectedLocation.title;
  locationSub.textContent = selectedLocation.sub;
}

function openLocationSheet() {
  locationSheet.classList.add('active');
  locationSheet.setAttribute('aria-hidden', 'false');
  setStatus('Choose current location or enter your area manually.');
  setTimeout(() => manualLocationInput.focus(), 120);
}

function closeLocationSheet() {
  locationSheet.classList.remove('active');
  locationSheet.setAttribute('aria-hidden', 'true');
}

function applyManualLocation(event) {
  event.preventDefault();

  const value = manualLocationInput.value.trim();
  if (value.length < 3) {
    setStatus('Enter a proper area or street name.', 'error');
    return;
  }

  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  const location = {
    title: parts[0] || value,
    sub: parts.slice(1).join(', ') || 'Manual location selected',
    source: 'manual'
  };

  updateHeaderLocation(location);
  saveLocation(location);
  setStatus('Location saved successfully.', 'success');
  setTimeout(closeLocationSheet, 450);
}

function applyDetectedLocation(position) {
  const latitude = position.coords.latitude.toFixed(4);
  const longitude = position.coords.longitude.toFixed(4);
  const location = {
    title: 'Current Location',
    sub: `Lat ${latitude}, Long ${longitude}`,
    source: 'gps',
    latitude,
    longitude
  };

  updateHeaderLocation(location);
  saveLocation(location);
  setStatus('Current location saved.', 'success');
  setTimeout(closeLocationSheet, 450);
}

function detectCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus('Your browser does not support location detection. Enter location manually.', 'error');
    return;
  }

  setStatus('Detecting your current location...');
  detectLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      detectLocationBtn.disabled = false;
      applyDetectedLocation(position);
    },
    () => {
      detectLocationBtn.disabled = false;
      setStatus('Location permission denied or unavailable. Enter location manually.', 'error');
    },
    {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 60000
    }
  );
}

function bindLocationEvents() {
  locationBtn?.addEventListener('click', openLocationSheet);
  locationBackdrop?.addEventListener('click', closeLocationSheet);
  locationCloseBtn?.addEventListener('click', closeLocationSheet);
  detectLocationBtn?.addEventListener('click', detectCurrentLocation);
  manualLocationForm?.addEventListener('submit', applyManualLocation);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && locationSheet.classList.contains('active')) {
      closeLocationSheet();
    }
  });
}

updateHeaderLocation(getSavedLocation());
bindLocationEvents();
