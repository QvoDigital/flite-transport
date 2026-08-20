/**
 * The four legal documents, as labels and URLs only.
 *
 * Split out from legal.ts for one reason: the footer and the consent bar render on every page and
 * need only the links, while legal.ts carries several thousand words of policy. With both in one
 * module, Rollup put the whole of it in the chunk the home page loads, so every visitor downloaded
 * the entire privacy policy to render four footer links. This file is what they load instead;
 * legal.ts imports it, so there is still one source for the slugs and the paths.
 *
 * Trailing slashes are deliberate. See the note on `nav` in site.ts.
 */

export const legalIndex = [
  { slug: 'privacy', navLabel: 'Privacy Policy', path: '/privacy/' },
  { slug: 'cookies', navLabel: 'Cookie Policy', path: '/cookies/' },
  { slug: 'terms', navLabel: 'Terms & Conditions', path: '/terms/' },
  { slug: 'accessibility', navLabel: 'Accessibility', path: '/accessibility/' },
] as const;

export type LegalSlug = (typeof legalIndex)[number]['slug'];

export function legalPath(slug: LegalSlug): string {
  // The find cannot miss: `slug` is typed from this same array.
  return legalIndex.find((entry) => entry.slug === slug)!.path;
}
