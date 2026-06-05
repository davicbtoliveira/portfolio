# PRD-0001: Portfolio Home Page

## Problem Statement

The portfolio is a closed spec (19 decisions in `ARCHITECTURE.md`) but no source exists yet. The first user-facing moment of the site is the home page at `/`. Without it, the site is unrenderable: visitors get a 404 and the author has nothing to deploy. The home page must establish the visual system (zinc + emerald, Geist, dark default), prove the content-collection data flow end-to-end, and act as the template for every other route — once `/` works, the rest of the site is a repetition of the same pattern with different data.

## Solution

A single static route at `/` that renders, in order:

1. A **hero** introducing the site owner.
2. A **featured projects** section — projects flagged `featured: true` in the `projects` collection, rendered as cards.
3. A **recent posts** section — the N most recent non-draft posts from the `blog` collection, rendered as cards.

To feed the home page, the slice also introduces the two **content collections** (`blog`, `projects`) with their Zod schemas and at least one seed entry of each, so the build has data to render. The page is a pure SSG output of `astro build` — no runtime server logic.

## User Stories

### Visitor — discovery

1. As a visitor landing on `/`, I want to see a hero with the author's name and a one-line positioning, so that I know whose site this is within 2 seconds.
2. As a visitor, I want the hero to set the tone (minimal, dark, mono accents), so that the page feels like a personal site, not a corporate landing.
3. As a visitor on a slow connection, I want the hero to be visible on first paint with no layout shift, so that I don't see a flash of unstyled content.
4. As a visitor arriving from a search engine, I want the page to render with the correct `<title>` and `<meta description>`, so that the browser tab and snippet are useful.
5. As a visitor arriving from social media, I want the Open Graph and Twitter Card tags to be set, so that link previews show the author's name and a sensible image.
6. As a visitor on a phone, I want the layout to adapt to a single column, so that I can read the hero and the cards without horizontal scroll.
7. As a visitor on a tablet or desktop, I want the layout to use a wider content area, so that the page does not look like a stretched mobile view.

### Visitor — projects

8. As a visitor, I want to see a "Featured Projects" section, so that the author's most representative work is one scroll away from the hero.
9. As a visitor, I want each featured project to show its title, summary, year, and tech stack, so that I can quickly decide which ones to open.
10. As a visitor, I want each project card to link to the project detail page, so that I can read more about the ones that interest me.
11. As a visitor, I want the "Featured Projects" section to be hidden when no projects are flagged `featured: true`, so that an empty seed doesn't leave a lonely section header on the page.
12. As a visitor, I want the projects to render in a stable order (e.g. year descending, then title), so that the page looks the same on every build.

### Visitor — blog

13. As a visitor, I want to see a "Recent Posts" section, so that the author's latest writing is discoverable from the home page.
14. As a visitor, I want each post card to show its title, description, publication date, and reading time, so that I can decide whether to open it.
15. As a visitor, I want each post card to link to the post page, so that I can read the full article.
16. As a visitor, I want the "Recent Posts" section to be hidden when no non-draft posts exist, so that an empty seed doesn't leave a lonely section header.
17. As a visitor, I want the recent posts to be the N most recent by `pubDate` descending, so that newer writing surfaces first.
18. As a visitor, I want draft posts (`draft: true`) to be excluded from the home page, so that unfinished writing never leaks to production builds.
19. As a visitor, I want the recent-posts count to be capped (e.g. 5), so that the home page does not become a duplicate of `/blog`.

### Visitor — accessibility and motion

20. As a visitor using a screen reader, I want the hero, projects, and posts to be announced as three distinct regions, so that I can jump between them.
21. As a visitor using keyboard navigation, I want every card link to be focusable and to show a visible focus ring, so that I can navigate without a mouse.
22. As a visitor with `prefers-reduced-motion: reduce` enabled, I want page transitions to be disabled, so that motion does not trigger discomfort.
23. As a visitor, I want the home page to respect the dark/light theme preference, so that it matches the rest of the site.

### Site owner — content workflow

24. As the site owner, I want to add a new project by creating a single MDX file under `src/content/projects/`, so that the home page picks it up on the next build.
25. As the site owner, I want a build to fail loudly when an MDX file in `src/content/projects/` is missing a required field, so that I do not ship a malformed project card.
26. As the site owner, I want the same for blog posts in `src/content/blog/`, so that I do not ship a malformed post card.
27. As the site owner, I want the build to skip `draft: true` posts without warning, so that I can keep unpublished drafts in the repo.
28. As the site owner, I want to flag a project as `featured: true` in its frontmatter, so that it appears in the home page's "Featured Projects" section without touching code.
29. As the site owner, I want the seed (one project + one blog post) to render the home page in a non-empty, demoable state, so that the first preview deploy is not a wall of empty sections.

### Site owner — operations

