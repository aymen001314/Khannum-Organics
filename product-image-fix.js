/* Repair product photo URLs on GitHub Pages and refresh already-saved browser data. */
(() => {
  const filesById = {
    'serum-rose': 'assets/products/saydung-girl-5835667_1920.jpg',
    'cream-gold': 'assets/products/foundation.png',
    'lip-balm': 'assets/products/lips.png',
    'cleanser-mint': 'assets/products/araxhs-ai-generated-8572403_1920.png',
    'mask-berry': 'assets/products/8618939-makeup-6698881_1920.jpg',
    'mist-citrus': 'assets/products/lip.png',
    'eyeshadow-luxe': 'assets/products/eyeshadow%20pallet.png',
    'foundation-veil': 'assets/products/foundation.png',
    'velvet-icon-lipstick': 'assets/products/lipstick.png',
    'glass-kiss-gloss': 'assets/products/gloss.png',
    'soft-focus-foundation': 'assets/products/foundation.png',
    'rosewood-palette': 'assets/products/eyeshadow%20pallet.png',
    'everyday-eyeshadow': 'assets/products/eyeshadow.png',
    'sculpt-glow-bronzer': 'assets/products/irynkaa-bronzer-10371534_1920.jpg',
    'lash-muse': 'assets/products/publicdomainpictures-eyelashes-315626_1920.jpg',
    'makeup-edit': 'assets/products/eyeshadow-palette-lipstick-brush-cosmetics-products-dual-background.jpg',
  };
  const base = new URL('.', window.location.href);
  products = products.map((product) => filesById[product.id]
    ? { ...product, image: new URL(filesById[product.id], base).href }
    : product);
  saveAll();
  renderAll();
})();
