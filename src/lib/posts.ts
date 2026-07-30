import type { PostEntry } from "../content/schemas";
import { listPosts, listTags } from "./blog-listing";
import { getBlogEntries, stripRenderable } from "./content";

export { listPosts, listTags };
export type { PostEntry };

export async function getPostEntries(
  filters: Parameters<typeof listPosts>[1] = {},
): Promise<PostEntry[]> {
  const entries = stripRenderable(getBlogEntries());
  return listPosts(entries, filters);
}

export async function getPostTags(): Promise<string[]> {
  const entries = stripRenderable(getBlogEntries());
  return listTags(entries);
}
