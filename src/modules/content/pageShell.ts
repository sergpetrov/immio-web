import { ANDROID_STORE_ENABLED, IMMIO_APP_STORE_URL, IMMIO_GOOGLE_PLAY_URL } from "../../react-app/appStoreLinks";
import { renderAnalyticsTags } from "../../shared/analytics";
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
  /** Emit the GA4 tag. False off the production host, so dev ships no tag at all. */
  analytics?: boolean;
  /** Context attached to every GA4 event fired from this page. */
  page?: PageAnalytics;
}

/** Rule pages only; every other page has no context to add. */
export interface PageAnalytics {
  ruleId: string;
  ruleTitle: string;
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
  analytics = false,
  page,
}: PageShellParams): string {
  const safeTitle = escapeAttr(normalizeText(title));
  const safeDescription = escapeAttr(normalizeText(description));
  const safeCanonical = escapeAttr(canonical);
  const safeOgImage = escapeAttr(ogImage);
  const safeOgImageAlt = escapeAttr(normalizeText(ogImageAlt));

  const robotsTag = noindex
    ? `<meta name="robots" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>${INAPP_BOOT_SCRIPT}</script>
    <script src="/theme.js"></script>
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
    ${renderAnalyticsTags(analytics)}
    <script>window.__immioPage=${JSON.stringify(page ?? {}).replace(/</g, "\\u003c")};</script>
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
    <script>${ANALYTICS_EVENTS_SCRIPT}</script>
  </body>
</html>`;
}

