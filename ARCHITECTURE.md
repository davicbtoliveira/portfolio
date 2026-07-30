# Portfolio — Documento de Arquitetura

> **Status**: implementação concluída com SvelteKit e SSG.
> **Escopo**: portfolio pessoal, single-author, EN-only, deploy em Cloudflare Pages.

## Visão geral

O portfolio é um site estático para projetos, posts técnicos e informações
profissionais. O conteúdo é versionado em MDX e validado no build; o SvelteKit
renderiza HTML durante o build e o adaptador estático publica `dist`.

Princípios: conteúdo é o produto, build-time > runtime, zero servidor em
produção, HTML acessível e mudanças reversíveis.

## Stack

| Camada | Decisão |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Build | Vite 8 + `@sveltejs/adapter-static` |
| Conteúdo | MDX processado por mdsvex, validado por Zod |
| Estilos | Tailwind CSS v4 e tokens em `src/styles/global.css` |
| Tipografia | DM Mono e Literata self-hosted |
| OG image | Satori + Resvg + Sharp em endpoints prerenderizados |
| Runtime | Node 20+ e pnpm |
| Hosting | Cloudflare Pages |

## Modelo de conteúdo

As coleções são descobertas em `src/lib/content.ts` com `import.meta.glob`.
Cada frontmatter é normalizado e validado pelos schemas em
`src/content/schemas.ts`. Posts com `draft: true` não entram em índices, RSS,
sitemap ou rotas de detalhe.

Projetos possuem `relatedPosts` como fonte da relação; o reverse lookup é
calculado por `src/lib/content-relationships.ts`. O enriquecimento GitHub é
opcional e não bloqueia a publicação quando a API está indisponível.

## Rotas

- `/`: home MSN-style com links sociais e alternância PT/EN.
- `/about`, `/now`, `/uses`: páginas estáticas.
- `/projects/` e `/projects/[slug]/`: índice filtrável e detalhes MDX.
- `/blog/` e `/blog/[slug]/`: índice por tag e detalhes MDX.
- `/404.html`: resposta estática estilizada para páginas ausentes.
- `/rss.xml`, `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt`: endpoints
  prerenderizados.
- `/og/[slug].png`: PNGs gerados no build para posts e projetos.

## Tema e interação

O HTML inicia em `data-theme="light"`; o bootstrap inline em `src/app.html`
aplica a preferência persistida antes do paint. `ThemeToggle.svelte` atualiza
`localStorage` e o atributo no documento. A home mantém estado local em runes
Svelte 5; o restante do site continua renderizável sem JavaScript obrigatório.

## Estrutura

```
src/
├── app.html
├── components/          # componentes Svelte reutilizáveis
├── content/             # MDX e schemas Zod
├── lib/                 # conteúdo, SEO, regras puras e OG image
├── routes/              # páginas, endpoints e layouts SvelteKit
└── styles/global.css
static/                  # favicon, ícones e imagens públicas
svelte.config.js
vite.config.ts
```

## Operação

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm preview
```

O workflow do GitHub Actions executa check, testes, build e deploy para
Cloudflare Pages. `GITHUB_TOKEN` é opcional e só habilita estatísticas de
repositórios.

## Fora de escopo

Search, comments, newsletter, i18n completo, series, categories, `/cv`, PWA,
service worker e webmentions continuam adiados. Search só deve ser reavaliado
quando o blog ultrapassar 25 posts.
