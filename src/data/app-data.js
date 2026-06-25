window.NUTRITILIOUS_DATA = {
  deliveryRadiusKm: 8,

  categories: [
    { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80' },
    { name: 'Lunch', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dinner', image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=300&q=80' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80' },
    { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=300&q=80' },
    { name: 'More', image: 'https://api.iconify.design/mdi/dots-grid.svg?color=%23f01835' }
  ],

  meals: [
    { name: 'Maa Kitchen Homemade', meta: 'North Indian, Thali, Roti Sabji', price: '₹99 for one', distance: '0.7 km', rating: '4.8', discount: '₹80 OFF', time: '10 mins', foodType: 'veg', latitude: 28.5681, longitude: 77.2436, area: 'Central Delhi', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80' },
    { name: 'Delhi Daily Tiffin', meta: 'Dal Rice, Seasonal Sabji, Curd', price: '₹119 for one', distance: '1.1 km', rating: '4.6', discount: '20% OFF', time: '15 mins', foodType: 'veg', latitude: 28.5706, longitude: 77.2367, area: 'Amar Colony', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80' },
    { name: 'Healthy Home Plate', meta: 'Paneer Rice, Salad, Homemade Pickle', price: '₹129 for one', distance: '1.4 km', rating: '4.5', discount: '₹60 OFF', time: '18 mins', foodType: 'veg', latitude: 28.5629, longitude: 77.2513, area: 'Defence Colony', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80' },
    { name: 'Home Chicken Tiffin', meta: 'Chicken Curry, Rice, Salad', price: '₹149 for one', distance: '1.0 km', rating: '4.7', discount: '₹70 OFF', time: '16 mins', foodType: 'non-veg', latitude: 28.5667, longitude: 77.2415, area: 'Market Area', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80' },
    { name: 'Egg Curry Meal Box', meta: 'Egg Curry, Roti, Rice, Onion Salad', price: '₹129 for one', distance: '1.5 km', rating: '4.4', discount: '15% OFF', time: '20 mins', foodType: 'non-veg', latitude: 28.5742, longitude: 77.2384, area: 'Station Road', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=900&q=80' },
    { name: 'Fish Rice Home Meal', meta: 'Fish Curry, Rice, Dal, Salad', price: '₹159 for one', distance: '2.0 km', rating: '4.6', discount: '₹50 OFF', time: '22 mins', foodType: 'non-veg', latitude: 28.5596, longitude: 77.2491, area: 'Main Road', image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=900&q=80' }
  ],

  filters: ['Filters', 'Rating 4.0+', 'Fast Delivery', 'Pure Veg', 'Under ₹120']
};

(() => {
  function setReferenceHeader() {
    const title = document.getElementById('locationTitle');
    const sub = document.getElementById('locationSub');
    const vegText = document.getElementById('foodTypeText');

    if (title) title.textContent = 'Kausa';
    if (sub) sub.textContent = 'Mumbra, Navi Mumbai';
    if (vegText) vegText.textContent = 'Only Veg';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setReferenceHeader();
      setTimeout(setReferenceHeader, 80);
      setTimeout(setReferenceHeader, 300);
      setTimeout(setReferenceHeader, 800);
    });
  } else {
    setReferenceHeader();
    setTimeout(setReferenceHeader, 80);
    setTimeout(setReferenceHeader, 300);
    setTimeout(setReferenceHeader, 800);
  }
})();
