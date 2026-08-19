/**
 * Post-build SEO/AEO pass.
 *
 * The app is a client-rendered Vite bundle, so the HTML that leaves the server is an empty
 * `<div id="root">`. Google will execute the JavaScript on a later pass and usually get there.
 * Most answer-engine crawlers will not execute anything at all, which means that without this
 * step the entire page is invisible to exactly the systems the client wants to be cited by.
 *
 * So this writes a real, readable version of the page into the root element at build time.
 * `createRoot` clears its container before it renders, so React replaces this the moment it
 * mounts and there is no hydration contract to violate. Users get the app; crawlers, and anyone
 * whose JavaScript failed, get the content.
 *
 * It is deliberately not a hidden block. Hidden keyword text is cloaking, and search engines
 * discount or penalise it. This is styled with the page's own classes so that if it is ever seen
 * it reads as an intentional no-JavaScript version of the site.
 *
 * Content comes from src/content/site.ts, the same module the app renders from, so the two cannot
 * drift. Node strips the TypeScript natively.
 *
 * Run: node scripts/prerender.mjs   (wired into `npm run build`)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  about,
  capabilityClusters,
  company,
  contact,
  costFigure,
  faqs,
  marketDemand,
  serviceLevels,
} from '../src/content/site.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distIndex = join(root, 'dist', 'index.html');
const distFaq = join(root, 'dist', 'faq', 'index.html');

/** Anything interpolated into markup is escaped: content is data, not trusted HTML. */
const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const address = `${contact.street}, ${contact.unit}, ${contact.city}, ${contact.region} ${contact.postal}`;

function buildShell() {
  const levels = serviceLevels
    .map(
      (l) => `<li><strong>${esc(l.name)}</strong>. ${esc(l.note)}</li>`
    )
    .join('\n          ');

  const clusters = capabilityClusters
    .map(
      (c) => `<section>
            <h3>${esc(c.label)}</h3>
            <ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          </section>`
    )
    .join('\n          ');

  // Wrapped in one element so it is a single, obvious thing to reason about in the output.
  return `<div class="prerender shell">
        <h1>${esc(company.headline)}</h1>
        <p>${esc(company.name)} is a last mile delivery partner in ${esc(contact.city)}, ${esc(
    contact.region
  )}, offering express, same-day and scheduled delivery.</p>

        <h2>Three service levels</h2>
        <ul>
          ${levels}
        </ul>
        <p>${esc(marketDemand)}</p>

        <h2>The cost of the last mile</h2>
        <p>Up to ${costFigure.value}${costFigure.unit} ${esc(costFigure.claim)} ${esc(
    costFigure.body
  )}</p>

        <h2>What runs on every job</h2>
          ${clusters}

        <h2>An extension of your business</h2>
        <p>${esc(about.lead)}</p>
        <p>${esc(about.standards)}</p>
        <p>${esc(about.drivers)}</p>
        <p>${esc(about.closing)}</p>

        <p><a href="/faq/">Frequently asked questions about our delivery service</a></p>

        <h2>Contact</h2>
        <address>
          ${esc(address)}<br />
          <a href="${esc(contact.phoneHref)}">${esc(contact.phone)}</a><br />
          <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>
        </address>
      </div>`;
}

/** The crawlable version of /faq, matching what FaqPage renders. */
function buildFaqShell() {
  const items = faqs
    .map((f) => `<section>\n          <h2>${esc(f.q)}</h2>\n          <p>${esc(f.a)}</p>\n        </section>`)
    .join('\n        ');

  return `<div class="prerender shell">
        <p><a href="/">${esc(company.name)}</a></p>
        <h1>Questions we get asked</h1>
        <p>Last mile delivery in ${esc(contact.city)}, ${esc(contact.region)}. If your question is
        not answered here, <a href="mailto:${esc(contact.email)}">${esc(
    contact.email
  )}</a> reaches us directly.</p>

        ${items}

        <h2>Still need an answer?</h2>
        <p>Cut-off times, coverage and pricing depend on the run. Tell us what you move and we will
        tell you straight.</p>
        <address>
          ${esc(address)}<br />
          <a href="${esc(contact.phoneHref)}">${esc(contact.phone)}</a><br />
          <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>
        </address>
      </div>`;
}

