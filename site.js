/* Shared page interactions + campaign hero. */
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
  if (hero) {
    hero.style.backgroundImage = "linear-gradient(90deg,rgba(28,8,13,.63),rgba(40,8,16,.20) 60%,rgba(28,8,13,.04)),url('assets/products/saydung-girl-5835667_1920.jpg')";
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center 38%';
    const video = hero.querySelector('.lux-hero-video');
    if (video) video.hidden = true;
    const shade = hero.querySelector('.lux-hero-shade');
    if (shade) shade.style.background = 'transparent';
    const soundButton = hero.querySelector('.sound-toggle');
    if (soundButton) soundButton.hidden = true;
    const caption = hero.querySelector('.lux-video-caption');
    if (caption) caption.textContent = 'THE RED LIP EDIT · KHANNUM ORGANICS';
  }

  // Run classic scripts in sequence after app.js has initialized its shared catalog.
  const imageScript = document.createElement('script');
  imageScript.src = 'uploaded-product-images.js';
  imageScript.async = false;
  imageScript.onload = () => {
    const catalogScript = document.createElement('script');
    catalogScript.src = 'catalog-enhancements.js';
    catalogScript.async = false;
    document.body.append(catalogScript);
  };
  document.body.append(imageScript);

  document.getElementById('checkout-link')?.addEventListener('click', () => {
    document.getElementById('cart-panel')?.classList.add('hidden');
  });
})();
