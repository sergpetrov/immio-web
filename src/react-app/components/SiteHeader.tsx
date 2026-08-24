import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import SiteHeaderView from "./SiteHeaderView";
import { trackAppDownload } from "../analytics";

export interface SiteHeaderProps {
  /**
   * "landing" enables JS-driven smooth-scroll anchors and the scroll shadow
   * (used on "/" where the header sits over the hero). "static" (default)
   * renders plain links to "/#section" and a permanently solid header.
   */
  mode?: "landing" | "static";
  appDownloadUrl: string;
}

/**
 * Client-only interactive wrapper around SiteHeaderView, used by the
 * hydrated landing page. Worker-rendered static pages render SiteHeaderView
 * directly instead (see content components) — this file touches
 * window/document, which the Worker's TS project deliberately has no lib
 * for, since none of the Workers runtime has a DOM.
 */
export default function SiteHeader({ mode = "static", appDownloadUrl }: SiteHeaderProps) {
  const isLanding = mode === "landing";
  const [navOpen, setNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    if (!isLanding) {
      return;
    }

    const syncNavScrolled = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setNavScrolled(scrollTop > 0);
      // Scrolling closes the mobile menu — mirrors MOBILE_NAV_SCRIPT on the
      // static pages.
      setNavOpen(false);
    };

    syncNavScrolled();
    window.addEventListener("scroll", syncNavScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncNavScrolled);
    };
  }, [isLanding]);

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (!isLanding) {
      return;
    }

    event.preventDefault();
    setNavOpen(false);

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${sectionId}`);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isLanding) {
      return;
    }

    event.preventDefault();
    setNavOpen(false);
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteHeaderView
      appDownloadUrl={appDownloadUrl}
      isLanding={isLanding}
      solid={!isLanding || navScrolled}
      navOpen={navOpen}
      onToggleMenu={() => setNavOpen((open) => !open)}
      onLogoClick={handleLogoClick}
      onAnchorClick={handleAnchorClick}
      onCtaClick={() => {
        trackAppDownload(appDownloadUrl.includes("play.google.com") ? "android" : "ios", "header");
        setNavOpen(false);
      }}
    />
  );
}
