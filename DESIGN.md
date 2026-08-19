# Flite Transport - Design System

## Design read

Reading this as: a **redesign-overhaul marketing site for logistics operations and e-commerce
buyers**, with a **dispatch-console / precision-logistics** language, leaning toward **native CSS +
GSAP scroll choreography** on the existing brand red against off-black.

Not a consumer luxury brand, not a SaaS dashboard. The buyer is an operations manager choosing a
last mile partner. The site has to feel precise and in control, because that is the product.

**Mode:** Redesign - Overhaul. The visual language is new. Content, brand colour, wordmark, contact
details, form field names and nav labels are preserved from flitetransport.com.

## Dials

`DESIGN_VARIANCE 8` · `MOTION_INTENSITY 8` · `VISUAL_DENSITY 4`

The existing site reads as roughly `3 / 2 / 4`. Overhaul adds +2 to variance and motion; the brief
explicitly asks for immersive, which pushes motion to 8. Density stays at 4 because there genuinely
is not much content, and pretending otherwise would mean inventing facts.

## The organising idea: one route

The page is threaded by **a single red route line that is drawn as you scroll**. It is not
decoration. It is the delivery route, and every section is a waypoint on it: the line leaves the
chevron in the wordmark, runs the length of the page, and terminates at a doorstep in the contact
section.

This is the answer to "what does this animation communicate?" The route line communicates the
product itself - a parcel moving from order to doorstep - and it is the reason the page reads as one
continuous journey instead of eight stacked sections.

Everything else on the page is calm so the route can carry the motion.

**Why not WebGL or a frame sequence.** Neither buys anything here. The story is a line moving
through space, which SVG does natively at 60fps on a phone, with no download cost and no fallback
problem. Reach for heavier tooling only when the story needs volume or parallax that 2D cannot fake.

## 1. Colour

Extracted from the live stylesheet at `/wp-content/themes/FliteTransport/style.css`, not invented.
The brand is already red and it stays red.

| Token | Value | Source | Use |
|---|---|---|---|
| `--red` | `#990000` | existing `.text-red`, active nav, `hr` | The only accent on the page |
| `--red-hot` | `#c01818` | derived | Hover / focus only |
| `--red-deep` | `#6b0000` | derived | Pressed, deep fills |
| `--ink` | `#111214` | new | Off-black page surface, never `#000` |
| `--ink-2` | `#191b1e` | new | Elevated dark surface |
| `--paper` | `#fcfcfc` | existing `body` background | Light page surface |
| `--paper-2` | `#f1efec` | new | Light alt surface |
| `--text-dark` | `#333333` | existing `.text-custom-black` | Body text on light |
| `--text-light` | `#d6d4d1` | new | Body text on dark |
| `--muted` | contextual | new | Secondary text, both modes |

**Colour consistency lock.** `#990000` is the only accent on the entire page. The route line, the
CTA fill, focus rings, the service markers and the active nav state all resolve to that one red. No
second hue is introduced anywhere, in either mode.

**Dual mode.** Both light and dark ship. Default follows `prefers-color-scheme`, with a manual
toggle in the masthead. One theme governs the whole page; no section inverts mid-scroll.

## 2. Typography

Preserved from the existing brand. Montserrat is already the wordmark face and is a genuine sans
display, so no serif is introduced and no font swap is needed.

- **Display:** Montserrat Variable, 700-800. `clamp()` scaled, tight tracking, `line-height: 1.04`.
- **Body:** Raleway Variable, 400-600. Measure capped at `65ch`.
- **Technical:** Roboto Mono Variable, 500. Uppercase, `0.16em` tracking. Reserved for the three
  service level names and the route waypoint markers, which are content, not decoration.

Self-hosted through `@fontsource-variable` with `font-display: swap`. No render-blocking Google
Fonts link.

**Eyebrow budget.** Seven sections, so a maximum of **2** small-caps labels on the whole page.
They are spent on the capabilities cluster headings, which categorise real content.

## 3. Space and shape

- Scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 176`px as `--space-*`.
- Shell: `min(1360px, 100% - 2 * gutter)`, gutter `clamp(20px, 4vw, 64px)`.
- Section rhythm: `clamp(96px, 12vw, 176px)` block padding.
- **Shape lock: radius `2px` on every surface.** Buttons, inputs, media frames, markers. This is a
  logistics brand and the geometry is waybill-square. No pills, no 16px cards.

## 4. Motion

GSAP + ScrollTrigger is the **only** animation system. Motion (the library) is not installed, so
nothing competes for frames.

| Purpose | Spec |
|---|---|
| Route draw | `scrub: 0.8`, `stroke-dashoffset` along one master timeline |
| Section pin (service levels) | `start: "top top"`, `pin: true`, `scrub: 1` |
| Reveal on enter | `y: 20 -> 0`, opacity `0 -> 1`, `620ms`, `power2.out`, stagger `0.06`, max 8 |
| Hover | `180ms cubic-bezier(.16,1,.3,1)` |
| Press | `translateY(1px)`, `70ms` |

**Hard rules.** No `window.addEventListener("scroll")`. No `window.scrollY` held in React state. No
`requestAnimationFrame` loop touching React state. Every GSAP context is reverted on unmount. Only
`transform` and `opacity` are animated, plus `stroke-dashoffset` on the route, which is composited.

**Reduced motion.** Under `prefers-reduced-motion: reduce` the route renders complete and static,
the pin is dropped so the service levels stack vertically, and reveals become instant. No content
is lost and nothing is gated behind an animation.

## 5. Layout families (repetition guard)

Seven sections, six distinct families. No family repeats, and there is no run of image-plus-text
splits.

| # | Section | Layout family |
|---|---|---|
| 1 | Hero | Asymmetric split, content left, media right |
| 2 | Service levels | Scroll-pinned horizontal track |
| 3 | The cost of the last mile | Full-bleed single-figure statement |
| 4 | Capabilities | Three clustered columns, no per-row hairlines |
| 5 | An extension of your business | Full-bleed editorial text, no media |
| 6 | Contact | Split form and detail column |
| 7 | Footer | Four-column base |

## 6. Content integrity

`src/content/site.ts` is the single source of truth for every business fact on the page, and all of
it comes from the live flitetransport.com.

**Nothing is invented.** No statistics beyond the one the company already publishes, no
testimonials, no client names, no certifications, no coverage area, no fleet size, no delivery
guarantees, no pricing, no years-in-business. If a claim is not in that file it does not appear on
the site.

The one real figure the company publishes is that last mile delivery can account for **up to 30% of
overall delivery costs**. That is why it earns a full section instead of being buried in a paragraph.

Copy voice is preserved. Two grammar errors in the source copy are corrected rather than
reproduced: `customers expectations` gains its apostrophe, and `We strives` becomes `We strive`.

## 7. Accessibility floor

- One `h1`, ordered headings, semantic landmarks, skip link.
- Route line is `aria-hidden`; nothing exists only inside it.
- Contrast AA minimum, AAA for body copy, verified in both modes.
- Focus rings: `2px` solid red at `2px` offset, visible on every interactive element.
- Form labels sit above inputs, errors inline below, no placeholder-as-label.
- Service level track is reachable by keyboard and readable when the pin is disabled.
