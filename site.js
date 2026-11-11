(function () {
  const menuButton = document.querySelector('.mobile-menu');
  const topbar = document.querySelector('.topbar');
  menuButton?.addEventListener('click', () => {
    const expanded = topbar.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(expanded));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.getElementById('cart-panel')?.classList.add('hidden');
      document.getElementById('admin-modal')?.classList.add('hidden');
      topbar?.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });
  const video = document.querySelector('.lux-hero-video');
  const soundButton = document.querySelector('.sound-toggle');
  soundButton?.addEventListener('click', () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? 'MUTED · LOOPING' : 'SOUND ON · LOOPING';
    soundButton.setAttribute('aria-label', video.muted ? 'Turn video sound on' : 'Mute video');
  });
  if (video) video.addEventListener('error', () => { video.style.display = 'none'; });
  document.querySelectorAll('.main-nav a[aria-current="page"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
  const checkoutLink = document.getElementById('checkout-link');
  checkoutLink?.addEventListener('click', (event) => {
    if (location.pathname.toLowerCase().endsWith('/checkout.html')) {
      event.preventDefault();
      document.getElementById('cart-panel')?.classList.add('hidden');
      document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
