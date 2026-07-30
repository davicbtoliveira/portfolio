<script lang="ts">
  import { resolve } from "$app/paths";
  import BlogCard from "../../components/BlogCard.svelte";
  import PageHead from "../../lib/PageHead.svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let activeTag = $derived.by(() => {
    if (!browser) return undefined;
    return new URLSearchParams(page.url.search).get("tag") ?? undefined;
  });
  let posts = $derived(
    activeTag
      ? data.posts.filter((entry) => entry.data.tags.includes(activeTag))
      : data.posts,
  );
</script>

<PageHead
  title="Blog — Davi Oliveira"
  description="Technical posts by Davi Oliveira."
  canonicalPath="/blog/"
 />

<div class="page">
  <h1 class="section-heading">Blog</h1>
  <p class="page-desc">Notes about software, projects, and decisions.</p>

  <nav aria-label="Post filters" class="filters" data-filter-nav>
    <a href={resolve("/blog/")} class={{ active: !activeTag }}>all</a>
    {#each data.tags as tag (tag)}
      <a href={resolve(`/blog?tag=${encodeURIComponent(tag)}`)} class={{ active: activeTag === tag }}>{tag}</a>
    {/each}
  </nav>

  <div data-filter-target>
    {#each posts as entry (entry.id)}
      <BlogCard post={entry.data} href={`/blog/${entry.id}`} />
    {/each}
  </div>
  {#if posts.length === 0}<p class="empty">no posts match this filter</p>{/if}
</div>

<style>
  .page-desc { color: var(--color-muted); font-size: 0.9375rem; margin: -0.75rem 0 1.5rem; }
  .filters { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem; }
  .filters a { color: var(--color-muted); font-size: 0.75rem; padding: 0.2rem 0.5rem; border: 1px solid var(--color-border); text-decoration: none; transition: color 150ms ease-out, border-color 150ms ease-out; }
  .filters a:hover, .filters a.active { color: var(--color-accent); border-color: var(--color-accent); }
  .empty { color: var(--color-muted); font-size: 0.875rem; border: 1px solid var(--color-border); padding: 1rem; }
</style>
