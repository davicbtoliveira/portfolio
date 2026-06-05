import type { ProjectEntry, PostEntry } from "../content/schemas";

export const PICK_FEATURED_PROJECTS_DEFAULT_LIMIT = 6;
export const PICK_RECENT_POSTS_DEFAULT_LIMIT = 5;

export function pickFeaturedProjects(
  entries: ProjectEntry[],
  options: { limit?: number } = {},
): ProjectEntry[] {
  const limit = options.limit ?? PICK_FEATURED_PROJECTS_DEFAULT_LIMIT;
  return entries
    .filter((entry) => entry.data.featured === true)
    .sort((a, b) => {
      const yearDiff = b.data.year - a.data.year;
      if (yearDiff !== 0) return yearDiff;
      return a.data.title.localeCompare(b.data.title);
    })
    .slice(0, limit);
}

export function pickRecentPosts(
  entries: PostEntry[],
  options: { limit?: number } = {},
): PostEntry[] {
  const limit = options.limit ?? PICK_RECENT_POSTS_DEFAULT_LIMIT;
  return entries
    .filter((entry) => entry.data.draft !== true)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, limit);
}
