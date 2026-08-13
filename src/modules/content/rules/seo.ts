import type { Breadcrumb } from "./breadcrumbs";
import type { RuleDoc } from "./types";

export function buildCanonicalUrl(origin: string, pathname: string): string {
  return new URL(pathname, origin).toString();
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
  };
}

export function buildArticleJsonLd(params: { origin: string; pathname: string; rule: RuleDoc }): object {
  const { origin, pathname, rule } = params;
  const organization = { "@type": "Organization", name: "Immio" };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: rule.frontmatter.title,
    description: rule.frontmatter.seo.description,
    dateModified: rule.frontmatter.updatedAt,
    author: organization,
    publisher: organization,
    mainEntityOfPage: buildCanonicalUrl(origin, pathname),
  };
}

/** Renders a JSON-LD <script> tag, escaping `<` so content can't break out of the tag. */
export function renderJsonLd(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
