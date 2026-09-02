# Lattice Daily Web App

Next.js reader for the generated lattice paper database.

```bash
npm ci
npm test
npm run dev
```

The app provides:

- a newest-first daily paper feed;
- a searchable paper library;
- paper detail pages with the complete generated summary;
- browser-local notes.

Production builds read `../data/papers.json` through the repository-level
Turbopack root configured in `next.config.ts`.
