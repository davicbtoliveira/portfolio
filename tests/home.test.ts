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
});
