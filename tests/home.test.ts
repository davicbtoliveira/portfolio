import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("home page", () => {
  let root: HTMLElement;

  beforeAll(() => {
    execSync("pnpm build", { stdio: "pipe" });
    const html = readFileSync("dist/index.html", "utf-8");
    root = parse(html);
  }, 120_000);

  it("contains the hero heading", () => {
    const h1 = root.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.text).toContain("Davi Oliveira");
  });

  it("sets data-theme=\"dark\" on the <html> element", () => {
    const html = root.querySelector("html");
    expect(html).not.toBeNull();
    expect(html?.getAttribute("data-theme")).toBe("dark");
  });

  it("ships no client-side module scripts from the home route", () => {
    const moduleScripts = root.querySelectorAll('script[type="module"]');
    expect(moduleScripts.length).toBe(0);
  });

  it("renders the seed project inside a card linking to its detail route", () => {
    const projectLinks = root.querySelectorAll('a[href="/projects/example"]');
    expect(projectLinks.length).toBeGreaterThanOrEqual(1);
    const linkText = Array.from(projectLinks).map((a) => a.text);
    expect(linkText.some((t) => t?.includes("Example project"))).toBe(true);
  });

  it("renders the seed post inside a card linking to its detail route", () => {
    const postLinks = root.querySelectorAll('a[href="/blog/example"]');
    expect(postLinks.length).toBeGreaterThanOrEqual(1);
    const linkText = Array.from(postLinks).map((a) => a.text);
    expect(linkText.some((t) => t?.includes("An example blog post"))).toBe(true);
  });
});
