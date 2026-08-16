# MoAT Design System

The visual system behind <https://moat.verify.rwth-aachen.de/>. It is a single fixed
palette — **Retro Blue** — in light and dark mode. There is no theme switcher and no
runtime theme state.

## Design Direction

- Calm, editorial aesthetic: warm canvas, confident blue headings, gold used sparingly.
- Display typography for headings, a neutral sans for everything else.
- Dashed separators and restrained card borders.
- Subtle motion, never heavy animation; always respect `prefers-reduced-motion`.
- Full support for class-based dark mode.

## Source Files

- `src/styles/global.css` — the palette, layout tokens, `@font-face`, global styles, and
  the `html.dark` overrides. This is the single source of truth for color.
- `tailwind.config.mjs` — content scanning and the `darkMode: "class"` strategy.
- `src/layouts/Layout.astro` — page shell, CSS import, dark-mode boot script.
- `src/components/sections/Header.astro` — navigation, mobile menu, sticky header,
  and the dark-mode toggle.

## Color Tokens

The light palette is defined once in the `@theme` block of `src/styles/global.css`.
Dark mode restates only the tokens that change, under `html.dark`.

### Brand

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--color-primary` | `#2d6dc3` | `#3884eb` | Brand color, links, CTAs, headings |
| `--color-primary-strong` | `#0066ff` | `#8fb9ff` | Hover and emphasis |
| `--color-primary-light` | `#8fb9ff` | — | Light accents |
| `--color-accent` | `#fad13b` | — | Badges, highlights |
| `--color-accent-light` | `#faeb75` | — | Softer accent states |

`--color-primary-rgb` carries the same color as an `r, g, b` triple, so the
`bg-primary/10`-style utilities can build `rgba()` values. Keep it in sync with
`--color-primary` in both modes.

### Button

| Token | Usage |
| --- | --- |
| `--color-btn-primary` | Primary filled button background |
| `--color-btn-primary-hover` | Primary filled button hover |
| `--color-btn-primary-dark` | Primary filled button in dark mode |
| `--color-btn-primary-dark-hover` | Primary filled button hover in dark mode |
| `--color-btn-primary-text` | Primary filled button foreground |

### Background

| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg-primary` | `#fdfaf5` | Light page canvas |
| `--color-bg-secondary` | `#fff` | Cards and panels |
| `--color-bg-primary-light` | `#faf9f5` | Article surfaces |
| `--color-bg-primary-deep` | `#fefcf4` | Warm nested surfaces |
| `--color-bg-primary-dark` | `#0b1220` | Dark page canvas |
| `--color-bg-secondary-dark` | `#0f1b2d` | Dark cards and panels |

### Text

| Token | Value | Usage |
| --- | --- | --- |
| `--color-text-primary` | `#2d6dc3` | Light-mode headings |
| `--color-text-secondary` | `#3f4a5a` | Light-mode body text |
| `--color-text-tertiary` | `#7a6550` | Muted metadata |
| `--color-text-primary-dark` | `#3884eb` | Dark-mode headings |
| `--color-text-secondary-dark` | `#c5cedb` | Dark-mode body text |
| `--color-text-tertiary-dark` | `#9bb3d7` | Dark-mode muted metadata |

### Neutral Scale

`--color-neutral-50` through `--color-neutral-950`, for borders, body text, muted labels,
placeholders, and dark surfaces.

## Typography

| Token | Font | Usage |
| --- | --- | --- |
| `--font-brand` | Revalia | Display headings, hero title, section headings |
| `--font-sans` | Inter | Body text, UI labels, navigation, buttons |
| `--font-body` | Inter | Body text |

Revalia is an Art Deco display face, self-hosted from `public/fonts/` — it must not be
loaded from Google's CDN, which would send visitor IPs to Google. It ships a single
weight; `.font-brand` pins `font-weight: 400 !important` so nothing triggers a synthetic
bold. Inter is still loaded from the Google CDN via `@import` in `global.css`.

Rules:

- Use `font-brand` only for display text. It is decorative and loses legibility at small
  sizes.
- Use `font-sans` for UI and long-form content.
- Keep compact UI headings smaller than hero headings.

## Layout Tokens

| Token/Class | Value | Usage |
| --- | --- | --- |
| `--max-screen` | `1200px` | Main site width |
| `.site-container` | max width + horizontal padding | Page sections |
| `.container` | the same, used by the footer | Footer |

## Dark Mode

Class-based, and the only runtime visual state the site has.

- Tailwind config: `darkMode: "class"`.
- Initial state is applied inline in `Layout.astro` before paint, to avoid a flash.
- Preference is stored in `localStorage` under `dark_mode`.
- Toggle behavior lives in the inline script of `Header.astro`, which also keeps the two
  toggles (desktop and mobile) in step.
- Dark overrides live in the `html.dark` block in `global.css`.

Every new surface needs both light and dark styling.

## Core Components

| Component | Path | Role |
| --- | --- | --- |
| Header | `src/components/sections/Header.astro` | Main navigation |
| Footer | `src/components/sections/Footer.astro` | Footer navigation |
| Button | `src/components/ui/Button.astro` | CTA and link buttons |
| Badge | `src/components/ui/Badge.astro` | Small labels |
| Logo | `src/components/ui/Logo.astro` | Brand mark |
| Wordmark | `src/components/ui/Wordmark.astro` | "MoAT" with the A turned into ∀ |
| TopBg | `src/components/ui/TopBg.astro` | Decorative page-top background |
| ToTop | `src/components/ui/ToTop.astro` | Back-to-top button |
| PageHeader | `src/components/elements/PageHeader.astro` | Page-level header |
| SectionHeader | `src/components/elements/SectionHeader.astro` | Section title and description |
| PublicationList | `src/components/elements/PublicationList.astro` | The publications page |

## UI Rules

- Use existing components before creating new ones.
- Use Lucide icons via `@lucide/astro` when an icon is needed.
- Use semantic tokens (`text-primary`, `bg-bg-secondary`, `border-primary/15`) instead of
  hardcoded one-off colors.
- Keep cards restrained: subtle borders, low shadow, clean spacing.
- Wide content such as the evaluation table must sit in an `overflow-x-auto` container.

## Astro Gotchas

- Literal `{` and `}` in page text must be escaped as `&#123;` / `&#125;`, or Astro parses
  them as a JSX expression.
- Astro strips whitespace at line breaks next to inline tags, unlike plain HTML. If a line
  break falls right before or after `<a>`, `<strong>`, `<em>`, or `<code>`, add `{" "}` or
  the words will run together.

## Assets

- `public/favicon.svg`
- `public/fonts/revalia-*.woff2` — self-hosted display font
- `public/CNAME` — custom domain for GitHub Pages; deleting it breaks the domain

There is no Open Graph image yet. `siteConfig.meta.image` is empty, and `Meta.astro`
emits no `og:image` while it stays that way; add a file under `public/` and point the
field at it to bring the tag back.
