import { describe, it, expect } from "vitest";
import type { Project, ProjectEntry } from "../../src/content/schemas";
import { listProjects } from "../../src/lib/project-listing";

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

describe("listProjects", () => {
  it("sorts by year desc, then title asc", () => {
    const listed = listProjects([
      makeEntry("older", { title: "Older", year: 2023 }),
      makeEntry("bravo", { title: "Bravo", year: 2026 }),
      makeEntry("alpha", { title: "Alpha", year: 2026 }),
    ]);

    expect(listed.map((entry) => entry.id)).toEqual(["alpha", "bravo", "older"]);
  });

  it("filters by status and tech", () => {
    const listed = listProjects(
      [
        makeEntry("astro", { status: "active", tech: ["astro", "typescript"] }),
        makeEntry("go", { status: "archived", tech: ["go"] }),
      ],
      { status: "active", tech: "astro" },
    );

    expect(listed.map((entry) => entry.id)).toEqual(["astro"]);
  });
});
