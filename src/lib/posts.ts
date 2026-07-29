import type { PostEntry } from "../content/schemas";
import { listPosts, listTags } from "./blog-listing";
import { getCollectionEntries } from "./collection";

export { listPosts, listTags };
export type { PostEntry };

export async function getPostEntries(
  filters: Parameters<typeof listPosts>[1] = {},
): Promise<PostEntry[]> {
  const entries = await getCollectionEntries<PostEntry["data"]>("blog");
  return listPosts(entries, filters);
}

export async function getPostTags(): Promise<string[]> {
  const entries = await getCollectionEntries<PostEntry["data"]>("blog");
  return listTags(entries);
}
