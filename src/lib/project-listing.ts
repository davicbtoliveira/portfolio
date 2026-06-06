import type { ProjectEntry } from "../content/schemas";

type ProjectFilters = {
  status?: ProjectEntry["data"]["status"];
  tech?: string;
};

export function listProjects(
  entries: ProjectEntry[],
  filters: ProjectFilters = {},
): ProjectEntry[] {
  return entries
    .filter((entry) => !filters.status || entry.data.status === filters.status)
    .filter((entry) => !filters.tech || entry.data.tech.includes(filters.tech))
    .sort((a, b) => {
      const yearDiff = b.data.year - a.data.year;
      if (yearDiff !== 0) return yearDiff;
      return a.data.title.localeCompare(b.data.title);
    });
}
