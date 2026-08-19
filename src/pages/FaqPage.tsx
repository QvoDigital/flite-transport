import { ArrowRight } from '@phosphor-icons/react';
import { Footer } from '../components/Footer';
import { Masthead } from '../components/Masthead';
import { contact, cta, faqs } from '../content/site';

/**
 * The FAQ, as its own document.
 *
 * It was a section on the home page and it is a page now for a search reason and a design reason,
 * and they happen to agree. A second indexable URL targeting question-shaped queries can rank on
 * its own, which one more section on a single-page site never could. And lifting it out leaves the
 * home page as an unbroken run of footage, which is what it was supposed to be.
 *
 * There is no scroll choreography here on purpose. This is the page someone lands on from a search
 * result wanting one specific answer, so it loads fast, reads plainly, and gets out of the way. No
 * GSAP, no frame sequences, no canvas.
 *
 * Answers are open rather than behind an accordion. An accordion would hide the exact text the
 * visitor came for, and hidden answers are worth less to answer engines than visible ones.
 */
export function FaqPage() {
  return (
    <div className="page">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Masthead />

      <main id="main">
        <article className="faqpage">
          <header className="faqpage__head shell">
            <p className="faqpage__crumb">
              <a href="/">Flite Transport</a>
            </p>
            <h1>Questions we get asked</h1>
            <p className="faqpage__lead">
              Last mile delivery in Burlington, Ontario. If your question is not answered here,{' '}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> reaches us directly.
            </p>
          </header>

          <div className="faq">
            <div className="faq__inner shell">
              <div className="faq__list">
                {faqs.map((item) => (
                  <section className="faq__item" key={item.q}>
                    <h2 className="faq__q">{item.q}</h2>
                    <p className="faq__a">{item.a}</p>
                  </section>
                ))}
              </div>
            </div>
          </div>

          {/* A reference page that dead-ends is a wasted arrival. */}
          <div className="faqpage__cta shell">
            <h2>Still need an answer?</h2>
            <p className="faqpage__ctaBody">
              Cut-off times, coverage and pricing depend on the run. Tell us what you move and we
              will tell you straight.
            </p>
            <a className="btn" href={cta.href}>
              {cta.label}
              <ArrowRight size={15} weight="bold" />
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
