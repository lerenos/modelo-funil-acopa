import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import markdownIntegration from '@astropub/md'

// https://astro.build/config
export default defineConfig({
  site: "https://exemplo.com.br/",
  integrations: [
    tailwind(), 
    sitemap(), 
    mdx(),
    markdownIntegration(),
  ]
});