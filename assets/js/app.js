let selectedGenre='breakfast';
let selectedFood='';
const root=document.getElementById('root');

root.innerHTML=`
<div class="app">
<header class="top-area" id="home">
  <div class="pot-silhouette pot-decor pot-one" aria-hidden="true"><span class="pot-lid"></span><span class="pot-body"></span></div>
  <div class="pot-silhouette pot-decor pot-two" aria-hidden="true"><span class="pot-lid"></span><span class="pot-body"></span></div>
  <div class="pot-silhouette pot-decor pot-three" aria-hidden="true"><span class="pot-lid"></span><span class="pot-body"></span></div>
  <div class="location-row">
    <div class="location-icon">➤</div>
    <div class="location-text" id="locationBtn">
      <div class="location-title"><span class="location-name">Lajpat Nagar Metro Station</span><button class="dropdown-btn" id="dropBtn" type="button"><span class="chevron-down"></span></button></div>
      <div class="location-subtitle">Lajpat Nagar, Ring Road, New Delhi</div>
    </div>
    <button class="profile-btn" id="profileBtn"><span class="profile-icon"></span></button>
  </div>
  <div class="greeting-card">
    <p class="greeting-text" id="greetingText">Good evening</p>
  </div>
  <div class="search-row">
    <div class="search-box"><span class="search-icon"></span><input id="searchInput" type="text" placeholder="Search, order and eat"><span class="divider"></span><button class="mic-btn" id="micBtn" type="button"><span class="mic-icon"><span class="mic-head"></span><span class="mic-arc"></span><span class="mic-line"></span><span class="mic-base"></span></span></button></div>
    <div class="veg-box active" id="vegBox"><div class="veg-text">VEG</div><button class="veg-toggle" type="button"><span class="veg-toggle-knob"></span></button></div>
  </div>
</header>
<div class="toggle-area"><div class="service-toggle"><button class="service-btn active" data-tab="food">FOOD</button><button class="service-btn" data-tab="tiffin">TIFFIN SERVICE</button></div></div>
<main class="main-content">
  <section id="foodSection"><div class="section"><div class="section-title"><h2>What do you want to eat?</h2></div></div><div class="genre-row" id="genreRow"></div><div class="section"><div class="section-title"><h2 id="foodHeading">Available Breakfast</h2></div></div><div class="food-grid" id="foodGrid"></div></section>
  <section id="tiffinSection" class="hidden"><div class="section"><div class="section-title"><h2>Tiffin Plans</h2></div></div><div id="tiffinList"></div></section>
</main>
</div>
<nav class="bottom-nav"><button class="nav-item active" data-nav="home"><div>🍱</div>Food</button><button class="nav-item" data-nav="offers"><div>🏷️</div>Offers</button><button class="nav-item" data-nav="genre"><div>🍽️</div>Genre</button><button class="nav-item" data-nav="orders"><div>📦</div>Orders</button><button class="nav-item" data-nav="profile"><div>👤</div>Profile</button></nav>
<div class="modal" id="foodModal"><div class="modal-box"><div class="modal-food-photo"><img id="modalImg" src="" alt="Food image"></div><h2 id="modalName"></h2><div class="cook-line" id="modalCook"></div><div class="detail-row"><div class="detail-chip"><strong id="modalPrice"></strong><span>Price</span></div><div class="detail-chip"><strong id="modalTime"></strong><span>Available</span></div><div class="detail-chip"><strong id="modalDelivery"></strong><span>Delivery</span></div></div><div class="info-box"><h3>Ingredients</h3><p id="modalIngredients"></p></div><div class="info-box"><h3>Nutritional Info</h3><div class="nutrition-grid"><div class="nutrition-item"><strong id="modalCalories"></strong><span>Calories</span></div><div class="nutrition-item"><strong id="modalProtein"></strong><span>Protein</span></div><div class="nutrition-item"><strong id="modalCarbs"></strong><span>Carbs</span></div><div class="nutrition-item"><strong id="modalFat"></strong><span>Fat</span></div></div></div><div class="info-box"><h3>Transparency Note</h3><p>Homemade meal prepared by a nearby local cook. Ingredients and nutrition are shown so users can choose healthier food with more clarity.</p></div><div class="modal-actions"><button class="btn close-btn" id="closeModal" type="button">Close</button><button class="btn cart-btn" id="addToCart" type="button">Add to Cart</button></div></div></div>
<div class="toast" id="toast"></div>`;

