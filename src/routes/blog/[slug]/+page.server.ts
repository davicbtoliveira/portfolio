import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getBlogEntries, getBlogEntry } from "../../../lib/content";
import { getProjectEntriesFromContent, stripRenderable } from "../../../lib/content";
import { findProjectForPost } from "../../../lib/content-relationships";

export const prerender = true;

export function entries() {
  return getBlogEntries()
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({ slug: entry.id }));
}

export const load: PageServerLoad = async ({ params }) => {
  const post = getBlogEntry(params.slug);
  if (!post || post.data.draft) error(404, "Post not found");

  const project = findProjectForPost(
    { id: post.id, data: post.data },
    stripRenderable(getProjectEntriesFromContent()),
  );

  return { post: { id: post.id, data: post.data }, project };
};