/*
  GA4 custom events for the Rule Guide. Everything is click delegation on
  document, so it works on these never-hydrated pages and survives any markup
  the article Markdown produces.

  Sources are inferred from where the clicked element sits rather than from a
  data attribute on every link, so adding a link anywhere does not also mean
  remembering to tag it.

  Fires nothing when gtag is absent — off the production host that is every
  page (see shared/analytics.ts), so dev clicks never reach the property.
*/
const ANALYTICS_EVENTS_SCRIPT = `(function(){
  var page = window.__immioPage || {};
  var LISTINGS = ["tax", "travel", "immigration", "countries"];

  function deviceType() {
    var ua = navigator.userAgent || "";
    var w = window.innerWidth || document.documentElement.clientWidth || 0;
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
    if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua) || w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }
  var device = deviceType();
  var inApp = document.documentElement.classList.contains("is-inapp");

  function track(name, params) {
    // Checked per call, not once at startup: listeners attach regardless, so
    // the page never depends on gtag.js having loaded first, and the whole
    // thing is a no-op wherever the tag is absent.
    if (!window.gtag) return;
    var payload = { device_type: device, in_app: inApp };
    if (page.ruleId) payload.rule_id = page.ruleId;
    if (page.ruleTitle) payload.rule_title = page.ruleTitle;
    for (var k in params) if (params[k] !== undefined && params[k] !== null && params[k] !== "") payload[k] = params[k];
    window.gtag("event", name, payload);
  }

  function ruleIdFromPath(path) {
    var parts = path.split("?")[0].split("#")[0].split("/").filter(Boolean);
    if (parts[0] !== "rules" || parts.length !== 2) return null;
    return LISTINGS.indexOf(parts[1]) === -1 ? parts[1] : null;
  }

  // The clicked rule's own title. Chips and related rows wrap it in a known
  // element; an in-article link has only its anchor text, which is the phrase
  // the author wrote rather than the rule name — still the truest label for
  // what was clicked.
  function ruleTitleFromLink(anchor) {
    var el = anchor.querySelector(".content-rule-chip__title, .content-related__title");
    return ((el ? el.textContent : anchor.textContent) || "").trim().slice(0, 100);
  }

  // Where a rule link was clicked from. Ordered most specific first.
  function ruleClickSource(anchor) {
    if (anchor.closest(".content-related")) return "related_content";
    if (anchor.closest(".content-article")) return "article_body";
    if (anchor.closest(".content-search-results")) return "search_results";
    if (anchor.closest(".content-country-grid")) return "country_grid";
    if (anchor.closest(".site-footer")) return "footer";
    if (anchor.closest(".site-header")) return "header";
    return anchor.getAttribute("data-rule-origin") || location.pathname;
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    var target = event.target;
    if (!target || !target.closest) return;

    var store = target.closest("a[data-app-download]");
    if (store) {
      var href = store.getAttribute("href") || "";
      track("app_download_click", {
        platform: href.indexOf("play.google.com") !== -1 ? "android" : "ios",
        source: store.getAttribute("data-app-source") || "unknown"
      });
      return;
    }

    var toc = target.closest(".content-toc__list a");
    if (toc) {
      track("rule_section_click", {
        section_id: (toc.getAttribute("href") || "").replace("#", ""),
        section_title: (toc.textContent || "").trim()
      });
      return;
    }

    var faq = target.closest(".faq-accordion__trigger");
    if (faq) {
      // Class is toggled after this handler, so is-open still reflects the pre-click state.
      var opening = !(faq.closest(".faq-accordion__item") || {}).classList.contains("is-open");
      if (opening) {
        var q = faq.querySelector("span");
        track("rule_faq_open", { question: ((q && q.textContent) || "").trim().slice(0, 100) });
      }
      return;
    }

    var country = target.closest(".content-country-card");
    if (country) {
      // The name span specifically — the card body also holds the rule count,
      // and textContent would run the two together ("Australia3 Rules").
      var nameEl = country.querySelector(".content-country-card__name");
      track("country_click", {
        country: ((nameEl && nameEl.textContent) || "").trim().slice(0, 60),
        destination: (country.getAttribute("href") || "").split("?")[0]
      });
      return;
    }

    var link = target.closest('a[href^="/rules/"]');
    if (link) {
      var id = ruleIdFromPath(link.getAttribute("href") || "");
      // rule_id and rule_title are both overridden so they describe the clicked
      // rule consistently. Leaving rule_title to fall through from the page
      // context would pair the destination's id with the source's title. Which
      // page the click happened on is still known — GA4 attaches page_location
      // to every event.
      if (id) track("rule_click", { rule_id: id, rule_title: ruleTitleFromLink(link), source: ruleClickSource(link) });
    }
  }, true);

  // Search: a separate, longer debounce than the list filtering, so the event
  // reflects a query the user stopped typing rather than every keystroke.
  var search = document.querySelector("[data-country-search]");
  if (search) {
    var searchTimer, lastSent = "";
    search.addEventListener("input", function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        var q = search.value.trim();
        if (!q || q === lastSent) return;
        lastSent = q;
        var visible = document.querySelectorAll("[data-searchable-rule]:not([hidden])").length;
        track("rule_search", { query: q.slice(0, 100), results: visible });
      }, 1500);
    });
  }

  /*
    One scroll event per visit, sent on the way out with the furthest point
    reached. Firing per threshold would multiply events for no extra insight,
    and reading depth only matters as a final figure. Rule pages only — the
    listeners are never attached elsewhere.

    pagehide covers navigation; visibilitychange covers mobile backgrounding,
    where pagehide is unreliable. Guarded so the two cannot double-send.
  */
  if (!page.ruleId) return;

  var maxPercent = 0, deepestSection = "", sent = false;
  var sections = Array.prototype.slice.call(document.querySelectorAll(".content-article > section[id]"));

  function measure() {
    var doc = document.documentElement;
    var viewport = window.innerHeight || doc.clientHeight || 0;
    var scrollable = doc.scrollHeight - viewport;
    var percent = scrollable > 0 ? Math.round(((window.scrollY || doc.scrollTop) / scrollable) * 100) : 100;
    if (percent > maxPercent) maxPercent = Math.max(0, Math.min(100, percent));
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= viewport * 0.5) deepestSection = sections[i].id;
    }
  }
  var measureTimer;
  window.addEventListener("scroll", function () {
    clearTimeout(measureTimer);
    measureTimer = setTimeout(measure, 200);
  }, { passive: true });
  measure();

  function sendScroll() {
    // gtag is checked here as well as in track(): without it the flag would be
    // burned on a pagehide that fired before gtag.js finished loading, and the
    // visibilitychange retry would then be suppressed for a send that never happened.
    if (sent || !window.gtag) return;
    sent = true;
    track("rule_scroll_depth", { percent_scrolled: maxPercent, deepest_section: deepestSection });
  }
  window.addEventListener("pagehide", sendScroll);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") sendScroll();
  });
})();`;

/**
 * Path prefixes the app opens in a WebView. `?source=inapp` on one of these
 * hides the marketing chrome — see `html.is-inapp` in content.css.
 */
const INAPP_PATH_PREFIXES = ["/rules", "/acknowledgements"];

