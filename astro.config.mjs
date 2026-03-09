import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Configuração oficial PRO Elite — Tailwind v4 + No Toolbar
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  devToolbar: {
    enabled: false
  }
});