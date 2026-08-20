import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Six documents, not a router.
 *
 * The FAQ and the four legal pages are separate documents rather than client-side routes on
 * purpose. Each is there to be indexed, linked and quoted, so each needs its own URL, its own
 * canonical, its own title and its own structured data. A client-side route would give them none
 * of those without adding a router and a server-side rendering step.
 *
 * The practical benefit is that none of them load GSAP or a single frame of footage. They are
 * reference pages and they should weigh what a reference page weighs.
 *
 * The four legal documents share one entry module, src/legal.tsx, which picks the document from
 * `data-legal` on the body. Four entry files would have produced four near-identical bundles;
 * this way the shared code is emitted once and a visitor reading a second policy already has it.
 */
const page = (file: string) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    rollupOptions: {
      input: {
        main: page('index.html'),
        faq: page('faq/index.html'),
        privacy: page('privacy/index.html'),
        cookies: page('cookies/index.html'),
        terms: page('terms/index.html'),
        accessibility: page('accessibility/index.html'),
      },
    },
  },
});
