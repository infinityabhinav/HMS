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

This serves the site at `http://localhost:8888` and routes `/api/create-order` and `/api/verify-payment` to the serverless functions. A Vite-only `npm run dev` does not run those API routes.

Create a production build with `npm run build`; preview the static build with `npm run preview`.

## Razorpay configuration

The checkout is integrated in test mode. The server creates a fixed-price ₹9 (900 paise) INR order; it does not trust a browser-supplied amount. After checkout, the server fetches the order and checks the HMAC-SHA256 signature before reporting it as verified. The verification approach follows [Razorpay's Standard Checkout integration steps](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/).

For local development, put these in an ignored `.env` file at the project root:

```dotenv
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
VITE_RAZORPAY_KEY_ID=your_test_key_id
```

`.env.example` shows the variable names. `RAZORPAY_KEY_SECRET` is server-only. `VITE_RAZORPAY_KEY_ID` is public and is included in browser code; never put the secret in a `VITE_` variable or in `src/`.

For deployment, set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as server environment variables, and set `VITE_RAZORPAY_KEY_ID` as a build environment variable in the hosting dashboard. The repository includes Netlify Functions and Vercel API routes. Netlify's build and function paths are configured in `netlify.toml`; Vercel detects the `api/` routes.

The site currently reports a verified payment but does not deliver the PDF. **Do not accept customer payments or switch to live keys until secure PDF delivery and customer support details are configured.** Keep the PDF out of the public static directory; see `public/ebook/README.md` for details. A signature check confirms the checkout response; it does not itself deliver the product.

## Before launch

- Configure secure PDF delivery that runs only after server-side payment verification and confirms payment capture before fulfillment.
- Add a real customer-support address, seller details, and final privacy and terms text in `src/App.jsx`.
- Review the refund and medical disclaimer wording for your business and applicable laws.
- Replace test credentials with matching live credentials only after delivery is ready. Keep the secret in the host's server-side environment settings.

## Deploy

### Vercel

- Import the repository. Use the **Vite** framework preset, `npm run build` as the build command, and `dist` as the output directory.
- Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `VITE_RAZORPAY_KEY_ID` in the project's environment settings. Redeploy after changing build variables.

### Netlify

- Connect the repository, use `npm run build` as the build command, and `dist` as the publish directory. `netlify.toml` configures the functions and SPA fallback.
- Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `VITE_RAZORPAY_KEY_ID` in the site's environment settings. Redeploy after changing build variables.
