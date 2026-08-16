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

/** Ends in the rule's country (not its title) — e.g. RULES / TAX / UNITED KINGDOM. */
export function buildRuleBreadcrumbs(category: Category, rule: RuleDoc): Breadcrumb[] {
  const trail = buildCategoryBreadcrumbs(category);
  const ruleHref = `/rules/${rule.frontmatter.id}`;
  const place = getPlaceForRule(rule);

  trail.push({ label: place.name, href: ruleHref });

  return trail;
}
