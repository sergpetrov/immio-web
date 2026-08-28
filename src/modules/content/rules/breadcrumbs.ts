import { getPlaceForRule } from "./registry";
import { getSubdivisionName } from "./places";
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
 * Ends in the rule's country, not its title — RULES / TAX / UNITED KINGDOM.
 *
 * A sub-national rule gets its country as a real parent crumb and the
 * subdivision as the leaf — RULES / TAX / UNITED STATES / NEW YORK. Naming the
 * leaf after the country would give all 31 US state pages the same trail while
 * pointing it at a page that is not about the country.
 *
 * Keep this trail and the emitted BreadcrumbList identical: structured data has
 * to describe what is on the page.
 */
export function buildRuleBreadcrumbs(category: Category, rule: RuleDoc): Breadcrumb[] {
  const trail = buildCategoryBreadcrumbs(category);
  const ruleHref = `/rules/${rule.frontmatter.id}`;
  const place = getPlaceForRule(rule);

  if (!place || !rule.frontmatter.place) {
    trail.push({ label: rule.frontmatter.title, href: ruleHref });
    return trail;
  }

  const subdivision = getSubdivisionName(rule.frontmatter.place);

  if (subdivision) {
    trail.push({ label: place.name, href: `/rules/countries/${place.slug}` });
    trail.push({ label: subdivision, href: ruleHref });
    return trail;
  }

  trail.push({ label: place.name, href: ruleHref });

  return trail;
}
