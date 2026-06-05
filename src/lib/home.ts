import type { Project } from "../content/schemas";

export const PICK_FEATURED_PROJECTS_DEFAULT_LIMIT = 6;

export function pickFeaturedProjects(
  entries: Project[],
  options: { limit?: number } = {},
): Project[] {
  const limit = options.limit ?? PICK_FEATURED_PROJECTS_DEFAULT_LIMIT;
  return entries
    .filter((entry) => entry.featured === true)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}
