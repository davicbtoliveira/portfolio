import type { PostEntry, ProjectEntry } from "../content/schemas";

export function findRelatedPosts(
  project: ProjectEntry,
  posts: PostEntry[],
): PostEntry[] {
  const byId = new Map(posts.map((post) => [post.id, post]));
  return project.data.relatedPosts.flatMap((id) => {
    const post = byId.get(id);
    return post ? [post] : [];
  });
}

export function findProjectForPost(
  post: PostEntry,
  projects: ProjectEntry[],
): ProjectEntry | undefined {
  return projects.find((project) => project.data.relatedPosts.includes(post.id));
}
