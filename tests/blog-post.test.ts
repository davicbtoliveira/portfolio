import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("blog post", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("corepack pnpm build", { stdio: "pipe" });
    root = parse(readFileSync("dist/blog/example/index.html", "utf-8"));
  }, 120_000);

  it("renders post metadata, reading time, and MDX body", () => {
    expect(root.querySelector("h1")?.text).toContain("An example blog post");
    expect(root.text).toContain("June 1, 2026");
    expect(root.text).toContain("1 min read");
    expect(root.text).toContain("meta");
    expect(root.text).toContain("A seed post that exists only");
  });

  it("renders owning project badge when referenced by a project", () => {
    expect(root.text).toContain("Part of project");
    expect(root.querySelector('a[href="/projects/example"]')?.text).toContain(
      "Example project",
    );
  });

  it("does not generate draft post detail pages", () => {
    expect(existsSync("dist/blog/draft/index.html")).toBe(false);
  });
});
