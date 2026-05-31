---
name: Dev server verification (curl)
description: How to curl the running dev app from the shell on this Replit project
---

# Verifying the running dev server from the shell

Curling the public `$REPLIT_DEV_DOMAIN` from inside the workspace shell returns
**HTTP 502** (the preview proxy uses mTLS and rejects raw shell curls). The app
is fine — the browser preview works.

**How to apply:** to verify pages from the shell, curl `http://localhost:$PORT`
(the Next.js dev workflow binds `${PORT:-5000}`, and `PORT` is often unset so it
is `5000`). Example: `curl -s http://localhost:5000/blog`.
