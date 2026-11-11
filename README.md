# Khannum Organics

A responsive cosmetics storefront demo with a premium, editorial-inspired design and working front-end shopping flows.

## Run on Windows (easy option)

1. Download or clone this repository.
2. Open the `Khannum-Organics` folder in File Explorer.
3. Double-click **`run.bat`**. A terminal window starts the local server and opens the store in your browser.
4. Keep that terminal window open while you use the site. Press **Ctrl+C** in that window to stop the server.

If Windows says Python is missing, install it from [python.org](https://www.python.org/downloads/), enable **Add Python to PATH** during setup, and then double-click `run.bat` again.

## Run from VS Code

Open the project folder in VS Code, choose **Terminal → New Terminal**, and run:

```powershell
py -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). If `py` is not recognized but Python is installed, try `python -m http.server 8000`.

## Demo admin login

- Username: `admin`
- Password: `admin123`

Open **Admin** in the top navigation to manage the catalog and view orders.

## Project files

- `index.html` — storefront, checkout, and admin panel markup
- `styles.css` — responsive visual design
- `app.js` — product catalog, cart, checkout, and admin interactions
- `run.bat` — Windows one-click local server launcher

## Demo limitations

This is a front-end demonstration. Products, cart, and orders are saved in the current browser's `localStorage`, not a shared database. Admin credentials are demo-only, and no real payment is processed. Do not use this setup for a live store or real customer data.
