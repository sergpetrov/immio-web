import {useState} from "react";
import {Link} from "react-router-dom";
import {LandingHeroVisual} from "./LandingHeroVisual.tsx";
import "./LandingPage.css";

/** Tax Residency Tracker – Immio (US App Store). */
const IMMIO_APP_STORE_URL = "https://apps.apple.com/us/app/tax-residency-tracker-immio/id6747927306";

const FAQ_ITEMS: { q: string; a: string }[] = [
    {
        q: "How is Immio different from a simple day-counting app?",
        a: "Immio is designed for ongoing compliance – not just counting days. It combines automatic travel tracking, jurisdiction-specific rule monitoring, future trip planning, alerts, and exportable reports in one place.",
    },
    {
        q: "Can Immio help me avoid accidental tax residency or visa overstays?",
        a: "Yes. Immio helps you monitor days against the rules you care about, including tax residency thresholds, Schengen calculations, and custom stay limits, so you can act before crossing a line.",
    },
    {
        q: "What rules can I track in the app?",
        a: "You can track common patterns like Schengen 90/180, 183-day style tax residency tests, UK-style fiscal periods, U.S. state presence, and your own custom presence or absence limits across countries and regions.",
    },
    {
        q: "Can I plan future trips before I book them?",
        a: "Yes. You can add upcoming travel to see how planned trips affect your day counts, remaining allowance, and residency position before those days actually happen.",
    },
    {
        q: "Can I add past trips and import existing travel history?",
        a: "Yes. You can add past trips manually or import them from a spreadsheet (CSV, Google Sheets, or Excel). Also, if you regularly take photos while traveling, we can also help reconstruct your trip history from your Photo Library using timestamp and location metadata. This processing happens locally on your device – your photos never leave your device.",
    },
    {
        q: "Can I export records for my accountant, lawyer, or immigration case?",
        a: "Yes. Immio can generate CSV exports you can review yourself or share with advisors when you need a structured record of your travel history and day counts.",
    },
    {
        q: "Where is my data stored?",
        a: "Your travel data stays on your device and, if you enable it, in your personal iCloud account. Immio does not require an account and is designed to keep sensitive travel history out of a central company database.",
    },
];

const FEATURES = [
    {
        title: "Automatic travel tracking",
        body: "Keep a live record of where you have been across countries and U.S. states without rebuilding your timeline by hand every time you cross a border.",
    },
    {
        title: "Tax Residency, Visa Limits, and Schengen rules",
        body: "Track rolling windows, fiscal-year thresholds, and custom stay limits so you can monitor tax residency exposure and immigration rules in one place.",
    },
    {
        title: "Future trip simulation",
        body: "Preview planned travel before you book it and see how each upcoming trip changes your remaining days, thresholds, and compliance runway.",
    },
    {
        title: "Audit-ready records",
        body: "Keep a clear travel history with structured exports you can review yourself or share with accountants, lawyers, and immigration advisors when needed.",
    },
    {
        title: "Private by design",
        body: "Store sensitive travel data on your device and in your personal iCloud account instead of relying on a central account-based service.",
    },
];


/*type Plan = {
    name: string;
    price: string;
    /!** Shown next to price (e.g. “/ month”). Omit for one-time pricing. *!/
    period?: string;
    tagline: string;
    cta: string;
    highlight: boolean;
    badge?: string;
    outlineCta?: boolean;
    features: string[];
};*/

/*
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
*/

/** Immio marketing landing (Tax Residency Tracker). */
export default function LandingPage() {
    const [navOpen, setNavOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="immio-landing">
            <header className="immio-landing-nav">
                <div className="immio-landing-nav__inner">
                    <a
                        className="immio-landing-logo"
                        href="/"
                        onClick={(event) => {
                            event.preventDefault();
                            setNavOpen(false);
                            window.history.replaceState(null, "", "/");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        aria-label="Immio home"
                    >
                        <img className="immio-landing-logo__icon" src="/logo.svg" alt="" width={42} height={42}/>
                        <img className="immio-landing-logo__wordmark" src="/logo_name.svg" alt="Immio"/>
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
              <span className="immio-landing-nav__hamburger-line"/>
              <span className="immio-landing-nav__hamburger-line"/>
              <span className="immio-landing-nav__hamburger-line"/>
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
                                    Track visa limits, tax residency, and travel days to stay compliant with global tax
                                    and immigration
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
                                    <img src="/immio/app-store-badge.svg" alt="" width={113} height={30}/>
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
                            <LandingHeroVisual/>
                        </div>
                    </div>
                </section>

                <section className="immio-landing-section immio-landing-section--features" id="features" aria-labelledby="features-heading">
                    <div className="immio-landing-section__header">
                        <span className="immio-landing-section__chip">Features</span>
                        <h2 id="features-heading" className="immio-landing-section__title">
                            Everything you need to track residency and travel limits
                        </h2>
                    </div>
                    <div className="immio-landing-features__grid">
                        {FEATURES.map((feature, index) => (
                            <article
                                key={feature.title}
                                className={`immio-landing-feature-card immio-landing-feature-card--${index < 3 ? "top" : "bottom"}`}
                            >
                                <h3 className="immio-landing-feature-card__title">{feature.title}</h3>
                                <p className="immio-landing-feature-card__desc">{feature.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="immio-landing-section" id="faq" aria-labelledby="faq-heading">
                    <div className="immio-landing-section__header">
                        <span className="immio-landing-section__chip">FAQ</span>
                        <h2 id="faq-heading" className="immio-landing-section__title">
                            All you need to know
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

                {/*<div className="immio-landing-section--pricing" id="pricing">
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
        </section>*/}
            </main>

            <footer className="immio-landing-footer">
                <div className="immio-landing-footer__inner">
                    <div>
                        <p className="immio-landing-footer__contact-label">Contact us</p>
                        <a className="immio-landing-footer__email" href="mailto:support@immio.app">
                            support@immio.app
                        </a>
                    </div>
                    <div className="immio-landing-footer__cols">
                        <div className="immio-landing-footer__col">
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
