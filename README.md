# MoAT — website

Source for <https://moat.verify.rwth-aachen.de/>, the website of **MoAT** (Model Checking
Analysis Tool): a framework for LTL model checking of infinite state systems which reduces
the problem to fair termination and calls the termination tools
[KoAT](https://koat.verify.rwth-aachen.de/) and
[LoAT](https://loat-developers.github.io/LoAT/) in the backend.

## Development

Requires Node >= 22.12 and pnpm 9.

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5200
```

```bash
pnpm build      # astro check && astro build -> dist/
pnpm preview
pnpm check      # biome: format and lint
```

### Running against a local analysis service

The `/interface/` page talks to the analysis service from the webinterface. To develop
against a local one, run its image and point the site at it, in two terminals:

```bash
docker run --rm --pull always -p 8081:8080 --platform linux/amd64 ghcr.io/moat-verifier/moat-webinterface:latest
```

```bash
PUBLIC_MOAT_API_URL=http://127.0.0.1:8081 pnpm dev
```

## Content

The pages are:

| Route | Content |
| --- | --- |
| `/` | About: overview, results at a glance, backends, contact |
| `/evaluation/` | Experimental setup, LTL properties, results table |
| `/getting_started/` | Input, output, and components |
| `/publications/` | The papers (generated, see below) and the tools MoAT builds on |

Site identity and metadata live in [`src/config/site.js`](src/config/site.js); the header
navigation is [`src/data/menu.json`](src/data/menu.json).

## Publications

The publications page is generated from a BibTeX file. **To add a paper, add an entry to [`src/data/publications.bib`](src/data/publications.bib) and change nothing else.**

[`src/lib/publications.ts`](src/lib/publications.ts) parses the file at build time and [`PublicationList.astro`](src/components/elements/PublicationList.astro) renders it, grouped by year (newest first, then `month`, then `sortkey`). Each abstract is
collapsed behind a toggle, and only one is open at a time.

| Field | Required | Notes |
| --- | --- | --- |
| `author` | yes | Printed verbatim as one line — write it exactly as it should appear |
| `title` | yes | Links to `doi`, else `arxiv`, else `site` |
| `year` | yes | Group heading and primary sort key; a missing year fails the build |
| `booktitle` | — | Proceedings name, on its own line |
| `series`, `volume`, `pages` | — | Render as `Series Volume, Pages, Year` |
| `journal`, `volume`, `pages` | — | Journal alternative to the three above |
| `abstract` | — | Shown in the collapsible panel |
| `month`, `sortkey` | — | Ordering within a year only, never displayed |
| `doi` | — | **Bare** DOI; `https://doi.org/` is added by the renderer |
| `arxiv`, `pdf`, `site` | — | Full URLs (`site` may be root-relative) |
| `to_appear = {}` | — | Presence-only flag; suppresses the series/volume/pages line |

`doi`, `arxiv`, `pdf`, and `site` each add one button. Unknown fields (`biburl`, `ee`,
`publisher`, …) are ignored, so pasting a DBLP entry does no harm — but rewrite its `author`
field by hand, since DBLP's `A and B and C` form is printed as-is. `%` comment lines are
skipped, and LaTeX escapes (`\_`), `--`, and protective braces (`{ACM}`) are decoded,
though never inside URL fields.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the site and publishes it to GitHub Pages. The custom domain is set by
[`public/CNAME`](public/CNAME) — deleting that file breaks the domain on the next deploy.

For this to work, the repository must have **Settings → Pages → Source** set to
*GitHub Actions*, the custom domain registered in the same settings page, and a DNS `CNAME`
record for `moat` in the `verify.rwth-aachen.de` zone.

## Credits

Built on the [ricoui-astro-starter](https://github.com/ricocc/ricoui-astro-starter) template
(MIT), with its blog, DESIGN, and Elements demo pages removed and its multi-theme system
reduced to the single Retro Blue palette. See [`DESIGN.md`](DESIGN.md) for the
palette, typography, and component rules.
