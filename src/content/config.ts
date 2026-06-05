import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { projectSchema, postSchema } from "./schemas";

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: projectSchema,
  }),
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
    schema: postSchema,
  }),
};
