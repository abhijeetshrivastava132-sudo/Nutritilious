(()=>{
  const style=document.createElement('style');
  style.id='mealsScrollModeCSS';
  style.textContent=`
    #foodSection{position:relative!important;}

    #foodSection>.section{
      position:sticky!important;
      top:0!important;
      z-index:80!important;
      background:#fff!important;
      margin-bottom:0!important;
      padding-top:10px!important;
      padding-bottom:0!important;
    }

    #foodSection>.filter-row{
      position:sticky!important;
      top:49px!important;
      z-index:79!important;
      background:#fff!important;
      padding-top:0!important;
      padding-bottom:10px!important;
    }

    .meal-day-grid{
      display:flex!important;
      grid-template-columns:none!important;
      flex-direction:column!important;
      gap:13px!important;
      max-height:none!important;
      overflow:visible!important;
      white-space:normal!important;
      padding:0 16px 20px!important;
    }

    body.meals-scroll-mode .meal-day-grid{
      max-height:calc(100dvh - 142px)!important;
      overflow-y:auto!important;
      overflow-x:hidden!important;
      overscroll-behavior:contain!important;
      scrollbar-width:none!important;
    }

    body.meals-scroll-mode .meal-day-grid::-webkit-scrollbar{
      display:none!important;
    }

    .meal-day-grid .food-card{
      width:100%!important;
      flex:0 0 auto!important;
      white-space:normal!important;
    }

    .meal-day-grid .food-photo{
      width:100%!important;
      height:178px!important;
      aspect-ratio:16/10!important;
      overflow:hidden!important;
      border-radius:18px 18px 0 0!important;
      background:#eee!important;
    }

    .meal-day-grid .food-photo img{
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center!important;
      display:block!important;
    }

    @media(max-width:360px){
      #foodSection>.filter-row{top:48px!important;}
      body.meals-scroll-mode .meal-day-grid{max-height:calc(100dvh - 136px)!important;}
      .meal-day-grid .food-photo{height:160px!important;}
    }
  `;
  document.head.appendChild(style);

  function updateMealsScrollMode(){
    const section=document.getElementById('foodSection');
    if(!section)return;
    const isFoodVisible=!section.classList.contains('hidden');
    const reachedTop=section.getBoundingClientRect().top<=0;
    document.body.classList.toggle('meals-scroll-mode',isFoodVisible&&reachedTop);
  }

  window.addEventListener('scroll',updateMealsScrollMode,{passive:true});
  window.addEventListener('resize',updateMealsScrollMode);
  document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>setTimeout(updateMealsScrollMode,80)));
  requestAnimationFrame(updateMealsScrollMode);
})();
