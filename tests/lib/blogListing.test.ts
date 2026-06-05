import { describe, it, expect } from "vitest";
import type { Post, PostEntry } from "../../src/content/schemas";
import { listPosts, listTags } from "../../src/lib/blog-listing";

const makePost = (overrides: Partial<Post> = {}): Post => ({
  title: "Post",
  description: "A long enough post description for schema-shaped test data.",
  pubDate: new Date("2026-01-01"),
  tags: [],
  draft: false,
  featured: false,
  ...overrides,
});

const makeEntry = (id: string, overrides: Partial<Post> = {}): PostEntry => ({
  id,
  data: makePost(overrides),
});

describe("blog listing", () => {
  it("excludes drafts and sorts by pubDate descending", () => {
    const posts = listPosts([
      makeEntry("old", { pubDate: new Date("2025-01-01") }),
      makeEntry("draft", { draft: true, pubDate: new Date("2027-01-01") }),
      makeEntry("new", { pubDate: new Date("2026-01-01") }),
    ]);

    expect(posts.map((post) => post.id)).toEqual(["new", "old"]);
  });

  it("filters by tag", () => {
    const posts = listPosts(
      [
        makeEntry("astro", { tags: ["astro", "typescript"] }),
        makeEntry("go", { tags: ["go"] }),
      ],
      { tag: "astro" },
    );

    expect(posts.map((post) => post.id)).toEqual(["astro"]);
  });

  it("deduplicates and sorts tags from published posts", () => {
    const tags = listTags([
      makeEntry("a", { tags: ["typescript", "astro"] }),
      makeEntry("b", { draft: true, tags: ["draft-only"] }),
      makeEntry("c", { tags: ["astro", "go"] }),
    ]);

    expect(tags).toEqual(["astro", "go", "typescript"]);
  });
});
