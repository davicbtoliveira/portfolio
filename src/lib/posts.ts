import type { PostEntry } from "../content/schemas";
import {
  pickRecentPosts,
  PICK_RECENT_POSTS_DEFAULT_LIMIT,
} from "./home";
import { listPosts, listTags } from "./blog-listing";
import { getCollectionEntries } from "./collection";

export { pickRecentPosts, PICK_RECENT_POSTS_DEFAULT_LIMIT };
export { listPosts, listTags };
export type { PostEntry };

export async function getRecentPostEntries(): Promise<PostEntry[]> {
  const entries = await getCollectionEntries<PostEntry["data"]>("blog");
  return pickRecentPosts(entries);
}

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
