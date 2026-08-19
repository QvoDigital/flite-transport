/**
 * Single source of truth for every business fact on the page.
 *
 * Everything here comes from the live flitetransport.com. Nothing is invented: no statistics
 * beyond the one figure the company already publishes, no testimonials, no client names, no
 * certifications, no coverage area, no fleet size, no delivery guarantees, no pricing, no
 * years-in-business. If a claim is not in this file it does not belong on the site.
 *
 * Two grammar errors in the source copy are corrected rather than reproduced:
 *   "customers expectations" -> "customers' expectations"
 *   "We strives"             -> "We strive"
 * The odd parenthetical "your (our) customers" is resolved to "your customers".
 */

export const company = {
  name: 'Flite Transport',
  tagline: 'Your transportation partner.',
  /** The existing brand line, with its missing apostrophe restored. */
  headline: "Exceed your customers' expectations.",
} as const;

export const contact = {
  street: '5063 North Service Road',
  unit: 'Suite 100',
  city: 'Burlington',
  region: 'ON',
  postal: 'L7L 5H6',
  phone: '(905) 802-0305',
  phoneHref: 'tel:+19058020305',
  email: 'info@flitetransport.com',
} as const;

export const social = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/flite-transport/' },
  { label: 'Instagram', href: 'https://www.instagram.com/flitetransport/' },
  { label: 'Facebook', href: 'https://www.facebook.com/flitetransport' },
  { label: 'X', href: 'https://twitter.com/flite_transport' },
] as const;

/**
 * Nav labels are preserved from the existing site.
 *
 * Capabilities is deliberately not here. It is no longer a section you jump to, it is a shot you
 * scroll through, so a nav item pointing at it would drop the visitor into the middle of a pinned
 * sequence with no context.
 *
 * Hrefs are root-absolute (`/#about`, not `#about`) because this nav renders on two documents
 * now. On the home page the browser treats `/#about` as a same-page jump; from /faq it navigates
 * home and then jumps. A bare `#about` would silently do nothing on the FAQ page.
 *
 * `beat` marks an item whose target is a moment inside a sequence rather than an element. The
 * service levels are shown inside the opening shot, so "Services" scrolls into that pin when one
 * is running, and falls back to the real anchor when there is not one, which is what happens on
 * /faq.
 */
export const nav = [
  { label: 'Services', href: '/#services', beat: 'services' },
  { label: 'About Us', href: '/#about' },
  /**
   * Trailing slash matters. The build emits faq/index.html, which every static host serves at
   * /faq/ as a directory index. A request for /faq without it misses that file and falls through
   * to the single-page catch-all, which quietly returns the home page: the URL changes and the
   * page does not, which is exactly what a broken nav link looks like.
   */
  { label: 'FAQ', href: '/faq/' },
] as const;

/**
 * The three service levels, exactly as the existing site names them.
 *
 * The source site lists these as names only, with no published turnaround times or service level
 * agreements attached. No SLA text is invented here. The `note` on each is definitional, drawn
 * from the level's own name, and makes no promise the company has not made.
 */
export const serviceLevels = [
  {
    id: 'express',
    name: 'Express',
    note: 'For consignments that cannot wait in a queue.',
  },
  {
    id: 'same-day',
    name: 'Same-Day',
    note: 'Ordered and delivered inside the same working day.',
  },
  {
    id: 'scheduled',
    name: 'Scheduled',
    note: 'Booked to a window that suits the receiver.',
  },
] as const;

/** Verbatim from the existing site. This is the market context for the three levels above. */
export const marketDemand =
  'Buyers have high expectations and will not waiver on quality and service. These days deliveries within 24 hours of ordering are the norm, and the demand for same-day delivery is increasing. Meanwhile, tolerance for error has never been lower and, of course, efficiency depends on being right first time, every time.';

/**
 * The one real figure the company publishes. It earns its own section for that reason, rather
 * than being buried in a paragraph the way the existing site buries it.
 */
