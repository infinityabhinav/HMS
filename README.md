# HMS

A responsive React + Vite storefront for **The Hair Fall Control Guide**. Styling uses Tailwind CSS 4 with hand-written responsive styles; icons use Lucide React.

## Run locally

Install dependencies, then run the Vite development server:

```sh
npm install
npm run dev
```

To exercise checkout locally, run the included Netlify functions alongside Vite:

```sh
npx netlify-cli dev
```

This serves the site at `http://localhost:8888` and routes the payment and guide-download APIs to serverless functions. A Vite-only `npm run dev` does not run those API routes.

Create a production build with `npm run build`; preview the static build with `npm run preview`.

## Razorpay configuration

The server creates a fixed-price ₹9 (900 paise) INR order; it does not trust a browser-supplied amount. It verifies Razorpay's HMAC-SHA256 signature, confirms the payment is captured, and issues a short-lived download token. The guide is streamed from private Vercel Blob storage only after the server rechecks the captured payment. See [Razorpay's Standard Checkout integration steps](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/).

For local payment development, put the Razorpay values in an ignored `.env.local` file at the project root:

```dotenv
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
VITE_RAZORPAY_KEY_ID=your_test_key_id
```

`.env.example` shows the variable names. `RAZORPAY_KEY_SECRET` and any fallback `BLOB_READ_WRITE_TOKEN` are server-only. `VITE_RAZORPAY_KEY_ID` is public and is included in browser code; never put either secret in a `VITE_` variable or in `src/`.

## Private PDF delivery

The repository is public, so the paid guide must not be committed to Git or placed under `public/`.

1. In Vercel, open the project's **Storage** tab and create a **private Blob** store. Connect it to this project and enable Production. Vercel uses project OIDC credentials for function access.
2. To upload locally, link this folder to the Vercel project and pull its Development environment variables. Include Development when connecting the Blob store so local OIDC credentials are available:

   ```sh
   vercel link
   vercel env pull .env.local
   ```

3. Upload the PDF from its existing local path:

   ```sh
   node --env-file=.env.local scripts/upload-guide.mjs "C:\Users\HP\Downloads\hairfallguide.pdf"
   ```

The upload script stores it as `hair-fall-control-guide.pdf` with private access. The order endpoint checks that this private PDF exists before creating a Razorpay order, so checkout remains unavailable until delivery is ready. After captured payment verification, the browser starts the download automatically and shows a retry link if needed.

For deployment, set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as server environment variables, and set `VITE_RAZORPAY_KEY_ID` as a build environment variable in the hosting dashboard. The repository includes Netlify Functions and Vercel API routes. Netlify's build and function paths are configured in `netlify.toml`; Vercel detects the `api/` routes.

## Before launch

- Create and connect the private Blob store, upload the PDF, and confirm Production is connected before enabling live checkout.
- Add a real customer-support address, seller details, and final privacy and terms text in `src/App.jsx`.
- Review the refund and medical disclaimer wording for your business and applicable laws.
- Configure matching Razorpay live credentials only after private PDF delivery is ready. Keep the secret in the host's server-side environment settings.

## Deploy

### Vercel

- Import the repository. Use the **Vite** framework preset, `npm run build` as the build command, and `dist` as the output directory.
- Connect a private Blob store to the project and enable it for Production. Vercel supplies short-lived OIDC credentials to connected functions.
- Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `VITE_RAZORPAY_KEY_ID` in Production. Redeploy after changing environment variables.

### Netlify

- Connect the repository, use `npm run build` as the build command, and `dist` as the publish directory. `netlify.toml` configures the functions and SPA fallback.
- Set the Razorpay variables and a server-only `BLOB_READ_WRITE_TOKEN` in the site's environment settings if deploying to Netlify; the Blob token must belong to the same private store where the guide was uploaded.
