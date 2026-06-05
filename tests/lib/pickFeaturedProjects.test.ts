import { describe, it, expect } from "vitest";
import {
  pickFeaturedProjects,
  PICK_FEATURED_PROJECTS_DEFAULT_LIMIT,
  type ProjectEntry,
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

const makeEntry = (id: string, overrides: Partial<Project> = {}): ProjectEntry => ({
  id,
  data: makeProject(overrides),
});

describe("pickFeaturedProjects", () => {
  it("filters out non-featured entries", () => {
    const entries = [
      makeEntry("a", { title: "A", featured: false }),
      makeEntry("b", { title: "B", featured: true }),
      makeEntry("c", { title: "C", featured: false }),
    ];
    const picked = pickFeaturedProjects(entries);
    expect(picked.map((p) => p.id)).toEqual(["b"]);
  });

  it("sorts by year desc, then title asc", () => {
    const entries = [
      makeEntry("a", { title: "Bravo", year: 2023, featured: true }),
      makeEntry("b", { title: "Alpha", year: 2024, featured: true }),
      makeEntry("c", { title: "Charlie", year: 2024, featured: true }),
      makeEntry("d", { title: "Delta", year: 2022, featured: true }),
    ];
    const picked = pickFeaturedProjects(entries);
    expect(picked.map((p) => p.id)).toEqual(["b", "c", "a", "d"]);
  });

  it("caps the result at the provided limit", () => {
    const entries = [
      makeEntry("a", { title: "A", year: 2024, featured: true }),
      makeEntry("b", { title: "B", year: 2023, featured: true }),
      makeEntry("c", { title: "C", year: 2022, featured: true }),
    ];
    const picked = pickFeaturedProjects(entries, { limit: 2 });
    expect(picked).toHaveLength(2);
    expect(picked.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("uses the default limit when no option is provided", () => {
    expect(PICK_FEATURED_PROJECTS_DEFAULT_LIMIT).toBe(6);
  });

  it("returns an empty array when no entries are featured", () => {
    const entries = [
      makeEntry("a", { featured: false }),
      makeEntry("b", { featured: false }),
    ];
    const picked = pickFeaturedProjects(entries);
    expect(picked).toEqual([]);
  });

  it("returns an empty array when the input is empty", () => {
    const picked = pickFeaturedProjects([]);
    expect(picked).toEqual([]);
  });
});
