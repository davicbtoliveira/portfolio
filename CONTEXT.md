# Portfolio — Domain Language

Personal portfolio site for Davi Oliveira. SSG with Astro 5, MDX content, deployed on Cloudflare Pages.

## Language

**Project**:
A showcase entry — an OSS or personal project with tech stack, links (repo, demo, post), and build-time stats. Has statuses: active, maintained, archived, wip. Roles: creator, maintainer, contributor.
_Avoid_: repository, repo, app

**Post**:
A blog article with title, description, pubDate, tags, and draft/featured flags. Content lives in MDX.
_Avoid_: article, entry, blog post

**Collection**:
An Astro content collection backed by MDX glob loaders. Two exist: `blog` and `projects`.
_Avoid_: dataset, index

**Enrichment**:
Build-time injection of GitHub API data (stars, forks, lastCommit) into project entries. Non-blocking, cached.
_Avoid_: fetch, sync, augmentation

**Entry**:
A single item within a collection — combines an `id` (slug) with `data` (the schema shape).
_Avoid_: item, record, row

**Card**:
A presentational component that renders a single Entry (ProjectCard, BlogCard). Stateless, receives data via props.
_Avoid_: tile, preview

**Section**:
A presentational wrapper that renders a grid of Cards (FeaturedProjects, RecentPosts). Conditional rendering: hides if empty.
_Avoid_: list, container

**Accessor**:
A data-fetching module that calls `getCollection`, strips MDX extensions, maps entries, and delegates to a pick/filter function.
_Avoid_: loader, fetcher, repository

**Pick function**:
A pure filter-sort-slice function (pickFeaturedProjects, pickRecentPosts). No I/O, no framework dependency. The only business logic in the codebase.
_Avoid_: filter, selector, query
