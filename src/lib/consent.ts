/**
 * Cookie consent: storage, reading, and the gate that non-essential scripts must pass through.
 *
 * As it stands this site loads nothing that needs consent, so `whenGranted` currently has no
 * callers. That is deliberate rather than an oversight. The expensive mistake with consent is
 * adding analytics first and the banner afterwards, because then the default is "on" and every
 * visitor between the two commits is measured without being asked. Building the gate first makes
 * the default "off" permanently: anything added later has to opt in through `whenGranted`, and if
 * somebody forgets, the failure mode is a script that never runs rather than one that runs
 * without permission.
 *
 * Stored in a cookie rather than localStorage on purpose. The record has to expire on its own so
 * the question is re-asked periodically, which is what regulators expect and what localStorage
 * cannot do without hand-rolling a timestamp. It is also readable server-side if this ever stops
 * being a static site.
 */

export type ConsentState = 'granted' | 'denied';

const COOKIE = 'flite_consent';

/**
 * Bumping this re-asks everyone.
 *
 * Consent is to a specific set of purposes, so a stored "yes" to today's cookie table is not a
 * "yes" to a table with analytics in it. Adding anything non-essential means incrementing this.
 */
const VERSION = 1;

/** Six months. Long enough not to nag, short enough that consent stays current. */
const MAX_AGE = 60 * 60 * 24 * 182;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  // Split on '; ' rather than ';' so a value containing a semicolon cannot shift the parse.
  const hit = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

/**
 * Returns the stored decision, or null if there is not one that still applies.
 *
 * A record written against an older VERSION is treated as absent, which is what re-asks the
 * question rather than silently carrying a stale answer forward.
 */
export function readConsent(): ConsentState | null {
  const raw = readCookie(COOKIE);
  if (!raw) return null;

  const [version, state] = raw.split(':');
  if (version !== `v${VERSION}`) return null;
  return state === 'granted' || state === 'denied' ? state : null;
}

export function setConsent(state: ConsentState): void {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  // Lax, not None: this cookie is never wanted on a cross-site request, and None would require
  // Secure everywhere including local development over http.
  document.cookie = `${COOKIE}=v${VERSION}:${state}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  if (state === 'granted') flush();
}

/** Clears the record so the banner asks again. Used by the footer's preferences control. */
export function clearConsent(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/* ---- The gate ------------------------------------------------------------------------------ */

const pending: Array<() => void> = [];

function flush(): void {
  // Spliced out before running so a callback that throws cannot be retried on the next grant.
  while (pending.length) pending.shift()?.();
}

/**
 * Runs `fn` once the visitor has granted consent, immediately if they already have.
 *
 * This is the only supported way to load anything non-essential. Call it at module scope; do not
 * check `readConsent()` yourself and branch, because that misses the case where consent is given
 * after the page has loaded.
 */
export function whenGranted(fn: () => void): void {
  if (readConsent() === 'granted') {
    fn();
    return;
  }
  pending.push(fn);
}

/* ---- Reopening the banner ------------------------------------------------------------------ */

const REOPEN = 'flite:consent-reopen';

/**
 * A window event rather than React context.
 *
 * The footer control and the banner are rendered by three different page components and never
 * share a parent below the root, so wiring them with context would mean adding a provider to every
 * entry point for one boolean. The DOM already has a working event bus.
 */
export function requestPreferences(): void {
  window.dispatchEvent(new CustomEvent(REOPEN));
}

export function onPreferencesRequested(fn: () => void): () => void {
  window.addEventListener(REOPEN, fn);
  return () => window.removeEventListener(REOPEN, fn);
}
