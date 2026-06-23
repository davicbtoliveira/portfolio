import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import satori from "satori";

const WIDTH = 1200;
const HEIGHT = 630;
const require = createRequire(import.meta.url);

type OgKind = "Blog" | "Project" | "Page";

export type OgImageInput = {
  title: string;
  description: string;
  kind: OgKind;
};

export type OgImageModel = OgImageInput & {
  width: number;
  height: number;
};

let fontData: ArrayBuffer | undefined;

export function buildOgImageModel(input: OgImageInput): OgImageModel {
  return {
    ...input,
    width: WIDTH,
    height: HEIGHT,
  };
}

async function loadFont(): Promise<ArrayBuffer> {
  if (!fontData) {
    const fontPath = require.resolve("@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff");
    const buffer = await readFile(fontPath);
    fontData = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
  }
  return fontData;
}

export async function renderOgPng(input: OgImageInput): Promise<Buffer> {
  const model = buildOgImageModel(input);
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: "#0c0c0c",
          color: "#e2ddd0",
          display: "flex",
          flexDirection: "column",
          fontFamily: "DM Mono",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                color: "#f0b34b",
                fontSize: 32,
                letterSpacing: 0,
              },
              children: model.kind,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 24,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 76,
                      fontWeight: 700,
                      lineHeight: 1,
                    },
                    children: model.title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      color: "#7d7870",
                      fontSize: 34,
                      lineHeight: 1.3,
                    },
                    children: model.description,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                color: "#a1a1aa",
                fontSize: 28,
              },
              children: "dcbto.dev",
            },
          },
        ],
      },
    },
    {
      width: model.width,
      height: model.height,
      fonts: [
        {
          name: "DM Mono",
          data: await loadFont(),
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: model.width },
  });
  const png = resvg.render().asPng();
  return sharp(png).png().toBuffer();
}
