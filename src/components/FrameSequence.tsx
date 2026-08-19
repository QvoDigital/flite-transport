import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerSequence } from '../lib/sequence';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed frame sequence.
 *
 * A <video> element is not used on purpose. Seeking `currentTime` from a scroll handler is
 * unreliable across browsers - iOS Safari in particular refuses to decode fast enough to keep up
 * and the picture visibly lags the scrollbar. Decoded frames drawn to a canvas always land on the
 * frame the scroll position asks for, which is the whole point of scrubbing.
 *
 * Loading is staged, because a page carrying two of these was requesting every frame of both on
 * mount - several megabytes competing with first paint, which is a Core Web Vitals problem and
 * therefore a ranking problem:
 *
 *   - `preload="eager"` is for the sequence above the fold. Frame 0 is fetched at high priority
 *     so there is a picture almost immediately; the rest follow at low priority.
 *   - `preload="near"` (the default) fetches nothing until the section is approaching the
 *     viewport, so a sequence further down the page costs nothing on load.
 *
 * The ScrollTrigger is built on mount either way, never on load completion. Creating a pin after
 * the user has already scrolled past would shift the layout underneath them; this way the section
 * always occupies its final height and frames simply stream into a canvas that is already placed.
 */

const NARROW_MAX = 760;

/** How far ahead of the viewport a deferred sequence starts fetching. */
const PRELOAD_MARGIN = '200% 0px';

function framePath(clip: string, index: number, narrow: boolean) {
  const n = String(index + 1).padStart(4, '0');
  return `/seq/${clip}/${narrow ? 'narrow' : 'wide'}/${n}.webp`;
}

type Props = {
  reducedMotion: boolean;
  /** Folder under /seq holding `wide/` and `narrow/` frame sets, e.g. "dock". */
  clip: string;
  /** How many frames that folder contains. */
  frameCount: number;
  /** ScrollTrigger id, so nav links can resolve a scroll position inside this pin. */
  triggerId: string;
  /**
   * Pin length as a percentage of viewport height, and the main control on pace: it is how much
   * scrolling the shot consumes before releasing. Longer gives the gesture more room to read,
   * shorter makes the sequence advance faster per turn of the wheel.
   */
  scrollLength?: string;
  /** `eager` for the shot above the fold; `near` defers until the section approaches. */
  preload?: 'eager' | 'near';
  /** Extra class on the sequence root, for shots that get their own treatment. */
  className?: string;
  /** Called with 0..1 as the sequence scrubs, so copy beats can follow the same progress value. */
  onProgress?: (progress: number) => void;
  children?: React.ReactNode;
};

export function FrameSequence({
  reducedMotion,
  clip,
  frameCount,
  triggerId,
  scrollLength = '225%',
  preload = 'near',
  className = '',
  onProgress,
  children,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);

  // Which frame is on the canvas, and how to put one there. Both live in refs because the
  // preload and the scrub are separate effects that each need to trigger a paint.
  const currentRef = useRef(-1);
  const drawRef = useRef<(index: number) => void>(() => {});

  const [armed, setArmed] = useState(preload === 'eager');
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  // Held in a ref so a caller passing an inline arrow cannot rebuild the whole timeline on
  // every render.
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  // ---- Arm the loader ----------------------------------------------------
  useEffect(() => {
    if (armed) return;
    const section = sectionRef.current;
    if (!section) return;

    // No IntersectionObserver means an old browser; load rather than never show the shot.
    if (typeof IntersectionObserver === 'undefined') {
      setArmed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [armed]);

  // ---- Preload -----------------------------------------------------------
  useEffect(() => {
    if (!armed) return;

    const narrow = window.matchMedia(`(max-width: ${NARROW_MAX}px)`).matches;
    let cancelled = false;
    let done = 0;

    const images: HTMLImageElement[] = new Array(frameCount);

    const settle = (index: number) => {
      if (cancelled) return;
      done += 1;
      setLoaded(done);

      // Paint as soon as there is anything to paint, rather than holding a blank canvas until
      // the whole sequence has arrived.
      if (index === currentRef.current || (currentRef.current < 0 && index === 0)) {
        drawRef.current(index);
      }

      if (done === frameCount) {
        setReady(true);
        drawRef.current(currentRef.current < 0 ? 0 : currentRef.current);
      }
    };

    for (let i = 0; i < frameCount; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      // The opening frame is the first thing anyone sees, so it competes for bandwidth. Every
      // other frame explicitly yields to text, fonts and the LCP image.
      img.fetchPriority = preload === 'eager' && i === 0 ? 'high' : 'low';
      img.src = framePath(clip, i, narrow);
      // A failed frame still resolves: one missing frame must not stall the whole sequence.
      img.onload = () => settle(i);
      img.onerror = () => settle(i);
      images[i] = img;
    }

    framesRef.current = images;

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [armed, clip, frameCount, preload]);

  // ---- Draw and scrub ----------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    /** Cover fit, computed per draw so a resize never letterboxes or stretches the frame. */
    const draw = (index: number) => {
      const img = framesRef.current[index];
      currentRef.current = index;
      // Nothing decoded yet: leave the canvas on its backdrop and paint when the frame lands.
      if (!img || !img.naturalWidth) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      context.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw(currentRef.current < 0 ? 0 : currentRef.current);
    };

    resize();

    if (reducedMotion) {
      // Rest on the revealed load. The sequence carries no information the copy does not.
      draw(frameCount - 1);
      progressRef.current?.(1);
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }

    // ScrollTrigger only reports on change, so the first beat would stay hidden until the user
    // scrolls. Seed the callback with the resting position.
    progressRef.current?.(0);

    const ctx = gsap.context(() => {
      const state = { progress: 0 };

      gsap.to(state, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          id: triggerId,
          trigger: section,
          start: 'top top',
          // Longer than one viewport so the gesture has room to read as a shot, not a flicker.
          end: `+=${scrollLength}`,
          pin: true,
          // Smoothing lag, in seconds, between the wheel and the frame catching up. Enough to
          // take the jitter off a trackpad, low enough that the picture still feels attached to
          // the scroll rather than trailing it.
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const index = Math.min(
            frameCount - 1,
            Math.max(0, Math.round(state.progress * (frameCount - 1)))
          );
          if (index !== currentRef.current) draw(index);
          progressRef.current?.(state.progress);
        },
      });
    }, sectionRef);

    // Publish this pin's scroll extent so nav links can jump to a beat inside it. Read live
    // rather than captured, because ScrollTrigger recomputes both ends on every refresh.
    const unregister = registerSequence(triggerId, () => {
      const t = ScrollTrigger.getById(triggerId);
      return t ? { start: t.start, end: t.end } : null;
    });

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      unregister();
      ctx.revert();
    };
  }, [reducedMotion, frameCount, triggerId, scrollLength]);

  const percent = Math.round((loaded / frameCount) * 100);

  return (
    <div className={`seq ${className}`.trim()} ref={sectionRef}>
      <canvas className="seq__canvas" ref={canvasRef} aria-hidden="true" />

      {armed && !ready && (
        <div className="seq__loading" role="status" aria-live="polite">
          <span className="label">Loading {percent}%</span>
          <span className="seq__bar">
            <span className="seq__barFill" style={{ transform: `scaleX(${loaded / frameCount})` }} />
          </span>
        </div>
      )}

      <div className="seq__overlay">{children}</div>
    </div>
  );
}
