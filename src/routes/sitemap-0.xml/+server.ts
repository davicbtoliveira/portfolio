import type { RequestHandler } from "./$types";
import { getBlogEntries, getProjectEntriesFromContent } from "../../lib/content";

export const prerender = true;

export const GET: RequestHandler = () => {
  const urls = [
    "/",
    "/about/",
    "/projects/",
    ...getProjectEntriesFromContent().map((entry) => `/projects/${entry.id}/`),
    "/blog/",
    ...getBlogEntries()
      .filter((entry) => !entry.data.draft)
      .map((entry) => `/blog/${entry.id}/`),
    "/now/",
    "/uses/",
  ];
  const body = urls.map((url) => `<url><loc>https://dcbto.dev${url}</loc></url>`).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
