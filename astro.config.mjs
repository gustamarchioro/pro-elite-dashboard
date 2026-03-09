import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: 'https://gustamarchioro.github.io', 
  base: '/pro-elite-dashboard', // O nome exato do seu repositório
  integrations: [tailwind()],
});