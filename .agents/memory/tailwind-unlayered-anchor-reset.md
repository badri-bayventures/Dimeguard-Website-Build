---
name: Unlayered a{color:inherit} beats Tailwind v4 utilities
description: Why text-white (and other text-color utilities) silently lose on <a> elements in this project, and how to fix it.
---

`src/app/globals.css` defines a plain (unlayered) `a { color: inherit }`. Tailwind v4
emits all utilities inside `@layer utilities`. In CSS cascade layers, an unlayered rule
beats any layered rule regardless of specificity — so `text-white` (and similar
text-color utilities) on an `<a>` are overridden by `a { color: inherit }`, making the
link inherit the ambient ink color. On a dark button background this renders dark-on-dark
(invisible).

**Why:** This bit the legal "Go to the contact page" chip (`LegalContactCta` in
`src/components/legal-layout.tsx`) — its `text-white` lost to the unlayered anchor reset.
Only `<a>` elements are affected; `<button>`/`<div>`/`<span>` dark buttons elsewhere are
fine because the reset only targets anchors.

**How to apply:** For any anchor-styled-as-button that needs a forced text color, use the
Tailwind v4 important modifier (`text-white!`) so the declaration is `!important` and wins
over the non-important unlayered rule. Do NOT remove or alter the global `a{color:inherit}`
reset to fix a single button — that's a sitewide change. Background CSS vars (e.g.
`--color-ink: #143a4a`) resolve fine despite a circular-looking `@theme inline` redef,
because the hand-written `:root` value wins the cascade.
