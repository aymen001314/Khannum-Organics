/* Admin product form handler: accepts repo-relative images and keeps admin additions. */
(() => {
  const form = document.getElementById('admin-product-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const data = new FormData(form);
    const id = String(data.get('productId') || '').trim();
    const name = String(data.get('productName') || '').trim();
    const category = String(data.get('productCategory') || '').trim();
    const description = String(data.get('productDescription') || '').trim();
    const image = String(data.get('productImage') || '').trim();
    const price = Number(data.get('productPrice'));
    const stock = Number(data.get('productStock'));
    const validImage = /^(https?:\/\/|\.?\/?assets\/|\.?\/?images\/)/i.test(image);

    if (!name || !category || !description || !validImage || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      notify('Please enter a name, category, description, valid price, whole-number stock, and an image URL or project path (for example assets/products/lip.png).');
      return;
    }

    const item = {
      id: id || `product-${Date.now()}`,
      name,
      category,
      price,
      stock,
      image,
      description,
    };
    const existingIndex = products.findIndex((product) => product.id === id);
    if (existingIndex >= 0) products[existingIndex] = item;
    else products.unshift(item);

    saveAll();
    form.reset();
    if (form.elements.productId) form.elements.productId.value = '';
    const submitButton = document.getElementById('product-submit-button');
    if (submitButton) submitButton.textContent = 'Add product';
    renderAll();
    notify(existingIndex >= 0 ? 'Product updated.' : 'Product added.');
  }, true);
})();
