(() => {
  const STORAGE_KEY = 'nutritiliousLocation';
  let detailStepOpen = false;

  function refs() {
    return {
      form: document.getElementById('manualLocationForm'),
      input: document.getElementById('manualLocationInput'),
      status: document.getElementById('locationStatus'),
      title: document.getElementById('locationTitle'),
      sub: document.getElementById('locationSub'),
      sheet: document.getElementById('locationSheet'),
      button: document.querySelector('#manualLocationForm .save-location-btn')
    };
  }

  function setStatus(message, type = '') {
    const status = document.getElementById('locationStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `location-status ${type}`.trim();
  }

  function value(id) {
    return (document.getElementById(id)?.value || '').trim();
  }

  function ensureDetailBox(form) {
    let box = document.getElementById('manualAddressDetails');
    if (box) return box;

    box = document.createElement('div');
    box.id = 'manualAddressDetails';
    box.className = 'address-detail-box';
    box.hidden = true;
    box.innerHTML = `
      <p class="address-detail-title">Complete delivery address</p>
      <p class="address-detail-sub">Add exact address details for delivery.</p>
      <div class="address-field-grid">
        <label>House / Flat / Floor
          <input id="addressHouse" type="text" placeholder="House 21, Flat 3B" autocomplete="address-line1" />
        </label>
        <label>Area / Street
          <input id="addressArea" type="text" placeholder="Street, area, colony" autocomplete="address-line2" />
        </label>
        <label>Landmark optional
          <input id="addressLandmark" type="text" placeholder="Near school, mall, gate" />
        </label>
        <div class="address-field-row">
          <label>City
            <input id="addressCity" type="text" placeholder="City" autocomplete="address-level2" />
          </label>
          <label>State
            <input id="addressState" type="text" placeholder="State" autocomplete="address-level1" />
          </label>
        </div>
        <label>Pincode
          <input id="addressPincode" type="tel" inputmode="numeric" maxlength="6" placeholder="6 digit pincode" autocomplete="postal-code" />
        </label>
      </div>
    `;

    const button = form.querySelector('.save-location-btn');
    if (button) button.insertAdjacentElement('beforebegin', box);
    return box;
  }

  function openDetailStep() {
    const r = refs();
    const typedLocation = r.input?.value.trim() || '';

    if (typedLocation.length < 3) {
      setStatus('Enter a proper area, street, or city name.', 'error');
      r.input?.focus();
      return;
    }

    const box = ensureDetailBox(r.form);
    const areaInput = document.getElementById('addressArea');

    if (areaInput && !areaInput.value) areaInput.value = typedLocation;
    box.hidden = false;
    detailStepOpen = true;

    if (r.button) r.button.textContent = 'Save complete address';
    setStatus('Now add house/flat, city, state and pincode.');
    document.getElementById('addressHouse')?.focus();
  }

  function saveAddress() {
    const r = refs();
    const house = value('addressHouse');
    const area = value('addressArea');
    const landmark = value('addressLandmark');
    const city = value('addressCity');
    const state = value('addressState');
    const pincode = value('addressPincode').replace(/\D/g, '').slice(0, 6);
    const pincodeInput = document.getElementById('addressPincode');

    if (pincodeInput) pincodeInput.value = pincode;

    if (house.length < 2) {
      setStatus('House / flat / floor is required.', 'error');
      document.getElementById('addressHouse')?.focus();
      return;
    }

    if (area.length < 3) {
      setStatus('Area / street is required.', 'error');
      document.getElementById('addressArea')?.focus();
      return;
    }

    if (city.length < 2) {
      setStatus('City is required.', 'error');
      document.getElementById('addressCity')?.focus();
      return;
    }

    if (pincode && pincode.length !== 6) {
      setStatus('Enter a valid 6 digit pincode.', 'error');
      pincodeInput?.focus();
      return;
    }

    const location = {
      title: `${house}, ${area}`,
      sub: [landmark, city, state, pincode].filter(Boolean).join(', '),
      fullAddress: [house, area, landmark, city, state, pincode].filter(Boolean).join(', '),
      house,
      area,
      landmark,
      city,
      state,
      pincode,
      source: 'manual-complete'
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    if (r.title) r.title.textContent = location.title;
    if (r.sub) r.sub.textContent = location.sub || location.fullAddress;

    window.dispatchEvent(new CustomEvent('nutritilious:location-changed', { detail: location }));
    setStatus('Complete delivery address saved.', 'success');

    setTimeout(() => {
      r.sheet?.classList.remove('active');
      r.sheet?.setAttribute('aria-hidden', 'true');
    }, 650);
  }

  function resetDetailStep() {
    const r = refs();
    const box = document.getElementById('manualAddressDetails');
    if (box) box.hidden = true;
    detailStepOpen = false;
    if (r.button) r.button.textContent = 'Confirm location';
  }

  function bind() {
    const r = refs();
    if (!r.form || r.form.dataset.fullAddressFlow === 'true') return;

    ensureDetailBox(r.form);

    r.form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (detailStepOpen) {
        saveAddress();
      } else {
        openDetailStep();
      }
    }, true);

    r.input?.addEventListener('input', resetDetailStep);

    document.addEventListener('input', (event) => {
      if (event.target?.id === 'addressPincode') {
        event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
      }
    });

    r.form.dataset.fullAddressFlow = 'true';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
