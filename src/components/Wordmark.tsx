/**
 * The real Flite Transport wordmark, not a redraw.
 *
 * Two files ship because the mark has black lettering in one and white in the other, while the
 * chevrons stay brand red in both. Which one shows is decided by CSS on the theme, so the
 * switch costs no JavaScript and cannot flash the wrong mark on load.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      <img
        className="wordmark__img wordmark__img--on-light"
        src="/brand/logo-dark-text.png"
        alt="Flite Transport"
        width={1200}
        height={186}
      />
      <img
        className="wordmark__img wordmark__img--on-dark"
        src="/brand/logo-light-text.png"
        alt=""
        aria-hidden="true"
        width={1200}
        height={186}
      />
    </span>
  );
}
