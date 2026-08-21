/**
 * Cross-file validation of content/rules, run from `npm run build`.
 *
 * Must be a real build step: `vite build` bundles the worker without executing
 * it, so an equivalent check inside registry.ts would not fire until the first
 * production request — where a throw fails worker init and 500s every page.
 * Single-file shape checks stay in rules/validate.ts, which runs per request.
 *
 * Reads the Markdown directly; the registry needs Vite's import.meta.glob.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rulesDir = resolve(repoRoot, "content/rules");

/** Keep in step with MAX_RELATED in components/RelatedContent.tsx. */
const MAX_RELATED = 6;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".md") ? [full] : [];
  });
}

const errors = [];
const rules = new Map();

for (const file of walk(rulesDir)) {
  const raw = readFileSync(file, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`);
    continue;
  }
  const fm = load(match[1]);
  const rel = repoRoot ? file.replace(`${repoRoot}/`, "") : file;
  if (rules.has(fm.id)) {
    errors.push(`${rel}: duplicate rule id "${fm.id}" (also in ${rules.get(fm.id).file})`);
    continue;
  }
  rules.set(fm.id, { file: rel, frontmatter: fm });
}

const inbound = new Map([...rules.keys()].map((id) => [id, 0]));

for (const [id, { file, frontmatter }] of rules) {
  const related = frontmatter.relatedContent ?? [];

  if (related.length > MAX_RELATED) {
    errors.push(`${file}: "relatedContent" has ${related.length} entries, max is ${MAX_RELATED}`);
  }
  if (new Set(related).size !== related.length) {
    errors.push(`${file}: "relatedContent" contains duplicates`);
  }
  for (const relatedId of related) {
    if (relatedId === id) {
      errors.push(`${file}: "relatedContent" lists itself`);
    } else if (!rules.has(relatedId)) {
      errors.push(`${file}: "relatedContent" references unknown rule "${relatedId}"`);
    } else {
      inbound.set(relatedId, inbound.get(relatedId) + 1);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n✗ content validation failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}

// Coverage is reported, not enforced: relatedContent is being back-filled a
// rule at a time, so most rules legitimately have none yet. Turn this into an
// error once the back-fill is complete.
const withRelated = [...rules.values()].filter((r) => (r.frontmatter.relatedContent ?? []).length > 0).length;
const linked = [...inbound.values()].filter((n) => n > 0).length;
console.log(
  `✓ content: ${rules.size} rules · ${withRelated} with relatedContent · ${linked} receiving inbound related links`,
);
