# Architecture Completion

The closed portfolio architecture is implemented as a static Astro site:

- Home page
- About page
- Projects index and project detail pages
- Blog index and blog post pages
- Now and uses pages
- Styled 404 page
- RSS feed
- Sitemap and robots outputs
- Generated OG images for blog posts and projects
- Optional GitHub project enrichment at build time
- Cloudflare Pages deployment workflow

## Local Commands

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm preview
```

CI runs the same validation path through GitHub Actions before deploying to
Cloudflare Pages.

## Production Workflow

Pull requests build and can deploy Cloudflare Pages previews when the required
Cloudflare secrets are configured. Pushes to `main` deploy production from the
static `dist` output. See `docs/deployment.md` for required secrets and manual
Cloudflare dashboard steps.

## Architecture Notes

- Content remains MDX committed in git.
- Blog drafts are excluded from public HTML, RSS, sitemap, and post detail
  routes.
- Project-to-post relationships stay source-of-truth on project frontmatter via
  `relatedPosts`.
- GitHub stats enrichment is optional and degrades when `GITHUB_TOKEN` or API
  responses are unavailable.
- Runtime JS remains limited to shared navigation/theme behavior.

## Deferred Features

These remain intentionally out of scope from `ARCHITECTURE.md`:

- search
- comments
- newsletter
- i18n
- series
- categories
- `/cv`
- PWA/service worker
- webmentions

Revisit search only after the blog exceeds 25 posts. Revisit comments only if
the site becomes community-oriented.
