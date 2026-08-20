/**
 * The four legal documents, as data.
 *
 * ---------------------------------------------------------------------------------------------
 * How this squares with the content-integrity rule in DESIGN.md
 * ---------------------------------------------------------------------------------------------
 * Everywhere else on this site, nothing is stated that the business has not already published.
 * Legal pages cannot work that way: their whole job is to describe practice, and the previous
 * flitetransport.com published none.
 *
 * So the rule is adapted rather than abandoned. Every factual claim below about what this website
 * does is verifiable from this repository, and was checked against it:
 *
 *   - No analytics, tag manager, advertising pixel or third-party embed exists in the source.
 *   - The only browser storage is `flite-theme` in localStorage (Masthead.tsx, index.html) and the
 *     `flite_consent` cookie added with the banner (src/lib/consent.ts).
 *   - Fonts are self-hosted via @fontsource-variable; no Google Fonts request is made.
 *   - The contact form does not POST. It opens the visitor's own mail client (Contact.tsx).
 *
 * Claims that could NOT be verified from the repository are not made. In particular there is
 * nothing here about staff numbers, retention schedules for operational delivery data, insurance,
 * sub-processors, or the terms of the carriage contract, because those are facts about the
 * business rather than about this website.
 *
 * ---------------------------------------------------------------------------------------------
 * REVIEW BEFORE PUBLICATION -- items requiring the client, and a lawyer
 * ---------------------------------------------------------------------------------------------
 *   1. PIPEDA s.4.1 requires a designated, named accountable individual. "Privacy Officer" is used
 *      as a role below; substitute a real name and, ideally, a dedicated address.
 *   2. Retention periods for enquiry email are stated as a practice, not a schedule. Confirm.
 *   3. Confirm the hosting and email providers named under "Where your information is held".
 *      Hosting is Vercel as at the date below; email provider was not determinable from this repo.
 *   4. The accessibility statement's obligations under the AODA scale with employee count.
 *      Confirm which tier Flite falls into.
 *   5. The website terms deliberately do not touch carriage, liability for goods, claims windows
 *      or service levels. Those belong in the customer agreement and bill of lading, not here.
 *
 * Text convention: `[label](href)` is the only markup. See src/lib/inline.ts.
 */

import { contact } from './site.ts';
import { legalIndex, legalPath, type LegalSlug } from './legal-index.ts';

export type { LegalSlug };

/** One date for all four documents. Bump when any of them changes materially. */
export const legalUpdated = '2026-08-20';
export const legalUpdatedLabel = '20 August 2026';

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'table'; head: readonly string[]; rows: readonly (readonly string[])[] };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: readonly LegalBlock[];
};

export type LegalDoc = {
  slug: LegalSlug;
  /** Trailing slash, matching /faq/. See the note on `nav` in site.ts. */
  path: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  sections: readonly LegalSection[];
};

const index = (slug: LegalSlug) => legalIndex.find((e) => e.slug === slug)!.navLabel;

const postal = `${contact.street}, ${contact.unit}, ${contact.city}, ${contact.region} ${contact.postal}`;
const mailto = `[${contact.email}](mailto:${contact.email})`;
const tel = `[${contact.phone}](${contact.phoneHref})`;

/* ============================================================================================
   Privacy
   ============================================================================================ */