export const costFigure = {
  value: 30,
  unit: '%',
  claim: 'of overall delivery costs can sit in the last mile.',
  body: 'When you work with us directly, your savings empower you to maximise your bottom line in today’s highly competitive markets.',
} as const;

/**
 * The ten capabilities the existing services page lists, grouped into three clusters.
 * The grouping is ours; the items are theirs, unchanged.
 */
export const capabilityClusters = [
  {
    id: 'visibility',
    label: 'Tracking and proof',
    items: [
      'GPS tracking and web based tracking',
      'Real-time tracking',
      'Photo proof of delivery',
    ],
  },
  {
    id: 'handling',
    label: 'Handling',
    items: [
      'Pick-up and delivery',
      'Residential and commercial delivery',
      'White glove service',
      'Contactless delivery',
    ],
  },
  {
    id: 'access',
    label: 'People and access',
    items: ['Professional drivers', 'Desktop and mobile app', 'Live customer support'],
  },
] as const;

/** Verbatim from the existing About page, with the two grammar fixes noted at the top of this file. */
export const about = {
  lead: 'As your last mile delivery partner, the Flite team considers itself an extension of your business, which means you can trust us to provide the highest levels of customer service.',
  standards:
    'Our delivery personnel will leave your customers with a good feeling. Our service level agreements and the use of key performance indicators ensure that standards are clearly understood and maintained by all involved in your last mile delivery.',
  drivers:
    'With our roster of professional, experienced drivers, our services are scalable to meet peak needs.',
  closing: 'We strive to deliver excellence and smiles with every single delivery.',
} as const;

/**
 * Questions and answers, rendered visibly on the page and emitted as FAQPage structured data
 * from this same array at build time.
 *
 * Both come from here on purpose. FAQPage markup that does not match content a visitor can
 * actually see is a structured data violation, and Google issues manual actions for it, so the
 * schema and the section have to be incapable of drifting apart.
 *
 * Every answer restates something the business already publishes. Restating a known fact as a
 * question is not invention; answering an unknown one would be. So there is nothing here about
 * cut-off times, service radius, turnaround guarantees or pricing. Those are the questions buyers
 * most want answered and the highest-value thing the client could still supply.
 */
export const faqs = [
  {
    q: 'What delivery services does Flite Transport offer?',
    a: 'Flite Transport offers three service levels: Express, Same-Day and Scheduled last mile delivery. Both residential and commercial deliveries are handled.',
  },
  {
    q: 'Where is Flite Transport based?',
    a: 'Flite Transport operates from 5063 North Service Road, Suite 100, Burlington, Ontario L7L 5H6. They can be reached on (905) 802-0305 or at info@flitetransport.com.',
  },
  {
    q: 'How can I track a Flite Transport delivery?',
    a: 'Flite Transport provides GPS and web based tracking, with real-time tracking available throughout the delivery, accessible through a desktop and mobile app.',
  },
  {
    q: 'Does Flite Transport provide proof of delivery?',
    a: 'Yes. Photo proof of delivery is captured at the doorstep and returned through the desktop and mobile app. Contactless delivery is also available.',
  },
  {
    q: 'Does Flite Transport handle deliveries that need special care?',
    a: 'Yes. Flite Transport offers a white glove service for consignments needing more than a doorstep drop, carried out by a roster of professional, experienced drivers that scales to meet peak needs.',
  },
  {
    q: 'Why does last mile delivery matter to my costs?',
    a: 'Last mile delivery can account for up to 30% of overall delivery costs. Working with a last mile partner directly is how those costs are reduced.',
  },
] as const;

/**
 * One CTA intent on the page, one label for it. The existing site used "LET'S TALK!" on the
 * About page, so that is the label everywhere: masthead, hero, contact.
 */
export const cta = {
  label: "Let's talk",
  /** Root-absolute so the same button works from /faq as well as the home page. */
  href: '/#contact',
} as const;
