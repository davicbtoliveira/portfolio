import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("blog index", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("pnpm build", { stdio: "pipe" });
    root = parse(readFileSync("dist/blog/index.html", "utf-8"));
  }, 120_000);

  it("renders published posts with tags", () => {
    expect(root.querySelector("h1")?.text).toContain("Blog");
    expect(root.text).toContain("An example blog post");
    expect(root.text).toContain("meta");
    expect(root.querySelector('a[href="/blog/example"]')).not.toBeNull();
  });

  it("renders tag filter links", () => {
    expect(root.querySelector('a[href="/blog?tag=meta"]')?.text).toContain(
      "meta",
    );
  });

  it("excludes draft posts and draft-only tags", () => {
    expect(root.text).not.toContain("A draft post");
    expect(root.text).not.toContain("draft-only");
  });
});
