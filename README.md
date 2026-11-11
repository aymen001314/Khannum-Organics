const STORAGE_KEYS = {
  products: 'khannum_products',
  cart: 'khannum_cart',
  orders: 'khannum_orders',
  adminSession: 'khannum_admin_session',
};

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
};

const DEFAULT_PRODUCTS = [
  {
    id: 'serum-rose',
    name: 'Rose Renewal Serum',
    category: 'Skincare',
    price: 48,
    stock: 26,
    image:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
    description: 'A brightening serum with rose water and niacinamide for calm, radiant skin.',
  },
  {
    id: 'cream-gold',
    name: 'Golden Dew Cream',
    category: 'Moisturizer',
    price: 54,
    stock: 18,
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    description: 'Velvety hydration to soften texture and leave a healthy glow.',
  },
  {
    id: 'lip-balm',
    name: 'Petal Lip Balm',
    category: 'Lip care',
    price: 24,
    stock: 38,
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    description: 'Nourishing lip treatment enriched with jojoba oil and rose wax.',
  },
  {
    id: 'cleanser-mint',
    name: 'Mint Cleanse Gel',
    category: 'Cleansing',
    price: 32,
    stock: 43,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    description: 'A refreshing cleanser to remove impurities without stripping moisture.',
  },
  {
    id: 'mask-berry',
    name: 'Berry Glow Mask',
    category: 'Face',
    price: 39,
    stock: 31,
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    description: 'Detoxifying clay mask that purifies and replenishes skin clarity.',
  },
  {
    id: 'mist-citrus',
    name: 'Citrus Dew Mist',
    category: 'Mist',
    price: 28,
    stock: 29,
    image:
      'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80',
    description: 'A lightweight spray to refresh skin between steps and boost glow.',
  },
  {
    id: 'eyeshadow-luxe',
    name: 'Luxe Neutral Palette',
    category: 'Makeup',
    price: 45,
    stock: 14,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
    description: 'Silky neutrals designed to create a soft, flattering eye look.',
  },
  {
    id: 'foundation-veil',
    name: 'Veil Foundation',
    category: 'Makeup',
    price: 52,
    stock: 20,
    image:
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80',
    description: 'Buildable medium coverage with a natural finish and soft-touch feel.',
  },
];

let products = loadStoredData(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
let cart = loadStoredData(STORAGE_KEYS.cart, []);
let orders = loadStoredData(STORAGE_KEYS.orders, []);
let adminLoggedIn = Boolean(loadStoredData(STORAGE_KEYS.adminSession, false));

const el = {
  productGrid: document.getElementById('product-grid'),
  cartItems: document.getElementById('cart-items'),
  cartPanel: document.getElementById('cart-panel'),
  cartToggle: document.getElementById('cart-toggle'),
  closeCart: document.getElementById('close-cart'),
  checkoutLink: document.getElementById('checkout-link'),
  cartCount: document.getElementById('cart-count'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartShipping: document.getElementById('cart-shipping'),
  cartTax: document.getElementById('cart-tax'),
  cartTotal: document.getElementById('cart-total'),
  checkoutForm: document.getElementById('checkout-form'),
  checkoutSubtotal: document.getElementById('checkout-subtotal'),
  checkoutShipping: document.getElementById('checkout-shipping'),
  checkoutTax: document.getElementById('checkout-tax'),
  checkoutTotal: document.getElementById('checkout-total'),
  shippingMethod: document.getElementById('shipping-method'),
  adminModal: document.getElementById('admin-modal'),
  adminTrigger: document.getElementById('admin-trigger'),
  openAdminQuick: document.getElementById('open-admin-quick'),
  adminLoginView: document.getElementById('admin-login-view'),
  adminDashboard: document.getElementById('admin-dashboard'),
  adminLoginForm: document.getElementById('admin-login-form'),
  adminLogout: document.getElementById('admin-logout'),
  adminProductForm: document.getElementById('admin-product-form'),
  adminProductList: document.getElementById('admin-product-list'),
  adminOrderList: document.getElementById('admin-order-list'),
  productSubmitButton: document.getElementById('product-submit-button'),
  cancelProductEdit: document.getElementById('cancel-product-edit'),
  tabButtons: Array.from(document.querySelectorAll('.tab-button')),
  adminProductsPanel: document.getElementById('admin-products-panel'),
  adminOrdersPanel: document.getElementById('admin-orders-panel'),
  modalCloseButtons: document.querySelectorAll('.modal-close'),
};

function loadStoredData(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return fallback;
    const parsedValue = JSON.parse(storedValue);
    return parsedValue ?? fallback;
  } catch (error) {
    console.error('Storage read error:', error);
    return fallback;
  }
}

function saveStoredData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

function getCartTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shippingMode = el.shippingMethod.value;
  const calculatedShipping = subtotal === 0 ? 0 : shippingMode === 'express' ? 22 : 12;
  const tax = subtotal * 0.05;
  const total = subtotal + calculatedShipping + tax;

  return { subtotal, shipping: calculatedShipping, tax, total };
}

