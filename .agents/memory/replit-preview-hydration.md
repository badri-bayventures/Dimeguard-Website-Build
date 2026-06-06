---
name: Replit preview hydration errors
description: Why "Hydration failed" can show in the Replit preview but not reproduce in a clean browser, and how to verify.
---

# Hydration errors reported in the Replit preview pane

**Observation:** A "Hydration failed because the server rendered HTML didn't
match the client" error reported from the Replit preview pane may NOT reproduce
when the same dev server is loaded directly in a clean browser.

**Why:** The preview is an iframe served through the Replit proxy (mTLS). The
proxy/iframe layer (and the user's browser extensions) can inject DOM/attributes
into the document. In the Next.js App Router, React hydrates the *entire*
`<html>`, so any externally injected node/attribute can trip a site-wide
mismatch that no app-code audit will find.

**How to verify:** Drive a clean headless Chromium (Nix `chromium` +
`puppeteer-core`) against `http://localhost:$PORT` directly and listen on
`page.on("console")` + `page.on("pageerror")`. The public `$REPLIT_DEV_DOMAIN`
URL 502s for puppeteer (mTLS), so it can't be used to reproduce. If the direct
load is clean, the app code is not the cause.

**App-code fix that still matters:** Do NOT put an explicit `<head>` with manual
`<script>` (e.g. JSON-LD) in the App Router root layout — React 19 reconciles
`<head>` specially and a manual head colliding with Next's metadata/font
injection (plus any proxy-injected head node) is a real hydration-fragility
source. Render JSON-LD as `<script type="application/ld+json">` in the body
(Google reads it there); that matches the per-page pattern. `suppressHydration
Warning` on `<html>`/`<body>` is the sanctioned, targeted mitigation for
external attribute injection on those two elements (it does not mask descendant
structure mismatches). A `new Date().getFullYear()` in a *server* component is
deterministic for hydration and needs no suppress.
