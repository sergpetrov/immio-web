import { IMMIO_APP_STORE_URL, IMMIO_GOOGLE_PLAY_URL } from "../../../react-app/appStoreLinks";
import {
  APP_STORE_RATING,
  APP_STORE_RATING_COUNT,
  DEFAULT_OG_IMAGE_PATH,
  LOGO_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "../../../shared/site";
import type { Breadcrumb } from "./breadcrumbs";
import type { RuleDoc, RulePlace } from "./types";

export function buildCanonicalUrl(origin: string, pathname: string): string {
  return new URL(pathname, origin).toString();
}

/** Publisher/author identity, referenced by every content-bearing schema. */
function organizationRef(): object {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(LOGO_PATH),
    },
  };
}

export function buildBreadcrumbListJsonLd(breadcrumbs: Breadcrumb[], origin: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: buildCanonicalUrl(origin, crumb.href),
    })),
  };
}

export function buildWebPageJsonLd(params: {
  origin: string;
  pathname: string;
  title: string;
  description: string;
}): object {
  const { origin, pathname, title, description } = params;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: buildCanonicalUrl(origin, pathname),
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_ORIGIN },
    publisher: organizationRef(),
  };
}

export function buildArticleJsonLd(params: {
  origin: string;
  pathname: string;
  rule: RuleDoc;
  place?: RulePlace;
}): object {
  const { origin, pathname, rule, place } = params;
  const { frontmatter } = rule;
  const url = buildCanonicalUrl(origin, pathname);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: normalize(frontmatter.seo.description),
    inLanguage: "en",
    datePublished: frontmatter.publishedAt ?? frontmatter.updatedAt,
    dateModified: frontmatter.updatedAt,
    author: organizationRef(),
    publisher: organizationRef(),
    mainEntityOfPage: url,
    url,
    image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
    ...(place ? { about: { "@type": "Place", name: place.name } } : {}),
    // The official sources already sitting in frontmatter. On a YMYL topic
    // these are the strongest machine-readable trust signal available, and
    // answer engines lean on them when deciding what to cite.
    citation: frontmatter.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      url: source.url,
    })),
  };
}

/**
 * Strips the rendered HTML back to plain text for schema `text` values.
 * FAQ answers are stored as HTML (marked output), but schema.org wants prose.
 */
function stripHtml(html: string): string {
  return normalize(
    html
      // Block boundaries become spaces so adjacent paragraphs and list items
      // don't run together; inline tags are dropped outright, or stripping
      // "<strong>test</strong>." would leave a space before the full stop.
      .replace(/<\/(p|li|h[1-6]|div|blockquote|tr|td|th)\s*>/gi, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/gi, "'"),
  );
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * FAQPage from the rule's own FAQ section. Every rule has one, and the items
 * are already parsed into `RuleSection.faqItems` by markdown.ts — this just
 * exposes them to crawlers. Returns null when a rule has no FAQ.
 */
export function buildFaqPageJsonLd(rule: RuleDoc): object | null {
  const faqItems = rule.sections.flatMap((section) => section.faqItems ?? []);
  if (faqItems.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: normalize(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.answerHtml),
      },
    })),
  };
}

/** Ordered list of the rules on a listing page, for carousel eligibility. */
export function buildItemListJsonLd(params: {
  origin: string;
  name: string;
  items: { name: string; pathname: string }[];
}): object {
  const { origin, name, items } = params;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: buildCanonicalUrl(origin, item.pathname),
    })),
  };
}

export function buildOrganizationJsonLd(): object {
  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: absoluteUrl(LOGO_PATH),
    description: SITE_DESCRIPTION,
    email: "support@immio.app",
  };

  if (SOCIAL_PROFILES.length > 0) {
    organization.sameAs = SOCIAL_PROFILES;
  }

  return organization;
}

export function buildWebSiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    inLanguage: "en",
    publisher: organizationRef(),
  };
}

/**
 * The app itself. `aggregateRating` reads from shared/site.ts; see the note
 * there on where the figures come from and on Google's expectation that a
 * marked-up rating is visible on the page.
 */
export function buildMobileApplicationJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: `${SITE_NAME} — Tax Residency Tracker`,
    operatingSystem: "iOS, Android",
    applicationCategory: "TravelApplication",
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
    installUrl: IMMIO_APP_STORE_URL,
    sameAs: [IMMIO_APP_STORE_URL, IMMIO_GOOGLE_PLAY_URL],
    author: organizationRef(),
    publisher: organizationRef(),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: APP_STORE_RATING,
      ratingCount: APP_STORE_RATING_COUNT,
      bestRating: "5",
      worstRating: "4",
    },
  };
}

/** Renders a JSON-LD <script> tag, escaping `<` so content can't break out of the tag. */
export function renderJsonLd(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
