import type { RequestHandler } from "./$types";
import { getBlogEntries, getProjectEntriesFromContent } from "../../../lib/content";
import { renderOgPng, type OgImageInput } from "../../../lib/og-image";

export const prerender = true;

export function entries() {
  return [
    ...getBlogEntries()
      .filter((entry) => !entry.data.draft)
      .map((entry) => ({ slug: `blog-${entry.id}` })),
    ...getProjectEntriesFromContent().map((entry) => ({ slug: `project-${entry.id}` })),
  ];
}

export const GET: RequestHandler = async ({ params }) => {
  const slug = params.slug ?? "";
  let input: OgImageInput | undefined;
  if (slug.startsWith("blog-")) {
    const entry = getBlogEntries().find((item) => `blog-${item.id}` === slug && !item.data.draft);
    if (entry) input = { title: entry.data.title, description: entry.data.description, kind: "Blog" };
  } else if (slug.startsWith("project-")) {
    const entry = getProjectEntriesFromContent().find((item) => `project-${item.id}` === slug);
    if (entry) input = { title: entry.data.title, description: entry.data.summary, kind: "Project" };
  }
  if (!input) return new Response("Not found", { status: 404 });
  const png = await renderOgPng(input);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  });
};
