/* Khannum Organics storefront interactions. Browser-local demo; no real payment/backend. */
'use strict';

const STORAGE_KEYS = { products: 'khannum_products', cart: 'khannum_cart', orders: 'khannum_orders' };
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };
const PRODUCT_IMAGES = {
  'serum-rose': 'assets/products/rose-serum.svg',
  'cream-gold': 'assets/products/golden-cream.svg',
  'lip-balm': 'assets/products/petal-lip-balm.svg',
  'cleanser-mint': 'assets/products/mint-cleanser.svg',
  'mask-berry': 'assets/products/berry-mask.svg',
  'mist-citrus': 'assets/products/citrus-mist.svg',
  'eyeshadow-luxe': 'assets/products/neutral-palette.svg',
  'foundation-veil': 'assets/products/veil-foundation.svg',
};
const DEFAULT_PRODUCTS = [
  { id: 'serum-rose', name: 'Rose Renewal Serum', category: 'Skincare', price: 48, stock: 26, image: PRODUCT_IMAGES['serum-rose'], description: 'A brightening botanical serum for calm, radiant-looking skin.' },
  { id: 'cream-gold', name: 'Golden Dew Cream', category: 'Moisturizer', price: 54, stock: 18, image: PRODUCT_IMAGES['cream-gold'], description: 'A nourishing daily cream with a soft, dewy finish.' },
  { id: 'lip-balm', name: 'Petal Lip Balm', category: 'Lip care', price: 24, stock: 38, image: PRODUCT_IMAGES['lip-balm'], description: 'A cushiony rose-toned balm for soft, comfortable lips.' },
  { id: 'cleanser-mint', name: 'Mint Cleanse Gel', category: 'Cleansing', price: 32, stock: 43, image: PRODUCT_IMAGES['cleanser-mint'], description: 'A gentle botanical gel wash for a fresh-feeling cleanse.' },
  { id: 'mask-berry', name: 'Berry Glow Mask', category: 'Face', price: 39, stock: 31, image: PRODUCT_IMAGES['mask-berry'], description: 'A creamy berry-inspired clay mask for a refreshed glow.' },
  { id: 'mist-citrus', name: 'Citrus Dew Mist', category: 'Mist', price: 28, stock: 29, image: PRODUCT_IMAGES['mist-citrus'], description: 'A fine, refreshing face mist for a dewy pick-me-up.' },
  { id: 'eyeshadow-luxe', name: 'Luxe Neutral Palette', category: 'Makeup', price: 45, stock: 14, image: PRODUCT_IMAGES['eyeshadow-luxe'], description: 'A curated palette of wearable, softly blended neutral shades.' },
  { id: 'foundation-veil', name: 'Veil Foundation', category: 'Makeup', price: 52, stock: 20, image: PRODUCT_IMAGES['foundation-veil'], description: 'Buildable foundation with a soft, natural-looking finish.' },
];

function readStorage(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
  catch (error) { console.warn(`Could not read ${key}`, error); return fallback; }
}
function writeStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch (error) { console.error(`Could not save ${key}`, error); notify('Could not save this change in your browser.'); }
}
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function currency(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0); }

let products = readStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
let cart = readStorage(STORAGE_KEYS.cart, []);
let orders = readStorage(STORAGE_KEYS.orders, []);
if (!Array.isArray(products)) products = DEFAULT_PRODUCTS;
if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(orders)) orders = [];

