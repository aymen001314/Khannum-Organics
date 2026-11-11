/* Keep both original storefront products and the refreshed catalog; preserve admin-added items. */
(() => {
  const scriptUrl = document.currentScript?.src || window.location.href;
  const image = (path) => new URL(path, new URL('.', scriptUrl)).href;
  const catalog = [
    // Original eight products shown on the storefront before the catalog refresh.
    { id: 'serum-rose', name: 'Rose Renewal Serum', category: 'Skincare', price: 48, stock: 26, image: image('assets/products/saydung-girl-5835667_1920.jpg'), description: 'A brightening botanical serum for calm, radiant-looking skin.' },
    { id: 'cream-gold', name: 'Golden Dew Cream', category: 'Moisturizer', price: 54, stock: 18, image: image('assets/products/foundation.png'), description: 'A nourishing daily cream with a soft, dewy finish.' },
    { id: 'lip-balm', name: 'Petal Lip Balm', category: 'Lip care', price: 24, stock: 38, image: image('assets/products/lips.png'), description: 'A cushiony rose-toned balm for soft, comfortable lips.' },
    { id: 'cleanser-mint', name: 'Mint Cleanse Gel', category: 'Cleansing', price: 32, stock: 43, image: image('assets/products/araxhs-ai-generated-8572403_1920.png'), description: 'A gentle botanical gel wash for a fresh-feeling cleanse.' },
    { id: 'mask-berry', name: 'Berry Glow Mask', category: 'Face', price: 39, stock: 31, image: image('assets/products/8618939-makeup-6698881_1920.jpg'), description: 'A creamy berry-inspired clay mask for a refreshed glow.' },
    { id: 'mist-citrus', name: 'Citrus Dew Mist', category: 'Mist', price: 28, stock: 29, image: image('assets/products/lip.png'), description: 'A fine, refreshing face mist for a dewy pick-me-up.' },
    { id: 'eyeshadow-luxe', name: 'Luxe Neutral Palette', category: 'Makeup', price: 45, stock: 14, image: image('assets/products/eyeshadow%20pallet.png'), description: 'A curated palette of wearable, softly blended shades.' },
    { id: 'foundation-veil', name: 'Veil Foundation', category: 'Makeup', price: 52, stock: 20, image: image('assets/products/foundation.png'), description: 'Buildable foundation with a soft, natural-looking finish.' },
    // Eight additional products.
    { id: 'velvet-icon-lipstick', name: 'Velvet Icon Lipstick', category: 'LIPS', price: 29, stock: 25, image: image('assets/products/lipstick.png'), description: 'A bold, richly pigmented red lipstick for a confident finish.' },
    { id: 'glass-kiss-gloss', name: 'Glass Kiss Lip Gloss', category: 'LIPS', price: 24, stock: 38, image: image('assets/products/gloss.png'), description: 'A glossy lip essential with a smooth, luminous finish.' },
    { id: 'soft-focus-foundation', name: 'Soft Focus Foundation', category: 'COMPLEXION', price: 52, stock: 20, image: image('assets/products/foundation.png'), description: 'A complexion staple for a smooth, natural-looking finish.' },
    { id: 'rosewood-palette', name: 'Rosewood Eyeshadow Palette', category: 'EYES', price: 45, stock: 14, image: image('assets/products/eyeshadow%20pallet.png'), description: 'A versatile palette for soft daytime looks and evening color.' },
    { id: 'everyday-eyeshadow', name: 'Everyday Eyeshadow', category: 'EYES', price: 34, stock: 18, image: image('assets/products/eyeshadow.png'), description: 'Easy-to-wear eye color for your everyday makeup ritual.' },
    { id: 'sculpt-glow-bronzer', name: 'Sculpt & Glow Bronzer', category: 'COMPLEXION', price: 36, stock: 16, image: image('assets/products/irynkaa-bronzer-10371534_1920.jpg'), description: 'A warm bronzer to add a sun-kissed touch to your look.' },
    { id: 'lash-muse', name: 'Lash Muse', category: 'EYES', price: 18, stock: 30, image: image('assets/products/publicdomainpictures-eyelashes-315626_1920.jpg'), description: 'A statement lash look for a little extra definition.' },
    { id: 'makeup-edit', name: 'The Makeup Edit', category: 'MAKEUP', price: 42, stock: 12, image: image('assets/products/eyeshadow-palette-lipstick-brush-cosmetics-products-dual-background.jpg'), description: 'A curated mix of makeup favorites to inspire your next look.' },
  ];

  const catalogIds = new Set(catalog.map((item) => item.id));
  const customProducts = products.filter((item) => item && !catalogIds.has(item.id));
  products = catalog.map((fresh) => {
    const old = products.find((item) => item.id === fresh.id);
    return old ? { ...fresh, stock: old.stock } : fresh;
  }).concat(customProducts);
  const availableIds = new Set(products.map((item) => item.id));
  cart = cart.filter((entry) => availableIds.has(entry.id));
  if (typeof saveAll === 'function') saveAll();
  if (typeof renderAll === 'function') renderAll();

  const style = document.createElement('style');
  style.textContent = `
    :root{--paper:#fbf6f1;--ink:#281a1c;--rose:#7b1832;--pink:#c34e62;--line:#ead9d4}
    body{background:#fbf6f1;color:#281a1c}
    .announcement{background:#541126!important;color:#fff4ea!important}
    .topbar{border-bottom-color:#ead9d4!important}
    .page-masthead{padding-top:62px!important;padding-bottom:24px!important}
    .page-masthead .eyebrow,.product-category{color:#9e2945!important;font-weight:700!important;letter-spacing:.16em!important}
    .page-masthead h1,.product-name{color:#36131f!important}
    .page-masthead h1 em{color:#b12d4b!important}
    .product-grid{gap:26px 20px!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}
    .product-card{overflow:hidden!important;background:#fffdfb!important;border:1px solid #ecded8!important;border-radius:4px!important;box-shadow:0 10px 28px rgba(67,20,37,.08)!important;transition:transform .22s ease,box-shadow .22s ease!important}
    .product-card:hover{transform:translateY(-5px)!important;box-shadow:0 18px 34px rgba(67,20,37,.15)!important}
    .product-card>img{display:block!important;width:100%!important;height:300px!important;object-fit:cover!important;object-position:center!important;background:#f0e2dc!important;color:#421323!important}
    .product-body{padding:18px 18px 20px!important}
    .product-name{font-family:'Playfair Display',Georgia,serif!important;font-size:23px!important;font-weight:600!important;line-height:1.2!important;margin:8px 0!important}
    .product-description{min-height:44px;color:#746266!important;font-size:13px!important}
    .product-price{color:#541126!important;font-size:17px!important;font-weight:700!important}
    .primary-btn{background:#761a35!important;border-color:#761a35!important;color:#fff!important;font-weight:700!important;letter-spacing:.04em!important;border-radius:2px!important}
    .primary-btn:hover{background:#a62848!important;border-color:#a62848!important}
    .product-stock{color:#7b686b!important}
    @media(max-width:900px){.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.product-card>img{height:280px!important}}
    @media(max-width:520px){.product-grid{grid-template-columns:1fr!important;gap:18px!important}.product-card>img{height:340px!important}.product-name{font-size:22px!important}}
  `;
  document.head.append(style);
})();
