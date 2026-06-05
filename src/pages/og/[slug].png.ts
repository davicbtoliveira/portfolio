import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { renderOgPng, type OgImageInput } from "../../lib/og-image";

type OgRoute = {
  slug: string;
  input: OgImageInput;
};

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const projects = await getCollection("projects");
  const routes: OgRoute[] = [
    ...posts
      .filter((post) => post.data.draft !== true)
      .map((post) => {
        const slug = post.id.replace(/\.mdx?$/, "");
        return {
          slug: `blog-${slug}`,
          input: {
            title: post.data.title,
            description: post.data.description,
            kind: "Blog" as const,
          },
        };
      }),
    ...projects.map((project) => {
      const slug = project.id.replace(/\.mdx?$/, "");
      return {
        slug: `project-${slug}`,
        input: {
          title: project.data.title,
          description: project.data.summary,
          kind: "Project" as const,
        },
      };
    }),
  ];

  return routes.map((route) => ({
    params: { slug: route.slug },
    props: { input: route.input },
  }));
}

export async function GET({ props }: APIContext) {
  const png = await renderOgPng(props.input);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
