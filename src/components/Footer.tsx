import { Wordmark } from './Wordmark';
import { handleBeatLink } from '../lib/sequence';
import { about, contact, nav, social } from '../content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner shell">
        <div className="footer__brand">
          <Wordmark className="wordmark--footer" />
          <p className="footer__blurb">{about.lead}</p>
          <ul className="footer__social">
            {social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer noopener">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <h2 className="footer__title">Quick links</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) =>
                    handleBeatLink(event, 'beat' in item ? item.beat : undefined)
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact">
          <h2 className="footer__title">Contact</h2>
          <address>
            {contact.street}
            <br />
            {contact.unit}
            <br />
            {contact.city}, {contact.region} {contact.postal}
            <br />
            <a href={contact.phoneHref}>{contact.phone}</a>
            <br />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </address>
        </div>
      </div>

      <div className="footer__base">
        <div className="shell">
          <span>
            &copy; {year} Flite Transport. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
