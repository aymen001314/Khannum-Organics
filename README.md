# Khannum Organics

A responsive multi-page beauty storefront demo with distinct Home, Shop, Our Story and Checkout pages. It includes a shared browser-stored cart, product search/filter/sort, checkout order recording, and a demo admin panel.

## Run locally

From the project directory in VS Code terminal:

```powershell
py -m http.server 8000
```

Open http://localhost:8000. Keep the terminal open while using the site. On Windows, you can also double-click `run.bat`.

## Pages

- `index.html` — video-led campaign home page
- `shop.html` — searchable/filterable product catalog
- `about.html` — brand story
- `checkout.html` — shipping form and order summary

The top navigation opens separate HTML pages; it is not one long scrolling page. The cart and product/order data are retained in the same browser with `localStorage` as you move between pages.

## Demo admin

Click **Admin** in the top navigation.

- Username: `admin`
- Password: `admin123`

## Demo limitations

This is a front-end demonstration, not a production store. Data is saved only in the current browser and is not shared across devices. The admin credentials are demo-only, and no payment is processed. The home hero attempts to load an externally hosted Pexels MP4; if it is blocked/unavailable, the poster image is shown instead.
