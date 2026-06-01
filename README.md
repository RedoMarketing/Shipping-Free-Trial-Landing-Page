# Redo Shipping — Free Trial Landing Page

Mobile-first marketing site for Redo's Shipping Cloud (OMS / WMS / IMS) signup flow.

## Pages

| File | Purpose |
| --- | --- |
| `home-mobile.html` | Main landing page — hero, integrations, brand marquee, why cards, feature carousel, stats, support, signup, footer. **Set this as the index route in production.** |
| `features.html` | All 27 Shipping Cloud features as a tile grid with click-to-expand modals, filterable by category. Linked from "View all features". |
| `free-trial.html` | Signup form. Submits to HubSpot, then redirects to Dom Lewis's demo booking calendar. |
| `styles.css` | Shared design tokens (colors, radii, fonts). All page-specific styles live inline in each HTML file. |
| `logos/` | All brand logos, integration icons, founder portraits, Arbiter UI icons, compliance badges, hero imagery. |

## HubSpot integration

The signup form on `free-trial.html` POSTs to HubSpot's Forms API, then redirects the user to the demo booking calendar regardless of API result.

| Setting | Value |
| --- | --- |
| Portal ID | `22543403` |
| Form GUID | `e6692ec9-3bde-4702-8d75-a04658c29a9c` |
| Booking redirect | `https://meetings.hubspot.com/dom-lewis/donminics-booking-link` |

Field mapping (HTML form name → HubSpot property):

| HTML field | HubSpot internal name | Object |
| --- | --- | --- |
| `firstName` | `firstname` | Contact |
| `lastName` | `lastname` | Contact |
| `email` | `email` | Contact |
| `company` | `company` | Contact |
| `phone` | `phone` | Contact |
| `annualOrderVolume` | `orders_last_year` | Company |
| `hdyhau` | `how_did_you_hear_about_us` | Contact |
| `password` | — | Not sent (visual only; we don't actually create accounts) |

All wiring lives in the `<script>` block at the bottom of `free-trial.html`. The HubSpot form itself must include the `Company Name` field so HubSpot can auto-associate the contact with a Company record for `orders_last_year` to land correctly.

## Local dev

It's pure static HTML/CSS/JS — no build step. Serve the folder with any static file server:

```bash
python3 -m http.server 5173
# or
npx serve -l 5173
```

Then open `http://localhost:5173/home-mobile.html`.

## Railway deployment

Easiest static-site setup is `serve` over Node:

1. Create `package.json` at repo root:
   ```json
   {
     "name": "shipping-free-trial-landing-page",
     "version": "1.0.0",
     "scripts": {
       "start": "serve -s . -l ${PORT:-3000}"
     },
     "dependencies": {
       "serve": "^14.2.4"
     }
   }
   ```
2. Push to Railway — it auto-detects Node, installs `serve`, runs `npm start`.
3. (Optional) Add routing so `/` serves `home-mobile.html` — either rename `home-mobile.html` → `index.html` or set up a redirect.

Alternative: any Nginx, Caddy, or Cloudflare Pages setup works — it's just static files.

## Asset notes

- `logos/warehouse.jpg` is the compressed (~300 KB) version of the original `warehouse.png` (2 MB). The compressed version is the one referenced in CSS.
- `logos/soc2-badge.png` is a 200×200 raster of the original 365 KB SVG. **Both SOC 2 and GDPR badges should be verified with Redo's compliance team before this site goes public.**
- Brand logos in the trusted-by marquee (SKIMS, TaylorMade, Liquid Death, Lashify, Summer Fridays, Malbon, Nutricost, Portland Leather, Nike Strength, Just Ingredients) — logo-usage permission should be confirmed for each before launch.
- Customer quote on `free-trial.html` (eDeadShop) is a real internal Slack-reported testimonial; ideally get written consent before publishing.
- Stats (`35% faster fulfillment`, `97% fewer ship errors`, `$5 per $1 spent`, `100M+ packages shipped`) should be confirmed with Redo product/finance before launch.
