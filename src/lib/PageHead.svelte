<script lang="ts">
  type Props = {
    title: string;
    description: string;
    canonicalPath: string;
    imagePath?: string;
    ogType?: "website" | "article";
    faviconPath?: string;
  };

  let {
    title,
    description,
    canonicalPath,
    imagePath = "/og/default.png",
    ogType = "website",
    faviconPath = "/favicon.ico",
  }: Props = $props();

  const siteUrl = "https://dcbto.dev";
  let canonical = $derived(new URL(canonicalPath, siteUrl).toString());
  let image = $derived(new URL(imagePath, siteUrl).toString());
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="cf-web-analytics" content="configure-token-in-production" />
  <link rel="icon" href={faviconPath} />
</svelte:head>