function renderProducts() {
  el.productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-body">
            <div class="product-topline">
              <span class="product-category">${product.category}</span>
              <span class="product-stock">${product.stock} in stock</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
              <span class="product-price">${formatCurrency(product.price)}</span>
            </div>
            <div class="product-actions">
              <button class="primary-btn" data-action="add-to-cart" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderCart() {
  if (!cart.length) {
    el.cartItems.innerHTML = '<div class="empty-cart">Your cart is empty. Add a few essentials to start shopping.</div>';
  } else {
    el.cartItems.innerHTML = cart
      .map((item) => {
        const product = getProductById(item.id);
        if (!product) return '';

        return `
          <div class="cart-item">
            <img src="${product.image}" alt="${product.name}" />
            <div class="item-details">
              <h4>${product.name}</h4>
              <div class="item-price">${formatCurrency(product.price)} each</div>
              <div class="qty-wrap">
                <button class="qty-btn" type="button" data-action="decrease-qty" data-id="${product.id}">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" type="button" data-action="increase-qty" data-id="${product.id}">+</button>
              </div>
            </div>
            <button class="remove-item" type="button" data-action="remove-item" data-id="${product.id}">Remove</button>
          </div>
        `;
      })
      .join('');
  }

  const { subtotal, shipping, tax, total } = getCartTotals();
  el.cartSubtotal.textContent = formatCurrency(subtotal);
  el.cartShipping.textContent = formatCurrency(shipping);
  el.cartTax.textContent = formatCurrency(tax);
  el.cartTotal.textContent = formatCurrency(total);
  el.cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));

  el.checkoutSubtotal.textContent = formatCurrency(subtotal);
  el.checkoutShipping.textContent = formatCurrency(shipping);
  el.checkoutTax.textContent = formatCurrency(tax);
  el.checkoutTotal.textContent = formatCurrency(total);
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      alert('This product is currently out of stock.');
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveStoredData(STORAGE_KEYS.cart, cart);
  renderCart();
  renderProducts();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  const product = getProductById(productId);
  if (!product) return;

  const newQty = item.quantity + delta;

  if (newQty <= 0) {
    cart = cart.filter((entry) => entry.id !== productId);
  } else if (newQty > product.stock) {
    alert('You cannot exceed available stock for this item.');
    return;
  } else {
    item.quantity = newQty;
  }

  saveStoredData(STORAGE_KEYS.cart, cart);
  renderCart();
  renderProducts();
}

function removeCartItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveStoredData(STORAGE_KEYS.cart, cart);
  renderCart();
  renderProducts();
}

function updateCheckoutPricing() {
  const { subtotal, shipping, tax, total } = getCartTotals();
  el.checkoutSubtotal.textContent = formatCurrency(subtotal);
  el.checkoutShipping.textContent = formatCurrency(shipping);
  el.checkoutTax.textContent = formatCurrency(tax);
  el.checkoutTotal.textContent = formatCurrency(total);
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  if (!cart.length) {
    alert('Your cart is empty. Please add products before checkout.');
    return;
  }

  const formData = new FormData(event.target);
  const customer = Object.fromEntries(formData.entries());
  const { subtotal, shipping, tax, total } = getCartTotals();

  const newOrder = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    customer,
    items: cart.map((item) => {
      const product = getProductById(item.id);
      return {
        id: item.id,
        name: product ? product.name : 'Unknown product',
        quantity: item.quantity,
        price: product ? product.price : 0,
      };
    }),
    subtotal,
    shipping,
    tax,
    total,
  };

  orders.unshift(newOrder);
  saveStoredData(STORAGE_KEYS.orders, orders);

  cart = [];
  saveStoredData(STORAGE_KEYS.cart, cart);

  event.target.reset();
  el.shippingMethod.value = 'standard';
  renderCart();
  renderOrders();
  alert('Order placed successfully! It is now visible in the admin panel.');
}

