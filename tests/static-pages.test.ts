import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

const pages = {
  about: "dist/about/index.html",
  now: "dist/now/index.html",
  uses: "dist/uses/index.html",
  notFound: "dist/404.html",
};

describe("static pages", () => {
  const roots = new Map<string, HTMLElement>();

  beforeAll(() => {
    execSync("corepack pnpm build", { stdio: "pipe" });
    for (const [name, path] of Object.entries(pages)) {
      roots.set(name, parse(readFileSync(path, "utf-8")));
    }
  }, 120_000);

  it("renders about with contact path", () => {
    const root = roots.get("about");
    expect(root?.querySelector("h1")?.text).toContain("About");
    expect(root?.querySelector('a[href^="mailto:"]')?.text).toContain("Email");
  });

  it("renders now with current focus", () => {
    const root = roots.get("now");
    expect(root?.querySelector("h1")?.text).toContain("Current focus");
    expect(root?.text).toContain("portfolio");
  });

  it("renders uses with tool sections", () => {
    const root = roots.get("uses");
    expect(root?.querySelector("h1")?.text).toContain("Tools I use");
    expect(root?.text).toContain("Hardware");
    expect(root?.text).toContain("Software");
  });

  it("renders styled 404 with a home link", () => {
    const root = roots.get("notFound");
    expect(root?.querySelector("h1")?.text).toContain("Page not found");
    const homeLinks = root?.querySelectorAll('a[href="/"]').map((link) => link.text);
    expect(homeLinks).toContain("Return home");
  });

  it("uses shared metadata on every static page", () => {
    for (const root of roots.values()) {
      expect(root.querySelector('link[rel="canonical"]')).not.toBeNull();
      expect(root.querySelector('meta[property="og:title"]')).not.toBeNull();
      expect(root.querySelector('meta[name="twitter:card"]')).not.toBeNull();
    }
  });
});
