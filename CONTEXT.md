# Portfolio — Domain Language

Personal portfolio site for Davi Oliveira. It is a statically generated
SvelteKit site with MDX content, deployed on Cloudflare Pages.

## Language

**Project**: A showcase entry with a stack, links, and optional build-time
statistics. Statuses are `active`, `maintained`, `archived`, and `wip`; roles
are `creator`, `maintainer`, and `contributor`.

**Post**: A blog post with title, description, publication date, tags, and
draft/featured flags. Content lives in MDX.

**Collection**: The content modules under `src/content/blog` and
`src/content/projects`, discovered by the SvelteKit/mdsvex content boundary.

**Enrichment**: Optional build-time injection of GitHub API data (stars, forks,
and last commit) into project entries. It degrades when no token is present.

**Entry**: A single collection value with an `id` slug and a validated `data`
object.

**Card**: A stateless presentational component that renders one project or post
entry.

**Section**: A presentational wrapper for a group of cards. Empty sections are
hidden.

**Accessor**: A data module that discovers, validates, filters, and sorts
content entries without coupling page components to frontmatter parsing.

**Pick function**: A pure filter/sort function such as `listProjects` or
`listPosts`. These are the only business rules that do not perform I/O.