function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2200)}
function setGreeting(){const h=new Date().getHours();const msg=h<12?'Good morning':h<17?'Good afternoon':'Good evening';const el=document.getElementById('greetingText');if(el)el.textContent=msg}
function renderGenres(){document.getElementById('genreRow').innerHTML=genres.map(g=>`<button class="genre-card ${g.id===selectedGenre?'active':''}" data-genre="${g.id}"><div class="genre-img"><img src="${g.img}" alt="${g.label}"></div><span>${g.label}</span></button>`).join('')}
function renderFoods(list=foods.filter(f=>f.genre===selectedGenre)){document.getElementById('foodGrid').innerHTML=list.map(f=>`<article class="food-card" data-name="${f.name}"><div class="food-photo"><span class="healthy-tag">${f.tag}</span><img src="${f.img}" alt="${f.name}"></div><div class="food-info"><h3>${f.name}</h3><p>by ${f.cook}</p><div class="food-meta"><span class="price">${f.price}</span><span class="time">${f.delivery}</span></div></div></article>`).join('');document.querySelectorAll('.food-card').forEach(c=>c.onclick=()=>openFoodModal(c.dataset.name))}
function renderTiffin(){document.getElementById('tiffinList').innerHTML=tiffinPlans.map(p=>`<div class="plan-card"><div class="plan-icon"><img src="${p.img}" alt="${p.name}"></div><div class="plan-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="food-meta"><span class="price">${p.price}</span><span class="time">${p.time}</span></div></div></div>`).join('')}
function bindGenres(){document.querySelectorAll('.genre-card').forEach(b=>b.onclick=()=>{selectedGenre=b.dataset.genre;document.getElementById('searchInput').value='';document.getElementById('foodHeading').textContent='Available '+genres.find(g=>g.id===selectedGenre).label;renderGenres();renderFoods();bindGenres()})}
function openFoodModal(name){const f=foods.find(x=>x.name===name);if(!f)return;selectedFood=f.name;modalName.textContent=f.name;modalCook.textContent='by '+f.cook;modalPrice.textContent=f.price;modalTime.textContent=f.time;modalDelivery.textContent=f.delivery;modalImg.src=f.img;modalIngredients.textContent=f.ingredients;modalCalories.textContent=f.nutrition[0];modalProtein.textContent=f.nutrition[1];modalCarbs.textContent=f.nutrition[2];modalFat.textContent=f.nutrition[3];foodModal.style.display='flex'}
function closeModal(){foodModal.style.display='none'}
searchInput.oninput=()=>{const q=searchInput.value.toLowerCase().trim();renderFoods(q?foods.filter(f=>(f.name+' '+f.cook+' '+f.genre).toLowerCase().includes(q)):foods.filter(f=>f.genre===selectedGenre))};
vegBox.onclick=function(){this.classList.toggle('active');showToast(this.classList.contains('active')?'Veg filter applied':'Veg filter removed')};
closeModal.onclick=closeModal;addToCart.onclick=()=>{closeModal();showToast(selectedFood+' added to cart')};foodModal.onclick=e=>{if(e.target.id==='foodModal')closeModal()};
locationBtn.onclick=()=>showToast('Location selector will open in next demo version');dropBtn.onclick=e=>{e.stopPropagation();showToast('Location selector will open in next demo version')};profileBtn.onclick=()=>showToast('Profile page will open in next demo version');micBtn.onclick=()=>showToast('Voice search will open in next demo version');
document.querySelectorAll('.service-btn').forEach(b=>b.onclick=()=>{document.querySelectorAll('.service-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');const tab=b.dataset.tab;foodSection.classList.toggle('hidden',tab!=='food');tiffinSection.classList.toggle('hidden',tab==='food');showToast(tab==='food'?'Showing homemade food':'Showing tiffin services')});
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');const nav=b.dataset.nav;if(nav==='home')home.scrollIntoView({behavior:'smooth'});else if(nav==='genre')genreRow.scrollIntoView({behavior:'smooth'});else showToast(nav+' page will open in next demo version')});
setGreeting();renderGenres();renderFoods();renderTiffin();bindGenres();