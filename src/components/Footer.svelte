<script lang="ts">
  const year = new Date().getFullYear();
  const socialLinks = [
    { href: "https://github.com/davicbtoliveira", label: "github" },
    { href: "https://linkedin.com/in/dcbto", label: "linkedin" },
    { href: "mailto:davicbtoliveira@gmail.com", label: "email" },
  ];
</script>

<footer>
  <hr class="section-divider" />
  <div class="footer-inner">
    <nav aria-label="Social links">
      {#each socialLinks as link (link.href)}
        <a href={link.href}>{link.label}</a>
      {/each}
    </nav>
    <p>© {year} davi oliveira</p>
  </div>
</footer>

<style>
  footer { max-width: 52rem; margin: 0 auto; padding: 0 1.5rem 2.5rem; width: 100%; box-sizing: border-box; }
  .footer-inner { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--color-muted); gap: 1rem; }
  nav { display: flex; gap: 1rem; }
  p { margin: 0; }
  @media (max-width: 36rem) {
    .footer-inner { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  }
</style>
