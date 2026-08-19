import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Two entry points, not a router.
 *
 * The FAQ is a separate document rather than a client-side route on purpose. It is there to be
 * indexed and quoted, so it needs its own URL, its own canonical, its own title and its own
 * structured data. A client-side route would give it none of those without a router and a
 * server-side rendering step, and `react-router-dom` cannot be installed on this machine anyway
 * because npm is missing from the Node install.
 *
 * The practical benefit is that /faq never loads GSAP or a single frame of footage. It is a
 * reference page and it should weigh what a reference page weighs.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        faq: fileURLToPath(new URL('faq/index.html', import.meta.url)),
      },
    },
  },
});
