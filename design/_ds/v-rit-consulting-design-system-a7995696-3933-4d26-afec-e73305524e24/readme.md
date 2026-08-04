# Vérité Consulting — Design System

A clean, professional design system for **Vérité Consulting**, an evidence-led management consulting firm. The system centers on a deep navy blue, Inter / Inter Tight typography, and a restrained, corporate-modern aesthetic.

> **Sources.** Built from the [`SmacGuffog/Verite`](https://github.com/SmacGuffog/Verite) GitHub repository — the firm's own design-system resources (tokens, components, UI-kit code). Explore that repo for deeper reference when building against this brand. The original direction from the owner: *core colour = darker blue; fonts = professional modern technology (Inter); aim for a very clean system.* No standalone Figma file, logo, or brand book was provided beyond the repo.

---

## Brand context

Vérité ("truth" in French) is a management consulting firm. Its promise is **clarity before scale** — turning a sharp, evidence-based point of view into measurable results for leadership teams. The tone is precise, confident, and quietly authoritative; the visual language is calm, high-contrast, and free of gimmicks. Two products are represented:

- **Marketing website** — public site: hero, services, case studies, insights, contact. (`ui_kits/website/`)
- **Client portal** — a workspace where engagement teams and client stakeholders track delivery. (`ui_kits/portal/`)

---

## Content fundamentals

**Voice:** precise, confident, evidence-led. We sound like a trusted advisor stating a considered position, not a vendor selling.

- **Point of view, backed by proof.** Lead with a claim, then the evidence. "Cost-to-serve fell 22% across three units." Numbers are specific and sourced, never rounded up for effect.
- **Person.** Address the client as **you**; refer to the firm as **we**. Avoid "I".
- **Casing.** Sentence case everywhere — headlines, buttons, nav, labels. The one exception is the **eyebrow / overline**, which is UPPERCASE with wide tracking. Never Title Case UI.
- **Tone rules of thumb:** short declarative sentences; active voice; concrete nouns. Name the trade-off rather than hiding it ("Here is the evidence, and the cost").
- **Avoid:** hype and superlatives ("game-changing", "world-class", "revolutionary"), unearned certainty ("trust us — it just works"), jargon, and exclamation marks.
- **Emoji:** never. Not in product, marketing, or decks.
- **Examples in voice:** headline "Clarity before scale." · CTA "Start a conversation" · reassurance "Expect a reply within two business days." · empty-of-hype result "An operating-model redesign that took 22% out of cost-to-serve."

See the **Voice & tone** brand card for a say / avoid comparison.

---

## Visual foundations

**Color.** The core is a deep navy blue (`--blue-700 #1A3566`, the brand color) supported by an 11-step blue ramp and a cool **slate** neutral ramp. A brighter blue (`--accent #2F569E`) carries interactivity (links, focus, accent buttons). Semantics are muted and professional: green `#1E8A5B`, amber `#B7791F`, red `#C0392B`, each with a soft tinted fill for banners. Backgrounds are white (`--surface-card`) or a barely-there slate (`--surface-page #F8FAFC`); dark sections use navy `--surface-inverse`. No purple, no neon, no multi-hue gradients — the only gradient used is a whisper-soft white→slate wash behind the hero.

**Typography.** Two families do the work. **Inter Tight** (600–700, tight −0.02/−0.03em tracking) for display and headlines; **Inter** (400/500/600) for body and UI; **JetBrains Mono** for figures, data, and code. Type scale is a 1.2 minor third from 12→60px. Body copy is 16px at 1.55 line-height. The signature move is the **eyebrow**: 12px, 600, uppercase, 0.08em tracking, in accent blue, sitting above a display headline.

**Spacing & layout.** 4px base grid (`--space-1`=4 … `--space-12`=96). Content max-width 1200px with 32px gutters. Generous vertical rhythm — sections breathe with 64–80px of padding. Layouts are grid-based and symmetrical; nothing is playfully off-axis.

**Corners.** Moderate, consistent radii: inputs/buttons 8px (`--radius-md`), cards 12px (`--radius-lg`), dialogs 16px, large feature panels 24px. Pills (badges/switch) are fully rounded. Never sharp 0px, never oversized-cute.

**Elevation & borders.** Shadows are soft and **cool-tinted** (navy-based rgba), used sparingly — cards rest on `--shadow-sm` and lift to `--shadow-md` on hover. Most separation is done with 1px slate borders (`--border-subtle`/`--border-default`), not shadow. Cards = white fill + 1px subtle border + small shadow + 12px radius.

**Motion.** Restrained and quick. Standard transitions are 120–200ms on a `cubic-bezier(0.2,0,0.1,1)` standard ease; emphasis moments use `cubic-bezier(0.16,1,0.3,1)`. Fades and small translate/-2px lifts — **no bounces, no springy overshoot, no infinite loops.** Respect `prefers-reduced-motion`.

**Interaction states.** Hover: darken solid fills one step, or wash a ghost control with `--slate-100`; cards lift −2px. Press: settle back to base (no aggressive shrink). Focus: 3px accent-blue ring (`--ring-focus`). Disabled: 50% opacity, `not-allowed` cursor.

**Imagery & texture.** The system is largely image-light and typographic. When imagery is used it should be cool-toned, sober, and documentary (real teams, workplaces) — no stock-photo gloss, no illustration mascots, no textures or patterns. Dark navy panels stand in for "hero imagery" moments. Transparency/blur is used only for sticky headers (85% white + 10px backdrop blur) and the dialog scrim (navy at 45% + slight blur).

---

## Iconography

- **Set:** [Lucide](https://lucide.dev) (ISC-licensed) — a curated subset is inlined as SVG in `components/media/Icon.jsx` and exposed via the `<Icon name="…" />` component. **Substitution flag:** no icon set was provided in the brief, so Lucide was chosen as the closest fit for a clean, modern, technical brand. Swap for the firm's own set if one exists.
- **Style:** 24×24 viewBox, **2px stroke, round caps/joins, no fill.** This matches the line-based, precise feel of the type. Default render size 16–24px in UI, up to 32px in feature callouts.
- **Color:** icons inherit `currentColor`, so they tint with surrounding text; feature icons sit in a navy-on-`--blue-50` rounded tile.
- **No emoji, no unicode-symbol icons, no PNG icons.** Everything is inline vector for crispness and recoloring.
- Add glyphs by extending the `ICONS` map in `Icon.jsx` (paste the inner SVG from lucide.dev) and the `IconName` union in `Icon.d.ts`.

---

## Components

Reusable primitives, grouped by concern under `components/`. All read tokens from `styles.css` and are exported on `window.DesignSystem_a79956`.

- **actions/** — `Button`, `IconButton`
- **forms/** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`
- **display/** — `Card`, `Badge`, `Tag`, `Stat`
- **feedback/** — `Alert`, `Dialog`, `Toast`, `Tooltip`
- **navigation/** — `Tabs`, `Breadcrumb`
- **media/** — `Icon`

**Intentional additions** (beyond a generic set, justified by the brand): `Stat` — consulting work is results-driven, so a first-class metric component is core, not optional. `Icon` — a wrapper over the curated Lucide set so glyph usage is consistent and recolorable.

Each component directory has `<Name>.jsx`, `<Name>.d.ts` (props), `<Name>.prompt.md` (usage), and one `*.card.html` specimen registered on the Design System tab.

---

## Index / manifest

Root:
- `styles.css` — entry point (import this one file). `@import`s everything in `tokens/`.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadows.css`.
- `readme.md` — this file.
- `SKILL.md` — Agent-Skills-compatible entry point.

Specimens (`guidelines/`, shown on the Design System tab):
- Colors — `color-brand`, `color-neutral`, `color-semantic`, `color-aliases`
- Type — `type-display`, `type-body`, `type-mono`, `type-scale`, `type-eyebrow`
- Spacing — `spacing-scale`, `spacing-radius`, `spacing-elevation`
- Brand — `brand-wordmark`, `brand-voice`

Components: `components/<group>/` (see list above).

UI kits:
- `ui_kits/website/` — marketing site (Home + Contact).
- `ui_kits/portal/` — client portal (Dashboard + Engagement).

---

## Caveats

- **No logo supplied.** The brand is rendered as a type-only wordmark ("Vérité." in Inter Tight, accent period). Replace `Wordmark` / `brand-wordmark.html` when a real mark exists.
- **Fonts load from the Google Fonts CDN** via `@import` in `tokens/fonts.css` (not self-hosted binaries). For offline/print reliability, provide woff2 files and we'll switch to `@font-face`.
- **Icons are Lucide**, substituted for a firm-specific set that was not provided.
