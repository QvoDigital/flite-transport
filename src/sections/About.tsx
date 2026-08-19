import { about } from '../content/site';

/**
 * Full-bleed editorial text, no media.
 *
 * This is the one section on the page that is only words. After the pinned opening and the
 * capability shot, a plain wide-measure statement is the change of pace, and it is where the
 * company's own claim about itself gets to stand on its own.
 */
export function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <div className="about__inner shell">
        <h2 id="about-heading" className="about__heading reveal">
          An extension of your business
        </h2>

        <div className="about__body">
          <p className="about__lead reveal">{about.lead}</p>
          <p className="reveal">{about.standards}</p>
          <p className="reveal">{about.drivers}</p>
          <p className="about__closing reveal">{about.closing}</p>
        </div>
      </div>
    </section>
  );
}
