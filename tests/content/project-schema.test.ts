import { describe, it, expect } from "vitest";
import { projectSchema } from "../../src/content/schemas";

const validProject = {
  title: "Example",
  summary: "A short summary.",
  year: 2024,
  status: "active",
  role: "creator",
  tech: ["typescript"],
  links: { repo: "https://github.com/davicbtoliveira/example" },
  featured: true,
  relatedPosts: [],
};

describe("projectSchema", () => {
  it("accepts a valid project entry", () => {
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("rejects a summary longer than 160 characters", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      summary: "a".repeat(161),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a year before 2000", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      year: 1999,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer year", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      year: 2024.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      status: "deprecated",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown role", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      role: "spectator",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-URL link in links.repo", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      links: { repo: "not-a-url" },
    });
    expect(result.success).toBe(false);
  });

  it("defaults featured to false when omitted", () => {
    const { featured: _ignored, ...withoutFeatured } = validProject;
    void _ignored;
    const result = projectSchema.safeParse(withoutFeatured);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
    }
  });
});