const privacy: LegalDoc = {
  slug: 'privacy',
  path: legalPath('privacy'),
  navLabel: index('privacy'),
  title: 'Privacy Policy',
  metaTitle: 'Privacy Policy - Flite Transport, Burlington Ontario',
  metaDescription:
    'How Flite Transport handles personal information collected through flitetransport.com, under Canadian privacy law. No analytics, no advertising trackers, no third-party embeds.',
  lead: 'This policy covers flitetransport.com. It explains what the website collects, why, who can see it and what you can ask us to do about it.',
  sections: [
    {
      id: 'summary',
      heading: 'The short version',
      blocks: [
        {
          kind: 'list',
          items: [
            'This website runs no analytics, no advertising pixels and no third-party trackers.',
            'It sets one cookie, and that cookie exists only to remember your answer to the cookie banner.',
            'The contact form does not send anything to us. It opens your own email program with the message prefilled, so you send it yourself and keep a copy.',
            'If you contact us, we use your details to answer you and to provide the service you ask about. We do not sell them and we do not rent them.',
            'You can ask us what we hold about you, ask us to correct it, and ask us to delete it.',
          ],
        },
      ],
    },
    {
      id: 'who-we-are',
      heading: 'Who is responsible',
      blocks: [
        {
          kind: 'p',
          text: `${'Flite Transport'} operates this website and is accountable for the personal information described in it. We are based at ${postal}, Canada.`,
        },
        {
          kind: 'p',
          text: `Questions about this policy, or about your information, go to our Privacy Officer at ${mailto} or ${tel}.`,
        },
        {
          kind: 'p',
          text: 'We handle personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA), which is the federal privacy law that applies to commercial activity in Ontario.',
        },
      ],
    },
    {
      id: 'what-we-collect',
      heading: 'What this website collects',
      blocks: [
        {
          kind: 'p',
          text: 'There are only two routes by which information reaches us through this site, and they work differently.',
        },
        {
          kind: 'p',
          text: 'Information you deliberately send us. If you use the contact form, email us or call the number on this site, we receive whatever you choose to include: typically your name, your email address, your phone number if you give it, your company, and the details of the enquiry or consignment you are asking about.',
        },
        {
          kind: 'p',
          text: 'Information your browser sends automatically. Like every web server, the service that hosts this site records the requests it receives. Those records include your IP address, the page requested, the date and time, the referring page and your browser and operating system. This happens for every website you visit and is not something a website can switch off; it is how a server knows where to send a page and how it detects abuse.',
        },
      ],
    },
    {
      id: 'contact-form',
      heading: 'How the contact form actually works',
      blocks: [
        {
          kind: 'p',
          text: 'This is worth stating plainly, because it is unusual and it is in your favour.',
        },
        {
          kind: 'p',
          text: `The form on this site has no server behind it. When you submit it, nothing is transmitted to us or to any third party. Your browser opens your own email program with a message addressed to ${contact.email}, prefilled with what you typed. Nothing leaves your device until you press send in your own email program, and the sent copy stays in your own outbox.`,
        },
        {
          kind: 'p',
          text: 'If we later connect the form to a service that submits directly, this page will be updated before that change goes live, and the provider will be named here.',
        },
      ],
    },
    {
      id: 'what-we-dont',
      heading: 'What this website does not do',
      blocks: [
        {
          kind: 'p',
          text: 'A privacy policy that lists only what a site collects tells you half the story. For the avoidance of doubt, as at the date at the foot of this page, this website:',
        },
        {
          kind: 'list',
          items: [
            'Runs no analytics package of any kind, including Google Analytics.',
            'Carries no advertising or conversion pixel, including from Meta, Google, LinkedIn or TikTok.',
            'Embeds no third-party content: no hosted video player, no map iframe, no social widget, no comment system, no chat widget, no font served from a third-party domain.',
            'Builds no profile of you, and does not track you across other websites.',
            'Has no user accounts, no logins and no passwords.',
            'Takes no payment and handles no card details.',
            'Does not sell, rent or trade personal information. We do not disclose it for anyone else’s marketing.',
          ],
        },
        {
          kind: 'p',
          text: 'Typefaces and photographs are served from this site’s own domain rather than from a content delivery network belonging to someone else, which means loading a page does not announce your visit to a third party.',
        },
      ],
    },
    {
      id: 'why',
      heading: 'Why we use it',
      blocks: [
        {
          kind: 'p',
          text: 'Under PIPEDA we have to identify our purposes and limit ourselves to them. Ours are:',
        },
        {
          kind: 'list',
          items: [
            'To answer your enquiry, quote for work and arrange the delivery service you ask about.',
            'To keep in touch about work already in progress, and to keep a record of what was agreed.',
            'To keep the website secure and working: detecting attacks, diagnosing faults and preventing abuse, using the server records described above.',
            'To meet legal, tax and insurance obligations that require us to retain business records.',
          ],
        },
        {
          kind: 'p',
          text: 'We do not use your enquiry to add you to a marketing list. If we ever send commercial electronic messages we will do so in accordance with Canada’s Anti-Spam Legislation (CASL), which means asking first and giving you a working unsubscribe.',
        },
      ],
    },
    {
      id: 'consent',
      heading: 'Consent, and taking it back',
      blocks: [
        {
          kind: 'p',
          text: 'Sending us an enquiry is your consent for us to use those details to respond to it. That is what PIPEDA calls implied consent, and it is limited to the purpose you sent them for.',
        },
        {
          kind: 'p',
          text: 'You can withdraw consent at any time by telling us, subject to legal and contractual limits: we cannot, for example, delete an invoice we are required to keep, and if you withdraw consent partway through a job we may not be able to complete it. Tell us and we will explain what the consequences would be before acting.',
        },
      ],
    },
    {
      id: 'where',
      heading: 'Where your information is held, and who else can see it',
      blocks: [
        {
          kind: 'p',
          text: 'We use a small number of service providers to run the business, and they process information only on our instructions:',
        },
        {
          kind: 'list',
          items: [
            'Our website host, which serves these pages and keeps the server records described above.',
            'Our email provider, which carries and stores the messages you send us.',
          ],
        },
        {
          kind: 'p',
          text: 'These providers operate infrastructure outside Canada, including in the United States. PIPEDA permits this, and requires us to tell you plainly: while your information is held in another country it is subject to the laws of that country, and can in principle be accessed by the courts, law enforcement and national security authorities there. We remain accountable for it, and require comparable protection by contract.',
        },
        {
          kind: 'p',
          text: 'We also disclose personal information where the law requires it: to comply with a court order, subpoena, warrant or other legal process, to establish or defend a legal claim, or to investigate suspected fraud or a threat to someone’s safety.',
        },
      ],
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      blocks: [
        {
          kind: 'p',
          text: 'We keep personal information only as long as it serves the purpose it was collected for, or as long as the law requires, whichever is longer.',
        },
        {
          kind: 'list',
          items: [
            'Enquiries that do not become work are kept while the conversation is live and disposed of once it is plainly finished.',
            'Records relating to work we carry out are kept for the period required by Canadian tax and business record-keeping law.',
            'Server records are short-lived and are kept only as long as they are useful for security and diagnosis.',
          ],
        },
      ],
    },
    {
      id: 'security',
      heading: 'How it is protected',
      blocks: [
        {
          kind: 'p',
          text: 'This site is served over HTTPS, so the connection between your browser and it is encrypted. Access to enquiry email is limited to the people who need it to do their job. We keep the site’s dependencies patched.',
        },
        {
          kind: 'p',
          text: 'No system is perfectly secure, and we will not claim otherwise. Email in particular is not a confidential medium. Please do not send anything highly sensitive by email or through the contact form; call us and we will arrange another way.',
        },
      ],
    },
    {
      id: 'rights',
      heading: 'Your rights, and how to use them',
      blocks: [
        {
          kind: 'p',
          text: 'Under PIPEDA you can ask us to:',
        },
        {
          kind: 'list',
          items: [
            'Tell you whether we hold personal information about you, and give you access to it.',
            'Tell you how it has been used and to whom it has been disclosed.',
            'Correct anything inaccurate or incomplete.',
            'Delete information we no longer have a reason to keep.',
            'Stop using it for a particular purpose.',
          ],
        },
        {
          kind: 'p',
          text: `Write to ${mailto}. We will respond within 30 days, which is the period PIPEDA allows, and we do not charge for a routine request. We may need to verify who you are before we release anything, which protects you rather than us.`,
        },
        {
          kind: 'p',
          text: 'If you are not satisfied with our answer, you can complain to the Office of the Privacy Commissioner of Canada, 30 Victoria Street, Gatineau, Quebec K1A 1H3, on 1-800-282-1376, or at [priv.gc.ca](https://www.priv.gc.ca/). We would rather you came to us first, but that route is yours regardless.',
        },
      ],
    },
    {
      id: 'elsewhere',
      heading: 'If you are outside Ontario',
      blocks: [
        {
          kind: 'p',
          text: 'Quebec. Law 25 gives Quebec residents further rights, including data portability and rights concerning automated decision-making. We make no automated decisions about anyone. Requests under Law 25 go to the same address as above.',
        },
        {
          kind: 'p',
          text: 'European Union and United Kingdom. If the GDPR or UK GDPR applies to your visit, our lawful bases are your consent for optional cookies, our legitimate interest in a secure and functioning website for the server records, and steps taken at your request before entering a contract for enquiries. You have the rights of access, rectification, erasure, restriction, portability and objection, and may complain to your national supervisory authority.',
        },
      ],
    },
    {
      id: 'children',
      heading: 'Children',
      blocks: [
        {
          kind: 'p',
          text: 'This is a business-to-business website. It is not directed at children and we do not knowingly collect information from them. If you believe a child has sent us personal information, tell us and we will delete it.',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        {
          kind: 'p',
          text: 'If we change how this website handles personal information, we will update this page and change the date at the foot of it before the change takes effect. Where a change is significant, and particularly if we introduce anything that tracks you, we will ask for your consent rather than assume it.',
        },
      ],
    },
  ],
};

/* ============================================================================================
   Cookies
   ============================================================================================ */

const cookies: LegalDoc = {
  slug: 'cookies',
  path: legalPath('cookies'),
  navLabel: index('cookies'),
  title: 'Cookie Policy',
  metaTitle: 'Cookie Policy - Flite Transport, Burlington Ontario',
  metaDescription:
    'Exactly what flitetransport.com stores in your browser: one cookie recording your cookie choice, and one local storage entry remembering light or dark mode. No analytics, no advertising cookies.',
  lead: 'Most cookie policies describe a tracking operation. This one is short, because there is not one to describe.',
  sections: [
    {
      id: 'the-point',
      heading: 'The whole story, up front',
      blocks: [
        {
          kind: 'p',
          text: 'This website sets one cookie. Its only job is to remember what you told the cookie banner, so that it does not ask you the same question on every page.',
        },
        {
          kind: 'p',
          text: 'There is no analytics cookie, no advertising cookie, no third-party cookie and nothing that follows you to another website. If that changes we will ask you first, and this page will say so before it happens.',
        },
      ],
    },
    {
      id: 'what-they-are',
      heading: 'What cookies and similar technologies are',
      blocks: [
        {
          kind: 'p',
          text: 'A cookie is a small text file a website asks your browser to keep and hand back on your next visit. It is how a site can recognise a returning browser at all.',
        },
        {
          kind: 'p',
          text: 'Local storage does a similar job but stays on your device: unlike a cookie, it is never attached to requests, so the server never receives it. Both are covered by this page, because from your point of view the distinction is invisible and what matters is what is stored and why.',
        },
      ],
    },
    {
      id: 'what-we-use',
      heading: 'What this site stores',
      blocks: [
        {
          kind: 'table',
          head: ['Name', 'Type', 'What it does', 'Expires'],
          rows: [
            [
              'flite_consent',
              'First-party cookie',
              'Records whether you accepted or declined non-essential cookies, so the banner is shown once rather than on every page.',
              'Six months from your choice',
            ],
            [
              'flite-theme',
              'Local storage',
              'Remembers whether you chose the light or the dark appearance. Never sent to our server.',
              'Until you clear your browser storage',
            ],
          ],
        },
        {
          kind: 'p',
          text: 'Both are strictly necessary in the sense the law uses: each exists solely to deliver something you asked for. Neither can identify you, neither is read by anyone else, and neither is used for measurement or advertising.',
        },
      ],
    },
    {
      id: 'not-cookies',
      heading: 'Server records are not cookies',
      blocks: [
        {
          kind: 'p',
          text: 'Our host records the requests it serves, including IP addresses, in the ordinary way every web server does. That is not a cookie and cannot be switched off with a cookie setting, so declining below does not affect it. It is covered in the [Privacy Policy](/privacy/) instead.',
        },
      ],
    },
    {
      id: 'consent',
      heading: 'Why you are asked at all',
      blocks: [
        {
          kind: 'p',
          text: 'Strictly necessary storage does not legally require consent. We ask anyway, for two reasons.',
        },
        {
          kind: 'p',
          text: 'The first is that asking only once we have something to ask about would mean the first time you saw a banner here, the answer would already matter. Establishing the mechanism now means that if measurement is ever added, it is switched off by default and stays off unless you say otherwise.',
        },
        {
          kind: 'p',
          text: 'The second is that "we do not track you" is worth more when you can see the control that would turn tracking off.',
        },
      ],
    },
    {
      id: 'change',
      heading: 'Changing your mind',
      blocks: [
        {
          kind: 'p',
          text: 'Choose Cookie preferences at the foot of any page. The banner returns and your new answer replaces the old one.',
        },
        {
          kind: 'p',
          text: 'You can also clear or block cookies in your browser settings. Every major browser lets you delete cookies for a single site, block third-party cookies, or refuse cookies entirely. Blocking everything here costs you the theme you chose and means the banner asks again, and nothing else.',
        },
        {
          kind: 'p',
          text: 'We do not respond to the Do Not Track browser header, because there is nothing here for it to turn off.',
        },
      ],
    },
    {
      id: 'future',
      heading: 'If this ever changes',
      blocks: [
        {
          kind: 'p',
          text: 'If we add anything that measures use of the site or supports advertising, it will not load until you have opted in, the table above will list it by name and purpose before it ships, and the banner will ask again rather than treating an old answer as covering a new question.',
        },
        {
          kind: 'p',
          text: `Questions about any of this go to ${mailto}.`,
        },
      ],
    },
  ],
};

/* ============================================================================================
   Terms
   ============================================================================================ */

const terms: LegalDoc = {
  slug: 'terms',
  path: legalPath('terms'),
  navLabel: index('terms'),
  title: 'Terms & Conditions',
  metaTitle: 'Website Terms & Conditions - Flite Transport, Burlington Ontario',
  metaDescription:
    'The terms governing use of flitetransport.com. Delivery services are governed by a separate written agreement; nothing on this website is an offer, a quotation or a contract of carriage.',
  lead: 'These terms govern your use of this website. They are not the terms on which we carry goods.',
  sections: [
    {
      id: 'scope',
      heading: 'What these terms cover, and what they do not',
      blocks: [
        {
          kind: 'p',
          text: 'This page governs your use of flitetransport.com. Read it as the terms of the website, not the terms of the service.',
        },
        {
          kind: 'p',
          text: 'Our delivery services are governed by a separate written agreement between Flite Transport and the customer, together with the waybill or bill of lading issued for each consignment. Nothing on this website forms part of that agreement, and nothing here is an offer capable of acceptance, a quotation, a rate, a booking, a service level agreement or a guarantee of any delivery time. If this page and a signed customer agreement ever disagree about the service, the customer agreement governs.',
        },
        {
          kind: 'p',
          text: 'By using this website you accept these terms. If you do not accept them, please do not use it.',
        },
      ],
    },
    {
      id: 'information',
      heading: 'The information on this site',
      blocks: [
        {
          kind: 'p',
          text: 'We describe our services in good faith and keep this site current, but the content is general information for prospective customers. It is not advice, it does not account for your circumstances, and it can go out of date.',
        },
        {
          kind: 'p',
          text: 'Service availability, coverage, cut-off times, turnaround and price all depend on the consignment and the route. None of them are published here, and none should be inferred from anything that is. Ask us and you will get an answer for your actual job.',
        },
        {
          kind: 'p',
          text: 'This website is provided as it stands. We do not warrant that it will be uninterrupted, error-free or free of anything harmful, and we may change, suspend or withdraw any part of it without notice.',
        },
      ],
    },
    {
      id: 'use',
      heading: 'Using the site',
      blocks: [{ kind: 'p', text: 'You may read this site, and print or save pages of it, for your own use or to evaluate us as a supplier. You may link to it. You may not:' },
        {
          kind: 'list',
          items: [
            'Use it unlawfully, or for any fraudulent or deceptive purpose.',
            'Attempt to gain unauthorised access to it, to the server that hosts it, or to any connected system.',
            'Interfere with it or with anyone else’s use of it, including by any attack designed to make it unavailable.',
            'Harvest contact details from it for unsolicited commercial messages, which would also breach Canadian anti-spam law.',
            'Reproduce, republish or exploit its content commercially, or present it as your own.',
            'Access it by automated means in a way our [robots.txt](/robots.txt) does not permit, or at a rate that degrades it for other visitors.',
          ],
        },
        {
          kind: 'p',
          text: 'We may withdraw access from anyone who does any of the above.',
        },
      ],
    },
    {
      id: 'ip',
      heading: 'Intellectual property',
      blocks: [
        {
          kind: 'p',
          text: 'The content of this site, including its text, photographs, layout, code and design, belongs to Flite Transport or to its licensors and is protected by copyright. The Flite Transport name and wordmark are ours; nothing here grants you a licence to use them.',
        },
        {
          kind: 'p',
          text: 'Quoting a short passage with attribution and a link is fine and welcome. Wholesale copying is not.',
        },
      ],
    },
    {
      id: 'links',
      heading: 'Links to other sites',
      blocks: [
        {
          kind: 'p',
          text: 'Where we link elsewhere, including to our own social media profiles, we do so for your convenience. We do not control those sites, we are not responsible for their content, and a link is not an endorsement. Their terms and their privacy policies apply once you leave.',
        },
      ],
    },
    {
      id: 'liability',
      heading: 'Our liability for this website',
      blocks: [
        {
          kind: 'p',
          text: 'This section is about the website. Liability for goods we carry is dealt with in the customer agreement and the waybill, and is not affected by anything here.',
        },
        {
          kind: 'p',
          text: 'To the fullest extent the law allows, we are not liable for indirect or consequential loss arising from your use of this website, or for loss of profit, revenue, business, goodwill or data, or for loss arising from reliance on general information published here rather than on a quotation given for your consignment.',
        },
        {
          kind: 'p',
          text: 'Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited. Some jurisdictions do not permit certain exclusions, in which case they apply to you only so far as the law permits.',
        },
      ],
    },
    {
      id: 'privacy',
      heading: 'Privacy',
      blocks: [
        {
          kind: 'p',
          text: 'How this website handles personal information is set out in the [Privacy Policy](/privacy/), and what it stores in your browser is set out in the [Cookie Policy](/cookies/). Both form part of these terms.',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      blocks: [
        {
          kind: 'p',
          text: 'We may revise these terms. The version on this page at the time you use the site is the version that applies, so the date at the foot is worth a glance if you are relying on them.',
        },
      ],
    },
    {
      id: 'law',
      heading: 'Governing law',
      blocks: [
        {
          kind: 'p',
          text: 'These terms, and any dispute arising out of this website, are governed by the laws of the Province of Ontario and the federal laws of Canada that apply in it. The courts of Ontario have jurisdiction.',
        },
        {
          kind: 'p',
          text: 'If any provision of these terms is held unenforceable, the rest continue in force.',
        },
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      blocks: [
        {
          kind: 'p',
          text: `Flite Transport, ${postal}, Canada. ${tel}. ${mailto}.`,
        },
      ],
    },
  ],
};

/* ============================================================================================
   Accessibility
   ============================================================================================ */

const accessibility: LegalDoc = {
  slug: 'accessibility',
  path: legalPath('accessibility'),
  navLabel: index('accessibility'),
  title: 'Accessibility',
  metaTitle: 'Accessibility Statement - Flite Transport, Burlington Ontario',
  metaDescription:
    'Flite Transport’s accessibility commitment under the AODA: the standard this website targets, what has been built to meet it, the limitations we know about, and how to give feedback or request another format.',
  lead: 'Our commitment, what this website does to meet it, and the parts we know are not there yet.',
  sections: [
    {
      id: 'commitment',
      heading: 'Our commitment',
      blocks: [
        {
          kind: 'p',
          text: 'Flite Transport is committed to providing goods, services and information in a way that respects the dignity and independence of people with disabilities, and to meeting our obligations under the Accessibility for Ontarians with Disabilities Act, 2005 (AODA) and its Integrated Accessibility Standards.',
        },
        {
          kind: 'p',
          text: 'That commitment covers how we deal with customers and their recipients at the doorstep, not only how this website behaves.',
        },
      ],
    },
    {
      id: 'standard',
      heading: 'The standard we build to',
      blocks: [
        {
          kind: 'p',
          text: 'This website is built to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. The Integrated Accessibility Standards Regulation references WCAG 2.0 Level AA; 2.1 includes everything in 2.0 and adds criteria covering mobile, low vision and cognitive access, so building to it satisfies the regulation and then some.',
        },
      ],
    },
    {
      id: 'measures',
      heading: 'What has been done',
      blocks: [
        {
          kind: 'p',
          text: 'Accessibility was designed in rather than retrofitted. Specifically:',
        },
        {
          kind: 'list',
          items: [
            'Everything on the site is real text. The scroll sequences are illustrated with photography, but every word they carry exists in the page and can be read with images off, with a screen reader, or with styles disabled.',
            'Pages use one main heading and an ordered heading structure, with landmarks for the header, main content and footer, and a skip link that takes you straight past the navigation.',
            'Every interactive element is reachable and operable by keyboard, and shows a visible focus ring that is never removed.',
            'Colour contrast meets Level AA in both the light and dark appearances, and body text targets the stricter Level AAA ratio. Colour is never the only way information is conveyed.',
            'Form fields have visible labels above them rather than placeholder text, errors appear in words next to the field they concern, and focus moves to the first field that needs fixing.',
            'The site honours the reduced-motion setting in your operating system. With it on, the scroll-driven sequences stop animating and render as ordinary stacked text and images. No content is reachable only by animating.',
            'Text reflows to a single column on small screens and stays legible when zoomed, and tap targets meet the minimum size on touch devices.',
            'Decorative canvases and the route graphic are hidden from assistive technology, because nothing exists only inside them.',
          ],
        },
      ],
    },
    {
      id: 'limitations',
      heading: 'What we know is not there yet',
      blocks: [
        {
          kind: 'p',
          text: 'A statement that claims everything is perfect is not worth reading. These are the current gaps:',
        },
        {
          kind: 'list',
          items: [
            'This site has not yet been audited by an independent accessibility specialist, and no conformance claim here has been externally verified.',
            'It has not yet been tested end to end with screen readers on physical devices. The work above was done to specification and checked in a browser.',
            'The home page is a long scroll-driven document. With reduced motion switched off it is heavier and busier than a conventional page, and some people will find the reduced-motion setting a better experience even without a vestibular condition.',
            'Third-party content we do not control, if any is ever embedded, may not meet the same standard.',
          ],
        },
        {
          kind: 'p',
          text: 'We would rather hear about a barrier than have you work around it. Anything you report gets looked at.',
        },
      ],
    },
    {
      id: 'formats',
      heading: 'Other formats and communication support',
      blocks: [
        {
          kind: 'p',
          text: 'If anything on this website is not accessible to you, we will provide it in another format, or in another way, on request and at no extra cost. That includes large print, plain text, accessible electronic documents, or simply reading it to you over the phone.',
        },
        {
          kind: 'p',
          text: 'We will agree the format with you rather than choosing on your behalf, and supply it as promptly as we can.',
        },
      ],
    },
    {
      id: 'feedback',
      heading: 'Feedback',
      blocks: [
        {
          kind: 'p',
          text: 'Tell us if you meet a barrier here, or in any dealing with us. Say what you were trying to do and what got in the way, and we will come back to you.',
        },
        {
          kind: 'list',
          items: [
            `Email ${mailto}`,
            `Phone ${tel}`,
            `Post: Accessibility Feedback, Flite Transport, ${postal}, Canada`,
          ],
        },
        {
          kind: 'p',
          text: 'Feedback can be given in whatever way works for you, including by phone if writing is difficult. We will reply in the same way unless you ask for another.',
        },
      ],
    },
    {
      id: 'status',
      heading: 'Status of this statement',
      blocks: [
        {
          kind: 'p',
          text: 'This statement was prepared on the date at the foot of this page, based on a review of the website by the team that built it. It will be revised when the site changes materially or when an independent audit has been carried out.',
        },
      ],
    },
  ],
};

/** Ordered as legalIndex is: privacy first, because it is the one people actually look for. */
export const legalDocs = { privacy, cookies, terms, accessibility } as const;

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return (legalDocs as Record<string, LegalDoc>)[slug];
}
