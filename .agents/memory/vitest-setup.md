---
name: Vitest setup in this Next.js app
description: How the Vitest + React Testing Library harness is wired and the version pin that makes it work.
---

# Vitest setup

Test harness: `vitest run` (script `test`), jsdom env, `@testing-library/react` + `@testing-library/jest-dom`. Config in `vitest.config.ts`, global matchers loaded via `vitest.setup.ts` (`import "@testing-library/jest-dom/vitest"`). Tests live next to source as `*.test.tsx`.

## Pin @vitejs/plugin-react to v4, NOT v6
**Why:** Vitest 3.x bundles Vite 7. `@vitejs/plugin-react@6` declares peer `vite@^8` and imports `vite/internal`, which Vite 7 does not export — config load fails with `ERR_PACKAGE_PATH_NOT_EXPORTED ... './internal'`. `@vitejs/plugin-react@^4` works with Vite 7.
**How to apply:** When bumping vitest/vite or adding the react plugin, keep plugin-react compatible with the Vite version vitest ships, or tests won't even load.

## Other gotchas
- `vite-tsconfig-paths` scans every tsconfig under the repo, including `.local/skills/**`, and prints parse warnings. Scope it: `tsconfigPaths({ projects: ["tsconfig.json"], ignoreConfigErrors: true })`.
- esbuild's postinstall build script is gated by pnpm; it's allowlisted via `pnpm.onlyBuiltDependencies: ["esbuild"]` in package.json. Without it vitest can't transform.
- `siteConfig.contact.calendlyUrl` reads `process.env.NEXT_PUBLIC_CALENDLY_URL` at module load, so to test env-dependent rendering set the env var, `vi.resetModules()`, then dynamic-import the component.
