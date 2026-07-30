import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

const config = {
  extensions: [".svelte", ".md", ".mdx"],
  preprocess: [
    vitePreprocess(),
    mdsvex({ extensions: [".md", ".mdx"] }),
  ],
  kit: {
    adapter: adapter({
      pages: "dist",
      assets: "dist",
      precompress: false,
    }),
    prerender: {
      handleUnseenRoutes: "ignore",
    },
    paths: {
      relative: false,
    },
  },
};

export default config;
