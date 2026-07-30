import type { PageServerLoad } from "./$types";
import { getPostEntries, getPostTags } from "../../lib/posts";

export const prerender = true;

export const load: PageServerLoad = async () => {
  const [posts, tags] = await Promise.all([getPostEntries(), getPostTags()]);
  return { posts, tags };
};
