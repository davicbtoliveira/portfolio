<script lang="ts">
  import { resolve } from "$app/paths";
  import PageHead from "../../../lib/PageHead.svelte";
  import { getBlogComponent } from "../../../lib/content";
  import { readingTime } from "../../../lib/reading-time";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let PostContent = $derived(getBlogComponent(data.post.id));
</script>

<PageHead
  title={`${data.post.data.title} — Davi Oliveira`}
  description={data.post.data.description}
  canonicalPath={`/blog/${data.post.id}/`}
  imagePath={`/og/blog-${data.post.id}.png`}
  ogType="article"
 />

<article class="page post-page">
  <p class="eyebrow">{new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(data.post.data.pubDate)} · {readingTime(data.post.data.description)}</p>
  <h1>{data.post.data.title}</h1>
  <p class="description">{data.post.data.description}</p>
  <div class="tags">
    {#each data.post.data.tags as tag (tag)}<a href={resolve(`/blog?tag=${encodeURIComponent(tag)}`)}>{tag}</a>{/each}
  </div>
  {#if data.project}
    <p class="project-badge">Part of project <a href={resolve(`/projects/${data.project.id}`)}>{data.project.data.title}</a></p>
  {/if}
  <div class="prose">
    {#if PostContent}<PostContent />{/if}
  </div>
</article>

<style>
  .post-page { max-width: 44rem; }
  .eyebrow { color: var(--color-muted); font-size: 0.75rem; margin: 0 0 1rem; }
  h1 { margin: 0; font-family: var(--font-serif); font-size: clamp(2rem, 6vw, 3.25rem); line-height: 1.1; font-weight: 500; }
  .description { color: var(--color-muted); font-size: 1rem; line-height: 1.6; margin: 1rem 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 2rem; }
  .tags a, .project-badge { color: var(--color-accent); font-size: 0.75rem; }
  .project-badge { margin: 0 0 2rem; }
  .prose { color: var(--color-fg); line-height: 1.8; }
  .prose :global(h2), .prose :global(h3) { margin-top: 2rem; font-family: var(--font-serif); }
  .prose :global(p) { margin: 1rem 0; }
  .prose :global(code) { color: var(--color-accent); }
</style>
