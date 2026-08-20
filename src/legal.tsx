import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LegalPage } from './pages/LegalPage';
import { getLegalDoc } from './content/legal';
import './styles/global.css';
import './styles/layout.css';

/**
 * Shared entry for /privacy/, /cookies/, /terms/ and /accessibility/.
 *
 * All four HTML documents load this one module and identify themselves with `data-legal` on the
 * body. Four near-identical entry files would have produced four near-identical bundles for no
 * benefit; this way Rollup emits the shared code once and each page pulls the same chunk, already
 * warm in cache if the visitor reads a second one.
 *
 * Like /faq, it deliberately does not import App: none of these pages animate anything, and none
 * of them should be paying for GSAP or a frame sequence.
 */
const root = document.getElementById('root');
if (!root) throw new Error('Root element missing from the legal document');

const slug = document.body.dataset.legal ?? '';
const doc = getLegalDoc(slug);

// A typo in `data-legal` would otherwise render a blank page that looks like a bundle failure.
if (!doc) throw new Error(`Unknown legal document "${slug}". Check data-legal on <body>.`);

createRoot(root).render(
  <StrictMode>
    <LegalPage doc={doc} />
  </StrictMode>
);