const INAPP_BOOT_SCRIPT = `(function(){
  var prefixes = ${JSON.stringify(INAPP_PATH_PREFIXES)};
  var matched = false;
  for (var i = 0; i < prefixes.length; i++) {
    if (location.pathname.indexOf(prefixes[i]) === 0) { matched = true; break; }
  }
  if (!matched) return;
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

// TEMPORARY: while ANDROID_STORE_ENABLED is off the rendered App Store href is
// already right on every device, so there is nothing to rewrite.
const APP_DOWNLOAD_SCRIPT = ANDROID_STORE_ENABLED
  ? `(function(){
  var url = /Android/i.test(navigator.userAgent || "")
    ? ${JSON.stringify(IMMIO_GOOGLE_PLAY_URL)}
    : ${JSON.stringify(IMMIO_APP_STORE_URL)};
  document.querySelectorAll("a[data-app-download]").forEach(function (anchor) {
    anchor.setAttribute("href", url);
  });
})();`
  : "";

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

  // Going "back" should land on the listing in the state it was left in --
  // same tab, same scroll position. SCROLL_RESTORE_SCRIPT and
  // TYPE_SWITCH_SCRIPT pick this flag up on the next page.
  link.addEventListener("click", function () {
    try {
      sessionStorage.setItem("immio:content:return", JSON.stringify({
        path: new URL(link.getAttribute("href"), location.href).pathname,
        at: Date.now()
      }));
    } catch (e) {}
  });
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

  // Rule Guide listings (/rules, a category, the countries index) start fresh
  // on a reload or a plain click onto the page -- default tab, top of the
  // page. Only Back/Forward and the article's own back link return to the
  // remembered state. Article pages still keep their place across reloads.
  var segments = location.pathname.split("/").filter(Boolean);
  var isListing = segments[0] === "rules" && (
    segments.length === 1 ||
    (segments.length === 2 && ["tax", "travel", "immigration", "countries"].indexOf(segments[1]) !== -1) ||
    (segments.length === 3 && segments[1] === "countries")
  );
  var isReturn = nav.type === "back_forward" || (nav.type === "reload" && !isListing);

  // The article's "← Back" link is an ordinary navigation, so the browser
  // reports it as "navigate"; it flags itself here (see BACK_LINK_SCRIPT) so
  // returning that way restores the listing exactly like Back does.
  try {
    var flag = sessionStorage.getItem("immio:content:return");
    sessionStorage.removeItem("immio:content:return");
    if (flag) {
      var back = JSON.parse(flag);
      if (back && back.path === location.pathname && Date.now() - back.at < 60000) isReturn = true;
    }
  } catch (e) {}

  // Read by TYPE_SWITCH_SCRIPT, which restores the selected tab on a return.
  window.__immioIsReturn = isReturn;

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
  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  toggle.addEventListener("click", function () {
    setOpen(!menu.classList.contains("is-open"));
  });
  // Scrolling the page closes the menu, so the expanded bar never trails
  // the content it is sitting over.
  window.addEventListener("scroll", function () {
    if (menu.classList.contains("is-open")) setOpen(false);
  }, { passive: true });
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

  // Keeps the chosen tab visible in the scrolling strip (see content.css):
  // centre it when there is room to scroll, clamped at either end.
  function centerTab(button, behavior) {
    var overflow = switcher.scrollWidth - switcher.clientWidth;
    if (overflow <= 0) return;
    var target = button.offsetLeft - (switcher.clientWidth - button.offsetWidth) / 2;
    var left = Math.max(0, Math.min(overflow, target));
    if (switcher.scrollTo) switcher.scrollTo({ left: left, behavior: behavior });
    else switcher.scrollLeft = left;
  }

  var typeKey = "immio:type:" + location.pathname;

  function selectCategory(id, button) {
    try { sessionStorage.setItem(typeKey, id); } catch (e) {}
    buttons.forEach(function (b) {
      var isSelected = b === button;
      b.classList.toggle("is-selected", isSelected);
      b.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    lists.forEach(function (list) {
      list.classList.toggle("is-active", list.getAttribute("data-category-list") === id);
    });
    movePill(button);
    centerTab(button, "smooth");
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectCategory(button.getAttribute("data-category"), button);
    });
  });

  var initial = switcher.querySelector(".is-selected") || buttons[0];

  // Coming back to the listing (Back button, or the article's back link)
  // reopens the tab that was left selected. A fresh visit keeps the
  // server-rendered default, so shared links are predictable.
  if (window.__immioIsReturn) {
    var savedId = null;
    try { savedId = sessionStorage.getItem(typeKey); } catch (e) {}
    if (savedId) {
      var savedButton = null;
      buttons.forEach(function (b) {
        if (b.getAttribute("data-category") === savedId) savedButton = b;
      });
      if (savedButton && savedButton !== initial) {
        selectCategory(savedId, savedButton);
        initial = savedButton;
      }
    }
  }

  if (initial) {
    // Storage always mirrors what is on screen -- including after a reset, so
    // a later Back cannot resurrect a tab the page was not left on.
    try { sessionStorage.setItem(typeKey, initial.getAttribute("data-category")); } catch (e) {}
    movePill(initial);
    centerTab(initial, "auto");
  }
  switcher.setAttribute("data-enhanced", "");

  window.addEventListener("resize", function () {
    var current = switcher.querySelector(".is-selected");
    if (current) {
      movePill(current);
      centerTab(current, "auto");
    }
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
