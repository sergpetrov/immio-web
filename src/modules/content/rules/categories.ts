import type { Category } from "./types";

export const RULE_CATEGORIES: Category[] = [
  {
    id: "tax",
    slug: "tax",
    title: "Tax residency",
    description:
      "When a country starts treating you as a tax resident — and taxing your worldwide income. The day thresholds, counting windows, and tests that trigger residency.",
    intro:
      "Days spent in a country are a key factor in determining tax residency. While 183 days is common, countries may use a calendar year, tax year, or rolling 12-month window. Our tax residency guidance explains thresholds, day-counting rules, and how personal or economic ties can affect your residency status."
  },
  {
    id: "travel",
    slug: "travel",
    title: "Travel, Visa & Stay limits",
    shortTitle: "Travel limit",
    description:
      "Visa, visitor visa, stay limits, visa-free stay, and Schengen-type rules for travelers.",
    intro:
      "Every visa or visa-free entry comes with a cap on how long you can stay. Some are counted per entry, others per calendar year, or across a rolling window like the Schengen 90 days in any 180. Our travel limit guidance explains stay lengths, day-counting rules, extensions, and when the clock resets.",
  },
  {
    id: "immigration",
    slug: "immigration",
    title: "Citizenship & Residency requirements",
    shortTitle: "Immigration",
    description:
      "ILR, permanent residence, citizenship, settlement, and residency requirement rules.",
    intro:
      "Permanent residency and citizenship are earned by time spent in a country — and can be lost by time spent away. Some countries set a minimum presence across a qualifying period, while others cap how long you can be absent. Our immigration guidance explains qualifying periods, absence limits, and what resets your residency clock.",
  },
];

/** Catalog-only tab. State rules keep `category: tax` in frontmatter. */
export const US_STATES_TAB_ID = "us-states";

export interface CatalogTab {
  id: string;
  label: string;
}

export function getCatalogTabs(): CatalogTab[] {
  return [
    ...RULE_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.shortTitle ?? category.title,
    })),
    { id: US_STATES_TAB_ID, label: "US States" },
  ];
}

export function getAllCategories(): Category[] {
  return RULE_CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return RULE_CATEGORIES.find((category) => category.slug === slug);
}
