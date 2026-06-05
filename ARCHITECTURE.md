# Portfolio — Documento de Arquitetura

> **Status**: spec fechado em sessão de design (19 decisões).
> **Escopo**: portfolio pessoal, single-author, EN-only, SSG, deploy em Cloudflare Pages.

---

## 1. Visão geral

Portfolio minimalista para expor projetos (OSS e pessoais), blog técnico e informações profissionais. Conteúdo em MDX commitado no repo (git como CMS), gerado estaticamente pelo Astro, distribuído via CDN da Cloudflare.

**Princípios guiadores:**

- Minimalismo visual (1 família sans + 1 mono, 1 accent, dark default)
- Conteúdo é o produto (sem features supérfluas, sem comentários, sem newsletter)
- SSG puro (zero runtime server-side em produção)
- Build-time > runtime (enrichment, OG image, sitemap)
- Reversibilidade (decisões adiáveis ficam adiadas)

---

## 2. Stack técnica

| Camada | Decisão | Versão / notas |
|---|---|---|
| Framework SSG | **Astro 5** | Content Collections, Loaders, View Transitions nativas |
| Estilização | **Tailwind CSS v4** | Config CSS-first via `@theme`, plugin `@tailwindcss/typography` |
| Ilhas interativas | **Solid JS** | 1 ilha prevista: theme toggle |
| Tipografia (sans) | **Geist Sans Variable** | Self-hosted via `@fontsource-variable/geist` |
| Tipografia (mono) | **Geist Mono Variable** | Self-hosted, ligatures ativas em code |
| Runtime | **Node 20 LTS** | |
| Package manager | **pnpm** | Lockfile: `pnpm-lock.yaml` |
| CI | **GitHub Actions** | Setup com `actions/setup-node` + `pnpm/action-setup` |
| Hosting | **Cloudflare Pages** | Edge network, free tier, preview deploys por PR |
| Analytics | **Cloudflare Web Analytics** | No-JS, cookie-free, dashboard no painel CF |
| OG image | **Satori + Sharp + Resvg** | Renderiza PNG em build-time |

---

## 3. Modelo de conteúdo

### 3.1 Coleções (Zod schemas)

Localização: `src/content/config.ts`.

**`blog`** (posts):

```ts
{
  title: string,
  description: string (40-160 chars),  // SEO + card preview
  pubDate: Date,
  updatedDate?: Date,
  tags: string[],                      // flat, no máximo ~10 ativas
  draft: boolean (default false),      // build ignora drafts
  featured: boolean (default false),   // pin no home
  cover?: string,                      // /public/covers/foo.png
  // SEM series por enquanto
}
```

**`projects`** (showcase):

```ts
{
  title: string,
  summary: string (max 160),
  year: number (int, min 2000),
  status: 'active' | 'maintained' | 'archived' | 'wip',
  role: 'creator' | 'maintainer' | 'contributor',
  tech: string[],                      // ex: ['go', 'postgres', 'grpc']
  links: {
    repo?: url,
    demo?: url,
    post?: url,
  },
  featured: boolean (default false),
  cover?: string,
  relatedPosts: string[],              // slugs de blog posts (source-of-truth)
  // stats: { stars, forks, lastCommit } → enriquecido em build-time
}
```

### 3.2 Relacionamentos project ↔ blog

- **Source-of-truth**: array `relatedPosts` no project.
- **Reverse computado em build**: para cada blog post, o loader procura qual project tem `relatedPosts.includes(post.slug)`.
- Renderização:
  - Project detail page → "Articles about this project" (lista os relatedPosts)
  - Blog post page → "This post is part of project X" (badge/link se match)

### 3.3 Enriquecimento build-time (GitHub API)

Loader Astro custom busca GitHub API no `astro build`:

- Campos injetados: `stats.stars`, `stats.forks`, `stats.lastCommit`
- Token: `GITHUB_TOKEN` (CI secret), 5000 req/h com auth
- Cache: 6-24h (loader Astro suporta cache nativo)
- Não bloqueia build de páginas que não precisam do dado

### 3.4 Páginas (escopo fechado)

| Rota | Tipo | Conteúdo |
|---|---|---|
| `/` | SSG | Hero + featured projects + recent posts |
| `/about` | SSG | Bio, stack, OSS, contato |
| `/projects` | SSG | Índice filtrável de projetos |
| `/projects/[slug]` | SSG | Página individual de projeto (MDX) |
| `/blog` | SSG | Índice cronológico reverso, filtro por tag |
| `/blog/[slug]` | SSG | Post individual (MDX) |
| `/now` | SSG | O que você está focando AGORA (atualiza a cada trimestre) |
| `/uses` | SSG | Hardware, software, ferramentas (escreve uma vez) |
| `/404` | SSG | Página de erro estilizada |
| `/og/[slug].png` | SSR | OG image dinâmica (Satori, gerada no build) |

