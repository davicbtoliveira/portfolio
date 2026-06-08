# 0001 — Extract collection entry fetching into shared module

`posts.ts` and `projects.ts` both contained `stripMdxExtension` and repeated the `getCollection` → map → delegate pattern. The `stripMdxExtension` function was copy-pasted verbatim.

We created `getCollectionEntries<T>` in `src/lib/collection.ts`. It owns the strip-map-filter pipeline. Posts and projects import this helper and add their own specific logic on top. Adding a new collection accessor now costs one call to `getCollectionEntries` instead of repeating the `getCollection` + strip + map pattern.
