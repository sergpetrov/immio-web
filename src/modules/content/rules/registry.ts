import { getAllCategories, getCategoryBySlug, getCatalogTabs, US_STATES_TAB_ID } from "./categories";
import { parseContentFile } from "./frontmatter";
import { parseMarkdownBody } from "./markdown";
import { assertValidRuleFrontmatter } from "./validate";
import {
  getAllPlaces as getConfiguredPlaces,
  getParentPlaceId,
  getPlaceById as getConfiguredPlaceById,
  getPlaceBySlug as getConfiguredPlaceBySlug,
  isSubnationalPlaceId,
} from "./places";
import type { RuleDoc, RulePlace } from "./types";

// Every content/rules/*.md file, inlined as raw text at build time. This
// registry only runs in worker-imported modules, so markdown/YAML parsing
// never ends up in the client bundle.
const rawContentFiles = import.meta.glob("../../../../content/rules/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function buildRegistry(): RuleDoc[] {
  const docs: RuleDoc[] = [];

  for (const [filePath, raw] of Object.entries(rawContentFiles)) {
    const { data, body } = parseContentFile(raw, filePath);
    const frontmatter = assertValidRuleFrontmatter(data, filePath);
    const { headline, sections, toc } = parseMarkdownBody(body, filePath);

    docs.push({ frontmatter, headline, sections, toc });
  }

  return docs.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}

const RULES = buildRegistry();

const rulesById = new Map(RULES.map((rule) => [rule.frontmatter.id, rule]));

/*
  relatedContent cross-references are validated by scripts/validate-content.mjs.
  Do not assert them here: this module's top level runs at worker startup, so a
  throw would fail initialisation and 500 every page rather than drop one link.
*/

const rulesByCategory = new Map<string, RuleDoc[]>();
for (const rule of RULES) {
  const list = rulesByCategory.get(rule.frontmatter.category) ?? [];
  list.push(rule);
  rulesByCategory.set(rule.frontmatter.category, list);
}

const rulesByPlace = new Map<string, RuleDoc[]>();
for (const rule of RULES) {
  if (!rule.frontmatter.place) {
    continue;
  }
  // Keyed by the PARENT id, so a US state rule lists under United States.
  const placeId = getParentPlaceId(rule.frontmatter.place);
  const list = rulesByPlace.get(placeId) ?? [];
  list.push(rule);
  rulesByPlace.set(placeId, list);
}

export function getAllRules(): RuleDoc[] {
  return RULES;
}

export function getRuleById(id: string): RuleDoc | undefined {
  return rulesById.get(id);
}

export function getPlaceForRule(rule: RuleDoc): RulePlace | undefined {
  if (!rule.frontmatter.place) {
    return undefined;
  }
  const place = getConfiguredPlaceById(getParentPlaceId(rule.frontmatter.place));
  if (!place) {
    throw new Error(`Rule ${rule.frontmatter.id} references an unknown place: ${rule.frontmatter.place}`);
  }
  return place;
}

export function getPlaceFlagId(place: RulePlace): string {
  return place.id === "schengen" ? "european_union" : place.id;
}

/**
 * Public URL for the rule's header/chip image. Conceptual guides use
 * `frontmatter.icon`; country rules use a derived flag path.
 */
export function getRuleIconSrc(rule: RuleDoc): string | undefined {
  if (rule.frontmatter.icon) {
    return rule.frontmatter.icon;
  }
  const flagFile = getRuleFlagFile(rule);
  return flagFile ? `/flags/${flagFile}` : undefined;
}

/**
 * Flag filename under `/flags/` for a country or state rule.
 * Sub-national rules (US states) deliberately share their country's `place` —
 * no separate place, no separate URL path — so they name their own flag in
 * frontmatter and everything else falls back to the country.
 */
export function getRuleFlagFile(rule: RuleDoc): string | undefined {
  const placeId = rule.frontmatter.place;
  if (!placeId) {
    return undefined;
  }
  const place = getPlaceForRule(rule);
  if (!place) {
    return undefined;
  }
  // Sub-national flags are always WebP: rasterising them is what makes them
  // affordable, since the vector originals run to hundreds of KB for a 56px
  // icon. Country flags are always SVG. Keeping each set to one format is what
  // lets the filename be derived instead of declared per rule.
  return isSubnationalPlaceId(placeId)
    ? `${placeId}.webp`
    : `${getPlaceFlagId(place)}.svg`;
}

function isUsStateRule(rule: RuleDoc): boolean {
  const placeId = rule.frontmatter.place;
  if (!placeId) {
    return false;
  }
  return isSubnationalPlaceId(placeId) && getParentPlaceId(placeId) === "us";
}

export function getRulesForCategory(categoryId: string): RuleDoc[] {
  const list = rulesByCategory.get(categoryId) ?? [];
  // US state rules stay `category: tax` in frontmatter (article URLs and
  // breadcrumbs), but the catalog lists them on their own tab.
  if (categoryId === "tax") {
    return list.filter((rule) => !isUsStateRule(rule));
  }
  return list;
}

export function getUsStateRules(): RuleDoc[] {
  return RULES.filter(isUsStateRule);
}

export function getAllPlaces(): RulePlace[] {
  return getConfiguredPlaces().filter((place) => rulesByPlace.has(place.id)).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPlaceBySlug(slug: string): RulePlace | undefined {
  return getConfiguredPlaceBySlug(slug);
}

export function getRulesForPlace(placeId: string): RuleDoc[] {
  return rulesByPlace.get(placeId) ?? [];
}

export { getAllCategories, getCategoryBySlug, getCatalogTabs, US_STATES_TAB_ID, isSubnationalPlaceId };
