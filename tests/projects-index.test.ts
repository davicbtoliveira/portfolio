import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("projects index", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("corepack pnpm build", { stdio: "pipe" });
    root = parse(readFileSync("dist/projects/index.html", "utf-8"));
  }, 120_000);

  it("renders project cards with status, role, tech, and links", () => {
    expect(root.querySelector("h1")?.text).toContain("Projects");
    expect(root.text).toContain("Example project");
    expect(root.text).toContain("wip");
    expect(root.text).toContain("creator");
    expect(root.text).toContain("typescript");
    expect(root.querySelector('a[href="https://github.com/davicbtoliveira/example"]')).not.toBeNull();
  });

  it("renders filter links for project status and tech", () => {
    expect(root.querySelector('a[href="/projects?status=wip"]')?.text).toContain("wip");
    expect(root.querySelector('a[href="/projects?tech=typescript"]')?.text).toContain(
      "typescript",
    );
  });
});
