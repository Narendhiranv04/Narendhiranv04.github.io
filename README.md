# Narendhiran's portfolio

A responsive, buildless portfolio for robotics and embodied AI. The design takes inspiration from [Ruchira Ray's portfolio](https://ruchira.framer.ai/): a narrow page, compact monospace text, a large portrait, and research thumbnails beside the descriptions. This version uses its own robot mark, warmer colors, project layouts, and light and dark themes.

## Preview locally

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. No package installation or build is required. Serve the files over HTTP; the content uses JavaScript modules.

## Edit

- `content.js` contains the biography, links, research, projects, competition details, and community activities.
- `styles.css` contains responsive layouts and both theme palettes. The theme follows the system until the visitor chooses a preference, which is saved locally.
- `script.js` renders the content and handles navigation, themes, and accessible detail dialogs.
- `index.html` contains metadata, font preloads, initial theme selection, and the no-JavaScript fallback. Update its metadata when changing the biography.
- `assets/images/` contains optimized WebP images derived from the original portfolio assets. Diagram previews preserve their complete aspect ratio and open at a larger size.
- `assets/fonts/` contains locally served DM Mono and Space Grotesk, with their SIL Open Font Licenses. The site does not require a third-party font service.

All original source images and the CV remain in the repository. GitHub Pages can serve the root directory directly.

## Original template

The original macOS-window template is preserved at commit `7380f7b` on:

```text
archive/original-macos-template-2026-10-23
```

To view that version, first commit or stash any work, then switch branches:

```sh
git switch archive/original-macos-template-2026-10-23
```

Return to the new design with `git switch main`.

## Verification

The redesign was checked in Chromium at widths from 320px to 1920px, in both themes. Checks cover local assets and fonts, theme persistence and system preference changes, blocked local storage, navigation, mobile layout, all research and competition dialogs, keyboard focus and Escape behavior, and the no-JavaScript contact/CV fallback. Automated axe checks cover WCAG A/AA and accessibility best practices.
