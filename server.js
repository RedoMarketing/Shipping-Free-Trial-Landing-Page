// Static server for the Redo Shipping free-trial landing page.
//
// The site is published at redo.com/shipping-free-trial via a Cloudflare reverse
// proxy that PRESERVES the path prefix, so Railway receives requests under
// /shipping-free-trial/*. We mount the static files at that same subpath so the
// on-disk layout matches the public URL exactly (e.g. /shipping-free-trial/logos/x.png).
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE = "/shipping-free-trial";

// Server internals / dependencies that should never be served publicly.
// (Dotfiles like .git and .env are already blocked by express.static's defaults.)
const HIDDEN_FILES = new Set(["server.js", "package.json", "package-lock.json"]);

// Block internals before the static handler runs.
app.use(BASE, (req, res, next) => {
  const segments = req.path.split("/").filter(Boolean);
  if (segments.includes("node_modules") || HIDDEN_FILES.has(path.basename(req.path))) {
    return res.status(404).end();
  }
  next();
});

app.use(BASE, express.static(__dirname, { extensions: ["html"] }));

// Convenience: bare domain root -> the landing page.
app.get("/", (req, res) => res.redirect(302, BASE + "/"));

// Health check for Railway.
app.get("/healthz", (req, res) => res.type("text").send("ok"));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serving ${BASE}/ on port ${PORT}`);
});
