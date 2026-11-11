/* Khannum Organics storefront interactions.
 * Demo data is stored in this browser only; this is not production authentication/payment.
 */
'use strict';

const STORAGE_KEYS = {
  products: 'khannum_products',
  cart: 'khannum_cart',
  orders: 'khannum_orders',
  admin: 'khannum_admin',
};

const DEMO_ADMIN = { username: 'admin', password: 'admin123' };
const DEFAULT_PRODUCTS = [
  { id: 'serum-rose', name: 'Rose Renewal Serum', category: 'Skincare', price: 48, stock: 26, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80', description: 'A brightening serum with rose water and niacinamide for calm, radiant skin.' },
  { id: 'cream-gold', name: 'Golden Dew Cream', category: 'Moisturizer', price: 54, stock: 18, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80', description: 'Velvety hydration to soften texture and leave a healthy glow.' },
  { id: 'lip-balm', name: 'Petal Lip Balm', category: 'Lip care', price: 24, stock: 38, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', description: 'Nourishing lip treatment enriched with jojoba oil and rose wax.' },
  { id: 'cleanser-mint', name: 'Mint Cleanse Gel', category: 'Cleansing', price: 32, stock: 43, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80', description: 'A refreshing cleanser to remove impurities without stripping moisture.' },
  { id: 'mask-berry', name: 'Berry Glow Mask', category: 'Face', price: 39, stock: 31, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', description: 'A purifying clay mask for a fresh, radiant-looking complexion.' },
  { id: 'mist-citrus', name: 'Citrus Dew Mist', category: 'Mist', price: 28, stock: 29, image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80', description: 'A lightweight spray to refresh skin between steps.' },
  { id: 'eyeshadow-luxe', name: 'Luxe Neutral Palette', category: 'Makeup', price: 45, stock: 14, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80', description: 'Silky neutral shades for a soft, flattering eye look.' },
  { id: 'foundation-veil', name: 'Veil Foundation', category: 'Makeup', price: 52, stock: 20, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80', description: 'Buildable coverage with a natural, soft-touch finish.' },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.warn(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (error) { console.error(`Could not save ${key}.`, error); showToast('Could not save in this browser. Check available storage.'); }
}
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
}

let products = readStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
let cart = readStorage(STORAGE_KEYS.cart, []);
let orders = readStorage(STORAGE_KEYS.orders, []);
let searchTerm = '';
let selectedCategory = 'all';
let sortMode = 'featured';

const byId = (id) => document.getElementById(id);
const getProduct = (id) => products.find((item) => item.id === id);
const saveAll = () => {
  writeStorage(STORAGE_KEYS.products, products);
  writeStorage(STORAGE_KEYS.cart, cart);
  writeStorage(STORAGE_KEYS.orders, orders);
};

function showToast(message) {
  let toast = byId('store-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'store-toast';
    toast.className = 'store-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

function installEnhancementStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .shop-tools{display:flex;gap:12px;align-items:center;margin:0 0 24px;flex-wrap:wrap}
    .shop-tools input,.shop-tools select{width:auto;min-width:190px;min-height:42px;background:#fffdf9}
    .shop-tools input{flex:1}.shop-tools .result-count{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#80736c}
    .no-products{grid-column:1/-1;padding:44px 20px;text-align:center;background:#fffdf9;color:#80736c}
    .store-toast{position:fixed;z-index:150;left:50%;bottom:24px;transform:translate(-50%,20px);opacity:0;pointer-events:none;background:#493735;color:#fffaf4;padding:13px 20px;font-size:12px;box-shadow:0 12px 35px #31272530;transition:.25s}
    .store-toast.visible{opacity:1;transform:translate(-50%,0)}
    .primary-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
    @media(max-width:620px){.topbar.menu-open .main-nav{display:flex;position:absolute;left:0;right:0;top:100%;padding:18px 22px;background:#f7f3ed;border-bottom:1px solid #e4d9ce;flex-direction:column;align-items:flex-start;gap:17px;box-shadow:0 18px 25px #31272518}.shop-tools input,.shop-tools select{width:100%;min-width:0}.shop-tools{gap:8px}}
  `;
  document.head.append(style);
}

function addShopTools() {
  const grid = byId('product-grid');
  if (!grid || byId('shop-tools')) return;
  const tools = document.createElement('div');
  tools.id = 'shop-tools';
  tools.className = 'shop-tools';
  tools.innerHTML = `
    <input id="product-search" type="search" placeholder="Search products…" aria-label="Search products" />
    <select id="category-filter" aria-label="Filter by category"><option value="all">All categories</option></select>
    <select id="product-sort" aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select>
    <span id="result-count" class="result-count" aria-live="polite"></span>`;
  grid.before(tools);
  byId('product-search').addEventListener('input', (event) => { searchTerm = event.target.value.trim().toLowerCase(); renderProducts(); });
  byId('category-filter').addEventListener('change', (event) => { selectedCategory = event.target.value; renderProducts(); });
  byId('product-sort').addEventListener('change', (event) => { sortMode = event.target.value; renderProducts(); });
}

function updateCategoryOptions() {
  const select = byId('category-filter');
  if (!select) return;
  const categories = [...new Set(products.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const current = selectedCategory;
  select.innerHTML = '<option value="all">All categories</option>' + categories.map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join('');
  select.value = categories.includes(current) ? current : 'all';
  selectedCategory = select.value;
}

function renderProducts() {
  const grid = byId('product-grid');
  if (!grid) return;
  updateCategoryOptions();
  let visible = products.filter((item) => {
    const matchesText = `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(searchTerm);
    return matchesText && (selectedCategory === 'all' || item.category === selectedCategory);
  });
  if (sortMode === 'price-low') visible.sort((a, b) => a.price - b.price);
  if (sortMode === 'price-high') visible.sort((a, b) => b.price - a.price);
  if (sortMode === 'name') visible.sort((a, b) => a.name.localeCompare(b.name));
  const count = byId('result-count');
  if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`;
  if (!visible.length) {
    grid.innerHTML = '<div class="no-products">No products match your search. Try another name or category.</div>';
    return;
  }
  grid.innerHTML = visible.map((item) => `
    <article class="product-card">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80'" />
      <div class="product-body">
        <div class="product-topline"><span class="product-category">${escapeHTML(item.category)}</span><span class="product-stock">${item.stock > 0 ? `${item.stock} in stock` : 'Sold out'}</span></div>
        <h3 class="product-name">${escapeHTML(item.name)}</h3><p class="product-description">${escapeHTML(item.description)}</p>
        <div class="product-meta"><span class="product-price">${money(item.price)}</span></div>
        <div class="product-actions"><button class="primary-btn" data-action="add" data-id="${escapeHTML(item.id)}" ${item.stock < 1 ? 'disabled' : ''}>${item.stock > 0 ? 'Add to bag' : 'Sold out'}</button></div>
      </div>
    </article>`).join('');
}

function getTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (getProduct(item.id)?.price || 0) * item.quantity, 0);
  const shipping = subtotal ? (byId('shipping-method')?.value === 'express' ? 22 : 12) : 0;
  const tax = subtotal * 0.05;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
function renderCart() {
  const container = byId('cart-items');
  if (!container) return;
  container.innerHTML = cart.length ? cart.map((item) => {
    const current = getProduct(item.id);
    if (!current) return '';
    return `<div class="cart-item"><img src="${escapeHTML(current.image)}" alt="${escapeHTML(current.name)}" /><div class="item-details"><h4>${escapeHTML(current.name)}</h4><div class="item-price">${money(current.price)} each</div><div class="qty-wrap"><button class="qty-btn" type="button" data-action="minus" data-id="${escapeHTML(current.id)}" aria-label="Decrease ${escapeHTML(current.name)} quantity">−</button><span class="qty-value">${item.quantity}</span><button class="qty-btn" type="button" data-action="plus" data-id="${escapeHTML(current.id)}" aria-label="Increase ${escapeHTML(current.name)} quantity">+</button></div></div><button class="remove-item" type="button" data-action="remove" data-id="${escapeHTML(current.id)}">Remove</button></div>`;
  }).join('') : '<div class="empty-cart">Your bag is waiting for something lovely.</div>';
  const totals = getTotals();
  const values = { subtotal: money(totals.subtotal), shipping: money(totals.shipping), tax: money(totals.tax), total: money(totals.total) };
  for (const [part, value] of Object.entries(values)) {
    const cartNode = byId(`cart-${part}`);
    const checkoutNode = byId(`checkout-${part}`);
    if (cartNode) cartNode.textContent = value;
    if (checkoutNode) checkoutNode.textContent = value;
  }
  byId('cart-count').textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
}

function renderAdminProducts() {
  const list = byId('admin-product-list');
  if (!list) return;
  list.innerHTML = products.length ? products.map((item) => `<div class="admin-card"><div class="admin-card-main"><img src="${escapeHTML(item.image)}" alt="" /><div class="admin-card-info"><h5>${escapeHTML(item.name)}</h5><p class="order-text">${escapeHTML(item.category)} · ${money(item.price)} · ${item.stock} in stock</p></div></div><div class="admin-card-actions"><button type="button" data-action="edit" data-id="${escapeHTML(item.id)}">Edit</button><button type="button" class="delete-btn" data-action="delete" data-id="${escapeHTML(item.id)}">Delete</button></div></div>`).join('') : '<div class="empty-cart">No products in the catalog.</div>';
}
function renderOrders() {
  const list = byId('admin-order-list');
  if (!list) return;
  list.innerHTML = orders.length ? orders.map((order) => `<article class="order-card"><div class="order-card-header"><strong>${escapeHTML(order.id)}</strong><span class="order-badge">${escapeHTML(order.status)}</span></div><p class="order-text"><strong>Customer:</strong> ${escapeHTML(order.customer.fullName)} (${escapeHTML(order.customer.email)})</p><p class="order-text"><strong>Shipping:</strong> ${escapeHTML(order.customer.address)}, ${escapeHTML(order.customer.city)} ${escapeHTML(order.customer.zip)}</p><ul class="order-items">${order.items.map((item) => `<li>${escapeHTML(item.name)} × ${item.quantity} — ${money(item.price * item.quantity)}</li>`).join('')}</ul><p class="order-text"><strong>Order total:</strong> ${money(order.total)}</p><label>Update status<select class="order-select" data-action="status" data-id="${escapeHTML(order.id)}">${['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select></label></article>`).join('') : '<div class="empty-cart">No orders yet. New customer orders will appear here.</div>';
}
function renderAll() { renderProducts(); renderCart(); renderAdminProducts(); renderOrders(); }

function toggleAdmin() {
  byId('admin-modal').classList.remove('hidden');
  const signedIn = localStorage.getItem(STORAGE_KEYS.admin) === 'yes';
  byId('admin-login-view').classList.toggle('hidden', signedIn);
  byId('admin-dashboard').classList.toggle('hidden', !signedIn);
  renderAdminProducts(); renderOrders();
}
function resetProductForm() {
  const form = byId('admin-product-form');
  if (!form) return;
  form.reset(); form.elements.productId.value = '';
  byId('product-submit-button').textContent = 'Add product';
}
function handleProductForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const id = String(data.get('productId') || '').trim();
  const price = Number(data.get('productPrice'));
  const stock = Number(data.get('productStock'));
  const image = String(data.get('productImage') || '').trim();
  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0 || !/^https?:\/\//i.test(image)) {
    showToast('Enter a valid price, stock count, and image URL.'); return;
  }
  const item = { id: id || `product-${Date.now()}`, name: String(data.get('productName')).trim(), category: String(data.get('productCategory')).trim(), price, stock, image, description: String(data.get('productDescription')).trim() };
  const existing = products.findIndex((product) => product.id === id);
  if (existing >= 0) products[existing] = item; else products.unshift(item);
  saveAll(); resetProductForm(); renderAll(); showToast(existing >= 0 ? 'Product updated.' : 'Product added to your collection.');
}

function placeOrder(event) {
  event.preventDefault();
  if (!cart.length) { showToast('Add a product to your bag before checkout.'); return; }
  for (const item of cart) {
    const current = getProduct(item.id);
    if (!current || item.quantity > current.stock) { showToast(`${current?.name || 'A product'} no longer has enough stock.`); renderAll(); return; }
  }
  const totals = getTotals();
  const customer = Object.fromEntries(new FormData(event.currentTarget).entries());
  const items = cart.map((item) => { const current = getProduct(item.id); return { id: current.id, name: current.name, quantity: item.quantity, price: current.price }; });
  items.forEach((item) => { getProduct(item.id).stock -= item.quantity; });
  orders.unshift({ id: `ORD-${Date.now()}`, createdAt: new Date().toISOString(), status: 'Confirmed', customer, items, ...totals });
  cart = [];
  saveAll(); event.currentTarget.reset();
  const shippingSelect = byId('shipping-method');
  if (shippingSelect) shippingSelect.value = 'standard';
  renderAll(); showToast('Order placed! It is now saved in the admin panel.');
}

function handleClick(event) {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  const item = getProduct(id);
  if (action === 'add' && item) {
    const inCart = cart.find((entry) => entry.id === id);
    if ((inCart?.quantity || 0) >= item.stock) { showToast('Sorry, that is the last available stock.'); return; }
    if (inCart) inCart.quantity += 1; else cart.push({ id, quantity: 1 });
    saveAll(); renderCart(); showToast(`${item.name} added to your bag.`); return;
  }
  if (action === 'plus') {
    const entry = cart.find((cartItem) => cartItem.id === id);
    if (!entry || !item || entry.quantity >= item.stock) { showToast('No more stock is available.'); return; }
    entry.quantity += 1;
  } else if (action === 'minus') {
    const entry = cart.find((cartItem) => cartItem.id === id);
    if (entry) entry.quantity -= 1;
    cart = cart.filter((cartItem) => cartItem.quantity > 0);
  } else if (action === 'remove') {
    cart = cart.filter((entry) => entry.id !== id);
  } else if (action === 'delete' && item) {
    if (!confirm(`Remove “${item.name}” from the store?`)) return;
    products = products.filter((entry) => entry.id !== id);
    cart = cart.filter((entry) => entry.id !== id);
  } else if (action === 'edit' && item) {
    const form = byId('admin-product-form');
    for (const [field, value] of Object.entries({ productId: item.id, productName: item.name, productCategory: item.category, productPrice: item.price, productStock: item.stock, productImage: item.image, productDescription: item.description })) form.elements[field].value = value;
    byId('product-submit-button').textContent = 'Update product';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  } else return;
  saveAll(); renderAll();
}

function init() {
  installEnhancementStyles();
  addShopTools();
  renderAll();
  byId('cart-toggle')?.addEventListener('click', () => byId('cart-panel').classList.toggle('hidden'));
  byId('close-cart')?.addEventListener('click', () => byId('cart-panel').classList.add('hidden'));
  byId('checkout-link')?.addEventListener('click', () => byId('cart-panel').classList.add('hidden'));
  byId('shipping-method')?.addEventListener('change', renderCart);
  byId('admin-trigger')?.addEventListener('click', toggleAdmin);
  byId('open-admin-quick')?.addEventListener('click', toggleAdmin);
  document.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', () => byId('admin-modal').classList.add('hidden')));
  byId('admin-login-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    if (data.get('username') === DEMO_ADMIN.username && data.get('password') === DEMO_ADMIN.password) {
      localStorage.setItem(STORAGE_KEYS.admin, 'yes'); toggleAdmin(); event.currentTarget.reset();
    } else showToast('Login details are not correct.');
  });
  byId('admin-logout')?.addEventListener('click', () => { localStorage.removeItem(STORAGE_KEYS.admin); toggleAdmin(); });
  byId('admin-product-form')?.addEventListener('submit', handleProductForm);
  byId('cancel-product-edit')?.addEventListener('click', resetProductForm);
  byId('checkout-form')?.addEventListener('submit', placeOrder);
  document.addEventListener('click', handleClick);
  document.addEventListener('change', (event) => {
    const select = event.target.closest('[data-action="status"]');
    if (!select) return;
    const order = orders.find((entry) => entry.id === select.dataset.id);
    if (order) { order.status = select.value; writeStorage(STORAGE_KEYS.orders, orders); renderOrders(); showToast('Order status updated.'); }
  });
  document.querySelectorAll('.tab-button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach((tab) => tab.classList.toggle('active', tab === button));
    byId('admin-products-panel').classList.toggle('hidden', button.dataset.tab !== 'products');
    byId('admin-orders-panel').classList.toggle('hidden', button.dataset.tab !== 'orders');
  }));
  const mobileMenu = document.querySelector('.mobile-menu');
  mobileMenu?.addEventListener('click', () => {
    const open = document.querySelector('.topbar').classList.toggle('menu-open');
    mobileMenu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('.topbar').classList.remove('menu-open')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { byId('cart-panel').classList.add('hidden'); byId('admin-modal').classList.add('hidden'); document.querySelector('.topbar').classList.remove('menu-open'); }
  });
}

init();
