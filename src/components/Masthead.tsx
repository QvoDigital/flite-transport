import { useEffect, useState } from 'react';
import { ArrowRight, List, Moon, Sun, X } from '@phosphor-icons/react';
import { Wordmark } from './Wordmark';
import { handleBeatLink } from '../lib/sequence';
import { cta, nav } from '../content/site';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function Masthead() {
  // Seeded from the DOM, which the inline script in index.html has already resolved before paint.
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('flite-theme', theme);
    } catch {
      // A blocked localStorage is not a reason to fail the toggle.
    }
  }, [theme]);

  // The open menu covers the page, so it has to release on Escape as well as on a link.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  function onNavClick(event: React.MouseEvent<HTMLAnchorElement>, beat?: string) {
    setMenuOpen(false);
    handleBeatLink(event, beat);
  }

  return (
    <header className="masthead">
      <div className="masthead__inner shell">
        {/* Root, not #top: from /faq the wordmark has to be a way back to the site. */}
        <a className="masthead__brand" href="/" aria-label="Flite Transport, home">
          <Wordmark />
        </a>

        <nav className="masthead__nav" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => onNavClick(event, 'beat' in item ? item.beat : undefined)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="masthead__actions">
          <button
            type="button"
            className="masthead__icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
          </button>

          <a className="btn masthead__cta" href={cta.href}>
            {cta.label}
            <ArrowRight size={15} weight="bold" />
          </a>

          <button
            type="button"
            className="masthead__icon masthead__burger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className="masthead__mobile" data-open={menuOpen} hidden={!menuOpen}>
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(event) => onNavClick(event, 'beat' in item ? item.beat : undefined)}
          >
            {item.label}
          </a>
        ))}
        <a className="btn" href={cta.href} onClick={() => setMenuOpen(false)}>
          {cta.label}
          <ArrowRight size={15} weight="bold" />
        </a>
      </div>
    </header>
  );
}
