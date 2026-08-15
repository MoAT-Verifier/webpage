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
```

## Content

The pages are:

| Route | Content |
| --- | --- |
| `/` | About: overview, results at a glance, backends, contact |
| `/evaluation/` | Experimental setup, LTL properties, results table |
| `/getting_started/` | Input, output, and components |
| `/publications/` | The paper and the tools it builds on |

The technical content is taken from the MoAT paper, whose LaTeX sources are kept in a
separate repository rather than here. The paper is the source of truth for all claims,
formulas, and benchmark numbers — in particular, the results table in
`src/pages/evaluation.astro` is a transcription of the evaluation table in that paper.

Site identity and metadata live in [`src/config/site.js`](src/config/site.js); the header
navigation is [`src/collections/menu.json`](src/collections/menu.json).

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
reduced to the single Retro Blue palette. See [`docs/DESIGN.md`](docs/DESIGN.md) for the
palette, typography, and component rules.
