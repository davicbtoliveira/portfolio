<script lang="ts">
  import { resolve } from "$app/paths";
  import ProjectCard from "../../components/ProjectCard.svelte";
  import PageHead from "../../lib/PageHead.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let activeStatus = $derived.by(() => {
    if (!browser) return undefined;
    return new URLSearchParams(page.url.search).get("status") ?? undefined;
  });
  let activeTech = $derived.by(() => {
    if (!browser) return undefined;
    return new URLSearchParams(page.url.search).get("tech") ?? undefined;
  });
  let projects = $derived(
    data.projects.filter(
      (entry) =>
        (!activeStatus || entry.data.status === activeStatus) &&
        (!activeTech || entry.data.tech.includes(activeTech)),
    ),
  );
</script>

<PageHead
  title="Projects — Davi Oliveira"
  description="A browsable index of projects by Davi Oliveira."
  canonicalPath="/projects/"
 />

<div class="page">
  <h1 class="section-heading">Projects</h1>
  <p class="page-desc">OSS and personal work, listed with status, role, stack, and links.</p>

  <nav aria-label="Project filters" class="filters" data-filter-nav>
    <div class="filter-group">
      <span class="filter-label">status</span>
      <a href={resolve("/projects/")} class={{ active: !activeStatus && !activeTech }}>all</a>
      {#each data.statuses as item (item)}
        <a href={resolve(`/projects?status=${encodeURIComponent(item)}`)} class={{ active: activeStatus === item && !activeTech }}>{item}</a>
      {/each}
    </div>
    <div class="filter-group">
      <span class="filter-label">tech</span>
      {#each data.techs as item (item)}
        <a href={resolve(`/projects?tech=${encodeURIComponent(item)}`)} class={{ active: activeTech === item && !activeStatus }}>{item}</a>
      {/each}
    </div>
  </nav>

  <div data-filter-target>
    {#each projects as entry (entry.id)}
      <ProjectCard project={entry.data} href={`/projects/${entry.id}`} stats={entry.stats} />
    {/each}
  </div>
  {#if projects.length === 0}<p class="empty">no projects match this filter</p>{/if}
</div>

<style>
  .page-desc { color: var(--color-muted); font-size: 0.9375rem; margin: -0.75rem 0 1.5rem; }
  .filters { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
  .filter-group { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
  .filter-label { color: var(--color-muted); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; margin-right: 0.25rem; }
  .filters a { color: var(--color-muted); font-size: 0.75rem; padding: 0.2rem 0.5rem; border: 1px solid var(--color-border); text-decoration: none; transition: color 150ms ease-out, border-color 150ms ease-out; }
  .filters a:hover, .filters a.active { color: var(--color-accent); border-color: var(--color-accent); }
  .empty { color: var(--color-muted); font-size: 0.875rem; border: 1px solid var(--color-border); padding: 1rem; }
</style>
