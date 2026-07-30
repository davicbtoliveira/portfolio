import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("home page", () => {
  let root: HTMLElement;
  let css: string;

  beforeAll(() => {
    execSync("pnpm build", { stdio: "pipe" });
    const html = readFileSync("dist/index.html", "utf-8");
    root = parse(html);
    css = root
      .querySelectorAll('link[rel="stylesheet"]')
      .map((link) => readFileSync(`dist${link.getAttribute("href")}`, "utf-8"))
      .join("\n");
  }, 120_000);

  it("contains the messenger contact heading", () => {
    const h1 = root.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.text).toContain("Davi Oliveira");
  });

  it("sets the home theme, language, and Messenger favicon", () => {
    const html = root.querySelector("html");
    expect(html).not.toBeNull();
    expect(html?.getAttribute("data-theme")).toBe("light");
    expect(html?.getAttribute("lang")).toBe("pt-BR");
    expect(root.querySelector('link[rel="icon"]')?.getAttribute("href")).toBe(
      "/msn-messenger.svg",
    );
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

  it("ships the shared SvelteKit bootstrap", () => {
    const bootstrap = root.querySelector("script:not([data-theme-bootstrap])");
    expect(bootstrap?.text).toContain("kit.start");
    expect(root.querySelector('link[rel="modulepreload"]')).not.toBeNull();
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

  it("renders an MSN-style transcript with two opening messages", () => {
    expect(root.querySelector(".messenger-toolbar")?.text).toContain("Fotos");
    expect(root.querySelector(".messenger-toolbar")?.text).toContain("Arquivos");
    expect(root.querySelector(".messenger-toolbar")?.text).toContain("Vídeo");

    const messages = root.querySelectorAll("[data-messages] .message--received");
    expect(messages.length).toBe(2);
    expect(messages[0]?.text).toContain("Olá.");
    expect(messages[0]?.text).toContain("Davi diz:");
    expect(messages[1]?.text).toContain("Crio software minimalista");
  });

  it("offers GitHub, LinkedIn, and email as messenger choices", () => {
    const choices = root.querySelectorAll("button[data-social-choice]");
    expect(choices.length).toBe(3);
    expect(root.querySelector("[data-messenger-icon]")?.getAttribute("src")).toBe(
      "/msn-messenger.svg",
    );
    expect(root.querySelector(".composer-field")).not.toBeNull();
    expect(root.querySelectorAll("button[data-social-choice] .social-icon").length).toBe(3);
    expect(choices[0]?.getAttribute("data-url")).toBe(
      "https://github.com/davicbtoliveira",
    );
    expect(choices[1]?.getAttribute("data-url")).toBe(
      "https://linkedin.com/in/dcbto",
    );
    expect(choices[2]?.getAttribute("data-label")).toBe("contato");
    expect(choices[2]?.getAttribute("data-url")).toBe(
      "mailto:davicbtoliveira@gmail.com",
    );
  });

  it("exposes interactive Messenger controls", () => {
    expect(root.querySelectorAll("button[data-social-choice]").length).toBe(3);
    expect(root.querySelector("button[data-lang-toggle]")).not.toBeNull();
    expect(root.querySelector("a.message-link[target=\"_blank\"]")).toBeNull();
  });

  it("ships scoped Svelte styles for message content", () => {
    expect(css).toContain(".conversation");
    expect(css).toContain(".message-meta");
    expect(css).not.toMatch(/data-[a-z]+-cid/);
  });
});
