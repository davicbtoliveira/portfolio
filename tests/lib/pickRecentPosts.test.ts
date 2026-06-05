import { describe, it, expect } from "vitest";
import {
  pickRecentPosts,
  PICK_RECENT_POSTS_DEFAULT_LIMIT,
} from "../../src/lib/home";
import type { Post, PostEntry } from "../../src/content/schemas";

const makePost = (overrides: Partial<Post> = {}): Post => ({
  title: "Untitled post",
  description: "A description that is at least forty characters long for the test.",
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

describe("pickRecentPosts", () => {
  it("filters out draft entries even when they are the newest", () => {
    const entries = [
      makeEntry("draft-newest", { pubDate: new Date("2026-06-01"), draft: true }),
      makeEntry("published", { pubDate: new Date("2026-05-01"), draft: false }),
    ];
    const picked = pickRecentPosts(entries);
    expect(picked.map((p) => p.id)).toEqual(["published"]);
  });

  it("sorts by pubDate desc", () => {
    const entries = [
      makeEntry("oldest", { pubDate: new Date("2025-01-01") }),
      makeEntry("newest", { pubDate: new Date("2026-06-01") }),
      makeEntry("middle", { pubDate: new Date("2025-12-01") }),
    ];
    const picked = pickRecentPosts(entries);
    expect(picked.map((p) => p.id)).toEqual(["newest", "middle", "oldest"]);
  });

  it("caps the result at the provided limit", () => {
    const entries = [
      makeEntry("a", { pubDate: new Date("2026-01-03") }),
      makeEntry("b", { pubDate: new Date("2026-01-02") }),
      makeEntry("c", { pubDate: new Date("2026-01-01") }),
    ];
    const picked = pickRecentPosts(entries, { limit: 2 });
    expect(picked).toHaveLength(2);
    expect(picked.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("uses the default limit when no option is provided", () => {
    expect(PICK_RECENT_POSTS_DEFAULT_LIMIT).toBe(5);
  });

  it("returns an empty array when all entries are drafts", () => {
    const entries = [
      makeEntry("a", { draft: true }),
      makeEntry("b", { draft: true }),
    ];
    const picked = pickRecentPosts(entries);
    expect(picked).toEqual([]);
  });

  it("returns an empty array when the input is empty", () => {
    const picked = pickRecentPosts([]);
    expect(picked).toEqual([]);
  });
});
