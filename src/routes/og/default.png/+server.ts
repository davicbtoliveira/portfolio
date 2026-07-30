import type { RequestHandler } from "./$types";
import { renderOgPng } from "../../../lib/og-image";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const png = await renderOgPng({
    title: "Davi Oliveira",
    description: "Crio software minimalista, com atenção aos detalhes.",
    kind: "Page",
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
