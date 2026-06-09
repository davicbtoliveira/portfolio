import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("project detail", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("pnpm build", { stdio: "pipe" });
    root = parse(readFileSync("dist/projects/heartdevs/index.html", "utf-8"));
  }, 180_000);

  it("renders project metadata and MDX body", () => {
    expect(root.querySelector("h1")?.text).toContain("HeartDevs");
    expect(root.text).toContain("maintained");
    expect(root.text).toContain("contributor");
  });

  it("renders related articles from project frontmatter", () => {
    expect(root.text).not.toContain("Articles about this project");
  });
});
