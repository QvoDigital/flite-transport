import { useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { Masthead } from './components/Masthead';
import { About } from './sections/About';
import { Capabilities } from './sections/Capabilities';
import { Contact } from './sections/Contact';
import { CostFigure } from './sections/CostFigure';
import { Opening } from './sections/Opening';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function App() {
  // Read once. Re-reading per render would let a resize rebuild every timeline mid-scroll.
  const reducedMotion = useMemo(prefersReducedMotion, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Only hide reveal targets once we know GSAP is live, so a script failure cannot leave the
    // page blank.
    document.body.classList.add('js-ready');

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: 'power2.out',
            stagger: 0.06,
            overwrite: true,
            // Dropping the hint once the tween lands keeps layers off the compositor.
            onComplete: () => gsap.set(batch, { willChange: 'auto' }),
          }),
      });
    });

    return () => {
      ctx.revert();
      document.body.classList.remove('js-ready');
    };
  }, [reducedMotion]);

  return (
    <div className="page">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <CookieBanner />

      <Masthead />

      <main id="main">
        <Opening reducedMotion={reducedMotion} />
        <CostFigure reducedMotion={reducedMotion} />
        <Capabilities reducedMotion={reducedMotion} />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
