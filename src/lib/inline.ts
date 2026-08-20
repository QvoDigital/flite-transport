/**
 * A two-token inline markup for legal copy.
 *
 * The legal documents need links inside sentences ("write to [our Privacy Officer](mailto:...)"),
 * and they are rendered twice: by React on the client and by scripts/prerender.mjs into static
 * HTML. Storing raw HTML in the content module would mean the prerender could not escape it, so a
 * stray `<` in a policy sentence would either break the markup or, worse, be injectable.
 *
 * So the content stays plain text with one convention, `[label](href)`, and each renderer walks
 * the same token list: React builds elements, the prerender escapes and builds strings. One
 * tokenizer, two safe outputs, no HTML in the content file.
 */

export type InlineToken =
  | { t: 'text'; v: string }
  | { t: 'link'; v: string; href: string };

/** Deliberately narrow: no nesting, no emphasis, no images. Legal copy needs links and nothing else. */
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;

  // `matchAll` on a global regex is safe here; the regex is a module constant and never re-entered.
  for (const match of text.matchAll(LINK)) {
    const at = match.index ?? 0;
    if (at > last) tokens.push({ t: 'text', v: text.slice(last, at) });
    tokens.push({ t: 'link', v: match[1], href: match[2] });
    last = at + match[0].length;
  }

  if (last < text.length) tokens.push({ t: 'text', v: text.slice(last) });
  return tokens;
}

/** External links get the noreferrer treatment; in-site and mailto/tel links do not need it. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
