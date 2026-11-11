/* Add the campaign's liquid lipstick as a separate, accurately pictured item. */
(() => {
  if (typeof products === 'undefined' || typeof renderAll !== 'function') return;
  const lipstick = {
    id: 'velvet-icon-lipstick',
    name: 'Velvet Icon Liquid Lipstick',
    category: 'Makeup',
    price: 29,
    stock: 25,
    image: 'assets/products/velvet-icon-lipstick.svg',
    description: 'A richly pigmented, comfortable deep-red liquid lipstick with a soft velvet finish.'
  };
  const existing = products.find((item) => item.id === lipstick.id);
  if (existing) Object.assign(existing, lipstick);
  else products.push(lipstick);
  if (typeof saveAll === 'function') saveAll();
  renderAll();
})();
