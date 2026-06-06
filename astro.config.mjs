import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://dcbto.dev",
  integrations: [mdx(), solidJs(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
