# SignPro Graphics ERP

Vite + React frontend for the SignPro Graphics ERP app, with Vercel serverless endpoints under `api/` for Zoho integration.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local`
3. Fill in the required Firebase and app URL values
4. If you want Zoho sync to work locally, also fill in the Zoho and Firebase Admin values
5. Start the app:
   `npm run dev`

To expose the dev server on your LAN, use:
`npm run dev:host`

## Useful scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run typecheck` runs TypeScript checks
- `npm run clean` removes `dist/` on Windows, macOS, and Linux

## Environment variables

Frontend:

- `APP_URL` optional public base URL used in generated client links; if omitted, the browser origin is used

Server / integrations:

- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_REDIRECT_URI`
- `ZOHO_ORG_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY` JSON string for server-side Firebase Admin access

## Notes

- Firebase client settings are loaded from `firebase-applet-config.json`
- The `api/zoho/*` endpoints are designed for a Vercel-style deployment
- The current production build completes successfully with `npm run build`
