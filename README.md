# Narendhiran's portfolio

A buildless academic portfolio, closely following the proportions and simple image-and-text layout of [Ruchira Ray's website](https://ruchira.framer.ai/). It uses a neutral background, black text, blue links, compact citations, and plain project rows. Light and dark modes are supported.

## Preview locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. There is no package installation or build step. Use HTTP because the content is imported as a JavaScript module. GitHub Pages serves the repository root.

## Edit

- `content.js`: biography, social links, all four publications, projects, competition details, and clubs.
- `styles.css`: layouts, typography, and both theme palettes.
- `script.js`: content rendering, theme preferences, and accessible image/project dialogs.
- `index.html`: search/social metadata, initial theme selection, local font preloads, and contact/CV fallback when JavaScript is disabled.
- `assets/publications/`: actual architecture figures from the papers, plus smaller previews. See [figure sources](assets/publications/SOURCES.md).
- `assets/images/`: optimized portrait, competition, and community images.
- `assets/fonts/`: locally hosted DM Mono and Hammersmith One, with their SIL Open Font Licenses. No external font service is required.

Publication metadata was checked against current arXiv records on 24 October 2026. The owner confirmed that the four papers are the complete Scholar list. Each entry includes the current title, complete author list in source order, year, paper link, diagram, and verified code/project links where available. The papers are labeled as arXiv records; submission or acceptance claims are not inferred. Figures open at a larger size with a PDF link. To add or update a paper, edit `publications.items` and record the figure source alongside the assets.

The theme follows the operating system until a visitor saves a preference. It also works when browser storage is blocked.

## Original template

The original macOS-window template remains preserved at commit `7380f7b` on:

```text
archive/original-macos-template-2026-10-23
```

Commit or stash local changes before switching to that branch. Return to the current site with `git switch main`. Original source images and the CV remain in the repository.

## Verification

Browser checks cover viewport widths from 320px to 1920px, both themes, complete publication metadata and figure loading, enlarged diagrams, competition galleries, keyboard focus and Escape behavior, theme persistence, system theme changes, unavailable local storage, and the no-JavaScript fallback. Automated axe checks cover WCAG A/AA and accessibility best practices on desktop, and WCAG A/AA on mobile.
