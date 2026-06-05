import { getCollection } from "astro:content";
import type { ProjectEntry } from "../content/schemas";
import {
  pickFeaturedProjects,
  PICK_FEATURED_PROJECTS_DEFAULT_LIMIT,
} from "./home";

export { pickFeaturedProjects, PICK_FEATURED_PROJECTS_DEFAULT_LIMIT };
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
