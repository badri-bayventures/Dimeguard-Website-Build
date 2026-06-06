---
name: Vitest is firewall-blocked in the main environment
description: Why vitest-based test suites cannot be installed in this repl's main environment, and what that means for testing tasks.
---

# Vitest is blocked by the package firewall (main environment)

Installing `vitest` in the **main** Replit environment fails with
`ERR_PNPM_FETCH_403 GET http://package-firewall.replit.local/npm/vitest/-/vitest-<ver>.tgz: Forbidden`
("No authorization header was set"). This happens via raw `pnpm install`, `pnpm add`,
AND the supported `installLanguagePackages` tool — it is a package-security block, not a transient hiccup.

**Why this matters:** Isolated task agents run in a *different* environment where vitest installs
fine (a test task merged a working `pnpm test` suite). But once merged, the main environment's
`pnpm install` hard-fails on the vitest tarball, so **every post-merge setup breaks** and the
lockfile can't be resynced.

**How to apply:**
- Do NOT add vitest (or vitest-based test scaffolding) to this project — it will break post-merge
  installs in main even if it passed in the task agent's env.
- Any "add automated tests" task here will hit the same wall. Flag it to the user before assigning;
  prefer a different verification approach (e.g. manual/e2e via the testing skill, or no unit harness).
- If a merge re-introduces vitest, the fix is to remove `vitest`, `@vitejs/plugin-react`, `jsdom`,
  `@testing-library/*`, `vite-tsconfig-paths` from package.json, delete `vitest.config.ts`,
  `vitest.setup.ts`, and any `*.test.tsx`, then `pnpm install` to resync. App build/runtime never
  depended on these (all dev-only); Vercel is unaffected (it installs from real npm, not the firewall).
