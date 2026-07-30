<script lang="ts">
  import "../styles/global.css";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";
  import type { Snippet } from "svelte";

  type Props = { data: { showChrome: boolean }; children: Snippet };
  let { data, children }: Props = $props();
</script>

{#if data.showChrome}<Header />{/if}
<main style="flex: 1">{@render children()}</main>
{#if data.showChrome}<Footer />{/if}
