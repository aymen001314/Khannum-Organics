/* Restore the complete 16-product shop catalog and preserve inventory/admin additions. */
(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const image = (path) => new URL(path, new URL('.', scriptUrl)).href;
  const catalog = [
    { id: 'serum-rose', name: 'Rose Renewal Serum', category: 'Skincare', price: 48, stock: 26, image: image('assets/products/saydung-girl-5835667_1920.jpg'), description: 'A brightening botanical serum for calm, radiant-looking skin.' },
    { id: 'cream-gold', name: 'Golden Dew Cream', category: 'Moisturizer', price: 54, stock: 18, image: image('assets/products/foundation.png'), description: 'A nourishing daily cream with a soft, dewy finish.' },
    { id: 'lip-balm', name: 'Petal Lip Balm', category: 'Lip care', price: 24, stock: 38, image: image('assets/products/lips.png'), description: 'A cushiony rose-toned balm for soft, comfortable lips.' },
    { id: 'cleanser-mint', name: 'Mint Cleanse Gel', category: 'Cleansing', price: 32, stock: 43, image: image('assets/products/araxhs-ai-generated-8572403_1920.png'), description: 'A gentle botanical gel wash for a fresh-feeling cleanse.' },
    { id: 'mask-berry', name: 'Berry Glow Mask', category: 'Face', price: 39, stock: 31, image: image('assets/products/8618939-makeup-6698881_1920.jpg'), description: 'A creamy berry-inspired clay mask for a refreshed glow.' },
    { id: 'mist-citrus', name: 'Citrus Dew Mist', category: 'Mist', price: 28, stock: 29, image: image('assets/products/lip.png'), description: 'A fine, refreshing face mist for a dewy pick-me-up.' },
    { id: 'eyeshadow-luxe', name: 'Luxe Neutral Palette', category: 'Makeup', price: 45, stock: 14, image: image('assets/products/eyeshadow%20pallet.png'), description: 'A curated palette of wearable, softly blended shades.' },
    { id: 'foundation-veil', name: 'Veil Foundation', category: 'Makeup', price: 52, stock: 20, image: image('assets/products/foundation.png'), description: 'Buildable foundation with a soft, natural-looking finish.' },
    { id: 'velvet-icon-lipstick', name: 'Velvet Icon Lipstick', category: 'LIPS', price: 29, stock: 25, image: image('assets/products/lipstick.png'), description: 'A bold, richly pigmented red lipstick for a confident finish.' },
    { id: 'glass-kiss-gloss', name: 'Glass Kiss Lip Gloss', category: 'LIPS', price: 24, stock: 38, image: image('assets/products/gloss.png'), description: 'A glossy lip essential with a smooth, luminous finish.' },
    { id: 'soft-focus-foundation', name: 'Soft Focus Foundation', category: 'COMPLEXION', price: 52, stock: 20, image: image('assets/products/foundation.png'), description: 'A complexion staple for a smooth, natural-looking finish.' },
    { id: 'rosewood-palette', name: 'Rosewood Eyeshadow Palette', category: 'EYES', price: 45, stock: 14, image: image('assets/products/eyeshadow%20pallet.png'), description: 'A versatile palette for soft daytime looks and evening color.' },
    { id: 'everyday-eyeshadow', name: 'Everyday Eyeshadow', category: 'EYES', price: 34, stock: 18, image: image('assets/products/eyeshadow.png'), description: 'Easy-to-wear eye color for your everyday makeup ritual.' },
    { id: 'sculpt-glow-bronzer', name: 'Sculpt & Glow Bronzer', category: 'COMPLEXION', price: 36, stock: 16, image: image('assets/products/irynkaa-bronzer-10371534_1920.jpg'), description: 'A warm bronzer to add a sun-kissed touch to your look.' },
    { id: 'lash-muse', name: 'Lash Muse', category: 'EYES', price: 18, stock: 30, image: image('assets/products/publicdomainpictures-eyelashes-315626_1920.jpg'), description: 'A statement lash look for a little extra definition.' },
    { id: 'makeup-edit', name: 'The Makeup Edit', category: 'MAKEUP', price: 42, stock: 12, image: image('assets/products/eyeshadow-palette-lipstick-brush-cosmetics-products-dual-background.jpg'), description: 'A curated mix of makeup favorites to inspire your next look.' },
  ];
  const ids = new Set(catalog.map((item) => item.id));
  const extras = products.filter((item) => item && !ids.has(item.id));
  products = catalog.map((fresh) => {
    const previous = products.find((item) => item.id === fresh.id);
    return previous ? { ...fresh, stock: previous.stock } : fresh;
  }).concat(extras);
  const available = new Set(products.map((item) => item.id));
  cart = cart.filter((entry) => available.has(entry.id));
  saveAll();
  renderAll();
})();
