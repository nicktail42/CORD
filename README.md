# CORD Mobilizer

Responsive, frontend-only business website built inside the existing Vite application. Five pages, a 404 route, a filterable demonstration project gallery with native image dialogs, and an accessible project inquiry form. No backend, database, authentication, or admin dashboard is included.

## Requirements and setup

Use a Node version supported by the installed Vite 8 release (Node 22.12+ recommended) and npm. Existing React 19, React Router 7, Tailwind 4, Lucide, and Vite configuration has been preserved.

```sh
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm` and `Copy-Item .env.example .env.local`.

Commands:
- `npm run dev`: development server; use the Local URL printed by Vite.
- `npm run build`: production output in `dist/`.
- `npm run preview`: preview the production build.
- `npm run lint`: ESLint checks.
- `npm test`: automated browser checks using locally installed Chrome. Install Chrome or change the browser channel in `playwright.config.js` if unavailable.

## Source map

- `src/App.jsx`: routes for `/`, `/about`, `/services`, `/projects`, `/contact`, and `*`.
- `src/components/Layout.jsx`: responsive navigation, shared footer, route titles and metadata.
- `src/components/UI.jsx`: shared buttons, headings, service cards, icons, CTA.
- `src/components/InquiryForm.jsx`: accessible form, validation feedback, loading/success/error states.
- `src/pages/Pages.jsx`: five page components and gallery interactions.
- `src/data/content.js`: editable branding, proposed services, demonstration projects, mission/vision/values.
- `src/utils/validation.js`: input validation.
- `src/services/inquiryService.js`: provider-specific submission adapter, isolated from UI.
- `src/index.css`: Tailwind import, global reset and theme.
- `src/App.css`: layout, component styling, responsive breakpoints.
- `public/images/`: local photography grouped by use.
- `public/logo/`: supplied official logo, preserved without alteration.

## Content review

All services are illustrative categories pending confirmation. Gallery items are explicitly demonstrations and are not claimed to be completed CORD work. Company overview, mission, vision, and values are editable draft copy. Confirm business contact information, operating area, service availability, privacy wording and business claims before launch. No invented addresses, licenses, customer counts, reviews, or company statistics are included. A map is intentionally deferred until a real address is supplied.

Edit `src/data/content.js` for service IDs/names/descriptions/images/icons, project categories and copy, and values. Update page prose in `src/pages/Pages.jsx`. Update navigation/footer in `src/components/Layout.jsx`. The supplied tagline is retained.

## Images and branding

Official image: `public/logo/CORD Housing Mobilization Logo.png`. It is displayed in its original aspect ratio beside a compact text wordmark. The original logo includes a checkerboard-looking background; supply a clean transparent export if desired. Do not stretch it or change its artwork. `public/cord-icon.svg` is a simple C monogram favicon, not a replacement official logo.

Replace the following local placeholders, keeping filenames or updating references in `src/data/content.js` and page/CSS references:

| Asset | Location | References |
| --- | --- | --- |
| Excavator hero | `public/images/hero/excavator.jpg` | `src/App.css`, services/projects data, Contact |
| Company/site | `public/images/company/site.jpg` | About, services data |
| Construction/clearing | `public/images/services/clearing.jpg` | services/projects data |
| Open land | `public/images/projects/land.jpg` | services/projects data |

Temporary stock photography is downloaded from Unsplash. Source image URLs:
- https://images.unsplash.com/photo-1580901368919-7738efb0f87e
- https://images.unsplash.com/photo-1504307651254-35680f356dfd
- https://images.unsplash.com/photo-1541888946425-d81bb19240f5
- https://images.unsplash.com/photo-1500382017468-9049fed747ef

Use genuine company photos and accurate alt text at launch. Use optimized JPEG/WebP files at appropriate widths (roughly 1920px hero, 1000px other images). All images are local at runtime; below-fold images load lazily. The original supplied logo is comparatively large and should eventually be replaced with an optimized official export.

## Formspree setup

