window.NUTRITILIOUS_DATA = {
  deliveryRadiusKm: 8,

  categories: [
    {
      name: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Lunch',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Dinner',
      image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Desserts',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'More',
      image: 'https://api.iconify.design/mdi/dots-grid.svg?color=%23f01835'
    }
  ],

  meals: [
    {
      name: 'Maa Kitchen Homemade',
      meta: 'North Indian, Thali, Roti Sabji',
      price: '₹99 for one',
      distance: '0.7 km',
      rating: '4.8',
      discount: '₹80 OFF',
      time: '10 mins',
      foodType: 'veg',
      latitude: 28.5681,
      longitude: 77.2436,
      area: 'Central Delhi',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Delhi Daily Tiffin',
      meta: 'Dal Rice, Seasonal Sabji, Curd',
      price: '₹119 for one',
      distance: '1.1 km',
      rating: '4.6',
      discount: '20% OFF',
      time: '15 mins',
      foodType: 'veg',
      latitude: 28.5706,
      longitude: 77.2367,
      area: 'Amar Colony',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Healthy Home Plate',
      meta: 'Paneer Rice, Salad, Homemade Pickle',
      price: '₹129 for one',
      distance: '1.4 km',
      rating: '4.5',
      discount: '₹60 OFF',
      time: '18 mins',
      foodType: 'veg',
      latitude: 28.5629,
      longitude: 77.2513,
      area: 'Defence Colony',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Home Chicken Tiffin',
      meta: 'Chicken Curry, Rice, Salad',
      price: '₹149 for one',
      distance: '1.0 km',
      rating: '4.7',
      discount: '₹70 OFF',
      time: '16 mins',
      foodType: 'non-veg',
      latitude: 28.5667,
      longitude: 77.2415,
      area: 'Market Area',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Egg Curry Meal Box',
      meta: 'Egg Curry, Roti, Rice, Onion Salad',
      price: '₹129 for one',
      distance: '1.5 km',
      rating: '4.4',
      discount: '15% OFF',
      time: '20 mins',
      foodType: 'non-veg',
      latitude: 28.5742,
      longitude: 77.2384,
      area: 'Station Road',
      image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Fish Rice Home Meal',
      meta: 'Fish Curry, Rice, Dal, Salad',
      price: '₹159 for one',
      distance: '2.0 km',
      rating: '4.6',
      discount: '₹50 OFF',
      time: '22 mins',
      foodType: 'non-veg',
      latitude: 28.5596,
      longitude: 77.2491,
      area: 'Main Road',
      image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=900&q=80'
    }
  ],

  filters: ['Filters', 'Rating 4.0+', 'Fast Delivery', 'Pure Veg', 'Under ₹120']
};

