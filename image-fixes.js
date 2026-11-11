/* Correct product-specific packshots and migrate older browser-cached catalog entries. */
(() => {
  const imageByProduct = {
    'serum-rose': 'assets/products/rose-serum.svg',
    'cream-gold': 'assets/products/golden-cream.svg',
    'lip-balm': 'assets/products/petal-lip-balm.svg',
    'cleanser-mint': 'assets/products/mint-cleanser.svg',
    'mask-berry': 'assets/products/berry-mask.svg',
    'mist-citrus': 'assets/products/citrus-mist.svg',
    'eyeshadow-luxe': 'assets/products/neutral-palette.svg',
    'foundation-veil': 'assets/products/veil-foundation.svg',
  };

  try {
    const stored = JSON.parse(localStorage.getItem('khannum_products') || 'null');
    if (Array.isArray(stored)) {
      const migrated = stored.map((item) => imageByProduct[item.id] ? { ...item, image: imageByProduct[item.id] } : item);
      localStorage.setItem('khannum_products', JSON.stringify(migrated));
      if (typeof products !== 'undefined') products = migrated;
    } else if (typeof products !== 'undefined') {
      products = products.map((item) => imageByProduct[item.id] ? { ...item, image: imageByProduct[item.id] } : item);
      localStorage.setItem('khannum_products', JSON.stringify(products));
    }
    if (typeof renderAll === 'function') renderAll();
  } catch (error) {
    console.warn('Product image refresh could not migrate browser data.', error);
  }
})();
