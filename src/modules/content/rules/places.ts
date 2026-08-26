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
  { id: "ie", name: "Ireland", type: "country", slug: "ireland" },
  { id: "ch", name: "Switzerland", type: "country", slug: "switzerland" },
  { id: "my", name: "Malaysia", type: "country", slug: "malaysia" },
  { id: "mt", name: "Malta", type: "country", slug: "malta" },
  { id: "ee", name: "Estonia", type: "country", slug: "estonia" },
  { id: "cz", name: "Czech Republic", type: "country", slug: "czech-republic" },
  { id: "bg", name: "Bulgaria", type: "country", slug: "bulgaria" },
  { id: "ro", name: "Romania", type: "country", slug: "romania" },
  { id: "vn", name: "Vietnam", type: "country", slug: "vietnam" },
  { id: "rs", name: "Serbia", type: "country", slug: "serbia" },
  { id: "me", name: "Montenegro", type: "country", slug: "montenegro" },
  { id: "mu", name: "Mauritius", type: "country", slug: "mauritius" },
  { id: "cn", name: "China", type: "country", slug: "china" },
  { id: "se", name: "Sweden", type: "country", slug: "sweden" },
  { id: "ke", name: "Kenya", type: "country", slug: "kenya" },
  { id: "dk", name: "Denmark", type: "country", slug: "denmark" },
  { id: "vc", name: "Saint Vincent and the Grenadines", type: "country", slug: "saint-vincent-and-the-grenadines" },
  { id: "vi", name: "US Virgin Islands", type: "territory", slug: "us-virgin-islands" },
];

export function getAllPlaces(): RulePlace[] {
  return RULE_PLACES;
}

/**
 * Sub-national places are written `{parent}-{subdivision}` — `us-ut` for Utah.
 * They are deliberately NOT registered as places of their own: the rule belongs
 * to the parent country for grouping, breadcrumbs and URLs, and the compound id
 * exists only so the rule can carry its own flag. No registered place id
 * contains a hyphen, so the split is unambiguous.
 */
export function isSubnationalPlaceId(placeId: string): boolean {
  return placeId.includes("-");
}

export function getParentPlaceId(placeId: string): string {
  const separator = placeId.indexOf("-");
  return separator === -1 ? placeId : placeId.slice(0, separator);
}

export function getPlaceById(id: string): RulePlace | undefined {
  return RULE_PLACES.find((place) => place.id === id);
}

export function getPlaceBySlug(slug: string): RulePlace | undefined {
  return RULE_PLACES.find((place) => place.slug === slug);
}
