import { useState } from "react";
import { Link } from "react-router-dom";
import { LandingHeroVisual } from "./LandingHeroVisual.tsx";
import "./LandingPage.css";

/** Tax Residency Tracker – Immio (US App Store). */
const IMMIO_APP_STORE_URL = "https://apps.apple.com/us/app/tax-residency-tracker-immio/id6747927306";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Do I need an account or email to use Immio?",
    a: "No. You can start immediately without sign-up or sign-in. Your travel data stays on your device or in your private iCloud — not on our servers tied to an account.",
  },
  {
    q: "How does automatic country and state tracking work?",
    a: "With optional geolocation enabled, your timeline updates with days spent in each country and U.S. state based on where you are. You can also build and edit your history manually. Works offline; there is no continuous location tracking service run by us.",
  },
  {
    q: "Can Immio replace my lawyer or tax advisor?",
    a: "No. Immio is an informational tool to help you count days, watch limits, and export records. Always consult a qualified legal or tax professional about your specific residency, visa, or filing obligations.",
  },
  {
    q: "What rules and limits can I track?",
    a: "Built-in patterns cover scenarios like the Schengen 90/180-day rule, U.S. Substantial Presence and Physical Presence tests, UK SRT-style thinking, Canada and Australia 183-day style limits, and many more — or create fully custom trackers for any country or requirement.",
  },
  {
    q: "Can I export my data for compliance or advisors?",
    a: "Yes. Generate a detailed CSV report for your own records or to share with advisors. Use it alongside Google Sheets or Excel for tax and immigration documentation.",
  },
];

const FEATURES = [
  {
    title: "Automatic day tracking",
    body: "Optional geolocation keeps your timeline updated with days in each country and 300+ jurisdictions, including U.S. states — so you spend less time counting stamps.",
  },
  {
    title: "Smart stay-limit trackers",
    body: "Monitor max or min presence and absence against rolling, annual, or fixed windows. Watch Schengen, visa caps, tax-residency thresholds, or define your own rules.",
  },
  {
    title: "Trip timeline & stats",
    body: "See past and future trips, visited countries, length of each stay, and residency context in one organized view.",
  },
  {
    title: "Plan upcoming travel",
    body: "Add future trips to preview projected day counts and how each trip fits your limits before you book.",
  },
  {
    title: "Reports & privacy",
    body: "Export CSV for compliance workflows. Data stays on-device or in your private iCloud; no account required.",
  },
];

type Plan = {
  name: string;
  price: string;
  /** Shown next to price (e.g. “/ month”). Omit for one-time pricing. */
  period?: string;
  tagline: string;
  cta: string;
  highlight: boolean;
  badge?: string;
  outlineCta?: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Monthly",
    price: "$4.99",
    period: "/ month",
    tagline: "Full access with the flexibility to cancel anytime.",
    cta: "Get on the App Store",
    highlight: false,
    features: [
      "All tracker and timeline features",
      "Schengen and custom rule setups",
      "CSV export",
      "14-day free trial for new subscribers",
    ],
  },
  {
    name: "Annual",
    price: "$29.99",
    period: "/ year",
    tagline: "Best value for year-round travelers and expats.",
    cta: "Get on the App Store",
    highlight: true,
    badge: "Best value",
    features: [
      "Everything in Monthly",
      "Lower equivalent monthly cost",
      "Same privacy: on-device / your iCloud",
      "14-day free trial for new subscribers",
    ],
  },
  {
    name: "Lifetime",
    price: "$89.99",
    tagline: "Pay once and keep Immio as long as you use the app.",
    cta: "Get on the App Store",
    highlight: false,
    outlineCta: true,
    features: [
      "Permanent access to current feature set",
      "Ideal if you travel long-term",
      "Updates included as long as the product is offered",
      "14-day free trial for new subscribers",
    ],
  },
];

