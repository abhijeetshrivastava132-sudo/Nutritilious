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
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

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

function getReadableAddressParts(address = {}) {
  const title =
    address.neighbourhood ||
    address.suburb ||
    address.quarter ||
    address.road ||
    address.village ||
    address.town ||
    address.city ||
    address.county ||
    'Current Location';

  const city = address.city || address.town || address.village || address.county || '';
  const state = address.state || '';
  const country = address.country || '';
  const sub = [address.road, city, state, country]
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .join(', ');

  return {
    title,
    sub: sub || 'Detected from GPS'
  };
}

async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: latitude,
    lon: longitude,
    zoom: '18',
    addressdetails: '1',
    'accept-language': 'en'
  });

  const response = await fetch(`${REVERSE_GEOCODE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Reverse geocoding failed');
  }

  const result = await response.json();
  if (!result || (!result.address && !result.display_name)) {
    throw new Error('No readable address found');
  }

  const readable = getReadableAddressParts(result.address || {});

  return {
    title: readable.title,
    sub: readable.sub || result.display_name,
    fullAddress: result.display_name || readable.sub
  };
}

function createGpsFallbackLocation(latitude, longitude) {
  return {
    title: 'Current Location',
    sub: `Lat ${latitude}, Long ${longitude}`,
    source: 'gps',
    latitude,
    longitude
  };
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

async function applyDetectedLocation(position) {
  const latitude = position.coords.latitude.toFixed(6);
  const longitude = position.coords.longitude.toFixed(6);
  const fallbackLocation = createGpsFallbackLocation(latitude, longitude);

  updateHeaderLocation(fallbackLocation);
  setStatus('Converting GPS into readable address...');

  try {
    const readableAddress = await reverseGeocode(latitude, longitude);
    const location = {
      ...fallbackLocation,
      title: readableAddress.title,
      sub: readableAddress.sub,
      fullAddress: readableAddress.fullAddress,
      source: 'gps-reverse-geocoded'
    };

    updateHeaderLocation(location);
    saveLocation(location);
    setStatus('Current location saved with readable address.', 'success');
  } catch (error) {
    saveLocation(fallbackLocation);
    setStatus('Address conversion failed. GPS coordinates saved instead.', 'error');
  }

  setTimeout(closeLocationSheet, 700);
}

function detectCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus('Your browser does not support location detection. Enter location manually.', 'error');
    return;
  }

  setStatus('Detecting your current location...');
  detectLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await applyDetectedLocation(position);
      detectLocationBtn.disabled = false;
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
