<script lang="ts">
  import PageHead from "../../lib/PageHead.svelte";
</script>

<PageHead
  title="Now — Davi Oliveira"
  description="Current focus and active work for Davi Oliveira."
  canonicalPath="/now/"
 />

<div class="page">
  <h1 class="section-heading">Now</h1>
  <p class="lead">
    Building this portfolio as a compact, content-first SvelteKit site and keeping
    the implementation close to its architecture document.
  </p>
  <hr class="section-divider" />
  <ul class="now-list">
    <li>Shipping static portfolio routes from MDX content.</li>
    <li>Writing technical notes that connect projects to decisions.</li>
    <li>Keeping deploy and analytics boring through Cloudflare Pages.</li>
  </ul>
</div>

<style>
  .lead { font-size: 1.0625rem; color: var(--color-fg); line-height: 1.6; margin: 0; }
  .now-list { color: var(--color-muted); line-height: 1.7; margin: 0; padding-left: 1.25rem; }
  .now-list li + li { margin-top: 0.5rem; }
</style>