(() => {
  const css = `
    .top-header {
      padding: 18px 16px 24px !important;
      overflow: visible !important;
      border-radius: 0 !important;
      background: #ffffff !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    .top-header::before,
    .top-header::after {
      display: none !important;
    }

    .top-row {
      align-items: flex-start !important;
      gap: 16px !important;
      margin-bottom: 26px !important;
    }

    .location-btn {
      grid-template-columns: 42px minmax(0, 1fr) !important;
      column-gap: 10px !important;
    }

    .location-pin,
    .location-pin svg {
      width: 42px !important;
      height: 42px !important;
      color: #f01835 !important;
      fill: currentColor !important;
    }

    .location-title {
      max-width: 230px !important;
      color: #090909 !important;
      font-size: 28px !important;
      font-weight: 950 !important;
      line-height: 1.02 !important;
      letter-spacing: -0.9px !important;
    }

    .location-down,
    .location-down svg {
      width: 26px !important;
      height: 26px !important;
      color: #111111 !important;
    }

    .location-sub {
      margin-top: 6px !important;
      color: #4b4b4b !important;
      font-size: 20px !important;
      font-weight: 650 !important;
      line-height: 1.12 !important;
      letter-spacing: -0.5px !important;
    }

    .profile-btn {
      position: relative !important;
      width: 46px !important;
      height: 56px !important;
      margin-top: 0 !important;
      margin-left: 0 !important;
      border-radius: 0 !important;
      color: #111111 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .profile-btn svg {
      display: none !important;
    }

    .profile-btn::before {
      content: "";
      position: absolute;
      left: 8px;
      top: 12px;
      width: 28px;
      height: 32px;
      border: 3px solid #111111;
      border-bottom: 0;
      border-radius: 16px 16px 8px 8px;
    }

    .profile-btn::after {
      content: "3";
      position: absolute;
      right: -2px;
      top: 0;
      display: grid;
      place-items: center;
      width: 27px;
      height: 27px;
      border-radius: 50%;
      color: #ffffff;
      background: #f01835;
      font-size: 16px;
      font-weight: 900;
      line-height: 1;
    }

    .search-row {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) 86px !important;
      align-items: center !important;
      gap: 16px !important;
    }

    .search-box {
      height: 74px !important;
      padding: 0 18px !important;
      border: 1px solid #eeeeee !important;
      border-radius: 22px !important;
      background: #ffffff !important;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.11) !important;
    }

    .search-icon {
      width: 34px !important;
      height: 34px !important;
      margin-right: 15px !important;
      color: #f01835 !important;
    }

    .search-box input {
      color: #454545 !important;
      font-size: 20px !important;
      font-weight: 650 !important;
      letter-spacing: -0.45px !important;
    }

    .search-box input::placeholder {
      color: #555555 !important;
      font-weight: 650 !important;
      opacity: 1 !important;
    }

    .search-divider {
      display: none !important;
    }

    .mic-icon {
      width: 32px !important;
      height: 32px !important;
      color: #f01835 !important;
    }

    .veg-card {
      width: 86px !important;
      min-width: 86px !important;
      height: 74px !important;
      gap: 8px !important;
      padding: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    .veg-text {
      width: max-content !important;
      color: #202020 !important;
      font-size: 17px !important;
      font-weight: 900 !important;
      line-height: 1 !important;
      letter-spacing: -0.2px !important;
      text-transform: none !important;
    }

    .veg-toggle {
      width: 50px !important;
      height: 28px !important;
      padding: 0 !important;
      border-radius: 999px !important;
      background: #dddddd !important;
    }

    .veg-toggle::before {
      display: none !important;
    }

    .veg-dot {
      position: absolute !important;
      left: 2px !important;
      top: 2px !important;
      width: 24px !important;
      height: 24px !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: #ffffff !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
    }

    .veg-toggle.off {
      background: #dddddd !important;
    }

    .veg-toggle.off .veg-dot {
      left: 2px !important;
      border: 0 !important;
      background: #ffffff !important;
    }

    .veg-card.veg-only .veg-toggle {
      background: #1bb45e !important;
    }

    .veg-card.veg-only .veg-dot {
      left: 24px !important;
    }

    #homePage > .section:first-child {
      margin-top: 22px !important;
    }

    .section-head {
      padding: 0 16px !important;
      margin-bottom: 18px !important;
    }

    .section-title {
      color: #050505 !important;
      font-size: 25px !important;
      font-weight: 950 !important;
      line-height: 1.1 !important;
      letter-spacing: -0.55px !important;
    }

    .see-all {
      display: none !important;
    }

    .category-grid {
      display: grid !important;
      grid-template-columns: repeat(6, 1fr) !important;
      gap: 0 !important;
      padding: 0 16px !important;
      overflow: visible !important;
    }

    .cat-item {
      min-width: 0 !important;
    }

    .cat-img-wrap {
      width: 64px !important;
      height: 64px !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: #f7f7f7 !important;
      box-shadow: none !important;
    }

    .cat-img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      transform: scale(1.03) !important;
    }

    .cat-item[data-category-name="More"] .cat-img {
      object-fit: contain !important;
      padding: 15px !important;
      transform: none !important;
    }

    .cat-name {
      margin-top: 12px !important;
      color: #202020 !important;
      font-size: 16px !important;
      font-weight: 850 !important;
      line-height: 1.05 !important;
      letter-spacing: -0.45px !important;
    }

    @media (max-width: 370px) {
      .top-header {
        padding-left: 14px !important;
        padding-right: 14px !important;
      }

      .location-btn {
        grid-template-columns: 36px minmax(0, 1fr) !important;
      }

      .location-pin,
      .location-pin svg {
        width: 36px !important;
        height: 36px !important;
      }

      .location-title {
        font-size: 24px !important;
        max-width: 190px !important;
      }

      .location-sub {
        font-size: 17px !important;
      }

      .search-row {
        grid-template-columns: minmax(0, 1fr) 76px !important;
        gap: 12px !important;
      }

      .search-box {
        height: 64px !important;
      }

      .search-box input {
        font-size: 17px !important;
      }

      .veg-card {
        width: 76px !important;
        min-width: 76px !important;
        height: 64px !important;
      }

      .category-grid {
        padding: 0 12px !important;
      }

      .cat-img-wrap {
        width: 52px !important;
        height: 52px !important;
      }

      .cat-name {
        font-size: 13px !important;
      }
    }
  `;

  const style = document.createElement('style');
  style.setAttribute('data-home-header-replica', 'true');
  style.textContent = css;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('locationTitle');
    const sub = document.getElementById('locationSub');
    const vegText = document.getElementById('foodTypeText');

    if (title && title.textContent.trim() === 'Choose location') title.textContent = 'Kausa';
    if (sub && sub.textContent.trim() === 'Tap to select delivery address') sub.textContent = 'Mumbra, Navi Mumbai';
    if (vegText) vegText.textContent = 'Only Veg';
  });
})();
