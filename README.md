# Personal Site

This repository hosts the source for [Narendhiran Vijayakumar's personal research homepage](https://narendhiranv04.github.io/).

The site is a static rebuild of the **Long Horizon Hierarchy** project theme, adapted to showcase biography, research highlights, selected projects, publications, media, and contact information. It is deployed via GitHub Pages from the repository root.

## Local development

Open `index.html` in a browser or use a simple HTTP server:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Customizing

- Update profile details, links, and section content directly in `index.html`.
- Replace the profile photo by updating the `<img>` `src` attribute inside the `.profile-card`.
- Add or edit projects, publications, and media entries by duplicating the existing card markup.
- Extend styles in `assets/style.css` if additional layouts are required.

## License

Content © Narendhiran Vijayakumar. Theme assets derived from the Long Horizon Hierarchy project and used with attribution.
