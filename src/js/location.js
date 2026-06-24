(() => {
  const STORAGE_KEY = 'nutritiliousLocation';
  const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';
  const SEARCH_GEOCODE_URL = 'https://nominatim.openstreetmap.org/search';
  const TARGET_ACCURACY_METERS = 35;
  const ACCURACY_WAIT_MS = 8000;

  const defaultLocation = {
    title: 'Lajpat Nagar Metro Station',
    sub: 'Lajpat Nagar, Ring Road, New Delhi',
    source: 'default'
  };

  let refs = {};
  let eventsBound = false;

  function cacheRefs() {
    refs = {
      locationBtn: document.getElementById('locationBtn'),
      locationSheet: document.getElementById('locationSheet'),
      locationBackdrop: document.getElementById('locationBackdrop'),
      locationCloseBtn: document.getElementById('locationCloseBtn'),
      detectLocationBtn: document.getElementById('detectLocationBtn'),
      manualLocationForm: document.getElementById('manualLocationForm'),
      manualLocationInput: document.getElementById('manualLocationInput'),
      locationTitle: document.getElementById('locationTitle'),
      locationSub: document.getElementById('locationSub'),
      locationStatus: document.getElementById('locationStatus')
    };
  }

  function setStatus(message, type = '') {
    if (!refs.locationStatus) return;
    refs.locationStatus.textContent = message;
    refs.locationStatus.className = `location-status ${type}`.trim();
  }

  function formatAccuracy(accuracy) {
    const value = Number(accuracy);
    if (!Number.isFinite(value)) return '';
    return `Accuracy around ${Math.round(value)} m`;
  }

  function getCleanHeaderSub(sub = '') {
    return String(sub)
      .replace(/\s*•\s*Accuracy around\s*\d+\s*m/gi, '')
      .replace(/\s*Accuracy around\s*\d+\s*m/gi, '')
      .trim();
  }

  function notifyLocationChange(location) {
    window.dispatchEvent(new CustomEvent('nutritilious:location-changed', {
      detail: location
    }));
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

    notifyLocationChange(location);
  }

  function updateHeaderLocation(location) {
    const selectedLocation = location || defaultLocation;
    if (refs.locationTitle) refs.locationTitle.textContent = selectedLocation.title;
    if (refs.locationSub) refs.locationSub.textContent = getCleanHeaderSub(selectedLocation.sub);
  }

  function openLocationSheet() {
    cacheRefs();
    if (!refs.locationSheet) return;

    refs.locationSheet.classList.add('active');
    refs.locationSheet.setAttribute('aria-hidden', 'false');
    setStatus('Use GPS for best accuracy or search your area manually.');

    setTimeout(() => {
      if (refs.manualLocationInput) refs.manualLocationInput.focus();
    }, 120);
  }

  function closeLocationSheet() {
    cacheRefs();
    if (!refs.locationSheet) return;

    refs.locationSheet.classList.remove('active');
    refs.locationSheet.setAttribute('aria-hidden', 'true');
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

  async function geocodeManualLocation(query) {
    const params = new URLSearchParams({
      format: 'jsonv2',
      q: query,
      limit: '1',
      addressdetails: '1',
      'accept-language': 'en'
    });

    const response = await fetch(`${SEARCH_GEOCODE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Manual location search failed');
    }

    const results = await response.json();
    const result = Array.isArray(results) ? results[0] : null;
    if (!result || !result.lat || !result.lon) {
      throw new Error('No matching location found');
    }

    const readable = getReadableAddressParts(result.address || {});

    return {
      title: readable.title || query,
      sub: readable.sub || result.display_name || 'Manual location selected',
      fullAddress: result.display_name || query,
      latitude: Number(result.lat).toFixed(6),
      longitude: Number(result.lon).toFixed(6),
      source: 'manual-geocoded'
    };
  }

  function createGpsFallbackLocation(latitude, longitude, accuracy = null) {
    return {
      title: 'Current Location',
      sub: `Lat ${latitude}, Long ${longitude}`,
      source: 'gps',
      latitude,
      longitude,
      accuracy
    };
  }

  async function applyManualLocation(event) {
    event.preventDefault();
    cacheRefs();

    const value = refs.manualLocationInput ? refs.manualLocationInput.value.trim() : '';
    if (value.length < 3) {
      setStatus('Enter a proper area, street, or city name.', 'error');
      return;
    }

    const submitButton = refs.manualLocationForm?.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setStatus('Searching this area and converting it into coordinates...');

    try {
      const location = await geocodeManualLocation(value);
      updateHeaderLocation(location);
      saveLocation(location);
      setStatus('Location confirmed with coordinates.', 'success');
      setTimeout(closeLocationSheet, 550);
    } catch (error) {
      const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
      const fallbackLocation = {
        title: parts[0] || value,
        sub: parts.slice(1).join(', ') || 'Manual location selected. GPS is more accurate.',
        source: 'manual'
      };

      updateHeaderLocation(fallbackLocation);
      saveLocation(fallbackLocation);
      setStatus('Could not find exact coordinates. Manual text saved, but GPS will be more accurate.', 'error');
      setTimeout(closeLocationSheet, 900);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  function getPreciseCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation unsupported'));
        return;
      }

      let bestPosition = null;
      let watchId = null;
      let settled = false;

      const stop = () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      };

      const finish = () => {
        if (settled) return;
        settled = true;
        stop();

        if (bestPosition) {
          resolve(bestPosition);
        } else {
          reject(new Error('Location unavailable'));
        }
      };

      const handlePosition = (position) => {
        const currentAccuracy = position.coords.accuracy || Number.POSITIVE_INFINITY;
        const bestAccuracy = bestPosition?.coords?.accuracy || Number.POSITIVE_INFINITY;

        if (!bestPosition || currentAccuracy < bestAccuracy) {
          bestPosition = position;
          setStatus(`Improving GPS accuracy... ${formatAccuracy(currentAccuracy)}`);
        }

        if (currentAccuracy <= TARGET_ACCURACY_METERS) {
          finish();
        }
      };

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(handlePosition, reject, options);
      watchId = navigator.geolocation.watchPosition(handlePosition, () => {
        if (!bestPosition) reject(new Error('Location permission denied'));
      }, options);

      setTimeout(finish, ACCURACY_WAIT_MS);
    });
  }

  async function applyDetectedLocation(position) {
    const latitude = position.coords.latitude.toFixed(6);
    const longitude = position.coords.longitude.toFixed(6);
    const accuracy = position.coords.accuracy ? Math.round(position.coords.accuracy) : null;
    const fallbackLocation = createGpsFallbackLocation(latitude, longitude, accuracy);

    updateHeaderLocation(fallbackLocation);
    setStatus(`Converting GPS into readable address... ${formatAccuracy(accuracy)}`);

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
      setStatus(accuracy ? `Current location saved. ${formatAccuracy(accuracy)}.` : 'Current location saved with readable address.', 'success');
    } catch (error) {
      saveLocation(fallbackLocation);
      setStatus('Address conversion failed. Best GPS coordinates saved instead.', 'error');
    }

    setTimeout(closeLocationSheet, 850);
  }

  async function detectCurrentLocation() {
    cacheRefs();

    if (!navigator.geolocation) {
      setStatus('Your browser does not support location detection. Search area manually.', 'error');
      return;
    }

    setStatus('Getting fresh GPS reading... keep location permission on.');
    if (refs.detectLocationBtn) refs.detectLocationBtn.disabled = true;

    try {
      const position = await getPreciseCurrentPosition();
      await applyDetectedLocation(position);
    } catch (error) {
      setStatus('Location permission denied or unavailable. Search area manually.', 'error');
    } finally {
      if (refs.detectLocationBtn) refs.detectLocationBtn.disabled = false;
    }
  }

  function handleDocumentClick(event) {
    const locationTrigger = event.target.closest('#locationBtn');
    if (locationTrigger) {
      event.preventDefault();
      openLocationSheet();
      return;
    }

    const backdropTrigger = event.target.closest('#locationBackdrop');
    const closeTrigger = event.target.closest('#locationCloseBtn');
    if (backdropTrigger || closeTrigger) {
      event.preventDefault();
      closeLocationSheet();
      return;
    }

    const detectTrigger = event.target.closest('#detectLocationBtn');
    if (detectTrigger) {
      event.preventDefault();
      detectCurrentLocation();
    }
  }

  function bindLocationEvents() {
    if (eventsBound) return;
    eventsBound = true;

    document.addEventListener('click', handleDocumentClick);

    if (refs.manualLocationForm) {
      refs.manualLocationForm.addEventListener('submit', applyManualLocation);
    }

    document.addEventListener('keydown', (event) => {
      cacheRefs();
      if (event.key === 'Escape' && refs.locationSheet && refs.locationSheet.classList.contains('active')) {
        closeLocationSheet();
      }
    });
  }

  function initLocationSystem() {
    cacheRefs();
    updateHeaderLocation(getSavedLocation());
    bindLocationEvents();
  }

  window.openNutritiliousLocationSheet = openLocationSheet;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocationSystem);
  } else {
    initLocationSystem();
  }
})();
