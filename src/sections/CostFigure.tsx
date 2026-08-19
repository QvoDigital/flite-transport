import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { costFigure } from '../content/site';

gsap.registerPlugin(ScrollTrigger);

/**
 * The one figure the company actually publishes, given a section of its own.
 *
 * The count communicates magnitude: watching the number climb to 30 lands the size of the
 * problem in a way a printed "30%" does not. It runs once, on entry, and never loops.
 */
export function CostFigure({ reducedMotion }: { reducedMotion: boolean }) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.textContent = String(costFigure.value);
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: costFigure.value,
        duration: 1.6,
        ease: 'power2.out',
        // Text is written straight to the node, so counting never re-renders the tree.
        onUpdate: () => {
          el.textContent = String(Math.round(counter.value));
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="figure" aria-labelledby="figure-heading">
      <div className="figure__inner shell">
        <p className="figure__value" aria-hidden="true">
          <span ref={numberRef}>0</span>
          <span className="figure__unit">{costFigure.unit}</span>
        </p>

        <div className="figure__copy">
          <h2 id="figure-heading" className="figure__claim reveal">
            <span className="figure__sr">
              {costFigure.value}
              {costFigure.unit}{' '}
            </span>
            {costFigure.claim}
          </h2>
          <p className="figure__body measure reveal">{costFigure.body}</p>
        </div>
      </div>
    </section>
  );
}
