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
  { id: "al", name: "Albania", type: "country", slug: "albania" },
  { id: "am", name: "Armenia", type: "country", slug: "armenia" },
  { id: "lt", name: "Lithuania", type: "country", slug: "lithuania" },
  { id: "md", name: "Moldova", type: "country", slug: "moldova" },
  { id: "sk", name: "Slovakia", type: "country", slug: "slovakia" },
  { id: "si", name: "Slovenia", type: "country", slug: "slovenia" },
  { id: "tw", name: "Taiwan", type: "country", slug: "taiwan" },
  { id: "jp", name: "Japan", type: "country", slug: "japan" },
];

/**
 * Display names for sub-national places. They are not registered as places (see
 * `isSubnationalPlaceId`), but a breadcrumb has to name the page it points at:
 * without this the leaf crumb on all 31 US state rules read "United States",
 * which is both indistinct in search results and wrong about what the page is.
 */
const SUBDIVISION_NAMES: Record<string, string> = {
  "us-az": "Arizona",
  "us-ca": "California",
  "us-co": "Colorado",
  "us-ct": "Connecticut",
  "us-dc": "District of Columbia",
  "us-de": "Delaware",
  "us-ga": "Georgia (US State)",
  "us-hi": "Hawaii",
  "us-ia": "Iowa",
  "us-id": "Idaho",
  "us-il": "Illinois",
  "us-ky": "Kentucky",
  "us-la": "Louisiana",
  "us-ma": "Massachusetts",
  "us-md": "Maryland",
  "us-me": "Maine",
  "us-mn": "Minnesota",
  "us-mo": "Missouri",
  "us-nc": "North Carolina",
  "us-nd": "North Dakota",
  "us-ne": "Nebraska",
  "us-nj": "New Jersey",
  "us-ny": "New York",
  "us-oh": "Ohio",
  "us-or": "Oregon",
  "us-pa": "Pennsylvania",
  "us-ri": "Rhode Island",
  "us-ut": "Utah",
  "us-va": "Virginia",
  "us-vt": "Vermont",
  "us-wv": "West Virginia",
};

export function getSubdivisionName(placeId: string): string | undefined {
  return SUBDIVISION_NAMES[placeId];
}

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
