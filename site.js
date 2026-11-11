/* Shared page interactions + brand styling polish. */
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

  const brandStyles = document.createElement('style');
  brandStyles.textContent = `
    .brand-wrap{gap:12px!important;transition:transform .2s ease}
    .brand-wrap:hover{transform:translateY(-1px)}
    .brand-mark{width:46px!important;height:46px!important;display:grid!important;place-items:center!important;border:1.5px solid #a34a4c!important;border-radius:50%!important;background:linear-gradient(145deg,#fff8eb 0%,#f0d7b4 100%)!important;color:#8f2638!important;font-size:25px!important;font-weight:700!important;box-shadow:0 3px 12px rgba(106,35,43,.13)!important}
    .brand-lockup{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important}
    .brand-name{color:#7d1f32!important;font-size:clamp(20px,2vw,25px)!important;font-weight:700!important;letter-spacing:.18em!important;line-height:1.08!important;text-shadow:0 1px 0 rgba(255,255,255,.7)}
    .brand-lockup .brand-tagline,.brand-lockup small,.brand-subtitle{color:#9a6549!important;font-size:9px!important;font-weight:600!important;letter-spacing:.16em!important;line-height:1.35!important}
    @media(max-width:620px){.brand-wrap{gap:8px!important}.brand-mark{width:39px!important;height:39px!important;font-size:22px!important}.brand-name{font-size:17px!important;letter-spacing:.13em!important}.brand-lockup .brand-tagline,.brand-lockup small,.brand-subtitle{font-size:7px!important}}
  `;
  document.head.append(brandStyles);

  // Use the uploaded lipstick campaign image for the home hero and keep its framing natural.
  const hero = document.querySelector('.lux-hero');
  if (hero) {
    const campaignPhoto = 'assets/products/lip.png';
    hero.style.backgroundImage = `linear-gradient(90deg,rgba(28,8,13,.58),rgba(40,8,16,.20) 58%,rgba(28,8,13,.04)),url('${campaignPhoto}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center 38%';
    hero.style.backgroundRepeat = 'no-repeat';
    hero.style.backgroundColor = '#421323';
    const video = hero.querySelector('.lux-hero-video');
    if (video) video.hidden = true;
    const shade = hero.querySelector('.lux-hero-shade');
    if (shade) shade.style.background = 'transparent';
    const soundButton = hero.querySelector('.sound-toggle');
    if (soundButton) soundButton.hidden = true;
    const caption = hero.querySelector('.lux-video-caption');
    if (caption) caption.textContent = 'THE RED LIP EDIT · KHANNUM ORGANICS';
  }

  const catalogScript = document.createElement('script');
  catalogScript.src = 'catalog-refresh.js';
  catalogScript.async = false;
  document.body.append(catalogScript);

  document.getElementById('checkout-link')?.addEventListener('click', () => {
    document.getElementById('cart-panel')?.classList.add('hidden');
  });
})();
