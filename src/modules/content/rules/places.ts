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
  { id: "de", name: "Germany", type: "country", slug: "germany" },
  { id: "sg", name: "Singapore", type: "country", slug: "singapore" },
  { id: "cl", name: "Chile", type: "country", slug: "chile" },
  { id: "fr", name: "France", type: "country", slug: "france" },
  { id: "in", name: "India", type: "country", slug: "india" },
  { id: "pr", name: "Puerto Rico", type: "territory", slug: "puerto-rico" },
  { id: "uy", name: "Uruguay", type: "country", slug: "uruguay" },
  { id: "ng", name: "Nigeria", type: "country", slug: "nigeria" },
  { id: "br", name: "Brazil", type: "country", slug: "brazil" },
  { id: "il", name: "Israel", type: "country", slug: "israel" },
  { id: "mc", name: "Monaco", type: "country", slug: "monaco" },
  { id: "sa", name: "Saudi Arabia", type: "country", slug: "saudi-arabia" },
  { id: "id", name: "Indonesia", type: "country", slug: "indonesia" },
  { id: "hk", name: "Hong Kong", type: "territory", slug: "hong-kong" },
  { id: "co", name: "Colombia", type: "country", slug: "colombia" },
  { id: "no", name: "Norway", type: "country", slug: "norway" },
  { id: "nz", name: "New Zealand", type: "country", slug: "new-zealand" },
  { id: "ge", name: "Georgia", type: "country", slug: "georgia" },
  { id: "ma", name: "Morocco", type: "country", slug: "morocco" },
  { id: "gr", name: "Greece", type: "country", slug: "greece" },
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
