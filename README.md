# Narendhiranv04.github.io

Minimal profile site for Narendhiran Vijayakumar that mirrors the look and feel of the Long Horizon Hierarchy page while
staying lightweight. The single-page layout now includes a light/dark theme toggle, animated experience timeline, and
project cards with dedicated media slots so the content feels intentional without heavy visuals.

## Local development

You can preview the site locally with any static file server. One option included with Python is `http.server`:

```bash
python -m http.server 4000
```

Then open [http://localhost:4000](http://localhost:4000) in your browser.

## Structure

- `index.html` – page markup and content
- `assets/css/styles.css` – global styles, layout, and theme definitions
- `assets/js/main.js` – navigation toggle, theme persistence, and scroll-triggered animation helpers
- `assets/img/` – handcrafted logo marks used in the experience timeline

All styles and scripts are handwritten so the page has no build step or external dependencies beyond the hosted fonts.
