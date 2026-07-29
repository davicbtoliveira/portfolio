import type { ProjectEntry } from "../content/schemas";
import { listProjects } from "./project-listing";
import { enrichProjects, type EnrichedProjectEntry } from "./github-enrichment";
import { getCollectionEntries } from "./collection";

export { listProjects };
export type { ProjectEntry };

export async function getProjectEntries(
  filters: Parameters<typeof listProjects>[1] = {},
): Promise<EnrichedProjectEntry[]> {
  const entries = await getCollectionEntries<ProjectEntry["data"]>("projects");
  const listed = listProjects(entries, filters);
  return enrichProjects(listed, { token: process.env.GITHUB_TOKEN });
}
