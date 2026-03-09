import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gustamarchioro.github.io', 
  base: '/pro-elite-dashboard',
  vite: {
    plugins: [tailwindcss()],
  },
});