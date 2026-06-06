import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("projects index", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("pnpm build", { stdio: "pipe" });
    root = parse(readFileSync("dist/projects/index.html", "utf-8"));
  }, 120_000);

  it("renders project cards with status, role, tech, and links", () => {
    expect(root.querySelector("h1")?.text).toContain("Projects");
    expect(root.text).toContain("ImageForge");
    expect(root.text).toContain("SpotUI");
    expect(root.text).toContain("HeartDevs");
    expect(root.text).toContain("Marketing Extension shared sorting");
    expect(root.text).toContain("active");
    expect(root.text).toContain("contributor");
    expect(root.text).toContain("creator");
    expect(root.text).toContain("python");
    expect(root.text).toContain("php");
    expect(
      root.querySelector(
        'a[href="https://github.com/davicbtoliveira/imageforge"]',
      ),
    ).not.toBeNull();
    expect(
      root.querySelector('a[href="https://github.com/he4rt/heartdevs.com"]'),
    ).not.toBeNull();
  });

  it("renders filter links for project status and tech", () => {
    expect(
      root.querySelector('a[href="/projects?status=active"]')?.text,
    ).toContain("active");
    expect(root.querySelector('a[href="/projects?tech=go"]')?.text).toContain(
      "go",
    );
  });
});
