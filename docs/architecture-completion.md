# Architecture Completion

The portfolio is a statically generated SvelteKit site with MDX content,
validated metadata, Cloudflare Pages deployment, RSS, sitemap, robots output,
and build-time OG images.

## Local commands

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm preview
```

The GitHub Actions workflow runs the same check, test, and build path before a
Cloudflare Pages preview or production deploy.

## Runtime boundaries

- Content is validated in `src/lib/content.ts` through Zod schemas.
- Draft posts are excluded from public HTML, RSS, sitemap, OG routes, and post
  detail pages.
- Project-to-post relationships remain source-of-truth in project frontmatter.
- GitHub enrichment is optional and degrades without credentials or API data.
- Shared theme and navigation behavior is implemented with Svelte components;
  static pages remain server-rendered HTML.

## Deferred features

search, comments, newsletter, full i18n, series, categories, `/cv`,
PWA/service worker, and webmentions remain intentionally out of scope.
