import { getCollection } from "astro:content";
import type { PostEntry } from "../content/schemas";
import {
  pickRecentPosts,
  PICK_RECENT_POSTS_DEFAULT_LIMIT,
} from "./home";
import { listPosts, listTags } from "./blog-listing";

export { pickRecentPosts, PICK_RECENT_POSTS_DEFAULT_LIMIT };
export { listPosts, listTags };
export type { PostEntry };

const stripMdxExtension = (id: string): string => id.replace(/\.mdx?$/, "");

export async function getRecentPostEntries(): Promise<PostEntry[]> {
  const entries = await getCollection("blog");
  return pickRecentPosts(
    entries.map((entry) => ({
      id: stripMdxExtension(entry.id),
      data: entry.data,
    })),
  );
}

export async function getPostEntries(filters: Parameters<typeof listPosts>[1] = {}): Promise<PostEntry[]> {
  const entries = await getCollection("blog");
  return listPosts(
    entries.map((entry) => ({
      id: stripMdxExtension(entry.id),
      data: entry.data,
    })),
    filters,
  );
}

export async function getPostTags(): Promise<string[]> {
  const entries = await getCollection("blog");
  return listTags(
    entries.map((entry) => ({
      id: stripMdxExtension(entry.id),
      data: entry.data,
    })),
  );
}
