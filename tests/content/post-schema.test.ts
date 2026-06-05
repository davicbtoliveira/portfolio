import { describe, it, expect } from "vitest";
import { postSchema } from "../../src/content/schemas";

const validPost = {
  title: "An example blog post",
  description: "A short description that fits within the forty to one hundred sixty character range.",
  pubDate: new Date("2026-06-01"),
  tags: ["typescript", "astro"],
  draft: false,
  featured: false,
};

describe("postSchema", () => {
  it("accepts a valid post entry", () => {
    const result = postSchema.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it("rejects a description shorter than 40 characters", () => {
    const result = postSchema.safeParse({
      ...validPost,
      description: "Too short.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description longer than 160 characters", () => {
    const result = postSchema.safeParse({
      ...validPost,
      description: "a".repeat(161),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-Date pubDate", () => {
    const result = postSchema.safeParse({
      ...validPost,
      pubDate: "2026-06-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an optional updatedDate", () => {
    const result = postSchema.safeParse({
      ...validPost,
      updatedDate: new Date("2026-06-02"),
    });
    expect(result.success).toBe(true);
  });

  it("accepts an optional cover path", () => {
    const result = postSchema.safeParse({
      ...validPost,
      cover: "/covers/example.png",
    });
    expect(result.success).toBe(true);
  });

  it("defaults draft to false when omitted", () => {
    const { draft: _ignored, ...withoutDraft } = validPost;
    void _ignored;
    const result = postSchema.safeParse(withoutDraft);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.draft).toBe(false);
    }
  });

  it("defaults featured to false when omitted", () => {
    const { featured: _ignored, ...withoutFeatured } = validPost;
    void _ignored;
    const result = postSchema.safeParse(withoutFeatured);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
    }
  });

  it("defaults tags to an empty array when omitted", () => {
    const { tags: _ignored, ...withoutTags } = validPost;
    void _ignored;
    const result = postSchema.safeParse(withoutTags);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });
});
