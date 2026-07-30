import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getProjectEntriesFromContent, getProjectEntry, stripRenderable } from "../../../lib/content";
import { findRelatedPosts } from "../../../lib/content-relationships";
import { enrichProjects } from "../../../lib/github-enrichment";
import { getPostEntries } from "../../../lib/posts";

export const prerender = true;

export function entries() {
  return getProjectEntriesFromContent().map((entry) => ({ slug: entry.id }));
}

export const load: PageServerLoad = async ({ params }) => {
  const contentEntry = getProjectEntry(params.slug);
  if (!contentEntry) error(404, "Project not found");

  const [enriched] = await enrichProjects(
    stripRenderable([contentEntry]),
    { token: process.env.GITHUB_TOKEN },
  );
  const relatedPosts = findRelatedPosts(enriched, await getPostEntries());
  return { project: enriched, relatedPosts };
};