30. As the site owner, I want `pnpm build` to produce a static `dist/index.html` for the home route, so that the site can be deployed to any static host.
31. As the site owner, I want `pnpm dev` to render the home page with hot reload, so that iterating on the hero or cards is fast.
32. As the site owner, I want the home page to have zero client-side JavaScript by default, so that the site is fast and the Lighthouse score is high.

## Implementation Decisions

### Scope of this slice

- **In scope**: the `/` route, the `BaseLayout`, `Header`, `Footer` (only the minimum needed to render `/`), the `blog` and `projects` content collections, the design tokens, and the seed content (one project, one blog post).
- **Out of scope but assumed in place**: the theme toggle island (a separate slice), `/about`, `/now`, `/uses`, `/404`, project detail, blog index/detail, RSS, sitemap, robots.txt, OG image generation, GitHub enrichment, Cloudflare deploy, custom domain, analytics.

### Scaffolding (prerequisite, done in this slice if not already)

- Astro 5 with TypeScript strict and the official `astro` CLI.
- Tailwind CSS v4 wired via `@tailwindcss/vite` with the Vite plugin; design tokens defined in `src/styles/global.css` via `@theme` (zinc palette + emerald accent per `ARCHITECTURE.md` §4.2, Geist font variables per §4.3, `light-dark()` color function per §4.1).
- `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` self-hosted.
- `@tailwindcss/typography` installed (used by post pages, not strictly required for `/`).
- The single Solid island for the theme toggle is **not** part of this slice.

### Content collections

- `src/content/config.ts` defines two collections, both backed by a `glob` loader over `**/*.mdx`:
  - **`blog`**: Zod schema per `ARCHITECTURE.md` §3.1 — `title`, `description` (40–160 chars, validated), `pubDate` (Date), `updatedDate?` (Date), `tags` (string[]), `draft` (boolean, default `false`), `featured` (boolean, default `false`), `cover?` (path under `/public/covers/`).
  - **`projects`**: Zod schema per `ARCHITECTURE.md` §3.1 — `title`, `summary` (max 160 chars, validated), `year` (integer ≥ 2000), `status` (`'active' | 'maintained' | 'archived' | 'wip'`), `role` (`'creator' | 'maintainer' | 'contributor'`), `tech` (string[]), `links` (`repo?`, `demo?`, `post?` URLs), `featured` (boolean, default `false`), `cover?`, `relatedPosts` (string[]).
- Reverse `relatedPosts` mapping is defined in the schema layer as a typed helper but is **not consumed by the home page** (project detail consumes it; deferred to that slice).
- Stats enrichment from the GitHub API is **deferred** to a later slice; the home page does not read `stats.*`.

### Routes and components

- One route: `src/pages/index.astro` renders, in order: `<Hero />`, `<FeaturedProjects projects={...} />`, `<RecentPosts posts={...} />`.
- The page is wrapped in a minimal `BaseLayout.astro` (head, header, footer, slot). The full feature set of `BaseLayout` (View Transitions, theme script, SEO component) is **out of scope for this slice** — the home page uses the minimum layout that makes the page render and validates the layout seam. The full `BaseLayout` is built when the second slice (`/about` or theme toggle) needs it.
- The `<SEO />` component is **deferred** — this slice sets `<title>` and `<meta name="description">` inline on the home page.
- A `<ProjectCard.astro>` and a `<BlogCard.astro>` component are introduced to render each card shape; both are presentational and receive a typed entry as a prop.
- The home page is a pure SSG page — no `client:*` directives, no Astro endpoints, no SSR.

### Data shaping (the only "business logic")

Two pure functions live close to the home page (e.g. `src/lib/home.ts`):

- `pickFeaturedProjects(entries, { limit?: number }): Project[]` — filters `featured === true`, sorts by `year` desc then `title` asc, and trims to `limit` (default: all featured, but capped at 6 for visual reasons).
- `pickRecentPosts(entries, { limit: number }): Post[]` — filters `draft !== true`, sorts by `pubDate` desc, and trims to `limit` (default 5).

These are pure and are the only pieces of logic worth unit-testing beyond the HTML seam.

### Theme and motion

- The page renders with `data-theme="dark"` on `<html>` as the default (no toggle in this slice).
- View Transitions are **not** added in this slice — they are added when the second slice needs cross-route navigation.
- A `<script>` setting `data-theme` from `localStorage` (anti-FOUC) is **not** in this slice — it lives with the theme toggle.

### Seed content

- `src/content/projects/example.mdx` — a single placeholder project with all required fields populated and `featured: true`.
- `src/content/blog/example.mdx` — a single placeholder post with `draft: false` and `pubDate` set to a recent date.
- This is the minimum to make the home page demoable on the first deploy.

### Dependencies and tooling

