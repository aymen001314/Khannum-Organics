/* Apply the real photos uploaded to assets/products and refresh old browser-saved entries. */
(() => {
  const uploadedPhotos = {
    'lip-balm': 'assets/products/gloss.png',
    'eyeshadow-luxe': 'assets/products/eyeshadow%20pallet.png',
    'foundation-veil': 'assets/products/foundation.png',
    'velvet-icon-lipstick': 'assets/products/lipstick.png',
  };
  try {
    const stored = JSON.parse(localStorage.getItem('khannum_products') || 'null');
    const current = Array.isArray(stored) ? stored : (typeof products !== 'undefined' ? products : []);
    const refreshed = current.map((item) => uploadedPhotos[item.id] ? { ...item, image: uploadedPhotos[item.id] } : item);
    if (typeof products !== 'undefined') products = refreshed;
    localStorage.setItem('khannum_products', JSON.stringify(refreshed));
    if (typeof renderAll === 'function') renderAll();
  } catch (error) {
    console.warn('Could not apply uploaded product images.', error);
  }
})();
