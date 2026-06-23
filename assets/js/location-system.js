(function(){
  const STORAGE_KEY='nutritiliousLocation';
  const providers={
    'Anita Homemade Food':{lat:28.5687,lng:77.2433},
    'Sunita Kitchen':{lat:28.5672,lng:77.2454},
    'Daily Fresh Home Food':{lat:28.5701,lng:77.2416},
    'South Home Kitchen':{lat:28.5657,lng:77.2442},
    'Raj Home Meals':{lat:28.5713,lng:77.2467},
    'Fit Home Kitchen':{lat:28.5664,lng:77.2408}
  };

  function qs(sel){return document.querySelector(sel)}

  function toast(msg){
    const t=qs('#toast');
    if(!t){alert(msg);return}
    t.textContent=msg;
    t.style.display='block';
    clearTimeout(window.__nutritiliousToastTimer);
    window.__nutritiliousToastTimer=setTimeout(()=>t.style.display='none',2400);
  }

  function distanceKm(a,b){
    const R=6371;
    const dLat=(b.lat-a.lat)*Math.PI/180;
    const dLng=(b.lng-a.lng)*Math.PI/180;
    const lat1=a.lat*Math.PI/180;
    const lat2=b.lat*Math.PI/180;
    const x=Math.sin(dLat/2)**2+Math.sin(dLng/2)**2*Math.cos(lat1)*Math.cos(lat2);
    return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  }

  function getAddressLabel(data){
    const a=data.address||{};
    return a.suburb||a.neighbourhood||a.road||a.city_district||a.city||a.town||a.village||'Current location';
  }

  function getAddressSubtitle(data,lat,lng){
    const a=data.address||{};
    const parts=[a.road,a.suburb||a.neighbourhood,a.city||a.town||a.village,a.state].filter(Boolean);
    return parts.slice(0,3).join(', ')||`${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  function updateLocationUI(loc){
    const name=qs('.location-name');
    const sub=qs('.location-subtitle');
    if(name)name.textContent=loc.name||'Current location';
    if(sub)sub.textContent=loc.subtitle||`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
  }

  function addDistanceToCards(loc){
    document.querySelectorAll('.food-card').forEach(card=>{
      const cook=(card.querySelector('.food-info p')?.textContent||'').replace(/^by\s+/i,'').trim();
      const p=providers[cook];
      let distanceEl=card.querySelector('.distance-tag');
      if(!distanceEl){
        distanceEl=document.createElement('span');
        distanceEl.className='distance-tag';
        const meta=card.querySelector('.food-meta');
        if(meta)meta.appendChild(distanceEl);
      }
      distanceEl.textContent=p?`${distanceKm(loc,p).toFixed(1)} km`:'';
    });
  }

  function injectCSS(){
    if(document.getElementById('realLocationCSS'))return;
    const s=document.createElement('style');
    s.id='realLocationCSS';
    s.textContent='.location-text{cursor:pointer}.location-name.locating,.location-subtitle.locating{opacity:.7}.distance-tag{font-size:12px;font-weight:700;color:#2f7d32;background:#eef8ee;padding:4px 7px;border-radius:999px;white-space:nowrap}';
    document.head.appendChild(s);
  }

  async function reverseGeocode(lat,lng){
    const url=`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
    const res=await fetch(url,{headers:{'Accept':'application/json'}});
    if(!res.ok)throw new Error('Address lookup failed');
    return res.json();
  }

  function saveLocation(loc){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(loc));
    updateLocationUI(loc);
    addDistanceToCards(loc);
  }

  function detectLocation(){
    if(!navigator.geolocation){toast('Your browser does not support GPS location');return}
    const name=qs('.location-name');
    const sub=qs('.location-subtitle');
    if(name){name.textContent='Detecting location...';name.classList.add('locating')}
    if(sub){sub.textContent='Allow location permission';sub.classList.add('locating')}
    navigator.geolocation.getCurrentPosition(async pos=>{
      const lat=pos.coords.latitude;
      const lng=pos.coords.longitude;
      let loc={lat,lng,name:'Current location',subtitle:`${lat.toFixed(5)}, ${lng.toFixed(5)}`};
      try{
        const data=await reverseGeocode(lat,lng);
        loc.name=getAddressLabel(data);
        loc.subtitle=getAddressSubtitle(data,lat,lng);
      }catch(e){
        toast('GPS found. Address name could not load');
      }
      if(name)name.classList.remove('locating');
      if(sub)sub.classList.remove('locating');
      saveLocation(loc);
      toast('Location updated');
    },err=>{
      if(name){name.textContent='Use current location';name.classList.remove('locating')}
      if(sub){sub.textContent='Location permission needed';sub.classList.remove('locating')}
      const msg=err.code===1?'Location permission denied':'Could not detect location';
      toast(msg);
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  }

  function bindLocation(){
    injectCSS();
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(saved){updateLocationUI(saved);setTimeout(()=>addDistanceToCards(saved),100)}
    const btn=qs('#locationBtn');
    const drop=qs('#dropBtn');
    if(btn)btn.onclick=detectLocation;
    if(drop)drop.onclick=function(e){e.stopPropagation();detectLocation()};
    const originalRender=window.renderFoods;
    if(typeof originalRender==='function'){
      window.renderFoods=function(){
        originalRender.apply(this,arguments);
        const loc=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
        if(loc)setTimeout(()=>addDistanceToCards(loc),0);
      };
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindLocation);else bindLocation();
})();