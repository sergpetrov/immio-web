/**
 * Release check: do newly added rules have an inbound `relatedContent` link
 * from a rule that already shipped?
 *
 *   npm run check:new-rule-links            # against origin/main
 *   npm run check:new-rule-links -- HEAD~5  # against any ref
 *
 * validate-content.mjs already asserts every rule receives at least one inbound
 * link, but that passes when a batch of new rules only links to itself: those
 * pages are reachable solely from other pages Google has not crawled, so they
 * inherit no authority and get discovered last. What matters is a link from a
 * page that is already indexed.
 *
 * Deliberately NOT part of `npm run build`. It needs git history, and the
 * deploy build runs on a clone that may be shallow — a build that fails there
 * takes the whole site down for a link-graph opinion.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rulesDir = resolve(repoRoot, "content/rules");
const baseRef = process.argv[2] ?? "origin/main";

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".md") ? [full] : [];
  });
}

function git(...args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
}

/** Rule files that do not exist at baseRef, i.e. added since. */
function addedSince(ref) {
  let shipped;
  try {
    shipped = new Set(
      git("ls-tree", "-r", "--name-only", ref, "content/rules")
        .split("\n")
        .filter((line) => line.endsWith(".md")),
    );
  } catch {
    console.error(`! cannot read "${ref}" — fetch it, or pass a ref that exists.`);
    process.exit(2);
  }
  return shipped;
}

const shippedFiles = addedSince(baseRef);

const rules = new Map();
for (const file of walk(rulesDir)) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, "utf8"));
  if (!match) continue;
  const fm = load(match[1]);
  const rel = file.replace(`${repoRoot}/`, "");
  rules.set(fm.id, { rel, related: fm.relatedContent ?? [], isNew: !shippedFiles.has(rel) });
}

const inbound = new Map([...rules.keys()].map((id) => [id, []]));
for (const [id, { related }] of rules) {
  for (const target of related) {
    inbound.get(target)?.push(id);
  }
}

const newRules = [...rules].filter(([, r]) => r.isNew);
const orphans = newRules.filter(([id]) => !inbound.get(id).some((src) => !rules.get(src).isNew));

if (newRules.length === 0) {
  console.log(`✓ no rules added since ${baseRef}`);
  process.exit(0);
}

console.log(`Rules added since ${baseRef}: ${newRules.length}\n`);
for (const [id] of newRules) {
  const from = inbound.get(id);
  const shipped = from.filter((src) => !rules.get(src).isNew);
  console.log(`  ${shipped.length ? "✓" : "✗"} ${id.padEnd(38)} ${from.length} inbound, ${shipped.length} from already-shipped pages`);
}

if (orphans.length > 0) {
  console.error(
    `\n✗ ${orphans.length} new rule(s) linked only from other new rules. Add each to the ` +
      `relatedContent of a page that already shipped — see §19a of ai/Rule Generation Plan.md:`,
  );
  for (const [id] of orphans) console.error(`    ${id}`);
  process.exit(1);
}

console.log(`\n✓ all ${newRules.length} new rules have an inbound link from an already-shipped page`);