/** Immio marketing landing (Tax Residency Tracker). */
export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="immio-landing">
      <header className="immio-landing-nav">
        <div className="immio-landing-nav__inner">
          <a className="immio-landing-logo" href="#top" onClick={() => setNavOpen(false)} aria-label="Immio home">
            <img className="immio-landing-logo__icon" src="/logo.svg" alt="" width={42} height={42} />
            <img className="immio-landing-logo__wordmark" src="/logo_name.svg" alt="Immio" />
          </a>
          <button
            type="button"
            className="immio-landing-nav__toggle"
            aria-expanded={navOpen}
            aria-controls="immio-landing-nav-menu"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="immio-landing-nav__hamburger" aria-hidden="true">
              <span className="immio-landing-nav__hamburger-line" />
              <span className="immio-landing-nav__hamburger-line" />
              <span className="immio-landing-nav__hamburger-line" />
            </span>
          </button>
          <nav
            id="immio-landing-nav-menu"
            className={`immio-landing-nav__links${navOpen ? " is-open" : ""}`}
            aria-label="Primary"
          >
            <a className="immio-landing-nav__link" href="#features" onClick={() => setNavOpen(false)}>
              Features
            </a>
            <a className="immio-landing-nav__link" href="#pricing" onClick={() => setNavOpen(false)}>
              Pricing
            </a>
            <a className="immio-landing-nav__link" href="#faq" onClick={() => setNavOpen(false)}>
              FAQ
            </a>
            <a
              className="immio-landing-nav__cta"
              href={IMMIO_APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setNavOpen(false)}
            >
              Get the app
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="immio-landing-hero" aria-labelledby="immio-landing-hero-heading">
          <div className="immio-landing-hero__inner">
            <div className="immio-landing-hero__content">
              <div className="immio-landing-hero__title-wrap">
                <h1 id="immio-landing-hero-heading" className="immio-landing-hero__title">
                  Professional Tool for Global Living and Compliance
                </h1>
                <p className="immio-landing-hero__subtitle">
                  Track visa limits, tax residency, and travel days to stay compliant with global tax and immigration
                  rules.
                </p>
              </div>
              <div className="immio-landing-hero__stores">
                <a
                  className="immio-landing-store-btn"
                  href={IMMIO_APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Tax Residency Tracker on the App Store"
                >
                  <img src="/immio/app-store-badge.svg" alt="" width={113} height={30} />
                </a>
                {/*<div className="immio-landing-hero__store-play">
                  <span
                    className="immio-landing-store-btn immio-landing-store-btn--disabled immio-landing-store-btn--play"
                    aria-disabled="true"
                    aria-label="Google Play — coming soon"
                  >
                    <img src="/immio/google-play-badge.svg" alt="" width={108} height={26} />
                  </span>
                </div>*/}
              </div>
            </div>

            <div className="immio-landing-hero__visualWrap">
              <LandingHeroVisual />
            </div>
          </div>
        </section>

        <section className="immio-landing-section immio-landing-section--features" id="features" aria-labelledby="features-heading">
          <div className="immio-landing-section__header">
            <h2 id="features-heading" className="immio-landing-section__title">
              Everything you need to track residency and travel limits
            </h2>
          </div>
          <div className="immio-landing-features__grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="immio-landing-feature-card">
                <h3 className="immio-landing-feature-card__title">{f.title}</h3>
                <p className="immio-landing-feature-card__desc">{f.body}</p>
                <div className="immio-landing-feature-card__art" />
              </article>
            ))}
          </div>
        </section>

        <div className="immio-landing-section--pricing" id="pricing">
          <div className="immio-landing-section__inner">
            <div className="immio-landing-section__header">
              <h2 className="immio-landing-section__title">Simple pricing on the App Store</h2>
            </div>
            <div className="immio-landing-pricing__grid">
              {PLANS.map((p) => (
                <article
                  key={p.name}
                  className={`immio-landing-price-card${p.highlight ? " immio-landing-price-card--highlight" : ""}`}
                >
                  {p.badge ? <span className="immio-landing-price-card__badge">{p.badge}</span> : null}
                  <h3 className="immio-landing-price-card__name">{p.name}</h3>
                  <div className="immio-landing-price-card__price">
                    <span className="immio-landing-price-card__amount">{p.price}</span>
                    {p.period ? <span className="immio-landing-price-card__period">{p.period}</span> : null}
                  </div>
                  <p className="immio-landing-price-card__tagline">{p.tagline}</p>
                  <a
                    className={`immio-landing-price-card__cta${p.outlineCta ? " immio-landing-price-card__cta--outline" : ""}`}
                    href={IMMIO_APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.cta}
                  </a>
                  <ul className="immio-landing-price-card__list">
                    {p.features.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <section className="immio-landing-section" id="faq" aria-labelledby="faq-heading">
          <div className="immio-landing-section__header">
            <h2 id="faq-heading" className="immio-landing-section__title">
              Questions about Immio
            </h2>
          </div>
          <div className="immio-landing-faq__list">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              const triggerId = `faq-trigger-${i}`;
              const panelId = `faq-panel-${i}`;
              return (
                <div key={item.q} className={`immio-landing-faq__item${isOpen ? " is-open" : ""}`}>
                  <button
                    type="button"
                    id={triggerId}
                    className="immio-landing-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="immio-landing-faq__icon" aria-hidden />
                  </button>
                  <div
                    id={panelId}
                    className="immio-landing-faq__panel"
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                  >
                    <div className="immio-landing-faq__panel-inner">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="immio-landing-footer">
        <div className="immio-landing-footer__inner">
          <div>
            <p className="immio-landing-footer__contact-label">Contact us at</p>
            <a className="immio-landing-footer__email" href="mailto:support@immio.app">
              support@immio.app
            </a>
          </div>
          <div className="immio-landing-footer__cols">
            <div className="immio-landing-footer__col">
              <a className="immio-landing-footer__link" href="#top">
                Home
              </a>
              <a className="immio-landing-footer__link" href="#pricing">
                Pricing
              </a>
              <Link className="immio-landing-footer__link" to="/contact">
                Contact
              </Link>
            </div>
            <div className="immio-landing-footer__col">
              <a className="immio-landing-footer__link" href="#faq">
                FAQ
              </a>
              <Link className="immio-landing-footer__link" to="/terms">
                Terms
              </Link>
              <Link className="immio-landing-footer__link" to="/privacy">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
