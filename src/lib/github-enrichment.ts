import type { ProjectEntry } from "../content/schemas";

export type GitHubStats = {
  stars: number;
  forks: number;
  lastCommit: string;
};

export type EnrichedProjectEntry = ProjectEntry & {
  stats?: GitHubStats;
};

type GitHubRepo = {
  owner: string;
  repo: string;
};

type FetchLike = (
  input: string,
  init?: { headers?: Record<string, string> },
) => Promise<{
  ok: boolean;
  json?: () => Promise<unknown>;
}>;

type EnrichOptions = {
  token?: string;
  fetch?: FetchLike;
};

export function parseGitHubRepo(url: string | undefined): GitHubRepo | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return undefined;
    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return undefined;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return undefined;
  }
}

export async function enrichProjects(
  entries: ProjectEntry[],
  options: EnrichOptions = {},
): Promise<EnrichedProjectEntry[]> {
  if (!options.token) return entries;

  const fetcher = options.fetch ?? fetch;
  return Promise.all(
    entries.map(async (entry) => {
      const repo = parseGitHubRepo(entry.data.links.repo);
      if (!repo) return entry;

      try {
        const response = await fetcher(
          `https://api.github.com/repos/${repo.owner}/${repo.repo}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${options.token}`,
            },
          },
        );
        if (!response.ok || !response.json) return entry;
        const payload = await response.json();
        if (!isGitHubRepoPayload(payload)) return entry;
        return {
          ...entry,
          stats: {
            stars: payload.stargazers_count,
            forks: payload.forks_count,
            lastCommit: payload.pushed_at,
          },
        };
      } catch {
        return entry;
      }
    }),
  );
}

function isGitHubRepoPayload(payload: unknown): payload is {
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as { stargazers_count?: unknown }).stargazers_count ===
      "number" &&
    typeof (payload as { forks_count?: unknown }).forks_count === "number" &&
    typeof (payload as { pushed_at?: unknown }).pushed_at === "string"
  );
}
