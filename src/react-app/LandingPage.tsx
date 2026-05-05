import type {CSSProperties, MouseEvent} from "react";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {LandingHeroVisual} from "./LandingHeroVisual.tsx";
import "./LandingPage.css";

/** Tax Residency Tracker – Immio (US App Store). */
const IMMIO_APP_STORE_URL = "https://apps.apple.com/us/app/tax-residency-tracker-immio/id6747927306";

type TrackerTiltStyle = CSSProperties & {
    "--tracker-front-rotate": string;
    "--tracker-back-rotate": string;
};

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
        title: "Automatic Trip Tracking",
        body: "Immio automatically detects where you have been and logs it to your travel timeline",
        imageSrc: "/immio/features/automatic-trip-tracking.webp",
        imageAlt: "Automatic Trip Tracking",
    },
    {
        title: "Stay Limit Trackers",
        body: "Stay ahead of visa deadlines, tax thresholds, and residency rules",
        layeredImages: [
            {
                src: "/immio/features/tracker-1.webp",
                alt: "Tracker 1",
                className: "immio-landing-feature-card__tracker-image--front",
            },
            {
                src: "/immio/features/tracker-2.webp",
                alt: "Tracker 2",
                className: "immio-landing-feature-card__tracker-image--back",
            },
        ],
    },
    {
        title: "Travel Statistics",
        body: "Instantly see where you've been and how long you stayed",
        imageSrc: "/immio/features/statistics.webp",
        imageAlt: "Travel Statistics",
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

const HASH_SCROLL_STORAGE_KEY = "immio-landing-scroll";


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
    const [navScrolled, setNavScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [trackerAnimationPlayed, setTrackerAnimationPlayed] = useState(false);
    const trackerCardRef = useRef<HTMLElement | null>(null);

    const handleNavAnchorClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: "features" | "faq") => {
        event.preventDefault();
        setNavOpen(false);

        const target = document.getElementById(sectionId);
        if (!target) {
            return;
        }

        target.scrollIntoView({behavior: "smooth", block: "start"});
        window.history.pushState(null, "", `#${sectionId}`);
    };

    useEffect(() => {
        if (!window.location.hash) {
            return;
        }

        const storageKey = `${HASH_SCROLL_STORAGE_KEY}:${window.location.pathname}`;
        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";

        const persistScrollPosition = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            window.sessionStorage.setItem(storageKey, `${Math.round(scrollTop)}`);
        };

        const restoreScrollPosition = () => {
            const storedValue = window.sessionStorage.getItem(storageKey);
            const parsedValue = storedValue ? Number(storedValue) : NaN;

            if (!Number.isFinite(parsedValue)) {
                return;
            }

            window.scrollTo({top: parsedValue, left: 0, behavior: "auto"});
        };

        restoreScrollPosition();
        const rafId = window.requestAnimationFrame(restoreScrollPosition);

        window.addEventListener("pagehide", persistScrollPosition);
        window.addEventListener("beforeunload", persistScrollPosition);

        return () => {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener("pagehide", persistScrollPosition);
            window.removeEventListener("beforeunload", persistScrollPosition);
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    useEffect(() => {
        const syncNavScrolled = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setNavScrolled(scrollTop > 0);
        };

        syncNavScrolled();
        window.addEventListener("scroll", syncNavScrolled, {passive: true});

        return () => {
            window.removeEventListener("scroll", syncNavScrolled);
        };
    }, []);

    useEffect(() => {
        const trackerCard = trackerCardRef.current;

        if (!trackerCard || trackerAnimationPlayed) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (!entry?.isIntersecting || entry.intersectionRatio < 0.7) {
                    return;
                }

                setTrackerAnimationPlayed(true);
                observer.disconnect();
            },
            {
                threshold: 0.7,
            }
        );

        observer.observe(trackerCard);

        return () => {
            observer.disconnect();
        };
    }, [trackerAnimationPlayed]);

    return (
        <div className="immio-landing">
                        <header className={`immio-landing-nav${navScrolled ? " is-scrolled" : ""}`}>
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
                        <a
                            className="immio-landing-nav__link"
                            href="#features"
                            onClick={(event) => handleNavAnchorClick(event, "features")}
                        >
                            Features
                        </a>
                        <a
                            className="immio-landing-nav__link"
                            href="#faq"
                            onClick={(event) => handleNavAnchorClick(event, "faq")}
                        >
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
                                    Your All-in-One Tax Residency & Compliance Tracker
                                </h1>
                                <p className="immio-landing-hero__subtitle">
                                    Track visa limits, tax residency, and travel days to stay compliant with global tax and immigration rules
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

                <section
                    className="immio-landing-section immio-landing-section--features"
                    id="features-section"
                    aria-labelledby="features-heading"
                >
                    <div id="features" className="immio-landing-section__header immio-landing-section__header--anchor">
                        <span className="immio-landing-section__chip">Features</span>
                        <h2 id="features-heading" className="immio-landing-section__title">
                            Professional tools to keep your travel days under control
                        </h2>
                    </div>
                    <div className="immio-landing-features__grid">
                        {FEATURES.map((feature, index) => (
                            <article
                                key={feature.title}
                                ref={feature.title === "Stay Limit Trackers" ? trackerCardRef : undefined}
                                className={`immio-landing-feature-card immio-landing-feature-card--${index < 3 ? "top" : "bottom"}${feature.imageSrc || feature.layeredImages ? " immio-landing-feature-card--with-media" : ""}${feature.layeredImages ? " immio-landing-feature-card--trackers" : ""}`}
                            >
                                <div className="immio-landing-feature-card__copy">
                                    <h3 className="immio-landing-feature-card__title">{feature.title}</h3>
                                    <p className="immio-landing-feature-card__desc">{feature.body}</p>
                                </div>
                                {feature.layeredImages ? (
                                    <div
                                        className="immio-landing-feature-card__media immio-landing-feature-card__media--trackers"
                                        style={{
                                            "--tracker-front-rotate": trackerAnimationPlayed ? "-6deg" : "0deg",
                                            "--tracker-back-rotate": trackerAnimationPlayed ? "6deg" : "0deg",
                                        } as TrackerTiltStyle}
                                    >
                                        {feature.layeredImages.map((image) => (
                                            <img
                                                key={image.src}
                                                className={`immio-landing-feature-card__tracker-image ${image.className}`}
                                                src={image.src}
                                                alt={image.alt}
                                            />
                                        ))}
                                    </div>
                                ) : feature.imageSrc ? (
                                    <div className="immio-landing-feature-card__media">
                                        <img
                                            className="immio-landing-feature-card__image"
                                            src={feature.imageSrc}
                                            alt={feature.imageAlt ?? ""}
                                        />
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </section>

                <section className="immio-landing-section" id="faq-section" aria-labelledby="faq-heading">
                    <div id="faq" className="immio-landing-section__header immio-landing-section__header--anchor">
                        <span className="immio-landing-section__chip">FAQ</span>
                        <h2 id="faq-heading" className="immio-landing-section__title">
                            All you need to know
                        </h2>
                    </div>
                    <div className="immio-landing-faq__list">
                        {FAQ_ITEMS.map((item, index) => {
                            const isOpen = openFaq === index;
                            const triggerId = `faq-trigger-${index}`;
                            const panelId = `faq-panel-${index}`;

                            return (
                                <div key={item.q} className={`immio-landing-faq__item${isOpen ? " is-open" : ""}`}>
                                    <button
                                        type="button"
                                        id={triggerId}
                                        className="immio-landing-faq__trigger"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                    >
                                        <span>{item.q}</span>
                                        <span className="immio-landing-faq__icon" aria-hidden={true}/>
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
