# FutureTech

FutureTech is a responsive multi-page editorial website about artificial intelligence, emerging technology, research, and podcasts. It was rebuilt from a static tutorial project as a portfolio-ready React application while preserving the original HTML structure, BEM class names, and visual styling.

## Stack

- React 19 and React Router
- Vite 7
- SCSS organized into foundation, shared component, and page partials
- Vitest and Testing Library
- ESLint and Prettier

## Getting started

```bash
npm install
npm run dev
```

Production checks:

```bash
npm test
npm run lint
npm run build
```

The included `vercel.json` provides the SPA fallback required for direct visits to every React route.

## Architecture

The React shell renders shared header, page content, and footer components from the original page documents. Routing supports both clean portfolio URLs (`/news`) and legacy links (`/news.html`). Shared interaction logic covers the mobile navigation, tabs, expandable article content, video controls, the custom select, and the phone mask.

SCSS is split without redesigning the interface:

- `src/styles/base` — reset, typography, tokens, and utilities
- `src/styles/components` — shared shell, cards, and reusable content blocks
- `src/styles/pages` — page-specific news, media, article, and form blocks

## Source asset note

The provided tutorial snapshot did not include several assets referenced by its original HTML/CSS (including the logo, some icons, avatars, and illustrations). Existing paths remain unchanged so the missing originals can be restored under `public/images` and `public/icons` without code or layout changes. The intended Inter and Kumbh Sans font files were restored from their open-source Fontsource packages, with license texts stored beside the font files. All assets present in the snapshot are served from `public` and included in the production build.