---

## 4. Design system

### 4.1 Modo de cor

- **Default**: dark
- **Alternativo**: light (manual toggle)
- Persistência: `localStorage`
- Anti-FOUC: `<script>` inline no `<head>` lê storage antes do paint
- Atributo: `data-theme="dark|light"` em `<html>`
- Função CSS: `light-dark()` (Tailwind v4 + CSS Color Module 5)

### 4.2 Paleta

**Grays** (Tailwind zinc, ultra-sutil frio):

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#fafafa` | `#0a0a0a` |
| `--color-fg` | `#0a0a0a` | `#ededed` |
| `--color-muted` | `#525252` | `#a1a1aa` |
| `--color-border` | `#e5e5e5` | `#262626` |

**Accent** (emerald):

| Token | Light | Dark |
|---|---|---|
| `--color-accent` | `#059669` | `#10b981` |
| `--color-accent-hover` | `#047857` | `#34d399` |
| `--color-accent-soft` | `#d1fae5` | `#064e3b` |

### 4.3 Tipografia

- **Sans** (UI, body, headings): Geist Sans Variable, weights 100-900
- **Mono** (code, kbd, samp): Geist Mono Variable, ligatures ativas
- Self-hosted (sem Google Fonts CDN)
- `@tailwindcss/typography` para prose de blog posts

### 4.4 Motion

- Hover/focus: `transition-colors duration-200 ease-out`
- Page transitions: Astro `<ViewTransitions />` (crossfade)
- Respeita `prefers-reduced-motion: reduce`
- JS adicional: < 1KB

---

## 5. Features

### 5.1 Incluídas (table stakes)

- RSS feed (`/rss.xml`) — `astro-rss`
- Sitemap.xml — plugin Astro
- robots.txt
- Shiki syntax highlight (built-in)
- Reading time ("5 min read")
- 404 page
- Favicon + manifest.json (PWA-ready, não instalável)
- **OG image dinâmica** (Satori + Sharp + Resvg) — gerada por post/project

### 5.2 Decididas (manter minimalismo)

| Feature | Decisão | Condição de revisão |
|---|---|---|
| Contato | `mailto:` link | Upgrade para form se fricção ficar alta |
| Search | nenhuma | Adicionar Pagefind se blog > 25 posts |
| Comments | nenhum | Adicionar Giscus se virar comunidade |
| Analytics | Cloudflare Web Analytics | Suficiente, sem mudança prevista |
| Newsletter | nenhum | Não previsto |
| View counter | nenhum | Não previsto |
| i18n | EN only | Adicionar PT-BR incremental se houver demanda |

---

## 6. Hosting & ops

### 6.1 Cloudflare Pages

- **Free tier**: 500 builds/mês, 100k requests/dia (plenty)
- **Build time esperado**: 2-3 min (SSG + GitHub enrichment)
- **Edge network**: global, forte no Brasil
- **Preview deploys**: cada PR gera URL única `pr-N.portfolio.pages.dev`
- **Domínio custom**: configurar via Cloudflare
- **CI**: GitHub Actions (não o CI da Cloudflare) para controle

### 6.2 CI/CD

```yaml
# .github/workflows/deploy.yml (esboço)
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      # deploy step (Wrangler ou Cloudflare API)
```

### 6.3 Secrets necessários

| Secret | Uso | Onde |
|---|---|---|
| `GITHUB_TOKEN` | GitHub API enrichment | CI |
| `CLOUDFLARE_API_TOKEN` | Deploy (se usar Wrangler manual) | CI |
| `CLOUDFLARE_ACCOUNT_ID` | Deploy | CI |

### 6.4 Observabilidade

- **Analytics**: Cloudflare Web Analytics (pageviews, referrers, geo)
- **Build logs**: GitHub Actions artifacts
- **Runtime errors**: nenhum (SSG, zero JS obrigatório)
- **Uptime**: implícito pelo SLA da Cloudflare

---

