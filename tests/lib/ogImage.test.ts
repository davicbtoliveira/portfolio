import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildOgImageModel, renderOgPng } from "../../src/lib/og-image";

describe("OG image generation", () => {
  it("builds render input from page metadata", () => {
    expect(
      buildOgImageModel({
        title: "Example project",
        description: "A compact project summary.",
        kind: "Project",
      }),
    ).toEqual({
      title: "Example project",
      description: "A compact project summary.",
      kind: "Project",
      width: 1200,
      height: 630,
    });
  });

  it("renders PNG bytes for representative metadata", async () => {
    const png = await renderOgPng({
      title: "An example blog post",
      description: "A seed blog post used by tests.",
      kind: "Blog",
    });

    expect(png.subarray(0, 8)).toEqual(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  });

  it("does not depend on system font paths", () => {
    const source = readFileSync("src/lib/og-image.ts", "utf-8");
    expect(source).not.toContain("/usr/share/fonts");
  });
});
