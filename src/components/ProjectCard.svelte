<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Project } from "../content/schemas";
  import type { GitHubStats } from "../lib/github-enrichment";

  type Props = { project: Project; href: `/projects/${string}`; stats?: GitHubStats };
  let { project, href, stats = undefined }: Props = $props();
</script>

<article class="project-entry" data-status={project.status} data-tech={project.tech.join(",")}>
  <h3><a href={resolve(href)}>{project.title}</a></h3>
  <p class="summary">{project.summary}</p>
  <p class="meta">
    <span>{project.tech.join(", ")}</span>
    <span aria-hidden="true"> · </span>
    <span>{project.year}</span>
    <span aria-hidden="true"> · </span>
    <span>{project.status}</span>
    <span aria-hidden="true"> · </span>
    <span>{project.role}</span>
    {#if stats}
      <span aria-hidden="true"> · </span>
      <span class="stats">{stats.stars}★</span>
    {/if}
  </p>
  {#if project.links.repo || project.links.demo || project.links.post}
    <p class="links">
      {#if project.links.repo}<a href={project.links.repo}>repo</a>{/if}
      {#if project.links.demo}<a href={project.links.demo}>demo</a>{/if}
      {#if project.links.post}<a href={project.links.post}>post</a>{/if}
    </p>
  {/if}
</article>
