<script lang="ts">
  import { resolve } from "$app/paths";
  import PageHead from "../../../lib/PageHead.svelte";
  import { getProjectComponent } from "../../../lib/content";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let ProjectContent = $derived(getProjectComponent(data.project.id));
</script>

<PageHead
  title={`${data.project.data.title} — Davi Oliveira`}
  description={data.project.data.summary}
  canonicalPath={`/projects/${data.project.id}/`}
  imagePath={`/og/project-${data.project.id}.png`}
 />

<article class="page project-page">
  <p class="eyebrow">{data.project.data.year} · {data.project.data.status} · {data.project.data.role}</p>
  <h1>{data.project.data.title}</h1>
  <p class="summary">{data.project.data.summary}</p>
  <p class="meta">{data.project.data.tech.join(", ")}{#if data.project.stats} · {data.project.stats.stars}★ · {data.project.stats.forks} forks{/if}</p>
  <p class="links">
    {#if data.project.data.links.repo}<a href={data.project.data.links.repo}>repo</a>{/if}
    {#if data.project.data.links.demo}<a href={data.project.data.links.demo}>demo</a>{/if}
    {#if data.project.data.links.post}<a href={data.project.data.links.post}>post</a>{/if}
  </p>

  <div class="prose">{#if ProjectContent}<ProjectContent />{/if}</div>

  {#if data.relatedPosts.length > 0}
    <section class="related">
      <h2>Articles about this project</h2>
      <ul>{#each data.relatedPosts as post (post.id)}<li><a href={resolve(`/blog/${post.id}`)}>{post.data.title}</a></li>{/each}</ul>
    </section>
  {/if}
</article>

<style>
  .project-page { max-width: 44rem; }
  .eyebrow { color: var(--color-muted); font-size: 0.75rem; margin: 0 0 1rem; }
  h1 { margin: 0; font-family: var(--font-serif); font-size: clamp(2rem, 6vw, 3.25rem); line-height: 1.1; font-weight: 500; }
  .summary { color: var(--color-muted); font-size: 1rem; line-height: 1.6; margin: 1rem 0; }
  .meta, .links { color: var(--color-muted); font-size: 0.75rem; margin: 0.4rem 0; }
  .links a { margin-right: 0.75rem; }
  .prose { color: var(--color-fg); line-height: 1.8; margin-top: 2.5rem; }
  .prose :global(h2), .prose :global(h3) { margin-top: 2rem; font-family: var(--font-serif); }
  .prose :global(p) { margin: 1rem 0; }
  .related { border-top: 1px solid var(--color-border); margin-top: 3rem; padding-top: 1.5rem; }
  .related h2 { font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-muted); font-weight: 400; }
  .related ul { padding-left: 1.25rem; }
</style>
