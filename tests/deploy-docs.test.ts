import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("Cloudflare deployment ops", () => {
  it("documents required secrets and manual Cloudflare steps", () => {
    const docs = readFileSync("docs/deployment.md", "utf-8");
    expect(docs).toContain("CLOUDFLARE_API_TOKEN");
    expect(docs).toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(docs).toContain("CLOUDFLARE_PAGES_PROJECT_NAME");
    expect(docs).toContain("PUBLIC_CF_WEB_ANALYTICS_TOKEN");
    expect(docs).toContain("Manual Cloudflare steps");
  });

  it("runs checks, tests, build, and Pages deploy from GitHub Actions", () => {
    const workflow = readFileSync(".github/workflows/deploy.yml", "utf-8");
    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("uses: pnpm/action-setup@v4");
    expect(workflow).not.toContain("pnpm/actions-setup");
    expect(workflow).toContain("pnpm install --frozen-lockfile");
    expect(workflow).toContain("pnpm check");
    expect(workflow).toContain("pnpm test");
    expect(workflow).toContain("pnpm build");
    expect(workflow).toContain("wrangler pages deploy dist");
  });
});
