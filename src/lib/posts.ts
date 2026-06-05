import { getCollection } from "astro:content";
import type { PostEntry } from "../content/schemas";
import {
  pickRecentPosts,
  PICK_RECENT_POSTS_DEFAULT_LIMIT,
} from "./home";

export { pickRecentPosts, PICK_RECENT_POSTS_DEFAULT_LIMIT };
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
