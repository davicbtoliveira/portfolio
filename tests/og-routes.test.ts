import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parse, HTMLElement } from "node-html-parser";

describe("OG image routes", () => {
  let post: HTMLElement;
  let project: HTMLElement;
  let postPng: Buffer;

  beforeAll(() => {
    execSync("pnpm build", { stdio: "pipe" });
    post = parse(readFileSync("dist/blog/example/index.html", "utf-8"));
    project = parse(
      readFileSync("dist/projects/imageforge/index.html", "utf-8"),
    );
    postPng = readFileSync("dist/og/blog-example.png");
  }, 120_000);

  it("links post and project pages to generated OG images", () => {
    expect(
      post.querySelector('meta[property="og:image"]')?.getAttribute("content"),
    ).toBe("https://dcbto.dev/og/blog-example.png");
    expect(
      project
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content"),
    ).toBe("https://dcbto.dev/og/project-imageforge.png");
  });

  it("generates PNG output", () => {
    expect(postPng.subarray(0, 8)).toEqual(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  });
});
