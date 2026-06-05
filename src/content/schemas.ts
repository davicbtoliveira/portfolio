import { z } from "astro/zod";

export const projectSchema = z.object({
  title: z.string(),
  summary: z.string().max(160),
  year: z.number().int().min(2000),
  status: z.enum(["active", "maintained", "archived", "wip"]),
  role: z.enum(["creator", "maintainer", "contributor"]),
  tech: z.array(z.string()),
  links: z
    .object({
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      post: z.string().url().optional(),
    })
    .default({}),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  relatedPosts: z.array(z.string()).default([]),
});

export type Project = z.infer<typeof projectSchema>;
