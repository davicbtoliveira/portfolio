<script lang="ts">
  import { resolve } from "$app/paths";
  import PageHead from "../lib/PageHead.svelte";
</script>

<PageHead
  title="Page not found — Davi Oliveira"
  description="The requested page could not be found."
  canonicalPath="/404/"
 />

<div class="page error-page">
  <h1 class="section-heading">page not found</h1>
  <p class="body-text">The page you requested does not exist.</p>
  <a href={resolve("/")}>return home</a>
</div>

<style>
  .error-page { min-height: 60vh; }
  .body-text { color: var(--color-muted); margin: 0 0 1.5rem; }
</style>
