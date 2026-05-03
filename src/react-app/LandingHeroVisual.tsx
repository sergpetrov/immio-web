import { useEffect, useRef } from "react";
import "./LandingHeroVisual.css";

const PARALLAX_PX_PER_SCROLL = 0.38;
const PARALLAX_MAX_SHIFT = 220;

const MAP_SRC = "/immio/landing-hero/world-map.svg";
const MOCKUP_SRC = "/immio/landing-hero/immio-mockup.png";

/**
 * Marketing hero: scrolling world map, iPhone mockup with scroll parallax, and feature chips.
 */
export function LandingHeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const mock = mockupRef.current;
    const root = rootRef.current;
    if (!mock || !root) return;

    let raf = 0;
    let heroTopDoc = 0;
    let viewportH = window.innerHeight;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const scrollRoot = window.scrollY || document.documentElement.scrollTop;
      heroTopDoc = scrollRoot + rect.top;
      viewportH = window.innerHeight;
    };

    const tick = () => {
      raf = 0;
      const scrollRoot = window.scrollY || document.documentElement.scrollTop;
      const scrolled = scrollRoot - heroTopDoc + viewportH * 0.35;
      const raw = -scrolled * PARALLAX_PX_PER_SCROLL;
      const clamped = Math.max(-PARALLAX_MAX_SHIFT, Math.min(PARALLAX_MAX_SHIFT, raw));
      mock.style.setProperty("--mockup-parallax-y", `${Math.round(clamped)}px`);
    };

    const queueTick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      queueTick();
    };

    measure();
    tick();
    window.addEventListener("scroll", queueTick, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", queueTick);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      mock.style.removeProperty("--mockup-parallax-y");
    };
  }, []);

  return (
    <div ref={rootRef} className="landing-hero-visual">
      <div className="landing-hero-visual__mask">
        <div className="landing-hero-visual__mapWrap">
          <div className="landing-hero-visual__mapTrack">
            <img className="landing-hero-visual__map" src={MAP_SRC} alt="" decoding="async" />
            <img className="landing-hero-visual__map" src={MAP_SRC} alt="" decoding="async" aria-hidden="true" />
          </div>
        </div>

        <div className="landing-hero-visual__overlays">
          <div ref={mockupRef} className="landing-hero-visual__mockup">
            <img
              className="landing-hero-visual__iphone"
              src={MOCKUP_SRC}
              alt=""
              width={1053}
              height={2253}
              decoding="async"
            />
          </div>
          <div className="landing-hero-visual__chip landing-hero-visual__chip--1">Schengen 90/180 Rule</div>
          <div className="landing-hero-visual__chip landing-hero-visual__chip--2">Automatic Tracking</div>
          <div className="landing-hero-visual__chip landing-hero-visual__chip--3">UK Tax Residency Tracker</div>
        </div>
      </div>
    </div>
  );
}
