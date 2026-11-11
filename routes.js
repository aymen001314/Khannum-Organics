(function () {
  const validRoutes = new Set(['home', 'shop', 'about', 'checkout']);
  let currentRoute = 'home';

  function navigate(route, options = {}) {
    if (!validRoutes.has(route)) route = 'home';
    currentRoute = route;
    document.querySelectorAll('.route-section').forEach((section) => {
      const routes = (section.dataset.route || '').split(/\s+/);
      section.hidden = !routes.includes(route);
    });
    document.querySelectorAll('[data-route-target]').forEach((button) => {
      button.classList.toggle('route-active', button.dataset.routeTarget === route);
    });
    document.querySelector('.topbar')?.classList.remove('menu-open');
    document.querySelector('.mobile-menu')?.setAttribute('aria-expanded', 'false');
    if (options.updateHistory !== false) history.pushState({ route }, '', `#${route}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (route === 'checkout') document.getElementById('checkout-form')?.querySelector('input')?.focus({ preventScroll: true });
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-route-target]');
    if (target) navigate(target.dataset.routeTarget);
    if (event.target.closest('#checkout-link')) {
      event.preventDefault();
      document.getElementById('cart-panel')?.classList.add('hidden');
      if (!document.querySelector('.cart-item')) {
        const empty = document.querySelector('#cart-items .empty-cart');
        if (empty) { empty.textContent = 'Your bag is empty — add a product before checkout.'; }
      }
      navigate('checkout');
    }
  });

  window.addEventListener('popstate', (event) => navigate(event.state?.route || location.hash.slice(1) || 'home', { updateHistory: false }));
  const initialRoute = location.hash.slice(1);
  navigate(validRoutes.has(initialRoute) ? initialRoute : 'home', { updateHistory: false });
})();
