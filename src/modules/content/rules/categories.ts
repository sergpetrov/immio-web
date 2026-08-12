import type { Category } from "./types";

export const RULE_CATEGORIES: Category[] = [
  {
    id: "tax",
    slug: "tax",
    title: "Tax residency",
    description:
      "Tax residence, tax day-count, and statutory residence rules that determine where you owe tax.",
  },
  {
    id: "travel",
    slug: "travel",
    title: "Travel limit",
    description:
      "Visa, visitor visa, stay limits, visa-free stay, and Schengen-type rules for travelers.",
  },
  {
    id: "immigration",
    slug: "immigration",
    title: "Immigration",
    description:
      "ILR, permanent residence, citizenship, settlement, and residency requirement rules.",
  },
];

export function getAllCategories(): Category[] {
  return RULE_CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return RULE_CATEGORIES.find((category) => category.slug === slug);
}
