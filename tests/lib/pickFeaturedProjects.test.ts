import { describe, it, expect } from "vitest";
import {
  pickFeaturedProjects,
  PICK_FEATURED_PROJECTS_DEFAULT_LIMIT,
} from "../../src/lib/home";
import type { Project } from "../../src/content/schemas";

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  title: "Untitled",
  summary: "A short summary.",
  year: 2024,
  status: "active",
  role: "creator",
  tech: [],
  links: {},
  featured: false,
  relatedPosts: [],
  ...overrides,
});

describe("pickFeaturedProjects", () => {
  it("filters out non-featured entries", () => {
    const entries = [
      makeProject({ title: "A", featured: false }),
      makeProject({ title: "B", featured: true }),
      makeProject({ title: "C", featured: false }),
    ];
    const picked = pickFeaturedProjects(entries);
    expect(picked.map((p) => p.title)).toEqual(["B"]);
  });

  it("sorts by year desc, then title asc", () => {
    const entries = [
      makeProject({ title: "Bravo", year: 2023, featured: true }),
      makeProject({ title: "Alpha", year: 2024, featured: true }),
      makeProject({ title: "Charlie", year: 2024, featured: true }),
      makeProject({ title: "Delta", year: 2022, featured: true }),
    ];
    const picked = pickFeaturedProjects(entries);
    expect(picked.map((p) => p.title)).toEqual([
      "Alpha",
      "Charlie",
      "Bravo",
      "Delta",
    ]);
  });

  it("caps the result at the provided limit", () => {
    const entries = [
      makeProject({ title: "A", year: 2024, featured: true }),
      makeProject({ title: "B", year: 2023, featured: true }),
      makeProject({ title: "C", year: 2022, featured: true }),
    ];
    const picked = pickFeaturedProjects(entries, { limit: 2 });
    expect(picked).toHaveLength(2);
    expect(picked.map((p) => p.title)).toEqual(["A", "B"]);
  });

  it("uses the default limit when no option is provided", () => {
    expect(PICK_FEATURED_PROJECTS_DEFAULT_LIMIT).toBe(6);
  });

  it("returns an empty array when no entries are featured", () => {
    const entries = [
      makeProject({ title: "A", featured: false }),
      makeProject({ title: "B", featured: false }),
    ];
    const picked = pickFeaturedProjects(entries);
    expect(picked).toEqual([]);
  });

  it("returns an empty array when the input is empty", () => {
    const picked = pickFeaturedProjects([]);
    expect(picked).toEqual([]);
  });
});
