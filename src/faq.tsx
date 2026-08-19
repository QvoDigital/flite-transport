import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FaqPage } from './pages/FaqPage';
import './styles/global.css';
import './styles/layout.css';

/**
 * Entry for /faq.
 *
 * Deliberately does not import App. Doing so would pull GSAP, ScrollTrigger and both frame
 * sequence components into a page that animates nothing, on the one URL whose whole job is to
 * load fast and be quoted.
 */
const root = document.getElementById('root');
if (!root) throw new Error('Root element missing from faq/index.html');

createRoot(root).render(
  <StrictMode>
    <FaqPage />
  </StrictMode>
);
