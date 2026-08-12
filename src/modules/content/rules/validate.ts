import type { CategoryId, RuleFrontmatter } from "./types";
import { getPlaceById } from "./places";

const CATEGORY_IDS: CategoryId[] = ["tax", "travel", "immigration"];

function fail(filePath: string, message: string): never {
  throw new Error(`Invalid rule frontmatter in ${filePath}: ${message}`);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function assertValidRuleFrontmatter(data: unknown, filePath: string): RuleFrontmatter {
  if (typeof data !== "object" || data === null) {
    fail(filePath, "frontmatter must be a YAML object");
  }

  const record = data as Record<string, unknown>;

  for (const field of ["id", "title", "place", "description", "updatedAt"]) {
    if (!isNonEmptyString(record[field])) {
      fail(filePath, `"${field}" is required and must be a non-empty string`);
    }
  }

  if (record.subtitle !== undefined && !isNonEmptyString(record.subtitle)) {
    fail(filePath, '"subtitle", if present, must be a non-empty string');
  }

  if (!CATEGORY_IDS.includes(record.category as CategoryId)) {
    fail(filePath, `"category" must be one of: ${CATEGORY_IDS.join(", ")}`);
  }

  const seo = record.seo as Record<string, unknown> | undefined;
  if (typeof seo !== "object" || seo === null || !isNonEmptyString(seo.title) || !isNonEmptyString(seo.description)) {
    fail(filePath, `"seo.title" and "seo.description" are required`);
  }

  if (!Array.isArray(record.sources) || record.sources.length === 0) {
    fail(filePath, `"sources" must be a non-empty array`);
  }

  for (const source of record.sources as unknown[]) {
    const s = source as Record<string, unknown>;
    if (!isNonEmptyString(s.title) || !isNonEmptyString(s.url) || !isNonEmptyString(s.type)) {
      fail(filePath, `each entry in "sources" needs a title, url, and type`);
    }
  }

  if (!getPlaceById(record.place as string)) {
    fail(filePath, `"place" must reference a configured place ID`);
  }

  if (record.relatedContent !== undefined) {
    if (!Array.isArray(record.relatedContent) || !record.relatedContent.every(isNonEmptyString)) {
      fail(filePath, `"relatedContent" must be an array of content IDs`);
    }
  }

  return record as unknown as RuleFrontmatter;
}
