# Flite Transport

Marketing site for Flite Transport, a last mile delivery company in Burlington, Ontario. One
continuous scroll journey: React 19 + TypeScript + Vite, with GSAP ScrollTrigger as the only
animation system.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck, bundle, then prerender -> dist/
npm run preview
```

## How the scroll sequences work

Two shots are scrubbed by scroll. Each is a folder of WebP frames drawn to a canvas, not a
`<video>`: seeking `currentTime` from a scroll handler is unreliable across browsers, and iOS
Safari in particular cannot decode fast enough to keep up, so the picture visibly lags the
scrollbar. Decoded frames always land on the frame the scroll position asks for.

| Clip | Frames | Where |
|---|---|---|
| `public/seq/dock` | 129 | The opening. Van doors open to reveal the load. |
| `public/seq/scan` | 129 | Capabilities. A parcel scanned, lifted, the stack behind it. |

`src/components/FrameSequence.tsx` owns both. Loading is staged: the opening shot is `eager`, with
frame 0 at high fetch priority and the rest at low, while the second defers behind an
IntersectionObserver until it is approaching. The ScrollTrigger is always built on mount rather
than on load completion, so a pin is never created underneath a user who has already scrolled past.

Copy beats are timed to each shot in `src/lib/sequence.ts`. Beat opacity is written straight to the
DOM from the scrub callback: putting scroll progress in React state would re-render the tree sixty
times a second for no benefit.

**The van livery is part of the footage, not an overlay.** It was produced by painting the wordmark
onto the shot's first frame (`scripts/make-start-frame.mjs`) and regenerating the clip from that
still, so the mark splits with the doors and foreshortens correctly as they swing. Compositing it
per frame was tried and abandoned: a flat overlay cannot know the panel is rotating away.

## Content

**`src/content/site.ts` is the single source of truth for every business fact on the site.** All of
it comes from the previous flitetransport.com. Nothing is invented: no statistics beyond the one
figure the company publishes, no testimonials, no client names, no coverage area, no cut-off times,
no delivery guarantees, no pricing.

Two grammar errors in the source copy are corrected rather than reproduced, and are documented at
the top of that file.

The highest-value thing the client could supply is the material that is deliberately missing:
service area, same-day cut-off times, turnaround guarantees and pricing. Those are the questions
buyers search for, and their absence is the main ceiling on how well this can rank.

## SEO, AEO and GEO

- `scripts/prerender.mjs` runs after `vite build` and writes a readable version of the page into
  `#root`. Without it a crawler receives an empty div: Google renders JavaScript eventually, most
  answer-engine crawlers never do. It also emits `dist/llms.txt`.
- `/faq` is a **separate document**, not a client-side route, with its own entry in
  `vite.config.ts`. It carries the `FAQPage` and `BreadcrumbList` structured data and loads no GSAP
  and no footage.
- `index.html` carries `LocalBusiness` markup. `openingHoursSpecification`, `areaServed` and `geo`
  are deliberately absent until the client supplies them.
- `public/_redirects` 301s the old `/services`, `/about` and `/contact` URLs so their ranking is not
  thrown away. Netlify syntax; convert for other hosts.
- `public/robots.txt` allows the AI crawlers on purpose, with the reasoning inline. Flip to
  `Disallow` if the client prefers.

## Contact form

Submissions open the visitor's mail client addressed to `info@flitetransport.com`, prefilled. That
is deliberate for a static site with no backend: a form that POSTs to an unconfigured endpoint
looks like it worked and silently drops the enquiry, which is the worst possible failure for the
one element whose job is generating leads. Swap `onSubmit` in `src/sections/Contact.tsx` for a form
service when there is somewhere real to send it.

## Accessibility and motion

- Every beat is real DOM text. The page reads with images off.
- `prefers-reduced-motion: reduce` drops both pins and renders each sequence at a resting frame,
  with the same copy as an ordinary stack. Nothing is reachable only by animating.
- One `h1`, ordered headings, skip link, visible focus rings, labelled fields with inline errors.
- Canvases are `aria-hidden`; nothing lives only in a frame sequence.

## Known gaps

- Reduced motion and light mode were exercised in code but never viewed on a device.
- Mobile layout is written but unverified at true phone width.
- `_redirects` cannot be tested locally; `vite preview` ignores it. Check after the first deploy.
