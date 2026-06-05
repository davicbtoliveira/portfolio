import { getCollection } from "astro:content";
import type { ProjectEntry } from "../content/schemas";
import {
  pickFeaturedProjects,
  PICK_FEATURED_PROJECTS_DEFAULT_LIMIT,
} from "./home";
import { listProjects } from "./project-listing";

export { pickFeaturedProjects, PICK_FEATURED_PROJECTS_DEFAULT_LIMIT };
export { listProjects };
export type { ProjectEntry };

const stripMdxExtension = (id: string): string => id.replace(/\.mdx?$/, "");

export async function getFeaturedProjectEntries(): Promise<ProjectEntry[]> {
  const entries = await getCollection("projects");
  return pickFeaturedProjects(
    entries.map((entry) => ({
      id: stripMdxExtension(entry.id),
      data: entry.data,
    })),
  );
}

export async function getProjectEntries(filters: Parameters<typeof listProjects>[1] = {}): Promise<ProjectEntry[]> {
  const entries = await getCollection("projects");
  return listProjects(
    entries.map((entry) => ({
      id: stripMdxExtension(entry.id),
      data: entry.data,
    })),
    filters,
  );
}
