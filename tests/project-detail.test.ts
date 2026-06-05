import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("project detail", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("corepack pnpm build", { stdio: "pipe" });
    root = parse(readFileSync("dist/projects/example/index.html", "utf-8"));
  }, 120_000);

  it("renders project metadata and MDX body", () => {
    expect(root.querySelector("h1")?.text).toContain("Example project");
    expect(root.text).toContain("wip");
    expect(root.text).toContain("creator");
    expect(root.text).toContain("typescript");
    expect(root.text).toContain("A seed project that exists only");
  });

  it("renders related articles from project frontmatter", () => {
    expect(root.text).toContain("Articles about this project");
    expect(root.querySelector('a[href="/blog/example"]')?.text).toContain(
      "An example blog post",
    );
  });
});
