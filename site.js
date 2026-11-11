/* Shared page interactions + cinematic red-lip campaign hero. */
(() => {
  const menuButton = document.querySelector('.mobile-menu');
  const topbar = document.querySelector('.topbar');
  menuButton?.addEventListener('click', () => {
    const expanded = topbar.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(expanded));
  });
  document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    topbar?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.getElementById('cart-panel')?.classList.add('hidden');
      document.getElementById('admin-modal')?.classList.add('hidden');
      topbar?.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });

  const hero = document.querySelector('.lux-hero');
  const video = document.querySelector('.lux-hero-video');
  if (hero) {
    // Use a reliable campaign portrait as the opening visual rather than a mismatched video.
    hero.style.backgroundImage = "linear-gradient(90deg,rgba(28,8,13,.63),rgba(40,8,16,.20) 60%,rgba(28,8,13,.04)),url('https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=2200')";
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center 38%';
    if (video) video.hidden = true;
    const shade = hero.querySelector('.lux-hero-shade');
    if (shade) shade.style.background = 'transparent';
    const soundButton = hero.querySelector('.sound-toggle');
    if (soundButton) soundButton.hidden = true;
    const caption = hero.querySelector('.lux-video-caption');
    if (caption) caption.textContent = 'THE RED LIP EDIT · KHANNUM ORGANICS';
  }

  // Add a distinct liquid lipstick product while keeping lip balm as its own item.
  const catalogScript = document.createElement('script');
  catalogScript.src = 'catalog-enhancements.js';
  catalogScript.defer = true;
  document.body.append(catalogScript);

  document.getElementById('checkout-link')?.addEventListener('click', () => {
    document.getElementById('cart-panel')?.classList.add('hidden');
  });
})();
