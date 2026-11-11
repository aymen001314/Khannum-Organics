# Khannum Organics

A responsive cosmetic-store demo with product catalog, cart, checkout, and admin tools.

## Run locally

1. Download/clone this repository and open its folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Start a local server from the project folder:
   - Python: `python -m http.server 8000`
   - Or install the VS Code **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**.
4. Visit `http://localhost:8000` (or the address Live Server shows).

## Demo admin login

- Username: `admin`
- Password: `admin123`

## Features

- Responsive storefront and featured cosmetics
- Cart quantity changes/removal and price totals
- Checkout captures customer/shipping information and saves orders
- Admin can add/edit/delete products, manage stock, and update order statuses
- Demo data is saved in browser `localStorage`

## Demo limitations

This is a front-end demonstration, not a production e-commerce backend. Data is stored only in the current browser and is not shared across devices. The admin credentials are demo-only; do not use this login for a real store. No real payment is processed.
