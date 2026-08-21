import { IMMIO_APP_STORE_URL, IMMIO_GOOGLE_PLAY_URL } from "../../react-app/appStoreLinks";
import { renderAnalyticsTags, renderSiteVerificationTag } from "../../shared/analytics";
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  absoluteUrl,
} from "../../shared/site";

export interface PageShellParams {
  title: string;
  description: string;
  canonical: string;
  jsonLd: string[];
  bodyHtml: string;
  /** "article" for rule pages, "website" for listings and legal pages. */
  ogType?: "website" | "article";
  /** Absolute URL. Falls back to the sitewide social card. */
  ogImage?: string;
  ogImageAlt?: string;
  /** Set on error pages and on any host that isn't production. */
  noindex?: boolean;
  /** `?source=inapp` — suppresses Safari's Smart App Banner. */
  inApp?: boolean;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Collapses the newlines YAML folded scalars (`description: >`) leave behind,
 * which would otherwise ship inside the `content="…"` attribute.
 */
function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function renderDocument({
  title,
  description,
  canonical,
  jsonLd,
  bodyHtml,
  ogType = "website",
  ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH),
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  noindex = false,
  inApp = false,
}: PageShellParams): string {
  const safeTitle = escapeAttr(normalizeText(title));
  const safeDescription = escapeAttr(normalizeText(description));
  const safeCanonical = escapeAttr(canonical);
  const safeOgImage = escapeAttr(ogImage);
  const safeOgImageAlt = escapeAttr(normalizeText(ogImageAlt));

  // Safari reads this at parse time; removing the element later with JS does
  // not dismiss a banner it has already shown.
  const appBannerTag = inApp
    ? ""
    : `<meta name="apple-itunes-app" content="app-id=6747927306, app-argument=${escapeAttr(IMMIO_APP_STORE_URL)}" />`;

  const robotsTag = noindex
    ? `<meta name="robots" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>${INAPP_BOOT_SCRIPT}</script>
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/site-header.css" />
    <link rel="stylesheet" href="/faq-accordion.css" />
    <link rel="stylesheet" href="/site-footer.css" />
    <link rel="stylesheet" href="/content/content.css" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeCanonical}" />
    ${robotsTag}
    <meta name="theme-color" content="#ffffff" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonical}" />
    <meta property="og:image" content="${safeOgImage}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />
    <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
    <meta property="og:image:alt" content="${safeOgImageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeOgImage}" />
    <meta name="twitter:image:alt" content="${safeOgImageAlt}" />
    ${appBannerTag}
    ${renderSiteVerificationTag()}
    ${renderAnalyticsTags()}
    ${jsonLd.join("\n    ")}
  </head>
  <body>
    ${bodyHtml}
    <script>${APP_DOWNLOAD_SCRIPT}</script>
    <script>${SCROLL_RESTORE_SCRIPT}</script>
    <script>${SMOOTH_SCROLL_SCRIPT}</script>
    <script>${SCROLL_SHADOW_SCRIPT}</script>
    <script>${MOBILE_NAV_SCRIPT}</script>
    <script>${FAQ_ACCORDION_SCRIPT}</script>
    <script>${TOC_SCROLLSPY_SCRIPT}</script>
    <script>${TYPE_SWITCH_SCRIPT}</script>
    <script>${BACK_LINK_SCRIPT}</script>
    <script>${COUNTRY_SEARCH_SCRIPT}</script>
    <script>${INAPP_LINKS_SCRIPT}</script>
  </body>
</html>`;
}

const INAPP_BOOT_SCRIPT = `(function(){
  if (location.pathname.indexOf("/rules") !== 0) return;
  if (new URLSearchParams(location.search).get("source") !== "inapp") return;
  document.documentElement.classList.add("is-inapp");
})();`;

const INAPP_LINKS_SCRIPT = `(function(){
  if (!document.documentElement.classList.contains("is-inapp")) return;
  document.addEventListener("click", function (event) {
    var anchor = event.target.closest("a");
    if (!anchor || anchor.target || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      var url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname.indexOf("/rules") !== 0) return;
      if (url.searchParams.get("source") === "inapp") return;
      url.searchParams.set("source", "inapp");
      anchor.setAttribute("href", url.pathname + url.search + url.hash);
    } catch (e) {}
  }, true);
})();`;

const APP_DOWNLOAD_SCRIPT = `(function(){
  var url = /Android/i.test(navigator.userAgent || "")
    ? ${JSON.stringify(IMMIO_GOOGLE_PLAY_URL)}
    : ${JSON.stringify(IMMIO_APP_STORE_URL)};
  document.querySelectorAll("a[data-app-download]").forEach(function (anchor) {
    anchor.setAttribute("href", url);
  });
})();`;

