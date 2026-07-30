import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () =>
  new Response(
    `<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found — Davi Oliveira</title>
    <meta name="description" content="The requested page could not be found.">
    <link rel="canonical" href="https://dcbto.dev/404/">
    <meta property="og:title" content="Page not found — Davi Oliveira">
    <meta property="og:description" content="The requested page could not be found.">
    <meta name="twitter:card" content="summary_large_image">
    <style>body{margin:0;background:#0c0c0c;color:#e2ddd0;font:15px monospace}.page{max-width:52rem;margin:0 auto;padding:3rem 1.5rem}.heading{color:#7d7870;font-size:.8125rem;font-weight:400;letter-spacing:.1em;text-transform:uppercase}.body{color:#7d7870;margin-bottom:1.5rem}a{color:#7ab0d4}</style>
  </head>
  <body><main class="page"><h1 class="heading">page not found</h1><p class="body">The page you requested does not exist.</p><a href="/">return home</a></main></body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
