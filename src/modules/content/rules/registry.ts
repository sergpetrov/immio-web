import { getAllCategories, getCategoryBySlug } from "./categories";
import { parseContentFile } from "./frontmatter";
import { parseMarkdownBody } from "./markdown";
import { assertValidRuleFrontmatter } from "./validate";
import {
  getAllPlaces as getConfiguredPlaces,
  getPlaceById as getConfiguredPlaceById,
  getPlaceBySlug as getConfiguredPlaceBySlug,
} from "./places";
import type { RuleDoc, RulePlace } from "./types";

// Every content/rules/*.md file, inlined as raw text at build time. This
// registry only runs in worker-imported modules, so markdown/YAML parsing
// never ends up in the client bundle.
const rawContentFiles = import.meta.glob("../../../../content/rules/*.md", {
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

const rulesByCategory = new Map<string, RuleDoc[]>();
for (const rule of RULES) {
  const list = rulesByCategory.get(rule.frontmatter.category) ?? [];
  list.push(rule);
  rulesByCategory.set(rule.frontmatter.category, list);
}

const rulesByPlace = new Map<string, RuleDoc[]>();
for (const rule of RULES) {
  const list = rulesByPlace.get(rule.frontmatter.place) ?? [];
  list.push(rule);
  rulesByPlace.set(rule.frontmatter.place, list);
}

export function getAllRules(): RuleDoc[] {
  return RULES;
}

export function getRuleById(id: string): RuleDoc | undefined {
  return rulesById.get(id);
}

export function getPlaceForRule(rule: RuleDoc): RulePlace {
  const place = getConfiguredPlaceById(rule.frontmatter.place);
  if (!place) {
    throw new Error(`Rule ${rule.frontmatter.id} references an unknown place: ${rule.frontmatter.place}`);
  }
  return place;
}

export function getPlaceFlagId(place: RulePlace): string {
  return place.id === "schengen" ? "european_union" : place.id;
}

export function getRulesForCategory(categoryId: string): RuleDoc[] {
  return rulesByCategory.get(categoryId) ?? [];
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

export { getAllCategories, getCategoryBySlug };
