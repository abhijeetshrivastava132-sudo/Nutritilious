const app = document.getElementById('app');
const vegToggle = document.getElementById('vegToggle');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageButtons = document.querySelectorAll('[data-page-btn]');
const interestBtn = document.getElementById('interestBtn');
const knowMoreBtn = document.getElementById('knowMoreBtn');
const categoryGrid = document.getElementById('categoryGrid');
const mealList = document.getElementById('mealList');
const filterList = document.getElementById('filterList');

const data = window.NUTRITILIOUS_DATA || { categories: [], meals: [], filters: [], deliveryRadiusKm: 8 };
const LOCATION_STORAGE_KEY = 'nutritiliousLocation';
const deliveryRadiusKm = data.deliveryRadiusKm || 8;

function icon(type) {
  const icons = {
    filter: '<svg viewBox="0 0 24 24"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z"/></svg>',
    flash: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 10-13h-7l0-7z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path d="M5 12c0-5 4-8 11-9 2 7-1 13-7 13H5z"/><path d="M5 21c1-5 5-8 10-10"/></svg>',
    rupee: '<svg viewBox="0 0 24 24"><path d="M6 4h12"/><path d="M9 4c3 0 5 1.5 5 4s-2 4-5 4h-3l8 8"/><path d="M6 8h12"/></svg>'
  };
  return icons[type] || icons.filter;
}

function getSavedLocation() {
  try {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function hasGpsLocation(location) {
  return Boolean(location && toNumber(location.latitude) !== null && toNumber(location.longitude) !== null);
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistanceKm(startLatitude, startLongitude, endLatitude, endLongitude) {
  const earthRadiusKm = 6371;
  const latitudeDiff = degreesToRadians(endLatitude - startLatitude);
  const longitudeDiff = degreesToRadians(endLongitude - startLongitude);

  const startLatRad = degreesToRadians(startLatitude);
  const endLatRad = degreesToRadians(endLatitude);

  const value =
    Math.sin(latitudeDiff / 2) * Math.sin(latitudeDiff / 2) +
    Math.cos(startLatRad) * Math.cos(endLatRad) *
    Math.sin(longitudeDiff / 2) * Math.sin(longitudeDiff / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  return earthRadiusKm * centralAngle;
}

function formatDistance(distanceKm) {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

function getMealsForLocation() {
  const savedLocation = getSavedLocation();

  if (!hasGpsLocation(savedLocation)) {
    return data.meals.map((meal) => ({
      ...meal,
      computedDistance: null,
      distanceLabel: meal.distance,
      locationMatched: false
    }));
  }

  const userLatitude = toNumber(savedLocation.latitude);
  const userLongitude = toNumber(savedLocation.longitude);

  return data.meals
    .map((meal) => {
      const providerLatitude = toNumber(meal.latitude);
      const providerLongitude = toNumber(meal.longitude);

      if (providerLatitude === null || providerLongitude === null) {
        return {
          ...meal,
          computedDistance: null,
          distanceLabel: meal.distance,
          locationMatched: false
        };
      }

      const computedDistance = calculateDistanceKm(
        userLatitude,
        userLongitude,
        providerLatitude,
        providerLongitude
      );

      return {
        ...meal,
        computedDistance,
        distanceLabel: `${formatDistance(computedDistance)} away`,
        locationMatched: computedDistance <= deliveryRadiusKm
      };
    })
    .filter((meal) => meal.locationMatched)
    .sort((firstMeal, secondMeal) => firstMeal.computedDistance - secondMeal.computedDistance);
}

function renderCategories() {
  categoryGrid.innerHTML = data.categories
    .map((category) => `
      <button class="cat-item" type="button">
        <div class="cat-img-wrap">
          <img class="cat-img" src="${category.image}" alt="${category.name}">
        </div>
        <div class="cat-name">${category.name}</div>
      </button>
    `)
    .join('');
}

function renderFilters() {
  const iconMap = ['filter', 'star', 'flash', 'leaf', 'rupee'];
  filterList.innerHTML = data.filters
    .map((filter, index) => `<button class="filter-chip" type="button">${icon(iconMap[index])}${filter}</button>`)
    .join('');
}

function renderEmptyNearbyState() {
  mealList.innerHTML = `
    <div class="nearby-empty">
      <div class="nearby-empty-icon">📍</div>
      <h3>No nearby homemade food providers yet</h3>
      <p>We could not find providers within ${deliveryRadiusKm} km of your selected location. Try manual location or check again later.</p>
    </div>
  `;
}

function renderMeals() {
  const meals = getMealsForLocation();

  if (!meals.length) {
    renderEmptyNearbyState();
    return;
  }

  mealList.innerHTML = meals
    .map((meal) => `
      <article class="restaurant-card">
        <div class="restaurant-img-box">
          <img class="restaurant-img" src="${meal.image}" alt="${meal.name}">
          <div class="discount-badge">${meal.discount}</div>
          <div class="time-badge">${meal.time}</div>
        </div>
        <div class="restaurant-content">
          <div class="restaurant-top">
            <div>
              <h3 class="restaurant-name">${meal.name}</h3>
              <div class="restaurant-meta">${meal.meta}</div>
            </div>
            <div class="rating">${meal.rating} ★</div>
          </div>
          <div class="restaurant-bottom">
            <div class="price">${meal.price}</div>
            <div class="distance">${meal.distanceLabel}</div>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function openPage(pageId) {
  pages.forEach((page) => page.classList.remove('active-page'));
  document.getElementById(pageId)?.classList.add('active-page');

  navItems.forEach((item) => {
    item.classList.remove('active');
    const navPage = pageId === 'knowMorePage' ? 'subscriptionPage' : pageId;
    if (item.dataset.page === navPage) item.classList.add('active');
  });

  if (pageId === 'homePage') {
    app.classList.remove('inner-page');
  } else {
    app.classList.add('inner-page');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindEvents() {
  vegToggle?.addEventListener('click', () => vegToggle.classList.toggle('off'));

  navItems.forEach((item) => {
    item.addEventListener('click', () => openPage(item.dataset.page));
  });

  pageButtons.forEach((button) => {
    button.addEventListener('click', () => openPage(button.dataset.pageBtn));
  });

  interestBtn?.addEventListener('click', () => {
    interestBtn.classList.toggle('interested');
    const text = interestBtn.querySelector('.interest-text');
    text.textContent = interestBtn.classList.contains('interested') ? 'Interest Saved' : 'I’m Interested';
  });

  knowMoreBtn?.addEventListener('click', () => openPage('knowMorePage'));

  window.addEventListener('nutritilious:location-changed', renderMeals);
}

renderCategories();
renderFilters();
renderMeals();
bindEvents();
