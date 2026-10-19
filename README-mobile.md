# EZCondo Mobile App (PWA)

This source package is based on `hoangchinsuoi/chungcu1` at commit `6c02207e83cd6fe32fcdf4b024eb1809509dae8b` and includes an installable Progressive Web App setup.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the reachable C# API address. For same-computer local development, the default `http://localhost:5263/api` is suitable.
3. Run `npm ci` and then `npm run dev`.

## Create the production web app

Run `npm ci` and `npm run build`. The deployable app is written to `dist/`.

Deploy `dist/` behind HTTPS to install it on phones. Android users can choose **Install app** in Chrome. On iPhone, open the site in Safari and choose **Share → Add to Home Screen**. A phone cannot use `localhost` to reach the API on your computer; set `VITE_API_BASE_URL` to a LAN or deployed API URL before building. The C# API must also allow requests from the app's origin.

The service worker caches the app shell and same-origin static assets. API data still requires a reachable backend.