// Refresh old demo entries so stale, mismatched stock photos are replaced after update.
products = products.map((item) => PRODUCT_IMAGES[item.id] ? { ...item, image: PRODUCT_IMAGES[item.id] } : item);
writeStorage(STORAGE_KEYS.products, products);
const $ = (id) => document.getElementById(id);
const getProduct = (id) => products.find((item) => item.id === id);
function saveAll() { writeStorage(STORAGE_KEYS.products, products); writeStorage(STORAGE_KEYS.cart, cart); writeStorage(STORAGE_KEYS.orders, orders); }
function notify(message) {
  let toast = $('store-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'store-toast'; toast.className = 'store-toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
  toast.textContent = message; toast.classList.add('visible'); clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

function getTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (getProduct(item.id)?.price || 0) * item.quantity, 0);
  const shipping = subtotal ? ($('shipping-method')?.value === 'express' ? 22 : 12) : 0;
  const tax = subtotal * 0.05;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function renderProducts() {
  const grid = $('product-grid');
  if (!grid) return;
  const visible = products;
  grid.innerHTML = visible.length ? visible.map((item) => `
    <article class="product-card">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" />
      <div class="product-body">
        <div class="product-topline"><span class="product-category">${escapeHTML(item.category)}</span><span class="product-stock">${item.stock > 0 ? `${item.stock} in stock` : 'Sold out'}</span></div>
        <h3 class="product-name">${escapeHTML(item.name)}</h3><p class="product-description">${escapeHTML(item.description)}</p>
        <div class="product-meta"><span class="product-price">${currency(item.price)}</span></div>
        <div class="product-actions"><button class="primary-btn" type="button" data-action="add" data-id="${escapeHTML(item.id)}" ${item.stock < 1 ? 'disabled' : ''}>${item.stock < 1 ? 'Sold out' : 'Add to bag'}</button></div>
      </div>
    </article>`).join('') : '<p class="empty-cart">No products are available right now.</p>';
}

function renderCart() {
  const list = $('cart-items');
  if (list) {
    list.innerHTML = cart.length ? cart.map((entry) => {
      const item = getProduct(entry.id);
      if (!item) return '';
      return `<div class="cart-item"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}"/><div class="item-details"><h4>${escapeHTML(item.name)}</h4><div class="item-price">${currency(item.price)} each</div><div class="qty-wrap"><button class="qty-btn" type="button" data-action="minus" data-id="${escapeHTML(item.id)}" aria-label="Decrease quantity">−</button><span class="qty-value">${entry.quantity}</span><button class="qty-btn" type="button" data-action="plus" data-id="${escapeHTML(item.id)}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" type="button" data-action="remove" data-id="${escapeHTML(item.id)}">Remove</button></div>`;
    }).join('') : '<div class="empty-cart">Your bag is waiting for something lovely.</div>';
  }
  const totals = getTotals();
  const values = { subtotal: currency(totals.subtotal), shipping: currency(totals.shipping), tax: currency(totals.tax), total: currency(totals.total) };
  Object.entries(values).forEach(([key, value]) => {
    const cartNode = $(`cart-${key}`), checkoutNode = $(`checkout-${key}`);
    if (cartNode) cartNode.textContent = value;
    if (checkoutNode) checkoutNode.textContent = value;
  });
  const count = $('cart-count');
  if (count) count.textContent = String(cart.reduce((sum, entry) => sum + entry.quantity, 0));
  const checkoutItems = $('checkout-items');
  if (checkoutItems) checkoutItems.innerHTML = cart.map((entry) => { const item = getProduct(entry.id); return item ? `<div class="checkout-line"><span>${escapeHTML(item.name)} × ${entry.quantity}</span><strong>${currency(item.price * entry.quantity)}</strong></div>` : ''; }).join('') || '<p class="checkout-line">Your bag is empty.</p>';
}

function renderAdminProducts() {
  const list = $('admin-product-list');
  if (!list) return;
  list.innerHTML = products.length ? products.map((item) => `<div class="admin-card"><div class="admin-card-main"><img src="${escapeHTML(item.image)}" alt=""/><div class="admin-card-info"><h5>${escapeHTML(item.name)}</h5><p class="order-text">${escapeHTML(item.category)} · ${currency(item.price)} · ${item.stock} in stock</p></div></div><div class="admin-card-actions"><button type="button" data-action="edit" data-id="${escapeHTML(item.id)}">Edit</button><button type="button" class="delete-btn" data-action="delete" data-id="${escapeHTML(item.id)}">Delete</button></div></div>`).join('') : '<div class="empty-cart">No products in the catalog.</div>';
}
function renderOrders() {
  const list = $('admin-order-list');
  if (!list) return;
  list.innerHTML = orders.length ? orders.map((order) => `<article class="order-card"><div class="order-card-header"><strong>${escapeHTML(order.id)}</strong><span class="order-badge">${escapeHTML(order.status)}</span></div><p class="order-text"><strong>Customer:</strong> ${escapeHTML(order.customer.fullName)} (${escapeHTML(order.customer.email)})</p><p class="order-text"><strong>Shipping:</strong> ${escapeHTML(order.customer.address)}, ${escapeHTML(order.customer.city)} ${escapeHTML(order.customer.zip)}</p><ul class="order-items">${order.items.map((item) => `<li>${escapeHTML(item.name)} × ${item.quantity} — ${currency(item.price * item.quantity)}</li>`).join('')}</ul><p class="order-text"><strong>Order total:</strong> ${currency(order.total)}</p><label>Update status<select class="order-select" data-action="status" data-id="${escapeHTML(order.id)}">${['Confirmed','Processing','Shipped','Delivered','Cancelled'].map((status) => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label></article>`).join('') : '<div class="empty-cart">No orders yet. Customer orders will appear here.</div>';
}
function renderAll() { renderProducts(); renderCart(); renderAdminProducts(); renderOrders(); }

function openAdmin() {
  const modal = $('admin-modal');
  if (!modal) { window.location.href = 'index.html#admin'; return; }
  modal.classList.remove('hidden');
  const loggedIn = localStorage.getItem('khannum_admin') === 'yes';
  $('admin-login-view')?.classList.toggle('hidden', loggedIn);
  $('admin-dashboard')?.classList.toggle('hidden', !loggedIn);
  renderAdminProducts(); renderOrders();
}
function resetProductForm() {
  const form = $('admin-product-form');
  if (!form) return;
  form.reset(); form.elements.productId.value = '';
  const button = $('product-submit-button'); if (button) button.textContent = 'Add product';
}
function submitProduct(event) {
  event.preventDefault();
  const form = event.currentTarget, data = new FormData(form), id = String(data.get('productId') || '');
  const image = String(data.get('productImage') || '').trim(), price = Number(data.get('productPrice')), stock = Number(data.get('productStock'));
  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0 || !/^https?:\/\//i.test(image)) { notify('Enter a valid price, whole-number stock, and image URL.'); return; }
  const item = { id: id || `product-${Date.now()}`, name: String(data.get('productName')).trim(), category: String(data.get('productCategory')).trim(), price, stock, image, description: String(data.get('productDescription')).trim() };
  const index = products.findIndex((entry) => entry.id === id);
  if (index >= 0) products[index] = item; else products.unshift(item);
  saveAll(); resetProductForm(); renderAll(); notify(index >= 0 ? 'Product updated.' : 'Product added.');
}
function submitOrder(event) {
  event.preventDefault();
  if (!cart.length) { notify('Your bag is empty. Add a product before checkout.'); return; }
  for (const entry of cart) {
    const item = getProduct(entry.id);
    if (!item || entry.quantity > item.stock) { notify(`${item?.name || 'A product'} does not have enough stock.`); return; }
  }
  const totals = getTotals(), customer = Object.fromEntries(new FormData(event.currentTarget).entries());
  const items = cart.map((entry) => { const item = getProduct(entry.id); return { id: item.id, name: item.name, quantity: entry.quantity, price: item.price }; });
  items.forEach((entry) => { getProduct(entry.id).stock -= entry.quantity; });
  orders.unshift({ id: `ORD-${Date.now()}`, createdAt: new Date().toISOString(), status: 'Confirmed', customer, items, ...totals });
  cart = []; saveAll(); event.currentTarget.reset(); renderAll(); notify('Order placed! It is now available in the admin panel.');
}

function handleAction(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id } = button.dataset, item = getProduct(id);
  if (action === 'add' && item) {
    const entry = cart.find((row) => row.id === id);
    if ((entry?.quantity || 0) >= item.stock) { notify('No more stock is available.'); return; }
    if (entry) entry.quantity += 1; else cart.push({ id, quantity: 1 });
    saveAll(); renderAll(); notify(`${item.name} added to your bag.`); return;
  }
  if (action === 'plus') {
    const entry = cart.find((row) => row.id === id);
    if (!entry || !item || entry.quantity >= item.stock) { notify('No more stock is available.'); return; }
    entry.quantity += 1;
  } else if (action === 'minus') {
    const entry = cart.find((row) => row.id === id); if (entry) entry.quantity -= 1;
    cart = cart.filter((row) => row.quantity > 0);
  } else if (action === 'remove') cart = cart.filter((row) => row.id !== id);
  else if (action === 'delete' && item) {
    if (!confirm(`Remove “${item.name}” from the store?`)) return;
    products = products.filter((row) => row.id !== id); cart = cart.filter((row) => row.id !== id);
  } else if (action === 'edit' && item) {
    const form = $('admin-product-form'); if (!form) return;
    Object.entries({ productId: item.id, productName: item.name, productCategory: item.category, productPrice: item.price, productStock: item.stock, productImage: item.image, productDescription: item.description }).forEach(([field, value]) => { form.elements[field].value = value; });
    $('product-submit-button').textContent = 'Update product'; form.scrollIntoView({ behavior: 'smooth', block: 'start' }); return;
  } else return;
  saveAll(); renderAll();
}

