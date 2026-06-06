---
name: Next.js dev/build share .next
description: Running `pnpm build` while the dev workflow runs breaks the dev server.
---

Running `pnpm build` (next build) while the `next dev` workflow is running
corrupts the shared `.next/` directory — the dev server then throws
`ENOENT ... .next/routes-manifest.json` and serves 500s.

**Why:** `next dev` and `next build` write to the same `.next/` dir; the build
rewrites/removes manifests the running dev server still expects.

**How to apply:** After running `pnpm build` for verification, restart the
"Start application" workflow so the dev server regenerates its manifests.
