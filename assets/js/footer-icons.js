function applyFooterIcons(){
  const icons={
    home:'<svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5.2v-6.1H8.7V21H3.5a.5.5 0 0 1-.5-.5v-9.7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    cart:'<svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2.1 10.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L21 8H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/></svg>',
    track:'<svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    subscription:'<svg class="nav-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.7 7.2A7 7 0 0 0 6 9.4M6.3 16.8A7 7 0 0 0 18 14.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 3v4.8h-4.8M6 21v-4.8h4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  document.querySelectorAll('.bottom-nav .nav-item').forEach((button)=>{
    const iconBox=button.querySelector('div');
    if(!iconBox)return;
    const icon=icons[button.dataset.nav];
    if(icon)iconBox.innerHTML=icon;
  });
}

applyFooterIcons();