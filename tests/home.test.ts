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

  it('sets data-theme="dark" on the <html> element', () => {
    const html = root.querySelector("html");
    expect(html).not.toBeNull();
    expect(html?.getAttribute("data-theme")).toBe("dark");
  });

  it("renders shared SEO metadata for link previews", () => {
    expect(
      root.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://dcbto.dev/");
    expect(
      root.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ).toBe("Davi Oliveira — building minimal software");
    expect(
      root.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
    ).toBe("summary_large_image");
  });

  it("ships only the shared client module script", () => {
    const moduleScripts = root.querySelectorAll('script[type="module"]');
    expect(moduleScripts.length).toBe(1);
  });

  it("includes a persisted theme toggle and pre-paint theme bootstrap", () => {
    const toggle = root.querySelector("button[data-theme-toggle]");
    expect(toggle).not.toBeNull();
    expect(toggle?.getAttribute("aria-label")).toBe("Toggle color theme");

    const bootstrap = root.querySelector("script[data-theme-bootstrap]");
    expect(bootstrap).not.toBeNull();
    expect(bootstrap?.text).toContain('localStorage.getItem("theme")');
    expect(bootstrap?.text).toContain("document.documentElement.dataset.theme");
  });

  it("documents the analytics insertion point without requiring credentials", () => {
    const analytics = root.querySelector('meta[name="cf-web-analytics"]');
    expect(analytics?.getAttribute("content")).toBe(
      "configure-token-in-production",
    );
  });

  it("renders a featured real project inside a card linking to its detail route", () => {
    const projectLinks = root.querySelectorAll(
      'a[href="/projects/imageforge"]',
    );
    expect(projectLinks.length).toBeGreaterThanOrEqual(1);
    const linkText = Array.from(projectLinks).map((a) => a.text);
    expect(linkText.some((t) => t?.includes("ImageForge"))).toBe(true);
  });

  it("renders the seed post inside a card linking to its detail route", () => {
    const postLinks = root.querySelectorAll('a[href="/blog/example"]');
    expect(postLinks.length).toBeGreaterThanOrEqual(1);
    const linkText = Array.from(postLinks).map((a) => a.text);
    expect(linkText.some((t) => t?.includes("An example blog post"))).toBe(
      true,
    );
  });
});
