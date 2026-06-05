import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

describe("machine-readable outputs", () => {
  let rss: string;
  let sitemap: string;
  let robots: string;

  beforeAll(() => {
    execSync("corepack pnpm build", { stdio: "pipe" });
    rss = readFileSync("dist/rss.xml", "utf-8");
    sitemap = readFileSync("dist/sitemap-0.xml", "utf-8");
    robots = readFileSync("dist/robots.txt", "utf-8");
  }, 120_000);

  it("publishes RSS for non-draft posts", () => {
    expect(rss).toContain("An example blog post");
    expect(rss).toContain("https://dcbto.dev/blog/example");
    expect(rss).not.toContain("A draft post");
  });

  it("publishes sitemap and robots without draft routes", () => {
    expect(sitemap).toContain("https://dcbto.dev/blog/example");
    expect(sitemap).toContain("https://dcbto.dev/projects/imageforge/");
    expect(sitemap).not.toContain("/blog/draft");
    expect(robots).toContain("Sitemap: https://dcbto.dev/sitemap-index.xml");
  });
});
