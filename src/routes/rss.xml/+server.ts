import type { RequestHandler } from "./$types";
import { getBlogEntries } from "../../lib/content";

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: RequestHandler = () => {
  const items = getBlogEntries()
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .map(
      (entry) => `
      <item>
        <title>${escapeXml(entry.data.title)}</title>
        <description>${escapeXml(entry.data.description)}</description>
        <pubDate>${entry.data.pubDate.toUTCString()}</pubDate>
        <link>https://dcbto.dev/blog/${entry.id}</link>
        <guid>https://dcbto.dev/blog/${entry.id}</guid>
      </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Davi Oliveira — Blog</title>
        <description>Technical posts by Davi Oliveira.</description>
        <link>https://dcbto.dev/blog/</link>${items}
      </channel>
    </rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
