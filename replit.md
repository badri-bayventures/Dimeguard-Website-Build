# Dimeguard.com

Lead-generation site for Saral Toms — insurance + retirement + tax advisor in Mountain House, CA. First reference implementation for the "Founding 10" cohort of advisor sites.

## Run & Operate

- `pnpm dev` — start the Next.js dev server (binds to `$PORT`, defaults to 5000)
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm typecheck` — TypeScript type check
- `pnpm lint` — ESLint

## Stack

- Next.js 15 (App Router) on Node.js 24, TypeScript 5
- Tailwind CSS v4
- Single Next.js app at the repo root — no monorepo, no separate API server
- API surface: Next.js Route Handlers under `src/app/api/`
- CMS: Notion via `@notionhq/client` + `notion-to-md` + `next-mdx-remote` (added in step 6)
- Lead pipeline: Twilio SMS + Resend email + Airtable; no application database
- Analytics: GA4 + Google Search Console + PostHog Cloud

## Where things live

- `src/site.config.ts` — cohort-config source of truth (advisor name, NAP, licensure, brand color, calculator assumptions, analytics IDs). Swap this file to spin up the next advisor in the cohort.
- `src/app/` — App Router pages and route handlers
- `src/app/globals.css` — Tailwind v4 entry + design tokens
- `public/` — static assets
- `content/` — (added in step 3) Dimeguard-specific copy (founder bio, carriers, local copy)
- `lib/schema/` — (added in step 7) centralized JSON-LD builders

## Architecture decisions

- **Single repo, no workspaces.** Cohort reuse comes from `site.config.ts`, not from a pnpm workspace. Re-evaluate only if shared lib publishing becomes necessary across cohort sites.
- **SSG everywhere except `/blog`.** Blog uses ISR with `revalidate: 300` + on-demand revalidation from Notion. Calculators are client components mounted in SSG shells.
- **No application database.** Twilio SMS + Resend email are the real-time handoff; Airtable is the structured log and Saral's admin UI.
- **One API surface.** Next.js Route Handlers only. No separate Express server.
- **Locked stack:** Next.js 15 (not 16) because the cohort template targets 15. Pin in `package.json`.

## Product

6 pages + 1 calculator route: `/`, `/retirement-planning`, `/life-insurance`, `/about`, `/resources`, `/blog`, `/calculators/inflation`. Three growth outcomes: lead generation, SEO, AEO citability.

## User preferences

- Copy rules: no superlatives, no guaranteed-outcome language, no outcome-implying testimonials. Use "may / can / designed to help" instead of "will" for outcomes. Per-page insurance-only disclosure.
- Compliance: insurance-only broker, no disclosure-review gate required.

## Gotchas

- The dev server must bind to `0.0.0.0` and read `$PORT`. Never hard-code a port.
- `next.config.ts` lists Replit dev origins under `allowedDevOrigins` so the proxied preview works.
- Cache-control is `no-store` in dev to avoid stale previews; production has no override.
- Required env vars are documented in the project task plan — request via the environment-secrets flow before wiring each integration.

## Pointers

- Task plan and architectural rationale: `.local/tasks/task-1.md`
- Original architect brief: `attached_assets/Pasted-ROLE-You-are-an-architect-helping-me-set-up-a-6-page-fi_1779298984949.txt`
- Step-1 corrections (names, formulas, copy rules): `attached_assets/Pasted-Thanks-for-the-plan-Aligned-on-the-substance-Six-correc_1779302672084.txt`
