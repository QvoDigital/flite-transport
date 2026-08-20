import { ArrowRight } from '@phosphor-icons/react';
import { CookieBanner } from '../components/CookieBanner';
import { Footer } from '../components/Footer';
import { Masthead } from '../components/Masthead';
import { contact, cta } from '../content/site';
import { legalDocs, legalUpdatedLabel, type LegalBlock, type LegalDoc } from '../content/legal';
import { isExternal, tokenizeInline } from '../lib/inline';

/**
 * One component, four documents.
 *
 * Privacy, cookies, terms and accessibility are the same shape: a long ordered read that people
 * arrive at with one specific question. Building four page components would mean four places to
 * fix a heading level, so the copy lives in src/content/legal.ts and this renders whichever one
 * the entry point hands it.
 *
 * Each is still its own document with its own URL, title and canonical, for the same reason /faq
 * is: a legal page nobody can link to directly is a legal page nobody can rely on.
 *
 * The layout is a sticky contents rail beside the prose. That is not decoration on a document this
 * long: the reason someone opens a privacy policy is almost always a single question, and a rail
 * turns a scroll hunt into one click. It is also the eighth distinct layout family on the site, so
 * it does not repeat one the marketing pages already use.
 */

function Inline({ text }: { text: string }) {
  return (
    <>
      {tokenizeInline(text).map((token, i) =>
        token.t === 'text' ? (
          token.v
        ) : (
          <a
            key={i}
            href={token.href}
            {...(isExternal(token.href) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            {token.v}
          </a>
        )
      )}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === 'p') {
    return (
      <p>
        <Inline text={block.text} />
      </p>
    );
  }

  if (block.kind === 'list') {
    return (
      <ul className="legal__list">
        {block.items.map((item) => (
          <li key={item}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }

  // Wrapped so a narrow screen scrolls the table rather than the whole page.
  return (
    <div className="legal__tableWrap">
      <table className="legal__table">
        <thead>
          <tr>
            {block.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) =>
                /* First cell is the row's identity, so it is the row header. */
                i === 0 ? (
                  <th key={cell} scope="row">
                    <code>{cell}</code>
                  </th>
                ) : (
                  <td key={cell}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const others = Object.values(legalDocs).filter((d) => d.slug !== doc.slug);

  return (
    <div className="page">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <CookieBanner />

      <Masthead />

      <main id="main">
        <article className="legal">
          <header className="legal__head shell">
            <p className="legal__crumb">
              <a href="/">Flite Transport</a>
              <span aria-hidden="true"> / </span>
              <span>{doc.navLabel}</span>
            </p>
            <h1>{doc.title}</h1>
            <p className="legal__lead">{doc.lead}</p>
            <p className="legal__stamp">
              Last updated <time dateTime="2026-08-20">{legalUpdatedLabel}</time>
            </p>
          </header>

          <div className="legal__body shell">
            {/*
              Labelled `nav`, so a screen reader can skip the whole rail. On narrow screens it
              collapses above the prose rather than being hidden: on a phone a long document needs
              the jump links more, not less.
            */}
            <nav className="legal__toc" aria-labelledby="legal-toc-title">
              <h2 className="legal__tocTitle" id="legal-toc-title">
                On this page
              </h2>
              <ol>
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="legal__prose">
              {doc.sections.map((section) => (
                <section className="legal__section" id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  {section.blocks.map((block, i) => (
                    <Block block={block} key={i} />
                  ))}
                </section>
              ))}

              <aside className="legal__aside">
                <h2>Questions about any of this</h2>
                <p>
                  A policy you have to be a lawyer to query is not much use.{' '}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a> reaches us directly, and{' '}
                  <a href={contact.phoneHref}>{contact.phone}</a> reaches a person.
                </p>
                <a className="btn" href={cta.href}>
                  {cta.label}
                  <ArrowRight size={15} weight="bold" />
                </a>
              </aside>

              <nav className="legal__siblings" aria-label="Other legal documents">
                <h2 className="legal__tocTitle">The rest of it</h2>
                <ul>
                  {others.map((other) => (
                    <li key={other.slug}>
                      <a href={other.path}>{other.navLabel}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
