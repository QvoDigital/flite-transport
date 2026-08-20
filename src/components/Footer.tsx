import { Wordmark } from './Wordmark';
import { handleBeatLink } from '../lib/sequence';
import { requestPreferences } from '../lib/consent';
import { about, contact, nav, social } from '../content/site';
import { legalIndex } from '../content/legal-index';

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

        {/*
          Its own column rather than a line of grey text under the copyright. These four are the
          pages a visitor goes looking for when they have already decided something is wrong, and
          burying them is how a site signals it would rather they did not read them.
        */}
        <nav className="footer__nav" aria-label="Legal">
          <h2 className="footer__title">Legal</h2>
          <ul>
            {legalIndex.map((item) => (
              <li key={item.slug}>
                <a href={item.path}>{item.navLabel}</a>
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
        <div className="shell footer__baseInner">
          <span>&copy; {year} Flite Transport. All rights reserved.</span>

          {/*
            A button, not a link: it changes state on this page rather than navigating, and a link
            that goes nowhere is a lie to anyone reading the page with a screen reader. Consent has
            to be as easy to withdraw as it was to give, which means this cannot be buried inside
            the cookie policy.
          */}
          <button type="button" className="footer__prefs" onClick={requestPreferences}>
            Cookie preferences
          </button>
        </div>
      </div>
    </footer>
  );
}
