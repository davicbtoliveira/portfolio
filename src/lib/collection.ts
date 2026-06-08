import { getCollection } from "astro:content";

const stripMdxExtension = (id: string): string => id.replace(/\.mdx?$/, "");

export async function getCollectionEntries<T>(
  collection: "blog" | "projects",
): Promise<{ id: string; data: T }[]> {
  const entries = await getCollection(collection);
  return entries.map((entry) => ({
    id: stripMdxExtension(entry.id),
    data: entry.data as T,
  }));
}