1. Create a form at Formspree and verify the intended CORD recipient email in its dashboard.
2. Copy the public form ID (the segment after `/f/`, not the full URL) into `.env.local`:
   `VITE_FORMSPREE_FORM_ID=your_actual_id`
3. Restart Vite. On hosting, add this build environment variable and redeploy.
4. Configure spam settings and allowed domains in Formspree. The form includes the `_gotcha` honeypot. Enable provider spam filtering and choose CAPTCHA settings compatible with AJAX; test them on the actual domain.
5. Send a real test inquiry and verify receipt and reply-to behavior before launch.

The adapter POSTs JSON to `https://formspree.io/f/{id}` with `Accept: application/json`. It includes name, `email` (Formspree reply-to field), phone, service, optional location, message, consent, honeypot and a subject. It requires a successful response with `ok: true` before displaying success. HTTP failures, malformed results, connection failures and timeouts never display success. Values are retained on failure. The submit button and fields are disabled while pending; a synchronous lock prevents duplicate submits. After success, the form remains disabled to prevent accidental resubmission. Reload to start a new inquiry.

Missing configuration is visibly identified and submission reports that no message was sent. The form ID is public frontend configuration; never put SMTP passwords or secret API keys in any `VITE_` variable. Change the recipient through the Formspree dashboard, not the React code. This implementation has no verified live email delivery until an actual configured account is tested.

Data is transmitted to Formspree and the recipient mailbox; it is not stored by this frontend. Finalize a real privacy policy, retention procedures, and published business details before production use. Client validation supplements Formspree server-side protection and is not a security boundary.

Official provider guidance: https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/

## Deployment to Vercel

Import the repository, set Root Directory to `cord-mobilizer` if importing its parent, select Vite, use `npm run build`, and publish `dist`. Set `VITE_FORMSPREE_FORM_ID` in the production environment. `vercel.json` rewrites application routes to `index.html` and adds basic response headers. Static files continue to be served normally. Test direct loads of `/about`, `/services`, `/projects`, and `/contact` on the deployed domain.

Before deploying:
- Replace `https://example.com` in `public/sitemap.xml` with the verified production domain and add its Sitemap URL in `public/robots.txt`.
- Make `og:image` an absolute image URL on that domain. Add canonical and `og:url` metadata once the domain is known.
- Replace demonstration content and confirm business/privacy information.
- Verify actual email delivery, spam settings and email reply-to behavior.

No Site was registered or published; this request targets the existing local Vite project and later Vercel deployment.

## SEO and accessibility

Semantic landmarks, one main heading per route, skip link, keyboard-focus styling, labeled controls, inline error associations, live notifications, reduced-motion support and a native modal dialog are included. Route changes update title, description, and Open Graph text. Client-side rendering means bots that do not execute JavaScript may see the default home metadata for every route. Prerender all five routes before a search/social-focused launch, or migrate to an SSR framework when justified. No fabricated local-business structured data is included. Unknown routes display a 404 view but static SPA hosting returns HTTP 200; real HTTP 404 semantics require server/prerender support.

## Future backend

Keep the form calling `submitInquiry(data)`. Replace only the implementation in `src/services/inquiryService.js` with a request to your backend API, retaining the same success/error contract. Perform authoritative validation, rate limiting and spam checks on the server. A later backend can store inquiries, send email and expose authenticated admin functionality. Keep private credentials server-side.

## Validation

Build and lint commands are required before release. Automated tests cover route rendering, direct links, mobile menu, horizontal overflow at representative widths, local image loading, project filtering/dialogs, service preselection, form validation, missing configuration and mocked provider loading/success/error states. Mocked success does not prove email delivery. Review real device layouts and the final business content before launch.

Dependency audit at implementation: npm reported six moderate advisories in the ESLint development-tool chain (minimatch amplification advisory and dependent packages), with no automated compatible fix available. These are not included in the static browser bundle. Review upstream tooling updates before release; no forced major-version dependency changes were applied.
