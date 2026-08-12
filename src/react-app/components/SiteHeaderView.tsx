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
            <span className="site-header__hamburger-line" />
          </span>
        </button>
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
          <a
            className="site-header__cta"
            href={appDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCtaClick}
          >
            Get the app
          </a>
        </nav>
      </div>
    </header>
  );
}
