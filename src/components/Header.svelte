<script lang="ts">
  import { resolve } from "$app/paths";
  import ThemeToggle from "./ThemeToggle.svelte";

  const links = [
    { href: "/", label: "home" },
    { href: "/blog/", label: "blog" },
    { href: "/projects/", label: "projects" },
    { href: "/about/", label: "about" },
  ] as const;
</script>

<header>
  <nav>
    <a href={resolve("/")} class="brand">~/portfolio</a>
    <div class="nav-group">
      <ul>
        {#each links as link (link.href)}
          <li><a href={resolve(link.href)}>{link.label}</a></li>
        {/each}
      </ul>
      <ThemeToggle />
    </div>
  </nav>
</header>

<style>
  header { border-bottom: 1px solid var(--color-border); }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    max-width: 52rem;
    margin: 0 auto;
    font-size: 0.8125rem;
  }
  .brand { color: var(--color-muted); font-weight: 400; text-decoration: none; }
  .brand:hover { color: var(--color-accent); }
  ul { display: flex; gap: 1rem; list-style: none; margin: 0; padding: 0; }
  .nav-group { display: flex; align-items: center; gap: 0.5rem; }
  nav a { color: var(--color-muted); text-decoration: none; }
  nav a:hover, nav a:focus-visible { color: var(--color-accent); }
</style>
