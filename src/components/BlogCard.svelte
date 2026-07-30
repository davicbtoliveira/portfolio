<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Post } from "../content/schemas";

  type Props = { post: Post; href: `/blog/${string}` };
  let { post, href }: Props = $props();

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
</script>

<article class="post-entry" data-tags={post.tags.join(",")}>
  <span class="date">{formatter.format(post.pubDate)}</span>
  <div class="info">
    <a href={resolve(href)} class="title">{post.title}</a>
    {#if post.description}<p class="description">{post.description}</p>{/if}
  </div>
</article>
