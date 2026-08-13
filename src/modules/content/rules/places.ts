import type { RulePlace } from "./types";

export const RULE_PLACES: RulePlace[] = [
  { id: "gb", name: "United Kingdom", type: "country", slug: "united-kingdom" },
  { id: "us", name: "United States", type: "country", slug: "united-states" },
  { id: "schengen", name: "Schengen Area", type: "territory", slug: "schengen-area" },
  { id: "ae", name: "United Arab Emirates", type: "country", slug: "united-arab-emirates" },
  { id: "es", name: "Spain", type: "country", slug: "spain" },
  { id: "pt", name: "Portugal", type: "country", slug: "portugal" },
  { id: "cy", name: "Cyprus", type: "country", slug: "cyprus" },
  { id: "pl", name: "Poland", type: "country", slug: "poland" },
  { id: "it", name: "Italy", type: "country", slug: "italy" },
  { id: "tr", name: "Turkey", type: "country", slug: "turkey" },
  { id: "ca", name: "Canada", type: "country", slug: "canada" },
  { id: "au", name: "Australia", type: "country", slug: "australia" },
  { id: "th", name: "Thailand", type: "country", slug: "thailand" },
];

export function getAllPlaces(): RulePlace[] {
  return RULE_PLACES;
}

export function getPlaceById(id: string): RulePlace | undefined {
  return RULE_PLACES.find((place) => place.id === id);
}

export function getPlaceBySlug(slug: string): RulePlace | undefined {
  return RULE_PLACES.find((place) => place.slug === slug);
}
