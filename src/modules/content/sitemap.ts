import { SITE_ORIGIN } from "../../shared/site";
import { getAllCategories, getAllPlaces, getAllRules, getRulesForPlace } from "./rules/registry";

/**
 * Derived from the rule registry, so it can't drift from what is served.
 *
 * `lastmod` is emitted only where a real content date exists — never a build
 * timestamp, which would move every URL on every deploy and train crawlers to
 * ignore the field.
 */

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function newestUpdatedAt(dates: string[]): string | undefined {
  const sorted = dates.filter(Boolean).sort();
  return sorted.length > 0 ? sorted[sorted.length - 1] : undefined;
}

export function buildSitemapEntries(): SitemapEntry[] {
  const rules = getAllRules();
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "monthly", priority: "1.0" },
    {
      path: "/rules",
      lastmod: newestUpdatedAt(rules.map((rule) => rule.frontmatter.updatedAt)),
      changefreq: "weekly",
      priority: "0.9",
    },
  ];

  for (const category of getAllCategories()) {
    const categoryRules = rules.filter((rule) => rule.frontmatter.category === category.id);
    entries.push({
      path: `/rules/${category.slug}`,
      lastmod: newestUpdatedAt(categoryRules.map((rule) => rule.frontmatter.updatedAt)),
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  entries.push({
    path: "/rules/countries",
    lastmod: newestUpdatedAt(rules.map((rule) => rule.frontmatter.updatedAt)),
    changefreq: "weekly",
    priority: "0.8",
  });

  for (const place of getAllPlaces()) {
    const placeRules = getRulesForPlace(place.id);
    // Single-rule places 301 to their rule (see worker/content.ts) — a sitemap
    // should only ever list the redirect target, never the redirect.
    if (placeRules.length < 2) {
      continue;
    }
    entries.push({
      path: `/rules/countries/${place.slug}`,
      lastmod: newestUpdatedAt(placeRules.map((rule) => rule.frontmatter.updatedAt)),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  for (const rule of rules) {
    entries.push({
      path: `/rules/${rule.frontmatter.id}`,
      lastmod: rule.frontmatter.updatedAt,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // `/contact` is deliberately absent. It is served from the SPA shell, whose
  // canonical is hardcoded to "/", so listing it would advertise a URL that
  // declares itself a duplicate of the homepage — the sitemap and the
  // canonical would be telling Google opposite things. Add it back once the
  // client-rendered routes are server-rendered with their own <head>.
  entries.push(
    { path: "/privacy", changefreq: "yearly", priority: "0.2" },
    { path: "/terms", changefreq: "yearly", priority: "0.2" },
  );

  return entries;
}

export function renderSitemap(): string {
  const urls = buildSitemapEntries()
    .map((entry) => {
      const loc = escapeXml(new URL(entry.path, SITE_ORIGIN).toString());
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      return `  <url>
    <loc>${loc}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