// Rule links write a short-lived, single-use source record before navigation.
// This preserves the exact listing page without adding navigation state to URLs.
const BACK_LINK_SCRIPT = `(function(){
  var storageKey = "immio-content:pending-origin";
  function isRulesListing(path) {
    var parts = path.split("?")[0].split("#")[0].split("/").filter(Boolean);
    return parts[0] === "rules" && (parts.length === 1 || (parts.length === 2 && ["tax", "travel", "immigration", "countries"].indexOf(parts[1]) !== -1) || (parts.length === 3 && parts[1] === "countries"));
  }
  function rememberOrigin(anchor) {
    var origin = anchor.getAttribute("data-rule-origin");
    if (!origin || !isRulesListing(origin)) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ target: new URL(anchor.href, location.href).pathname, origin: origin, at: Date.now() }));
    } catch (e) {}
  }
  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var anchor = event.target.closest("a[data-rule-origin]");
    if (anchor && !anchor.target && !anchor.hasAttribute("download")) rememberOrigin(anchor);
  }, true);

  var link = document.querySelector("[data-back-link]");
  if (!link) return;
  try {
    var raw = sessionStorage.getItem(storageKey);
    sessionStorage.removeItem(storageKey);
    if (!raw) return;
    var record = JSON.parse(raw);
    if (record.target === location.pathname && isRulesListing(record.origin) && Date.now() - record.at < 15000) {
      link.setAttribute("href", record.origin);
    }
  } catch (e) {
  }
})();`;

const COUNTRY_SEARCH_SCRIPT = `(function(){
  var input = document.querySelector("[data-country-search]");
  if (!input) return;
  var clear = document.querySelector("[data-clear-search]");
  var countryGrid = document.querySelector("[data-country-grid]");
  var results = document.querySelector("[data-search-results]");
  var rules = results ? Array.prototype.slice.call(results.querySelectorAll("[data-searchable-rule]")) : [];
  var timer;
  function syncClearButton() {
    if (clear) clear.hidden = !input.value;
  }
  function syncResults() {
    var query = input.value.trim().toLocaleLowerCase();
    var searching = query.length > 0;
    if (countryGrid) countryGrid.hidden = searching;
    if (results) results.hidden = !searching;
    if (!searching) return;
    rules.forEach(function (rule) {
      rule.hidden = rule.getAttribute("data-searchable-rule").indexOf(query) === -1;
    });
  }
  function scheduleResults() {
    clearTimeout(timer);
    timer = setTimeout(syncResults, 150);
  }
  if (clear) {
    clear.addEventListener("click", function () {
      input.value = "";
      syncClearButton();
      syncResults();
      input.focus();
    });
  }
  input.addEventListener("input", function () {
    syncClearButton();
    scheduleResults();
  });
  syncClearButton();
  if (new URLSearchParams(location.search).get("search") === "1") {
    input.focus();
  }
})();`;

/*
  Keeps your place on reload. Native scroll restoration is unreliable here —
  it races the page's own layout/animation work and can land short, leaving
  you part-way up the page (and drifting further on repeat refreshes). So we
  take it over: record the position while scrolling, and put it back
  ourselves on a reload or back/forward. Restoring is forced to instant
  regardless of the smooth-scroll class, so the jump is never animated.
  A fresh navigation still starts at the top, as it should.
*/
const SCROLL_RESTORE_SCRIPT = `(function(){
  if (!("scrollRestoration" in history)) return;
  history.scrollRestoration = "manual";

  var key = "immio:scroll:" + location.pathname + location.search;
  var nav = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || {};
  var isReturn = nav.type === "reload" || nav.type === "back_forward";

  function save() {
    try { sessionStorage.setItem(key, String(Math.round(window.scrollY))); } catch (e) {}
  }

  var timer;
  window.addEventListener("scroll", function () {
    clearTimeout(timer);
    timer = setTimeout(save, 100);
  }, { passive: true });
  window.addEventListener("pagehide", save);

  if (!isReturn) return;

  var saved = null;
  try { saved = sessionStorage.getItem(key); } catch (e) {}
  if (saved === null) return;

  var y = parseInt(saved, 10);
  if (!(y > 0)) return;

  function restore() {
    var el = document.documentElement;
    var prev = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    window.scrollTo(0, y);
    el.style.scrollBehavior = prev;
  }

  // Re-applied as the page fills out, since the target offset isn't
  // reachable until enough of the document has been laid out.
  restore();
  document.addEventListener("DOMContentLoaded", restore);
  window.addEventListener("load", function () {
    restore();
    setTimeout(restore, 0);
  });
})();`;

// Enables CSS smooth scrolling only after load, so it can't hijack the
// scroll restore above (see content.css). Defers past the load event, by
// which point the restore has already landed. setTimeout rather than
// requestAnimationFrame so it still runs in a background tab, where rAF is
// paused until the tab becomes visible.
const SMOOTH_SCROLL_SCRIPT = `(function(){
  function enable() {
    setTimeout(function () {
      document.documentElement.classList.add("has-smooth-scroll");
    }, 0);
  }
  if (document.readyState === "complete") enable();
  else window.addEventListener("load", enable);
})();`;

