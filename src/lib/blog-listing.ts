import type { PostEntry } from "../content/schemas";

type PostFilters = {
  tag?: string;
};

export function listPosts(
  entries: PostEntry[],
  filters: PostFilters = {},
): PostEntry[] {
  return entries
    .filter((entry) => entry.data.draft !== true)
    .filter((entry) => !filters.tag || entry.data.tags.includes(filters.tag))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function listTags(entries: PostEntry[]): string[] {
  const posts = listPosts(entries);
  return Array.from(new Set(posts.flatMap((entry) => entry.data.tags))).sort();
}
