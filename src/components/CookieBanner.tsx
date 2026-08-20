import { useCallback, useEffect, useRef, useState } from 'react';
import {
  onPreferencesRequested,
  readConsent,
  setConsent,
  type ConsentState,
} from '../lib/consent';
import { legalPath } from '../content/legal-index';

/**
 * The consent prompt.
 *
 * Shown once. The answer is kept for six months (src/lib/consent.ts), so a returning visitor is
 * not asked again, and the footer's "Cookie preferences" control is the way back to it.
 *
 * Non-modal on purpose. It does not cover the page, does not trap focus and does not block
 * reading, because there is nothing here that requires a decision before the content is safe to
 * show: no script is waiting on the answer. A consent wall would be pure friction.
 *
 * It sits early in the DOM and late on the screen. Tab order reaches it immediately after the skip
 * link, so a keyboard or screen reader user meets the choice at the start rather than discovering
 * it at the bottom of a long scroll, while `position: fixed` keeps it visually out of the way of
 * the opening shot.
 *
 * Accept and Decline are the same size, sit side by side and are one click each. Making the
 * refusal harder to reach than the acceptance is the thing consent law is most consistently
 * enforced against, and it would be a strange look on a page whose point is that we do not track
 * anyone.
 *
 * Motion is CSS, not GSAP. DESIGN.md makes GSAP the only animation system, but that rule is about
 * the home page's scroll choreography, and this component also renders on /faq and the legal pages
 * which deliberately load no GSAP at all. Pulling the library onto those documents to fade one bar
 * in would cost more than the bar is worth. Transitions rather than keyframes so an interrupted
 * dismissal retargets instead of restarting.
 */

type Phase = 'idle' | 'entering' | 'shown' | 'leaving';

/**
 * Long enough that the banner does not race the first paint, short enough that it does not feel
 * like it snuck in behind you.
 */
const ENTER_DELAY = 550;
const LEAVE_DURATION = 200;

export function CookieBanner() {
  /**
   * Read synchronously on first render rather than in an effect. An effect would render the
   * banner for a frame and then remove it, so every returning visitor would see it flash.
   */
  const [phase, setPhase] = useState<Phase>(() => (readConsent() === null ? 'entering' : 'idle'));

  /** True when the visitor opened this themselves, which changes how focus and Escape behave. */
  const invoked = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    },
    []
  );

  // The footer control asks for the banner back.
  useEffect(
    () =>
      onPreferencesRequested(() => {
        invoked.current = true;
        setPhase('entering');
      }),
    []
  );

  /*
   * `entering` -> `shown` on the next frame. The class swap has to land in a later frame than the
   * initial paint or the browser has nothing to transition from and the bar simply appears.
   */
  useEffect(() => {
    if (phase !== 'entering') return;

    let raf = 0;
    const id = window.setTimeout(() => {
      raf = requestAnimationFrame(() => setPhase('shown'));
    }, invoked.current ? 0 : ENTER_DELAY);

    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  /*
   * Focus moves in only when the visitor asked for the banner. Stealing focus from someone who
   * just arrived and started reading would be hostile, and worse for a screen reader user, who
   * would be yanked out of the page mid-sentence.
   */
  useEffect(() => {
    if (phase === 'shown' && invoked.current) {
      panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    }
  }, [phase]);

  const close = useCallback(() => {
    setPhase('leaving');
    after(LEAVE_DURATION, () => {
      setPhase('idle');
      invoked.current = false;
    });
  }, [after]);

  const choose = useCallback(
    (state: ConsentState) => {
      setConsent(state);
      close();
    },
    [close]
  );

  /*
   * Escape dismisses only when there is already a stored answer to fall back on, which is exactly
   * the case where the visitor opened this to review a choice they had made. On a first visit
   * Escape does nothing, because silently treating a keypress as an answer is not consent.
   */
  useEffect(() => {
    if (phase !== 'shown') return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && readConsent() !== null) close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, close]);

  if (phase === 'idle') return null;

  return (
    <div
      className="consent"
      data-state={phase}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
    >
      <div className="consent__panel" ref={panel}>
        <div className="consent__copy">
          <h2 className="consent__title" id="consent-title">
            Cookies
          </h2>
          <p className="consent__body" id="consent-body">
            This site sets one cookie, and its only job is to remember this answer. There is no
            analytics here, no advertising pixel and nothing that follows you to another site. The{' '}
            <a href={legalPath('cookies')}>Cookie Policy</a> lists everything stored, by name.
          </p>
        </div>

        <div className="consent__actions">
          <button type="button" className="btn btn--ghost" onClick={() => choose('denied')}>
            Decline
          </button>
          <button type="button" className="btn" onClick={() => choose('granted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
