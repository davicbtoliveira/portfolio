<script lang="ts">
  import { onMount } from "svelte";

  type Theme = "dark" | "light";
  const STORAGE_KEY = "theme";
  let theme = $state<Theme>("light");

  onMount(() => {
    theme = window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  });

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }
</script>

<button
  aria-label="Toggle color theme"
  class="theme-toggle"
  data-theme-toggle
  onclick={toggleTheme}
  type="button"
>
  <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
</button>
