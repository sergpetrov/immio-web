import type { MouseEvent } from "react";

export interface SiteHeaderViewProps {
  appDownloadUrl: string;
  /** true on "/" itself: nav links become in-page anchors instead of "/#section". */
  isLanding: boolean;
  /** Solid/bordered header background. Static pages are always solid (no hero to sit over). */
  solid: boolean;
  navOpen: boolean;
  onToggleMenu?: () => void;
  onLogoClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onAnchorClick?: (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  onCtaClick?: () => void;
}

const NAV_LINKS: { id: "features" | "how-it-works" | "faq"; label: string }[] = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "faq", label: "FAQ" },
];

/**
 * Pure presentational header markup — no window/document references, so it
 * can be imported and renderToStaticMarkup'd by the Worker (which has no DOM
 * lib) as well as hydrated on the client. See SiteHeader.tsx for the
 * interactive (client-only) wrapper used on the landing page, and
 * pageShell.ts's inline script for how the mobile toggle works without
 * hydration on static pages.
 */
export default function SiteHeaderView({
  appDownloadUrl,
  isLanding,
  solid,
  navOpen,
  onToggleMenu,
  onLogoClick,
  onAnchorClick,
  onCtaClick,
}: SiteHeaderViewProps) {
  return (
    <header className={`site-header${solid ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="site-header__logo" href="/" onClick={onLogoClick} aria-label="Immio home">
          <img className="site-header__logo-icon" src="/logo.svg" alt="" width={36} height={36} />
          <img className="site-header__logo-wordmark" src="/logo_name.svg" alt="Immio" />
        </a>
        <nav id="site-header-menu" className={`site-header__links${navOpen ? " is-open" : ""}`} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              className="site-header__link"
              href={isLanding ? `#${link.id}` : `/#${link.id}`}
              onClick={onAnchorClick ? (event) => onAnchorClick(event, link.id) : undefined}
            >
              {link.label}
            </a>
          ))}
          {/* A real page rather than an in-page section, so it stays a plain
              link on the landing page too — no smooth-scroll handler. */}
          <a className="site-header__link" href="/rules" onClick={onCtaClick}>
            Rule Guide
          </a>
        </nav>
        <div className="site-header__actions">
          {!isLanding ? (
            <button type="button" className="site-header__theme" aria-label="Switch color mode">
              <svg
                className="site-header__theme-icon site-header__theme-icon--moon"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
                focusable="false"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg
                className="site-header__theme-icon site-header__theme-icon--sun"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
          ) : null}
          <a
            className="site-header__cta"
            href={appDownloadUrl}
            data-app-download
            data-app-source="header"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCtaClick}
          >
            {/* Same phone glyph (and 180° flip) as the rule-page bottom CTA. */}
            <svg
              className="site-header__cta-icon"
              viewBox="0 0 12 18"
              width={12}
              height={18}
              aria-hidden="true"
              focusable="false"
            >
              <rect x="0.75" y="0.75" width="10.5" height="16.5" rx="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="4" y="14.4" width="4" height="1.2" rx="0.6" fill="currentColor" />
            </svg>
            Get the app
          </a>
          <button
            type="button"
            className="site-header__toggle"
            aria-expanded={navOpen}
            aria-controls="site-header-menu"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={onToggleMenu}
          >
            <span className="site-header__hamburger" aria-hidden="true">
              <span className="site-header__hamburger-line" />
              <span className="site-header__hamburger-line" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