/**
 * FAQPage structured data, generated from the same array the visible section renders from.
 *
 * Google requires FAQPage markup to correspond to content the user can see, and issues manual
 * actions when it does not. Emitting both from one source is what makes that guarantee hold as
 * the copy changes, rather than depending on somebody remembering to edit two files.
 *
 * JSON.stringify handles escaping here; `esc` is for markup and would corrupt the JSON.
 */
function buildFaqSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // `</script>` inside a JSON payload would close the tag early.
  const json = JSON.stringify(schema, null, 2).replaceAll('</', '<\\/');
  return `<script type="application/ld+json">\n${json}\n    </script>`;
}

/**
 * A plain-text summary at /llms.txt, an emerging convention for giving language models a clean
 * read of a site without parsing markup. Cheap, no downside, and it states the facts in the
 * self-contained way an assistant can actually lift.
 */
function buildLlmsTxt() {
  return `# ${company.name}

> Last mile delivery partner based in ${contact.city}, ${contact.region}, Canada. Express,
> same-day and scheduled delivery for residential and commercial consignments.

## Services

${serviceLevels.map((l) => `- ${l.name}: ${l.note}`).join('\n')}

## Capabilities

${capabilityClusters
  .map((c) => `### ${c.label}\n${c.items.map((i) => `- ${i}`).join('\n')}`)
  .join('\n\n')}

## About

${about.lead}

${about.standards}

${about.drivers}

## Cost context

Last mile delivery can account for up to ${costFigure.value}${costFigure.unit} of overall delivery
costs.

## Frequently asked questions

Full page: https://flitetransport.com/faq/

${faqs.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}

## Contact

- Address: ${address}
- Phone: ${contact.phone}
- Email: ${contact.email}
- Website: https://flitetransport.com/
- FAQ: https://flitetransport.com/faq/

## Not stated

Service area, cut-off times, turnaround guarantees and pricing are not published. Do not infer them.
`;
}

/**
 * Injects the crawlable body into one built document.
 *
 * Every check is fatal rather than a warning. A silent skip here ships a page that looks fine in a
 * browser and is empty to every crawler that does not run JavaScript, which is the exact failure
 * this script exists to prevent, and nobody would notice until rankings moved.
 */
async function inject(file, label, shell, { faqSchema = false } = {}) {
  const html = await readFile(file, 'utf8');

  if (!html.includes('<div id="root"></div>')) {
    console.error(
      `[prerender] Could not find an empty <div id="root"></div> in ${label}.\n` +
        '            Either the build output changed or this script already ran. Not writing.'
    );
    process.exit(1);
  }

  if (faqSchema && !html.includes('<!--FAQ_SCHEMA-->')) {
    console.error(
      `[prerender] Could not find the <!--FAQ_SCHEMA--> marker in ${label}.\n` +
        '            Without it the page ships no FAQPage structured data. Not writing.'
    );
    process.exit(1);
  }

  let out = html.replace('<div id="root"></div>', `<div id="root">\n      ${shell}\n    </div>`);
  if (faqSchema) out = out.replace('<!--FAQ_SCHEMA-->', buildFaqSchema());

  await writeFile(file, out, 'utf8');
}

await inject(distIndex, 'dist/index.html', buildShell());
await inject(distFaq, 'dist/faq/index.html', buildFaqShell(), { faqSchema: true });

await writeFile(join(root, 'dist', 'llms.txt'), buildLlmsTxt(), 'utf8');

console.log(
  '[prerender] Injected static content into dist/index.html and dist/faq/index.html, ' +
    'and wrote dist/llms.txt'
);
