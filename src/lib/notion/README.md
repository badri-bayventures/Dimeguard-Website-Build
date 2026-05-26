# Notion blog database schema

Saral publishes posts from a single Notion database. The site reads `Status =
Published` rows from that database; everything else is invisible to the live
site. To switch a draft live, flip the Status select to **Published** — ISR
re-fetches within 5 minutes.

## Required environment variables

Set these in the Replit Secrets pane (never commit them):

- `NOTION_API_KEY` — Notion internal integration secret (starts with `secret_`
  or `ntn_`). Create at <https://www.notion.so/my-integrations>, then share the
  blog database with the integration from the Notion UI ("…" → Connections).
- `NOTION_BLOG_DB_ID` — the 32-character database ID from the database URL
  (`https://www.notion.so/<workspace>/<DATABASE_ID>?v=…`).

If either is missing or empty, the site transparently falls back to static
MDX posts in `content/blog/` so `/blog` always renders.

## Database properties

| Property name     | Notion type | Required | Notes                                                                                  |
| ----------------- | ----------- | -------- | -------------------------------------------------------------------------------------- |
| `Title`           | Title       | yes      | Renders as the H1.                                                                     |
| `Slug`            | Rich text   | yes      | URL slug. Lowercase, hyphenated, unique. Drives `/blog/[slug]`.                        |
| `Status`          | Select      | yes      | Options: `Draft`, `Published`. Only `Published` rows are returned.                     |
| `Published Date`  | Date        | yes      | Used for byline, sort order, JSON-LD `datePublished`, and sitemap `lastmod`.           |
| `Summary`         | Rich text   | yes      | 1–2 sentence card summary on `/blog`.                                                  |
| `Category`        | Select      | yes      | Options: `Insurance`, `Retirement`, `Tax`, `Estate`, `General`. Renders as a badge.    |
| `SEO Title`       | Rich text   | no       | Overrides `<title>` if set. Otherwise `Title` is used.                                 |
| `SEO Description` | Rich text   | no       | Overrides meta description if set. Otherwise `Summary` is used.                        |
| Body              | Page body   | yes      | The Notion page itself. Converted to Markdown via `notion-to-md` and rendered as MDX.  |

## Editorial guardrails

Every post must comply with the broker copy guardrails baked into the rest of
the site:

- No superlatives: `best`, `top-rated`, `#1`, `leading`, `premier`,
  `trusted by thousands`, etc.
- No outcome-implying language: `guaranteed returns`, `will save you $X`.
- Prefer `may` / `can` / `designed to help`.
- Strip SEO-spammy AI tells (`In today's world…`, `It is important to note
  that…`, `Furthermore`, …).
- Close every post with the "What to do next" CTA — the site appends this
  automatically; do not duplicate it in the body.
