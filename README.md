# Redo Shipping — Free Trial Landing Page

Mobile-first marketing site for Redo's Shipping Cloud (OMS / WMS / IMS) signup flow.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Main landing page — hero, integrations, brand marquee, why cards, feature carousel, stats, support, signup, footer. Served at `/`. |
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

## Hosting model

The site is published at **`redo.com/shipping-free-trial`** through a Cloudflare
reverse proxy that **preserves the path prefix** — i.e. Cloudflare forwards
`redo.com/shipping-free-trial/*` to the Railway origin with the path intact.

To make that work cleanly:

- A tiny Express server (`server.js`) mounts the static files under
  `/shipping-free-trial/*`, so the on-disk paths match the public URL exactly.
- Every page has `<base href="/shipping-free-trial/" />` in its `<head>`, so all
  relative links/assets resolve under the subpath even when the URL is hit
  without a trailing slash. All page/asset links are relative; the only absolute
  links are the `href="/"` "Redo home" brand links, which intentionally point to
  `redo.com/`.

If you ever switch the proxy to **strip** the prefix instead, change `BASE` in
`server.js` to `"/"` (or mount at root) and update the `<base>` tags accordingly.

## Local dev

It's pure static HTML/CSS/JS, but it must be served under the subpath so the
`<base>` tag resolves. Use the bundled server:

```bash
npm install
npm start        # serves on http://localhost:3000
```

Then open `http://localhost:3000/shipping-free-trial/` (the bare root `/`
redirects there automatically).

## Railway deployment

1. Create a new Railway project from this GitHub repo (Deploy from GitHub repo).
2. Railway auto-detects Node, runs `npm install`, then `npm start` (`node server.js`).
   The server binds `0.0.0.0:$PORT` — Railway sets `$PORT` automatically.
3. Generate a public domain for the service (Settings → Networking → Generate
   Domain), e.g. `shipping-free-trial.up.railway.app`. Verify it loads at
   `https://<that-domain>/shipping-free-trial/`. Optional health check path: `/healthz`.

### Cloudflare reverse-proxy rule (path-preserving)

On the `redo.com` zone, route `/shipping-free-trial*` to the Railway origin while
keeping the path. Typical setup with an Origin Rule + a proxied DNS/route:

- Match: `Hostname equals redo.com AND URI Path starts with /shipping-free-trial`
- Action: override the origin host to the Railway domain
  (`shipping-free-trial.up.railway.app`), port 443, **do not** rewrite/strip the
  path.

The path stays `/shipping-free-trial/...` all the way to Railway, where
`server.js` serves it. (If you instead use a Cloudflare Worker or Transform Rule
that strips the prefix, see the note in "Hosting model" above.)

Alternative: any Nginx, Caddy, or Cloudflare Pages setup works too — it's just
static files served under `/shipping-free-trial/`.

## Asset notes

- `logos/warehouse.jpg` is the compressed (~300 KB) version of the original `warehouse.png` (2 MB). The compressed version is the one referenced in CSS.
- `logos/soc2-badge.png` is a 200×200 raster of the original 365 KB SVG. **Both SOC 2 and GDPR badges should be verified with Redo's compliance team before this site goes public.**
- Brand logos in the trusted-by marquee (SKIMS, TaylorMade, Liquid Death, Lashify, Summer Fridays, Malbon, Nutricost, Portland Leather, Nike Strength, Just Ingredients) — logo-usage permission should be confirmed for each before launch.
- Customer quote on `free-trial.html` (eDeadShop) is a real internal Slack-reported testimonial; ideally get written consent before publishing.
- Stats (`35% faster fulfillment`, `97% fewer ship errors`, `$5 per $1 spent`, `100M+ packages shipped`) should be confirmed with Redo product/finance before launch.
