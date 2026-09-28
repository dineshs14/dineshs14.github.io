# Dinesh S — Portfolio

Responsive, dependency-free HTML/CSS/JavaScript portfolio. Includes light/dark themes, accessible navigation, scroll reveals, project links, a CV download, and a WhatsApp contact handoff.

Preview locally with `python -m http.server 8000`, then open `http://localhost:8000`.

The repository root remains ready for GitHub Pages. For a static deployment artifact, run `node scripts/build.mjs`; public files are copied into `dist/`. Sites configuration is in `.openai/hosting.json`.

Motion follows the visitor's reduced-motion preference. Theme preference is stored locally when available. Google Fonts and Font Awesome are external resources; system fonts remain available as fallbacks.
