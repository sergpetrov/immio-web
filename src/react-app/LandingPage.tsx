import type {CSSProperties} from "react";
import {useEffect, useRef, useState} from "react";
import {ANDROID_STORE_ENABLED, IMMIO_APP_STORE_URL, IMMIO_GOOGLE_PLAY_URL, getAppDownloadUrlForUserAgent} from "./appStoreLinks.ts";
import {trackAppDownload} from "./analytics";
import FaqAccordion from "./components/FaqAccordion.tsx";
import SiteFooter from "./components/SiteFooter.tsx";
import SiteHeader from "./components/SiteHeader.tsx";
import {LandingHeroVisual} from "./LandingHeroVisual.tsx";
import "./LandingPage.css";

const getDeviceAppDownloadUrl = () => {
    if (typeof navigator === "undefined") {
        return IMMIO_APP_STORE_URL;
    }

    return getAppDownloadUrlForUserAgent(navigator.userAgent || "");
};

type TrackerTiltStyle = CSSProperties & {
    "--tracker-front-rotate": string;
    "--tracker-back-rotate": string;
};

// Mirrored as FAQPage JSON-LD in index.html — update both together. (The
// worker-rendered pages generate theirs from modules/content/rules/seo.ts;
// this page has no server render yet.)
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
        body: "Track rolling stay limits, annual tax residency, or any custom presence / absence rules",
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
        body: "Explore detailed travel statistics with flexible pre-built and custom date filters",
        imageSrc: "/immio/features/statistics.webp",
        imageAlt: "Travel Statistics",
    },
    {
        title: "Import Trips & Export Reports",
        body: "Import trips from a CSV spreadsheet or photos in seconds, and export audit-ready reports to self-review or share with professional advisors",
        imageSrc: "/immio/features/import-export.webp",
        imageAlt: "Import Trips & Export Reports",
        mediaSize: "compact" as const,
    },
    {
        title: "Smart Alerts",
        body: "Get notified before you reach tax residency thresholds, visa stay limits, or other immigration deadlines",
        imageSrc: "/immio/features/alerts.webp",
        imageAlt: "Smart Alerts",
    },
];

