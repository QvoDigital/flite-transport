/**
 * Beat maps for the page's scroll-scrubbed sequences.
 *
 * Content that lives inside a pinned sequence cannot be reached by a plain anchor, because its
 * target is a scroll position rather than an element. Keeping the maps here lets both the section
 * that renders the beats and any link that jumps to one work from the same numbers.
 *
 * This module deliberately does not import GSAP. The masthead and footer both depend on it for
 * their nav links, and they are shared with /faq, which has no sequences and should not be made
 * to download an animation engine to render a list of questions. Sequences register themselves
 * at runtime instead, so the dependency points the other way.
 */

/** The scroll extent of a live sequence, in page pixels. */
type TriggerRange = { start: number; end: number };

const sequences = new Map<string, () => TriggerRange | null>();

/**
 * Called by a mounted sequence to publish its scroll extent. Returns its own cleanup.
 *
 * A getter rather than a value because ScrollTrigger recomputes start and end on every refresh,
 * and a snapshot taken at mount would send a nav click to a stale position after any resize.
 */
export function registerSequence(id: string, range: () => TriggerRange | null): () => void {
  sequences.set(id, range);
  return () => {
    if (sequences.get(id) === range) sequences.delete(id);
  };
}

export type Beat = { from: number; to: number };

export const FADE = 0.06;

/**
 * The first beat of a sequence opens one fade-width before zero and the last closes one past one,
 * so both sit at full opacity at the ends of the scrub. A beat starting exactly at 0 would be
 * invisible until the user scrolled.
 */
export const OPENING_ID = 'opening-sequence';
export const OPENING_BEATS: Beat[] = [
  { from: -FADE, to: 0.3 },
  { from: 0.34, to: 0.64 },
  { from: 0.7, to: 1 + FADE },
];

/**
 * The capability shot: scanner on the label, hands lifting the parcel, the stack behind it.
 * One cluster per moment, in that order.
 */
export const CAPABILITIES_ID = 'capabilities-sequence';
export const CAPABILITIES_BEATS: Beat[] = [
  { from: -FADE, to: 0.34 },
  { from: 0.38, to: 0.68 },
  { from: 0.72, to: 1 + FADE },
];

/** Trapezoid: ramp up over FADE, hold, ramp down over FADE. */
export function beatOpacity(progress: number, beat: Beat): number {
  if (progress <= beat.from || progress >= beat.to) return 0;
  const rise = Math.min(1, (progress - beat.from) / FADE);
  const fall = Math.min(1, (beat.to - progress) / FADE);
  return Math.max(0, Math.min(rise, fall));
}

/**
 * Applies a sequence's beat opacities directly to their nodes.
 *
 * Written straight to the DOM rather than through state: this runs on every scrub frame, and
 * re-rendering the tree sixty times a second would buy nothing.
 */
export function paintBeats(
  nodes: Array<HTMLElement | null>,
  beats: Beat[],
  progress: number
): void {
  nodes.forEach((node, i) => {
    const beat = beats[i];
    if (!node || !beat) return;
    const opacity = beatOpacity(progress, beat);
    node.style.opacity = String(opacity);
    // Transform only, so this stays on the compositor.
    node.style.transform = `translate3d(0, ${(1 - opacity) * 14}px, 0)`;
    node.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';
  });
}

/**
 * Scrolls to the middle of a beat's hold, where it sits at full opacity.
 *
 * Returns false when that sequence is not on this page or not scrubbing - reduced motion, frames
 * still loading, or the visitor is on /faq - so the caller can fall back to ordinary anchor
 * behaviour instead of silently doing nothing.
 */
export function scrollToBeat(
  triggerId: string,
  beats: Beat[],
  index: number,
  smooth = true
): boolean {
  const beat = beats[index];
  if (!beat) return false;

  const trigger = sequences.get(triggerId)?.();
  if (!trigger) return false;

  const distance = trigger.end - trigger.start;
  if (distance <= 0) return false;

  // Clamp the hold to the real 0..1 range before taking its midpoint: the first and last beats
  // deliberately overhang the ends.
  const centre = (Math.max(0, beat.from) + Math.min(1, beat.to)) / 2;

  window.scrollTo({
    top: trigger.start + distance * centre,
    behavior: smooth ? 'smooth' : 'auto',
  });

  return true;
}

/** Where a nav item points when its target is a beat rather than a section. */
export type BeatTarget = { trigger: string; beats: Beat[]; index: number };

export const BEAT_TARGETS: Record<string, BeatTarget> = {
  services: { trigger: OPENING_ID, beats: OPENING_BEATS, index: 1 },
};

/**
 * Click handler for a nav link whose target is a beat.
 *
 * Modified clicks are left alone so open-in-new-tab still works, and the default is only
 * prevented when the scroll actually happened.
 */
export function handleBeatLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  key: string | undefined
): void {
  if (!key) return;
  const target = BEAT_TARGETS[key];
  if (!target) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  if (scrollToBeat(target.trigger, target.beats, target.index)) event.preventDefault();
}
