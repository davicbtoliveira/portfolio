# Deployment

Cloudflare Pages deploys run from GitHub Actions. Local development does not
need Cloudflare credentials.

## Required GitHub Secrets

- `GITHUB_TOKEN`: provided by GitHub Actions; used for build-time GitHub project enrichment.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Pages edit/deploy access.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID.
- `CLOUDFLARE_PAGES_PROJECT_NAME`: Cloudflare Pages project name.

## Optional GitHub Variables

- `PUBLIC_CF_WEB_ANALYTICS_TOKEN`: Cloudflare Web Analytics token. Omit locally
  or in CI to skip the analytics beacon.

## Workflow

- Pull requests run install, check, test, build, then deploy a Cloudflare Pages
  preview using the PR branch name.
- Pushes to `main` run the same validation and deploy production from `dist`.
- The static build remains valid without Cloudflare credentials; only deploy
  steps need the Cloudflare secrets.

## Manual Cloudflare steps

1. Create the Cloudflare Pages project.
2. Create a Cloudflare API token scoped to the Pages project.
3. Add `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and
   `CLOUDFLARE_PAGES_PROJECT_NAME` to GitHub repository secrets.
4. Add `PUBLIC_CF_WEB_ANALYTICS_TOKEN` as a GitHub repository variable when
   Cloudflare Web Analytics is enabled.
5. Configure the custom domain in the Cloudflare dashboard.
