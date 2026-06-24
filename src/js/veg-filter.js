(() => {
  const LOCATION_STORAGE_KEY = 'nutritiliousLocation';
  const data = window.NUTRITILIOUS_DATA || { meals: [], deliveryRadiusKm: 8 };
  const deliveryRadiusKm = data.deliveryRadiusKm || 8;

  let selectedFoodType = 'all';

  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function getSavedLocation() {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
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

  function renderEmptyState() {
    const mealList = document.getElementById('mealList');
    if (!mealList) return;

    mealList.innerHTML = `
      <div class="nearby-empty">
        <h3>No meals found</h3>
        <p>Try switching the veg filter or changing your location.</p>
      </div>
    `;
  }

  function renderFilteredMeals() {
    const mealList = document.getElementById('mealList');
    if (!mealList) return;

    const mealsForLocation = getMealsForLocation();
    const meals = selectedFoodType === 'veg'
      ? mealsForLocation.filter((meal) => meal.foodType === 'veg')
      : mealsForLocation;

    if (!meals.length) {
      renderEmptyState();
      return;
    }

    mealList.innerHTML = meals.map((meal) => `
      <article class="restaurant-card">
        <div class="restaurant-img-box">
          <img class="restaurant-img" src="${meal.image}" alt="${meal.name}">
          <div class="food-type-badge ${meal.foodType === 'non-veg' ? 'non-veg' : ''}">
            ${meal.foodType === 'non-veg' ? 'NON-VEG' : 'VEG'}
          </div>
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
            <div class="distance">${meal.distanceLabel || meal.distance}</div>
          </div>
        </div>
      </article>
    `).join('');
  }

  function syncVegToggleUi() {
    const vegToggle = document.getElementById('vegToggle');
    const foodTypeToggle = document.getElementById('foodTypeToggle') || vegToggle?.closest('.veg-card');
    const foodTypeText = document.getElementById('foodTypeText') || foodTypeToggle?.querySelector('.veg-text');

    if (!vegToggle || !foodTypeToggle) return;

    const vegOnly = !vegToggle.classList.contains('off');
    selectedFoodType = vegOnly ? 'veg' : 'all';

    if (!foodTypeToggle.id) foodTypeToggle.id = 'foodTypeToggle';
    if (foodTypeText && !foodTypeText.id) foodTypeText.id = 'foodTypeText';
    if (foodTypeText) foodTypeText.textContent = 'VEG';

    foodTypeToggle.classList.toggle('veg-only', vegOnly);
    renderFilteredMeals();
  }

  function initVegFilter() {
    const vegToggle = document.getElementById('vegToggle');
    const foodTypeToggle = document.getElementById('foodTypeToggle') || vegToggle?.closest('.veg-card');
    const foodTypeText = document.getElementById('foodTypeText') || foodTypeToggle?.querySelector('.veg-text');

    if (!vegToggle || !foodTypeToggle) return;

    if (!foodTypeToggle.id) foodTypeToggle.id = 'foodTypeToggle';
    if (foodTypeText && !foodTypeText.id) foodTypeText.id = 'foodTypeText';

    vegToggle.classList.add('off');
    syncVegToggleUi();

    foodTypeToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      vegToggle.classList.toggle('off');
      syncVegToggleUi();
    }, true);

    window.addEventListener('nutritilious:location-changed', () => {
      window.requestAnimationFrame(renderFilteredMeals);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVegFilter);
  } else {
    initVegFilter();
  }
})();
