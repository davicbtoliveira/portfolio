import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { listPosts } from "../lib/blog-listing";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const entries = listPosts(
    posts.map((post) => ({
      id: post.id.replace(/\.mdx?$/, ""),
      data: post.data,
    })),
  );

  return rss({
    title: "Davi Oliveira — Blog",
    description: "Technical posts by Davi Oliveira.",
    site: context.site ?? "https://dcbto.dev",
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/blog/${entry.id}`,
    })),
  });
}