function renderOrders() {
  if (!orders.length) {
    el.adminOrderList.innerHTML = '<div class="empty-cart">No orders have been placed yet.</div>';
    return;
  }

  el.adminOrderList.innerHTML = orders
    .map(
      (order) => `
        <div class="order-card">
          <div class="order-card-header">
            <strong>${order.id}</strong>
            <span class="order-badge">${order.status}</span>
          </div>
          <p class="order-text"><strong>Customer:</strong> ${order.customer.fullName} (${order.customer.email})</p>
          <p class="order-text"><strong>Shipping:</strong> ${order.customer.address}, ${order.customer.city} ${order.customer.zip}</p>
          <ul class="order-items">
            ${order.items
              .map(
                (item) => `<li>${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}</li>`,
              )
              .join('')}
          </ul>
          <p class="order-text"><strong>Order total:</strong> ${formatCurrency(order.total)}</p>
          <label>
            Update status
            <select class="order-select" data-action="update-order-status" data-id="${order.id}">
              <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </label>
        </div>
      `,
    )
    .join('');
}

function renderAdminProducts() {
  if (!products.length) {
    el.adminProductList.innerHTML = '<div class="empty-cart">No products in the catalog.</div>';
    return;
  }

  el.adminProductList.innerHTML = products
    .map(
      (product) => `
        <div class="admin-card">
          <div class="admin-card-main">
            <img src="${product.image}" alt="${product.name}" />
            <div class="admin-card-info">
              <h5>${product.name}</h5>
              <p class="order-text">${product.category}</p>
              <p class="order-text">${formatCurrency(product.price)} • ${product.stock} in stock</p>
            </div>
          </div>
          <div class="admin-card-actions">
            <button type="button" data-action="edit-product" data-id="${product.id}">Edit</button>
            <button class="delete-btn" type="button" data-action="delete-product" data-id="${product.id}">Delete</button>
          </div>
        </div>
      `,
    )
    .join('');
}

function openAdminModal() {
  el.adminModal.classList.remove('hidden');
  renderAdminDashboard();
}

function closeAdminModal() {
  el.adminModal.classList.add('hidden');
}

function renderAdminDashboard() {
  if (adminLoggedIn) {
    el.adminLoginView.classList.add('hidden');
    el.adminDashboard.classList.remove('hidden');
  } else {
    el.adminLoginView.classList.remove('hidden');
    el.adminDashboard.classList.add('hidden');
  }

  renderAdminProducts();
  renderOrders();
}

function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();

  if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
    adminLoggedIn = true;
    saveStoredData(STORAGE_KEYS.adminSession, true);
    renderAdminDashboard();
    event.target.reset();
  } else {
    alert('Invalid login details. Use the demo credentials shown below.');
  }
}

function handleAdminLogout() {
  adminLoggedIn = false;
  saveStoredData(STORAGE_KEYS.adminSession, false);
  renderAdminDashboard();
}

function resetProductForm() {
  el.adminProductForm.reset();
  el.adminProductForm.productId.value = '';
  el.productSubmitButton.textContent = 'Add product';
}

function handleProductSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const productId = String(formData.get('productId') || '').trim();
  const productData = {
    id: productId || `product-${Date.now()}`,
    name: String(formData.get('productName') || '').trim(),
    category: String(formData.get('productCategory') || '').trim(),
    price: Number(formData.get('productPrice')),
    stock: Number(formData.get('productStock')),
    image: String(formData.get('productImage') || '').trim(),
    description: String(formData.get('productDescription') || '').trim(),
  };

  if (!productData.name || !productData.category || !productData.image || !productData.description) {
    alert('Please complete all product fields.');
    return;
  }

  if (Number.isNaN(productData.price) || Number.isNaN(productData.stock)) {
    alert('Price and stock values must be valid numbers.');
    return;
  }

  const productIndex = products.findIndex((product) => product.id === productData.id);

  if (productIndex >= 0) {
    products[productIndex] = { ...products[productIndex], ...productData };
  } else {
    products.unshift(productData);
  }

  saveStoredData(STORAGE_KEYS.products, products);
  resetProductForm();
  renderProducts();
  renderAdminProducts();
}

function handleAdminEditProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;

  el.adminProductForm.productId.value = product.id;
  el.adminProductForm.productName.value = product.name;
  el.adminProductForm.productCategory.value = product.category;
  el.adminProductForm.productPrice.value = product.price;
  el.adminProductForm.productStock.value = product.stock;
  el.adminProductForm.productImage.value = product.image;
  el.adminProductForm.productDescription.value = product.description;
  el.productSubmitButton.textContent = 'Update product';
  document.querySelector('#admin-products-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleAdminDeleteProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const shouldDelete = confirm(`Delete "${product.name}" from the store?`);
  if (!shouldDelete) return;

  products = products.filter((entry) => entry.id !== productId);
  cart = cart.filter((entry) => entry.id !== productId);
  saveStoredData(STORAGE_KEYS.products, products);
  saveStoredData(STORAGE_KEYS.cart, cart);

  renderProducts();
  renderCart();
  renderAdminProducts();
}

function updateStatusForOrder(orderId, newStatus) {
  const order = orders.find((entry) => entry.id === orderId);
  if (!order) return;

  order.status = newStatus;
  saveStoredData(STORAGE_KEYS.orders, orders);
  renderOrders();
}

function attachEventListeners() {
  el.cartToggle.addEventListener('click', () => {
    el.cartPanel.classList.toggle('hidden');
  });

  el.closeCart.addEventListener('click', () => {
    el.cartPanel.classList.add('hidden');
  });

  el.checkoutLink.addEventListener('click', () => {
    el.cartPanel.classList.add('hidden');
  });

  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-action="add-to-cart"]');
    if (addButton) {
      addToCart(addButton.dataset.id);
      return;
    }

    const qtyIncreaseButton = event.target.closest('[data-action="increase-qty"]');
    if (qtyIncreaseButton) {
      updateCartQuantity(qtyIncreaseButton.dataset.id, 1);
      return;
    }

    const qtyDecreaseButton = event.target.closest('[data-action="decrease-qty"]');
    if (qtyDecreaseButton) {
      updateCartQuantity(qtyDecreaseButton.dataset.id, -1);
      return;
    }

    const removeButton = event.target.closest('[data-action="remove-item"]');
    if (removeButton) {
      removeCartItem(removeButton.dataset.id);
      return;
    }

    const editProductButton = event.target.closest('[data-action="edit-product"]');
    if (editProductButton) {
      handleAdminEditProduct(editProductButton.dataset.id);
      return;
    }

    const deleteProductButton = event.target.closest('[data-action="delete-product"]');
    if (deleteProductButton) {
      handleAdminDeleteProduct(deleteProductButton.dataset.id);
    }
  });

  el.shippingMethod.addEventListener('change', () => {
    renderCart();
    updateCheckoutPricing();
  });

  el.adminTrigger.addEventListener('click', openAdminModal);
  el.openAdminQuick.addEventListener('click', openAdminModal);
  el.modalCloseButtons.forEach((button) => {
    button.addEventListener('click', closeAdminModal);
  });

  el.adminLoginForm.addEventListener('submit', handleAdminLogin);
  el.adminLogout.addEventListener('click', handleAdminLogout);
  el.adminProductForm.addEventListener('submit', handleProductSubmit);
  el.cancelProductEdit.addEventListener('click', resetProductForm);
  el.checkoutForm.addEventListener('submit', handleCheckoutSubmit);

  el.tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activeTab = button.dataset.tab;
      el.tabButtons.forEach((tab) => tab.classList.toggle('active', tab === button));

      if (activeTab === 'products') {
        el.adminProductsPanel.classList.remove('hidden');
        el.adminOrdersPanel.classList.add('hidden');
      }

      if (activeTab === 'orders') {
        el.adminProductsPanel.classList.add('hidden');
        el.adminOrdersPanel.classList.remove('hidden');
      }
    });
  });

  document.addEventListener('change', (event) => {
    const statusSelect = event.target.closest('[data-action="update-order-status"]');
    if (statusSelect) {
      updateStatusForOrder(statusSelect.dataset.id, statusSelect.value);
    }
  });
}

function init() {
  renderProducts();
  renderCart();
  renderAdminDashboard();
  attachEventListeners();
  updateCheckoutPricing();
}

init();
