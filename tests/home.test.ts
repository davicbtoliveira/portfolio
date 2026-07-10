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

  it("contains the messenger contact heading", () => {
    const h1 = root.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.text).toContain("Davi Oliveira");
  });

  it('sets data-theme="light" on the <html> element', () => {
    const html = root.querySelector("html");
    expect(html).not.toBeNull();
    expect(html?.getAttribute("data-theme")).toBe("light");
  });

  it("renders shared SEO metadata for link previews", () => {
    expect(
      root.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://dcbto.dev/");
    expect(
      root.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ).toBe("Davi Oliveira — software minimalista");
    expect(
      root.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
    ).toBe("summary_large_image");
  });

  it("ships only the shared client module script", () => {
    const moduleScripts = root.querySelectorAll('script[type="module"]');
    expect(moduleScripts.length).toBe(1);
  });

  it("includes the shared pre-paint theme bootstrap", () => {
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

  it("renders two opening messages in the messenger conversation", () => {
    const messages = root.querySelectorAll("[data-messages] .message--received");
    expect(messages.length).toBe(2);
    expect(messages[0]?.text).toContain("Olá.");
    expect(messages[1]?.text).toContain("Crio software minimalista");
  });

  it("offers GitHub and LinkedIn as messenger choices", () => {
    const choices = root.querySelectorAll("button[data-social-choice]");
    expect(choices.length).toBe(2);
    expect(choices[0]?.getAttribute("data-url")).toBe(
      "https://github.com/davicbtoliveira",
    );
    expect(choices[1]?.getAttribute("data-url")).toBe(
      "https://linkedin.com/in/dcbto",
    );
  });

  it("adds sent and Discord-style preview messages after a choice", () => {
    const scripts = Array.from(root.querySelectorAll("script:not([type])"))
      .map((script) => script.text)
      .join("\n");
    expect(scripts).toContain("message--sent");
    expect(scripts).toContain("link-preview");
    expect(scripts).toContain("target=\"_blank\"");
  });
});
