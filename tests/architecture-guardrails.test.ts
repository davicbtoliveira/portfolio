import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

describe("architecture completion guardrails", () => {
  beforeAll(() => {
    execSync("corepack pnpm build", { stdio: "pipe" });
  }, 120_000);

  it("builds every architecture route and output", () => {
    [
      "dist/index.html",
      "dist/about/index.html",
      "dist/projects/index.html",
      "dist/projects/imageforge/index.html",
      "dist/blog/index.html",
      "dist/blog/example/index.html",
      "dist/now/index.html",
      "dist/uses/index.html",
      "dist/404.html",
      "dist/rss.xml",
      "dist/sitemap-index.xml",
      "dist/sitemap-0.xml",
      "dist/robots.txt",
      "dist/og/blog-example.png",
      "dist/og/project-imageforge.png",
    ].forEach((path) => expect(existsSync(path), path).toBe(true));
  });

  it("documents commands, workflow, and deferred features", () => {
    const docs = readFileSync("docs/architecture-completion.md", "utf-8");
    expect(docs).toContain("pnpm check");
    expect(docs).toContain("pnpm test");
    expect(docs).toContain("pnpm build");
    expect(docs).toContain("Cloudflare Pages");
    expect(docs).toContain("search");
    expect(docs).toContain("comments");
    expect(docs).toContain("newsletter");
    expect(docs).toContain("i18n");
    expect(docs).toContain("/cv");
  });
});
