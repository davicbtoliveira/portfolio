import { describe, it, expect } from "vitest";
import type { Post, PostEntry, Project, ProjectEntry } from "../../src/content/schemas";
import {
  findProjectForPost,
  findRelatedPosts,
} from "../../src/lib/content-relationships";

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  title: "Project",
  summary: "A project summary.",
  year: 2026,
  status: "active",
  role: "creator",
  tech: [],
  links: {},
  featured: false,
  relatedPosts: [],
  ...overrides,
});

const makePost = (overrides: Partial<Post> = {}): Post => ({
  title: "Post",
  description: "A long enough post description for schema-shaped test data.",
  pubDate: new Date("2026-01-01"),
  tags: [],
  draft: false,
  featured: false,
  ...overrides,
});

const project = (id: string, overrides: Partial<Project> = {}): ProjectEntry => ({
  id,
  data: makeProject(overrides),
});

const post = (id: string, overrides: Partial<Post> = {}): PostEntry => ({
  id,
  data: makePost(overrides),
});

describe("content relationships", () => {
  it("finds posts referenced by a project", () => {
    const posts = [post("a"), post("b"), post("c")];
    const related = findRelatedPosts(project("p", { relatedPosts: ["b", "a"] }), posts);

    expect(related.map((entry) => entry.id)).toEqual(["b", "a"]);
  });

  it("finds owning project for a post", () => {
    const projects = [
      project("alpha", { relatedPosts: [] }),
      project("bravo", { relatedPosts: ["post-one"] }),
    ];

    expect(findProjectForPost(post("post-one"), projects)?.id).toBe("bravo");
    expect(findProjectForPost(post("post-two"), projects)).toBeUndefined();
  });
});
