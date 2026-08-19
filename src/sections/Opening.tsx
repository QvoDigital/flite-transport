import { useCallback, useRef } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { FrameSequence } from '../components/FrameSequence';
import { OPENING_BEATS, OPENING_ID, paintBeats } from '../lib/sequence';
import { company, cta, serviceLevels } from '../content/site';

/**
 * The opening shot.
 *
 * One locked-off take at the dock: the doors swing open and the load is revealed. Scroll is the
 * playhead. Three copy beats are timed to the gesture, so the words arrive on the picture rather
 * than beside it.
 *
 *   doors closed   -> the promise
 *   doors opening  -> what you can book
 *   load revealed  -> what comes back to you afterwards
 *
 * Beat opacity is written straight to the nodes from the scrub callback. Putting scroll progress
 * in React state would re-render this tree sixty times a second for no benefit.
 */

export function Opening({ reducedMotion }: { reducedMotion: boolean }) {
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);

  const onProgress = useCallback((progress: number) => {
    paintBeats(beatRefs.current, OPENING_BEATS, progress);
  }, []);

  return (
    <section className="opening" id="top" aria-labelledby="opening-heading">
      <FrameSequence
        reducedMotion={reducedMotion}
        clip="dock"
        frameCount={129}
        triggerId={OPENING_ID}
        preload="eager"
        onProgress={onProgress}
      >
        <div className="opening__beats shell">
          {/* Beat 1 - doors closed. */}
          <div className="beat" ref={(el) => { beatRefs.current[0] = el; }}>
            <h1 id="opening-heading">{company.headline}</h1>
            <p className="beat__sub">
              Your transportation partner for express, same-day and scheduled last mile delivery.
            </p>
            <a className="btn" href={cta.href}>
              {cta.label}
              <ArrowRight size={15} weight="bold" />
            </a>
          </div>

          {/* Beat 2 - doors opening. */}
          <div className="beat" ref={(el) => { beatRefs.current[1] = el; }}>
            <h2 className="beat__heading">Three service levels</h2>
            <ul className="beat__levels">
              {serviceLevels.map((level) => (
                <li key={level.id}>
                  <span className="beat__level">{level.name}</span>
                  <span className="beat__note">{level.note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Beat 3 - the load revealed. */}
          <div className="beat" ref={(el) => { beatRefs.current[2] = el; }}>
            <h2 className="beat__heading">Every parcel accounted for</h2>
            <p className="beat__sub">
              GPS and web based tracking on the way out. Photo proof of delivery on the way back.
            </p>
          </div>
        </div>
      </FrameSequence>

      {/*
        Under reduced motion the sequence rests on its final frame and the scrub never runs, so
        the beats above stay hidden. This is the same copy as a plain stack.

        It also carries id="services" so that nav link resolves to a real element. Under reduced
        motion this block is what the user sees and the anchor lands correctly; when the scrub is
        live the masthead intercepts the click and scrolls into the pin instead.
      */}
      <div className="opening__static" id="services">
        <div className="shell">
          <h1>{company.headline}</h1>
          <p className="beat__sub">
            Your transportation partner for express, same-day and scheduled last mile delivery.
          </p>
          <ul className="beat__levels">
            {serviceLevels.map((level) => (
              <li key={level.id}>
                <span className="beat__level">{level.name}</span>
                <span className="beat__note">{level.note}</span>
              </li>
            ))}
          </ul>
          <p className="beat__sub">
            GPS and web based tracking on the way out. Photo proof of delivery on the way back.
          </p>
          <a className="btn" href={cta.href}>
            {cta.label}
            <ArrowRight size={15} weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}