- Runtime/dev: `astro`, `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/typography`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `solid-js` (only if needed for the layout — likely not in this slice; defer the Solid install until the theme toggle slice).
- Dev tooling: `vitest` for unit tests, `typescript` strict, `pnpm` lockfile.
- No Playwright in this slice.

## Testing Decisions

### Primary seam: build-time HTML assertion

The home page is tested by **rendering the page and asserting on the produced HTML** — no browser, no Playwright. The seam is:

- A test script (Vitest + a small Astro render helper, or a script that runs `astro build` and parses `dist/index.html` with `node-html-parser` or `cheerio`) that:
  1. Renders the home route (either by importing the `.astro` component into a test, or by reading the built `dist/index.html`).
  2. Asserts the hero text is present.
  3. Asserts the example project title from `src/content/projects/example.mdx` appears inside a card linking to the project detail route.
  4. Asserts the example post title from `src/content/blog/example.mdx` appears inside a card linking to the post detail route.
  5. Asserts `<html data-theme="dark">` is set.
  6. Asserts no `<script type="module">` from the home page itself is present (i.e. no client-side JS shipped for `/`).

This seam is the highest reasonable one for an SSG site: it tests what the user gets, without the overhead of a browser. It is also robust to refactors of components — the test cares about rendered output, not implementation.

### Secondary seam: unit tests on the data-shaping functions

The two pure functions in `src/lib/home.ts` (`pickFeaturedProjects`, `pickRecentPosts`) are unit-tested with hand-crafted collections:

- `pickFeaturedProjects` returns only `featured: true` entries, sorted by year desc then title asc, and is capped at the limit.
- `pickRecentPosts` excludes drafts, sorts by `pubDate` desc, and trims to the limit.

This is the seam that catches "draft leaked to home page" or "featured projects in the wrong order" without re-running the build.

### What is explicitly **not** tested in this slice

- Visual / pixel-level regressions (no screenshot diff).
- Browser-driven e2e (no Playwright).
- Accessibility audits (no axe-core run; accessibility is a property of the markup, asserted by reading the HTML directly in the build-time test).
- Performance budgets (no Lighthouse run; SSG + zero-JS for `/` is the budget).

### Prior art

- None in-repo (greenfield). The seam is inspired by Astro's own `pnpm test` patterns and by the principle that for an SSG site, the build artifact is the source of truth for "what the user sees."

## Out of Scope

- **Theme toggle** and the Solid island — separate slice.
- **Full `BaseLayout`** with View Transitions, theme script, and `<SEO />` — added when the second slice needs it.
- **/about**, **/now**, **/uses**, **/404** pages.
- **/projects** index and `/projects/[slug]` detail.
- **/blog** index and `/blog/[slug]` detail.
- **OG image** generation at `/og/[slug].png`.
- **GitHub enrichment loader** for project stats.
- **RSS**, **sitemap**, **robots.txt**, **favicon**, **manifest.json**.
- **Cloudflare Pages deploy** and **GitHub Actions** workflow.
- **Custom domain** and **Cloudflare Web Analytics** beacon.
- **Search** (Pagefind), **comments** (Giscus), **i18n**, **newsletter** — explicitly deferred per `ARCHITECTURE.md` §5.2 and §9.
- **Series support**, **categories**, **JSON Resume**, **PWA**, **webmentions** — deferred per `ARCHITECTURE.md` §9.
- **Playwright / e2e browser tests** — not in this slice; the build-time HTML seam covers the home page.

## Further Notes

- This PRD is the **first tracer bullet**: it proves the end-to-end flow from MDX in the repo to a static `index.html` that renders. Once it ships, every other route is a data variation of the same shape (collection → pick → render cards in a route), so the pattern established here is what the rest of the site will follow.
- The choice to **not** include the full `BaseLayout` (View Transitions, SEO, theme script) in this slice is deliberate. Adding them in the home page PRD would couple the layout's evolution to the home page's evolution. The home page ships with the minimum layout that lets it render, and the layout is upgraded incrementally as other routes need features.
- The choice to **not** install Solid in this slice is also deliberate — the home page has no interactivity. Solid is added when the theme toggle slice lands, which is the only planned island in the spec.
- The build-time HTML seam is the highest practical seam for a personal portfolio: it asserts on what the user actually receives, without the cost of a browser. If a later slice introduces interactivity that the HTML seam cannot cover, Playwright is added then, not now.
- The "exclude drafts" rule (`pickRecentPosts` filters `draft !== true`) is the only behavioral rule from `ARCHITECTURE.md` that has real consequences in this slice. It is encoded in the function and covered by a unit test, so a future change cannot silently start leaking drafts.
- The `ARCHITECTURE.md` spec is in Portuguese while the project is EN-only (decision 7). This PRD is in English to match the rendered site. The spec stays in Portuguese; the codebase and the user-visible site stay in English.
