# HMS

A responsive React + Vite storefront for **The Hair Fall Control Guide**. Styling uses Tailwind CSS 4 with a small set of hand-written responsive styles; icons use Lucide React.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; preview it locally with `npm run preview`.

## Configure before launch

1. Replace `PAYMENT_LINK` in `src/config.js` with your PhonePe hosted payment URL. Until it is set to an HTTPS URL, checkout stays disabled. The site never treats a click or redirect as proof of payment.
2. Add your real support and business details and final privacy and terms text in `src/App.jsx` before publishing. Review the refund and medical disclaimer wording for your business and applicable laws; contact, privacy and terms currently contain launch placeholders.
3. Add the real PDF only after choosing a delivery method. The configured `PDF_PATH` is an integration reference; the browser does not expose a download button or unlock the file.

## Secure payment and PDF delivery

For paid downloads, connect the PhonePe checkout to a server-side integration. The server should create/verify payment orders using private credentials held in server environment variables, accept only authenticated provider confirmation or a verified webhook, and issue a short-lived download URL after it confirms the paid order. Keep the PDF in private object storage or outside the static `public/` directory. See `public/ebook/README.md` for why a file placed in `public/` is not private.

The static storefront intentionally has no payment verification or download endpoint. Do not add private payment credentials to React code or treat a return URL as payment confirmation.

## Deploy

### Vercel

- Import the project from Git, or run `npm install` and `npm run build`.
- Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
- No environment variables are needed for the static storefront; the public hosted payment URL is configured in `src/config.js`.

### Netlify

- Connect the repository, or run `npm install` and `npm run build`.
- Build command: `npm run build`. Publish directory: `dist`.
- The project includes `netlify.toml` with the same build and SPA fallback settings.

For a backend payment and delivery integration, deploy that service separately or add protected serverless functions. Keep its secrets in the host's server-side environment settings, never in `src/` or `VITE_` variables.
