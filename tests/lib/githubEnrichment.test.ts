import { describe, it, expect, vi } from "vitest";
import type { Project, ProjectEntry } from "../../src/content/schemas";
import { enrichProjects, parseGitHubRepo } from "../../src/lib/github-enrichment";

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

const makeEntry = (id: string, overrides: Partial<Project> = {}): ProjectEntry => ({
  id,
  data: makeProject(overrides),
});

describe("GitHub enrichment", () => {
  it("parses GitHub repository links", () => {
    expect(parseGitHubRepo("https://github.com/davicbtoliveira/portfolio")).toEqual({
      owner: "davicbtoliveira",
      repo: "portfolio",
    });
    expect(parseGitHubRepo("https://example.com/repo")).toBeUndefined();
  });

  it("adds stats when token and API response are available", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stargazers_count: 10,
        forks_count: 2,
        pushed_at: "2026-06-01T00:00:00Z",
      }),
    });

    const [entry] = await enrichProjects(
      [makeEntry("p", { links: { repo: "https://github.com/o/r" } })],
      { token: "token", fetch: fetcher },
    );

    expect(fetcher).toHaveBeenCalledWith(
      "https://api.github.com/repos/o/r",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      }),
    );
    expect(entry.stats).toEqual({
      stars: 10,
      forks: 2,
      lastCommit: "2026-06-01T00:00:00Z",
    });
  });

  it("degrades gracefully without token or on API failure", async () => {
    const fetcher = vi.fn();
    const [withoutToken] = await enrichProjects(
      [makeEntry("p", { links: { repo: "https://github.com/o/r" } })],
      { fetch: fetcher },
    );
    expect(withoutToken.stats).toBeUndefined();
    expect(fetcher).not.toHaveBeenCalled();

    const [failed] = await enrichProjects(
      [makeEntry("p", { links: { repo: "https://github.com/o/r" } })],
      { token: "token", fetch: vi.fn().mockResolvedValue({ ok: false }) },
    );
    expect(failed.stats).toBeUndefined();
  });
});