function init() {
  renderAll();
  $('cart-toggle')?.addEventListener('click', () => $('cart-panel')?.classList.toggle('hidden'));
  $('close-cart')?.addEventListener('click', () => $('cart-panel')?.classList.add('hidden'));
  $('shipping-method')?.addEventListener('change', renderCart);
  $('admin-trigger')?.addEventListener('click', openAdmin);
  document.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', () => $('admin-modal')?.classList.add('hidden')));
  $('admin-login-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    if (data.get('username') === ADMIN_CREDENTIALS.username && data.get('password') === ADMIN_CREDENTIALS.password) { localStorage.setItem('khannum_admin', 'yes'); openAdmin(); event.currentTarget.reset(); }
    else notify('Login details are not correct.');
  });
  $('admin-logout')?.addEventListener('click', () => { localStorage.removeItem('khannum_admin'); openAdmin(); });
  $('admin-product-form')?.addEventListener('submit', submitProduct);
  $('cancel-product-edit')?.addEventListener('click', resetProductForm);
  $('checkout-form')?.addEventListener('submit', submitOrder);
  $('checkout-link')?.addEventListener('click', () => $('cart-panel')?.classList.add('hidden'));
  document.addEventListener('click', handleAction);
  document.addEventListener('change', (event) => {
    const select = event.target.closest('[data-action="status"]');
    if (!select) return;
    const order = orders.find((entry) => entry.id === select.dataset.id);
    if (order) { order.status = select.value; writeStorage(STORAGE_KEYS.orders, orders); renderOrders(); notify('Order status updated.'); }
  });
  document.querySelectorAll('.tab-button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach((tab) => tab.classList.toggle('active', tab === button));
    $('admin-products-panel')?.classList.toggle('hidden', button.dataset.tab !== 'products');
    $('admin-orders-panel')?.classList.toggle('hidden', button.dataset.tab !== 'orders');
  }));
  if (location.hash === '#admin') openAdmin();
}

init();