const HOW_IT_WORKS_STEPS = [
    {
        number: "01",
        title: "Build your travel timeline",
        body: "Add your countries of residence. Import trips from photos, a spreadsheet, or enter them manually. Turn on automatic geolocation tracking",
        caption: "No account required. 100% private, stored on device",
    },
    {
        number: "02",
        title: "Set trackers and turn on alerts",
        body: "Add pre-build or custom trackers that matter to you – tax, visa, residency. Smart alerts notify you before you hit a threshold.",
        caption: "300+ jurisdictions, including U.S. states",
    },
    {
        number: "03",
        title: "Get audit-ready reports",
        body: "Export a detailed report for tax and legal compliance. Share with advisors or perform your own analysis and record-keeping in Google Sheets or Excel.",
        caption: "Developed in consultation with professionals",
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
    const [heroTitleReady, setHeroTitleReady] = useState(false);
    const [trackerAnimationPlayed, setTrackerAnimationPlayed] = useState(false);
    const trackerCardRef = useRef<HTMLElement | null>(null);
    const appDownloadUrl = getDeviceAppDownloadUrl();

    useEffect(() => {
        let isMounted = true;
        const titleFont = "600 50px Inter";
        const titleText = "Your All-in-One Tax Residency & Compliance Tracker";

        const revealTitle = () => {
            if (isMounted) {
                setHeroTitleReady(true);
            }
        };

        if (!document.fonts) {
            revealTitle();
            return () => {
                isMounted = false;
            };
        }

        if (document.fonts.check(titleFont, titleText)) {
            revealTitle();
        } else {
            document.fonts.load(titleFont, titleText).finally(revealTitle);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    /*
      Landing on /#section from another page (a Rule Guide header link, say):
      the browser resolves the hash before React has rendered the sections, so
      it silently stays at the top. Re-align once the section exists, and keep
      re-aligning briefly as the hero fonts and images settle. Timers rather
      than rAF, so it also works if the tab starts in the background.
    */
    useEffect(() => {
        const targetId = window.location.hash.slice(1);

        if (!targetId) {
            return;
        }

        const alignToTarget = () => {
            document.getElementById(targetId)?.scrollIntoView({behavior: "auto", block: "start"});
        };

        alignToTarget();
        const timers = [0, 50, 150, 350, 700, 1200].map((delay) =>
            window.setTimeout(alignToTarget, delay),
        );

        return () => {
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);

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
            // An anchor the page actually has wins over the remembered
            // position: arriving at /#how-it-works should land on the section.
            if (document.getElementById(window.location.hash.slice(1))) {
                return;
            }

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
            <SiteHeader mode="landing" appDownloadUrl={appDownloadUrl}/>

            <main id="top">
                <section className="immio-landing-hero" aria-labelledby="immio-landing-hero-heading">
                    <div className="immio-landing-hero__inner">
                        <div className="immio-landing-hero__content">
                            <div className="immio-landing-hero__title-wrap">
                                <h1
                                    id="immio-landing-hero-heading"
                                    className={`immio-landing-hero__title${heroTitleReady ? " is-ready" : ""}`}
                                >
                                    Your All-in-One Tax Residency & Compliance Tracker
                                </h1>
                                <p className="immio-landing-hero__subtitle">
                                    Track visa limits, tax residency, and travel days to stay compliant with global tax
                                    and immigration rules
                                </p>
                            </div>
                            <div className="immio-landing-hero__stores">
                                <a
                                    className="immio-landing-store-btn"
                                    href={IMMIO_APP_STORE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Download Tax Residency Tracker on the App Store"
                                    onClick={() => trackAppDownload("ios", "hero")}
                                >
                                    <img src="/immio/app-store-badge.svg" alt="" width={113} height={30}/>
                                </a>
                                {/* TEMPORARY: hidden while ANDROID_STORE_ENABLED is off. */}
                                {ANDROID_STORE_ENABLED ? (
                                    <a
                                        className="immio-landing-store-btn immio-landing-store-btn--play"
                                        href={IMMIO_GOOGLE_PLAY_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Get Immio on Google Play"
                                        onClick={() => trackAppDownload("android", "hero")}
                                    >
                                        <img src="/immio/google-play-badge.svg" alt="" width={108} height={26}/>
                                    </a>
                                ) : null}
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
                                className={`immio-landing-feature-card immio-landing-feature-card--${index < 3 ? "top" : "bottom"}${feature.imageSrc || feature.layeredImages ? " immio-landing-feature-card--with-media" : ""}${feature.layeredImages ? " immio-landing-feature-card--trackers" : ""}${"mediaSize" in feature && feature.mediaSize === "compact" ? " immio-landing-feature-card--media-compact" : ""}`}
                            >
                                <div className="immio-landing-feature-card__copy">
                                    <h3 className="immio-landing-feature-card__title">{feature.title}</h3>
                                    <p className="immio-landing-feature-card__desc">{feature.body}</p>
                                </div>
                                {feature.layeredImages ? (
                                    <div
                                        className="immio-landing-feature-card__media immio-landing-feature-card__media--trackers"
                                        style={{
                                            "--tracker-front-rotate": trackerAnimationPlayed ? "-4deg" : "0deg",
                                            "--tracker-back-rotate": trackerAnimationPlayed ? "4deg" : "0deg",
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

                <section
                    className="immio-landing-section immio-landing-section--how"
                    id="how-it-works-section"
                    aria-labelledby="how-it-works-heading"
                >
                    <div id="how-it-works" className="immio-landing-section__header immio-landing-section__header--anchor">
                        <span className="immio-landing-section__chip">How it works</span>
                        <h2 id="how-it-works-heading" className="immio-landing-section__title">
                            Simple setup. Minimal routine.
                        </h2>
                    </div>
                    <div className="immio-landing-how__grid">
                        {HOW_IT_WORKS_STEPS.map((step) => (
                            <article key={step.number} className="immio-landing-how__step">
                                <span className="immio-landing-how__number">{step.number}</span>
                                <h3 className="immio-landing-how__title">{step.title}</h3>
                                <p className="immio-landing-how__body">{step.body}</p>
                                {"caption" in step ? (
                                    <p className="immio-landing-how__caption">{step.caption}</p>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </section>

                <section className="immio-landing-section" id="faq-section" aria-labelledby="faq-heading">
                    <div id="faq" className="immio-landing-section__header immio-landing-section__header--anchor">
                        <span className="immio-landing-section__chip">FAQ</span>
                        <h2 id="faq-heading" className="immio-landing-section__title">
                            All you want to know
                        </h2>
                    </div>
                    <div className="immio-landing-faq-wrap">
                        <FaqAccordion
                            idPrefix="landing"
                            items={FAQ_ITEMS.map((item) => ({question: item.q, answer: item.a}))}
                        />
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

            <SiteFooter/>
        </div>
    );
}