## 7. Estrutura de pastas proposta

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── fonts/                      # Geist Variable files
│   ├── covers/                     # blog/project covers
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── content/
│   │   ├── blog/
│   │   │   └── *.mdx
│   │   ├── projects/
│   │   │   └── *.mdx
│   │   ├── config.ts               # Zod schemas
│   │   └── loaders/
│   │       └── github.ts           # build-time enrichment
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── BlogCard.astro
│   │   ├── Tag.astro
│   │   ├── ThemeToggle.tsx         # ilha Solid
│   │   └── SEO.astro               # meta + OG + Twitter
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── BlogPost.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── now.astro
│   │   ├── uses.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── og/
│   │       └── [...slug].png.ts
│   ├── styles/
│   │   └── global.css              # Tailwind v4 @theme + tokens
│   └── consts.ts
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── ARCHITECTURE.md                 # este documento
```

---

## 8. Ordem de implementação (do zero ao deploy)

Sequência de commits incremental, cada um com deploy preview funcionando:

1. **Bootstrap**: `pnpm create astro@latest`, empty template, TypeScript strict
2. **Tailwind v4**: `pnpm add tailwindcss @tailwindcss/vite @tailwindcss/typography`
3. **Geist fonts**: `pnpm add @fontsource-variable/geist @fontsource-variable/geist-mono`
4. **Solid**: `pnpm astro add solid`
5. **Tokens**: `src/styles/global.css` com `@theme` (zinc, emerald, Geist vars, `light-dark()`)
6. **Layout base**: `BaseLayout.astro` com `<ViewTransitions />`, `<Header />`, `<Footer />`, anti-FOUC
7. **Theme toggle**: ilha Solid, ~30 linhas, `localStorage` persist
8. **Schema**: `src/content/config.ts` com collections `blog` e `projects`
9. **Home**: hero, featured projects, recent posts
10. **About**: bio, tech stack, OSS
11. **Projects index + detail**: cards + página MDX com `relatedPosts`
12. **Blog index + detail**: cronologia reversa, tags, reading time, "part of project" badge
13. **Now + Uses**: conteúdo estático, sem fancy
14. **GitHub loader**: enrichment build-time, `GITHUB_TOKEN` no CI
15. **OG image**: `/og/[slug].png.ts` com Satori
16. **SEO component**: `<SEO />` com meta, OG, Twitter Card
17. **RSS + Sitemap**: `astro-rss` + `@astrojs/sitemap`
18. **404 page**: estilizada
19. **Deploy Cloudflare**: GitHub Actions + Wrangler, ou Git integration
20. **Domínio custom + Web Analytics beacon**

Cada passo deve terminar com `pnpm build` passando e `pnpm preview` mostrando a mudança localmente.

---

## 9. Decisões adiadas (volátil, revisar depois)

- **Search client-side** (Pagefind): adicionar se blog > 25 posts
- **Comments** (Giscus): adicionar se virar comunidade
- **Series support**: campo `series` no schema + rota `/series/[slug]`, se escrever trilogy
- **Categories**: hierarquia só se tags virarem > 15
- **Newsletter** (Buttondown/Resend): provavelmente nunca
- **i18n PT-BR**: incremental via content collections por locale, se houver demanda
- **JSON Resume / `/cv`**: adicionar se job hunting
- **PWA / Service Worker**: skip (portfolio não precisa de offline)
- **Webmentions**: skip (Twitter substitui)

---

## 10. Pendências (decidir antes de codar)

- [ ] **Nome do projeto / repo**: sugestão `portfolio`
- [ ] **Domínio custom**: sugestão `dcbto.dev` ou similar (verificar disponibilidade)
- [ ] **Email de contato** (pro `mailto:`)
- [ ] **Username GitHub** (pro enrichment + URLs)
- [ ] **Conteúdo seed**:
  - 2-3 blog posts (para validar layout de post)
  - 2-3 projects (incluindo os 2 OSS contribuídos)
  - Bio do `/about`
  - Conteúdo do `/now` e `/uses`
- [ ] **Conta Cloudflare** (criar se não tiver)
- [ ] **Repositório no GitHub** (criar com `.gitignore` adequado)

---

## 11. Como rodar localmente

```bash
# instalar dependências
pnpm install --frozen-lockfile

# dev server (http://localhost:4321)
pnpm dev

# type check
pnpm check

# build de produção (output em ./dist)
pnpm build

# preview do build
pnpm preview
```

---

## 12. Resumo de decisões (changelog)

| # | Decisão | Escolha |
|---|---|---|
| 1 | Modelo de conteúdo | Git como CMS (MDX no repo) |
| 2 | Framework | Astro 5 (SSG) |
| 3 | Estilização | Tailwind CSS v4 |
| 4 | Ilhas | Solid |
| 5 | Runtime | Node 20 LTS |
| 6 | Package manager | pnpm |
| 7 | i18n | EN only |
| 8 | Escopo de páginas | base + `/now` + `/uses` |
| 9 | Tags do blog | flat, sem series |
| 10 | Relacionamentos | project → blog, reverse computado |
| 11 | Enrichment | build-time (GitHub API) |
| 12 | Modo de cor | dark default + light opcional |
| 13 | Tipografia | Geist Sans + Geist Mono |
| 14 | Paleta | zinc + emerald |
| 15 | Motion | micro-transitions + View Transitions |
| 16 | OG image | dinâmica em build-time (Satori) |
| 17 | Analytics | Cloudflare Web Analytics |
| 18 | Hosting | Cloudflare Pages |
| 19 | Contato | `mailto:` link |
| 20 | Search | nenhum (Pagefind se > 25 posts) |
| 21 | Comments | nenhum |
