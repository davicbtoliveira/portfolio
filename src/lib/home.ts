import type { Project } from "../content/schemas";

export const PICK_FEATURED_PROJECTS_DEFAULT_LIMIT = 6;

export type ProjectEntry = {
  id: string;
  data: Project;
};

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
