import type { Component } from "svelte";
import {
  postSchema,
  projectSchema,
  type Post,
  type PostEntry,
  type Project,
  type ProjectEntry,
} from "../content/schemas";

type ContentModule = {
  default: Component;
  metadata?: Record<string, unknown>;
};

export type RenderablePostEntry = PostEntry & { component: Component };
export type RenderableProjectEntry = ProjectEntry & { component: Component };

const blogModules = import.meta.glob<ContentModule>(
  "../content/blog/*.mdx",
  { eager: true },
);
const projectModules = import.meta.glob<ContentModule>(
  "../content/projects/*.mdx",
  { eager: true },
);

function slugFromPath(path: string): string {
  return path.split("/").pop()?.replace(/\.mdx?$/, "") ?? path;
}

function asDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(String(value));
}

function normalizePostMetadata(metadata: Record<string, unknown>): Post {
  return postSchema.parse({
    ...metadata,
    pubDate: asDate(metadata.pubDate),
    updatedDate:
      metadata.updatedDate === undefined
        ? undefined
        : asDate(metadata.updatedDate),
  });
}

function normalizeProjectMetadata(
  metadata: Record<string, unknown>,
): Project {
  return projectSchema.parse(metadata);
}

function entriesFromModules<T>(
  modules: Record<string, ContentModule>,
  normalize: (metadata: Record<string, unknown>) => T,
): Array<{ id: string; data: T; component: Component }> {
  return Object.entries(modules).map(([path, module]) => ({
    id: slugFromPath(path),
    data: normalize(module.metadata ?? {}),
    component: module.default,
  }));
}

const blogEntries = entriesFromModules(blogModules, normalizePostMetadata);
const projectEntries = entriesFromModules(
  projectModules,
  normalizeProjectMetadata,
);

export function getBlogEntries(): RenderablePostEntry[] {
  return blogEntries.map((entry) => ({ ...entry })) as RenderablePostEntry[];
}

export function getProjectEntriesFromContent(): RenderableProjectEntry[] {
  return projectEntries.map((entry) => ({
    ...entry,
  })) as RenderableProjectEntry[];
}

export function getBlogEntry(slug: string): RenderablePostEntry | undefined {
  return getBlogEntries().find((entry) => entry.id === slug);
}

export function getProjectEntry(
  slug: string,
): RenderableProjectEntry | undefined {
  return getProjectEntriesFromContent().find((entry) => entry.id === slug);
}

export function getBlogComponent(slug: string): Component | undefined {
  return getBlogEntry(slug)?.component;
}

export function getProjectComponent(slug: string): Component | undefined {
  return getProjectEntry(slug)?.component;
}

export function stripRenderable<T extends { component: Component }>(
  entries: T[],
): Array<Omit<T, "component">> {
  return entries.map(({ component: _component, ...entry }) => entry);
}
