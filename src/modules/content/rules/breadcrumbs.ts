import { getPlaceForRule } from "./registry";
import type { Category, RulePlace, RuleDoc } from "./types";

export interface Breadcrumb {
  label: string;
  href: string;
}

export function buildCatalogBreadcrumbs(): Breadcrumb[] {
  return [{ label: "Rules", href: "/rules" }];
}

export function buildCategoryBreadcrumbs(category: Category): Breadcrumb[] {
  return [
    ...buildCatalogBreadcrumbs(),
    { label: category.shortTitle ?? category.title, href: `/rules/${category.slug}` },
  ];
}

export function buildCountriesBreadcrumbs(): Breadcrumb[] {
  return [...buildCatalogBreadcrumbs(), { label: "Countries", href: "/rules/countries" }];
}

export function buildCountryBreadcrumbs(place: RulePlace): Breadcrumb[] {
  return [...buildCountriesBreadcrumbs(), { label: place.name, href: `/rules/countries/${place.slug}` }];
}

/**
 * Ends in the rule's country (not its title) — e.g. RULES / TAX / UNITED KINGDOM.
 *
 * The final crumb is the current page, so Breadcrumbs.tsx renders it as plain
 * `aria-current` text rather than a link; the href only ever reaches the
 * BreadcrumbList JSON-LD, where a self-referencing final `item` is the
 * expected shape. Keep this trail and the emitted schema identical —
 * structured data has to describe what is actually on the page.
 */
export function buildRuleBreadcrumbs(category: Category, rule: RuleDoc): Breadcrumb[] {
  const trail = buildCategoryBreadcrumbs(category);
  const ruleHref = `/rules/${rule.frontmatter.id}`;
  const place = getPlaceForRule(rule);

  trail.push({ label: place.name, href: ruleHref });

  return trail;
}
