# Vérité — landing page

Marketing landing page for **Vérité**, a dedicated AI consultancy for small and
mid-sized businesses. We identify practical AI use cases, build them with you,
and keep them running.

## What's here

| Path | What it is |
| --- | --- |
| [`index.html`](./index.html) | The landing page — a self-contained, responsive static page. Open it in a browser or serve the repo root. |
| [`design/`](./design) | The original Claude Design source this page implements. |

### `index.html`

A single, self-contained file: the Vérité design-system tokens are inlined, web
fonts (Inter / Inter Tight / JetBrains Mono) load from Google Fonts, and every
design-system component used in the design (Button, Card, Badge, Icon) is
rendered as plain HTML/CSS. No build step and no runtime JavaScript — it works
on any static host (e.g. GitHub Pages) and renders without JS enabled.

Sections: hero, introduction, the opportunity, our approach (Discovery →
Implementation → Maintenance), track record, team, and a get-in-touch CTA.

### `design/`

The source of truth this page was built from, exported from Claude Design:

- `Verite Landing Page.dc.html` — the design file.
- `_ds/v-rit-consulting-design-system-a7995696-…/` — the Vérité design system
  (tokens + component bundle) the design imports.
- `support.js` — the Claude Design runtime that resolves the design file's
  components in the browser.

`index.html` is a faithful static implementation of `design/Verite Landing
Page.dc.html`; the design file remains the reference for any future changes.