// Mirrors SiteHeader.tsx's syncNavScrolled effect on the landing page, so
// the header behaves identically here: borderless at the top of the page,
// bordered once scrolled — not permanently "solid" like before.
const SCROLL_SHADOW_SCRIPT = `(function(){
  var header = document.querySelector(".site-header");
  if (!header) return;
  function sync() {
    var scrolled = (window.scrollY || document.documentElement.scrollTop) > 0;
    header.classList.toggle("is-scrolled", scrolled);
  }
  sync();
  window.addEventListener("scroll", sync, { passive: true });
})();`;

// Vanilla JS (no React/hydration) so the mobile nav toggle works on these
// fully static pages — SiteHeader's own onClick handler is a no-op here
// since it never gets hydrated.
const MOBILE_NAV_SCRIPT = `(function(){
  var toggle = document.querySelector(".site-header__toggle");
  var menu = document.getElementById("site-header-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();`;

// Highlights the TOC entry for whichever section is currently in view.
// Tracks all currently-intersecting sections and picks the topmost
// (document order) one, so the active item follows the section actually
// being read as the page scrolls.
const TOC_SCROLLSPY_SCRIPT = `(function(){
  var sections = Array.prototype.slice.call(document.querySelectorAll(".content-article > section[id]"));
  if (!sections.length || !("IntersectionObserver" in window)) return;
  var links = document.querySelectorAll(".content-toc__list a");
  var visible = {};

  function setActive() {
    var activeId = null;
    for (var i = 0; i < sections.length; i++) {
      if (visible[sections[i].id]) {
        activeId = sections[i].id;
        break;
      }
    }
    links.forEach(function (link) {
      link.classList.toggle("is-active", activeId !== null && link.getAttribute("href") === "#" + activeId);
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      setActive();
    },
    { rootMargin: "-" + (68 + 16) + "px 0px -60% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();`;

// Catalog page's category switch. All three categories' rule lists render
// server-side (only the first marked .is-active) so everything is
// crawlable without JS; this wires up the click behavior and slides the
// pill behind whichever button is selected — [data-enhanced] is what
// actually reveals the pill (see content.css), so it never flashes at
// the wrong position before this runs.
const TYPE_SWITCH_SCRIPT = `(function(){
  var switcher = document.querySelector(".content-type-switch");
  if (!switcher) return;
  var pill = switcher.querySelector(".content-type-switch__pill");
  var buttons = Array.prototype.slice.call(switcher.querySelectorAll(".content-type-switch__item"));
  var lists = document.querySelectorAll(".content-type-list");

  function movePill(button) {
    pill.style.width = button.offsetWidth + "px";
    pill.style.height = button.offsetHeight + "px";
    pill.style.transform = "translate(" + button.offsetLeft + "px, " + button.offsetTop + "px)";
  }

  function selectCategory(id, button) {
    buttons.forEach(function (b) {
      var isSelected = b === button;
      b.classList.toggle("is-selected", isSelected);
      b.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    lists.forEach(function (list) {
      list.classList.toggle("is-active", list.getAttribute("data-category-list") === id);
    });
    movePill(button);
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectCategory(button.getAttribute("data-category"), button);
    });
  });

  var initial = switcher.querySelector(".is-selected") || buttons[0];
  if (initial) {
    movePill(initial);
  }
  switcher.setAttribute("data-enhanced", "");

  window.addEventListener("resize", function () {
    var current = switcher.querySelector(".is-selected");
    if (current) movePill(current);
  });
})();`;

// FaqAccordionView renders server-side with everything closed (matching the
// landing page's initial state). This wires up the same single-open
// behavior as the landing page's React state (FaqAccordion.tsx), driven by
// plain DOM APIs since these pages never hydrate.
const FAQ_ACCORDION_SCRIPT = `(function(){
  document.querySelectorAll(".faq-accordion").forEach(function (accordion) {
    var items = Array.prototype.slice.call(accordion.querySelectorAll(".faq-accordion__item"));
    items.forEach(function (item, index) {
      var trigger = item.querySelector(".faq-accordion__trigger");
      trigger.addEventListener("click", function () {
        var willOpen = !item.classList.contains("is-open");
        items.forEach(function (other, otherIndex) {
          var open = willOpen && otherIndex === index;
          other.classList.toggle("is-open", open);
          other.querySelector(".faq-accordion__trigger").setAttribute("aria-expanded", open ? "true" : "false");
          other.querySelector(".faq-accordion__panel").setAttribute("aria-hidden", open ? "false" : "true");
        });
      });
    });
  });
})();`;
