# Vérité website

Marketing website for **Vérité**, a dedicated AI consultancy for small and
mid-sized businesses. We identify practical AI use cases, build them with you,
and keep them running.

Live at [verite-consulting.com](https://verite-consulting.com), deployed by
GitHub Pages from `main` (`.github/workflows/static.yml`; custom domain via
`CNAME`).

## Structure

Plain static files: no build step, no framework, and every page renders fully
with JavaScript disabled. Folder-style clean URLs, one `index.html` per page.

| Path | Page |
| --- | --- |
| [`index.html`](./index.html) | Home: hero with the neural-net canvas, a condensed "What is Vérité?", an approach teaser and a closing CTA. |
| [`services/`](./services/index.html) | Services: why you need AI consulting, and how we work (Discovery, Implementation, Maintenance). |
| [`use-cases/`](./use-cases/index.html) | Use Cases: the track-record cards. Add a new `<article class="case card hoverable reveal">` to the grid for each new case. |
| [`about/`](./about/index.html) | About: "What is Vérité?" in full, the founders, and the "worked at" logo strip. |
| [`contact/`](./contact/index.html) | Contact: a native enquiry form that posts to Web3Forms (which emails enquiries@verite-consulting.com) and redirects to `contact/thanks/`; works without JavaScript. Email and LinkedIn below as the second option. |
| [`contact/thanks/`](./contact/thanks/index.html) | Thank-you page after a form submission (`noindex`, not in the sitemap). |
| [`privacy/`](./privacy/index.html) | Privacy policy. Linked from the footer; excluded from `sitemap.xml` and disallowed in `robots.txt` until finalised. |

### Shared assets

| Path | What it is |
| --- | --- |
| [`assets/css/site.css`](./assets/css/site.css) | The one stylesheet every page links: design tokens, components (buttons, cards, badges, timeline, dark block, CTA panel), header, footer, mobile nav and the reveal-on-scroll styles. Edit styles here, never in a page. |
| [`assets/js/site.js`](./assets/js/site.js) | Shared scripts: footer year and reveal-on-scroll. Progressive enhancement; pages work without it. |
| [`assets/js/hero-net.js`](./assets/js/hero-net.js) | Home only: the interactive neural-net canvas behind the hero (vanilla canvas, cursor-responsive, static frame under reduced motion, nothing drawn with JavaScript off). |
| `assets/joe.jpg`, `assets/sam.jpg`, `assets/logos/` | Team photos and the greyed company logos. |
| `design/` | The original Claude Design source and design system this site implements. Reference only; do not edit. |

### Conventions

- The header and footer are duplicated in each HTML file (not injected by
  script). If you change them, change every page.
- Use root-relative paths (`/assets/...`, `/services/`) so nested pages resolve.
- Shared assets are linked with a `?v=` query. Bump it on every page when you change `site.css` or a script, so browsers fetch the new file instead of a cached one.
- The current page's nav link carries `aria-current="page"`.
- The mobile menu is a CSS-only `<details>` disclosure, so it works with
  JavaScript off.
- Copy is British English with no em dashes.
- `sitemap.xml` lists the five public pages; `robots.txt` points to it.

### Local preview

Serve the repo root (so root-relative paths resolve), for example:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`.
