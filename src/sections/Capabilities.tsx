import { useCallback, useRef } from 'react';
import { FrameSequence } from '../components/FrameSequence';
import { CAPABILITIES_BEATS, CAPABILITIES_ID, paintBeats } from '../lib/sequence';
import { capabilityClusters } from '../content/site';

/**
 * The capability shot.
 *
 * The ten things the company lists were a flat wall of text on the old site and a three-column
 * grid in the first pass here. Neither said anything. This puts them on the footage instead, and
 * the footage was chosen so each cluster lands on the moment that shows it:
 *
 *   scanner on the label      -> tracking and proof
 *   hands lifting the parcel  -> handling
 *   the stack behind it       -> the people and access behind the job
 *
 * Same grammar as the opening: locked-off camera, one gesture, scroll as the playhead.
 */
export function Capabilities({ reducedMotion }: { reducedMotion: boolean }) {
  const beatRefs = useRef<Array<HTMLDivElement | null>>([]);

  const onProgress = useCallback((progress: number) => {
    paintBeats(beatRefs.current, CAPABILITIES_BEATS, progress);
  }, []);

  return (
    <section className="caps" id="capabilities" aria-labelledby="caps-heading">
      <h2 id="caps-heading" className="sr-only">
        What runs on every job
      </h2>

      <FrameSequence
        reducedMotion={reducedMotion}
        clip="scan"
        frameCount={81}
        triggerId={CAPABILITIES_ID}
        scrollLength="205%"
        onProgress={onProgress}
      >
        <div className="opening__beats shell">
          {capabilityClusters.map((cluster, i) => (
            <div
              className="beat"
              key={cluster.id}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
            >
              <h3 className="beat__heading">{cluster.label}</h3>
              <ul className="beat__levels">
                {cluster.items.map((item) => (
                  <li key={item}>
                    <span className="beat__level beat__level--sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FrameSequence>

      {/*
        Reduced motion never runs the scrub, so the beats above stay hidden. Same content as an
        ordinary stack, on the page's own surface rather than over the resting frame.
      */}
      <div className="opening__static">
        <div className="shell caps__static">
          {capabilityClusters.map((cluster) => (
            <div key={cluster.id}>
              <h3 className="cluster__name">{cluster.label}</h3>
              <ul className="cluster__list">
                {cluster.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
