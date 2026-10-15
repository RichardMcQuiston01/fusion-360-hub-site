// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fusion360.hiredhandhq.com',
  integrations: [sitemap()],
  // The Support page became Contact Us.
  redirects: { '/support': '/contact/' },
  vite: {
    plugins: [tailwindcss()],
  },
});
