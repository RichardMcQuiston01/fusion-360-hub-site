// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fusion360.hiredhandhq.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
