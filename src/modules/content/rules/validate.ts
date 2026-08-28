import type { CategoryId, RuleFrontmatter } from "./types";
import { getParentPlaceId, getPlaceById } from "./places";

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

  for (const field of ["id", "title", "updatedAt"]) {
    if (!isNonEmptyString(record[field])) {
      fail(filePath, `"${field}" is required and must be a non-empty string`);
    }
  }

  if (record.subtitle !== undefined && !isNonEmptyString(record.subtitle)) {
    fail(filePath, '"subtitle", if present, must be a non-empty string');
  }

  if (record.shortTitle !== undefined && !isNonEmptyString(record.shortTitle)) {
    fail(filePath, '"shortTitle", if present, must be a non-empty string');
  }

  if (record.publishedAt !== undefined && !isNonEmptyString(record.publishedAt)) {
    fail(filePath, '"publishedAt", if present, must be a non-empty date string');
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

  if (record.place !== undefined) {
    if (!isNonEmptyString(record.place)) {
      fail(filePath, `"place", if present, must be a non-empty string`);
    }
    const placeId = record.place;
    if (!/^[a-z][a-z0-9_]*(-[a-z0-9]+)?$/.test(placeId)) {
      fail(filePath, `"place" must be a place ID, optionally with a "-{subdivision}" suffix`);
    }
    if (!getPlaceById(getParentPlaceId(placeId))) {
      fail(filePath, `"place" must reference a configured place ID (or a sub-national id whose parent is configured)`);
    }
  }

  if (record.icon !== undefined && !isNonEmptyString(record.icon)) {
    fail(filePath, `"icon", if present, must be a non-empty string`);
  }

  if (record.relatedContent !== undefined) {
    if (!Array.isArray(record.relatedContent) || !record.relatedContent.every(isNonEmptyString)) {
      fail(filePath, `"relatedContent" must be an array of content IDs`);
    }
  }

  return record as unknown as RuleFrontmatter;
}
