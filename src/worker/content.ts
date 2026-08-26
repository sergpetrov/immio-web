import { Hono } from "hono";
import type { NotFoundHandler } from "hono";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { getAppDownloadUrlForUserAgent } from "../react-app/appStoreLinks";
import LegalPage from "../modules/content/legal/LegalPage";
import { getLegalDocument } from "../modules/content/legal/registry";
import {
  buildCatalogBreadcrumbs,
  buildCategoryBreadcrumbs,
  buildCountriesBreadcrumbs,
  buildCountryBreadcrumbs,
  buildRuleBreadcrumbs,
} from "../modules/content/rules/breadcrumbs";
import RulesPage from "../modules/content/rules/components/RulesPage";
import RuleTypePage from "../modules/content/rules/components/RuleTypePage";
import CountriesPage from "../modules/content/rules/components/CountriesPage";
import CountryPage from "../modules/content/rules/components/CountryPage";
import RulePage from "../modules/content/rules/components/RulePage";
import { renderDocument } from "../modules/content/pageShell";
import { renderSitemap } from "../modules/content/sitemap";
import {
  getAllCategories,
  getAllPlaces,
  getAllRules,
  getCategoryBySlug,
  getPlaceForRule,
  getRulesForCategory,
  getRulesForPlace,
  getUsStateRules,
} from "../modules/content/rules/registry";
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildFaqPageJsonLd,
  buildItemListJsonLd,
  buildWebPageJsonLd,
  renderJsonLd,
} from "../modules/content/rules/seo";
import type { Category, RulePlace, RuleDoc } from "../modules/content/rules/types";
import { SITE_ORIGIN, shouldIndexHost } from "../shared/site";

export interface ContentBindings {
  ASSETS: Fetcher;
}

const content = new Hono<{ Bindings: ContentBindings }>();

/** `origin` is always production (see shared/site.ts); `noindex` covers the rest. */
interface RenderContext {
  origin: string;
  appDownloadUrl: string;
  noindex: boolean;
  /** Production host only — keeps dev and preview traffic out of GA4. */
  analytics: boolean;
}

function htmlHandler(render: (context: RenderContext) => string) {
  return (request: Request) => {
    const headers = new Headers({
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600",
    });

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    const url = new URL(request.url);
    const appDownloadUrl = getAppDownloadUrlForUserAgent(request.headers.get("user-agent") ?? "");
    const isProduction = shouldIndexHost(url.hostname);
    const noindex = !isProduction;
    return new Response(render({ origin: SITE_ORIGIN, appDownloadUrl, noindex, analytics: isProduction }), {
      status: 200,
      headers,
    });
  };
}

/** Registers a route and a 301 from its trailing-slash form, so only one resolves. */
function route(path: string, handler: (request: Request) => Response) {
  content.on(["GET", "HEAD"], path, (c) => handler(c.req.raw));
  content.on(["GET", "HEAD"], `${path}/`, (c) => c.redirect(path, 301));
}

function renderCatalogDocument({ origin, appDownloadUrl, noindex, analytics }: RenderContext): string {
  const pathname = "/rules";
  const title = "Immio Rule Guide | Tax Residency, Travel & Immigration Rules";
  const description =
    "Plain-English explanations of tax residency, travel, and immigration rules, sourced from official guidance.";
  const bodyHtml = renderToStaticMarkup(
    createElement(RulesPage, { appDownloadUrl }),
  );

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    noindex,
    analytics,
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCatalogBreadcrumbs(), origin)),
      renderJsonLd(buildRuleItemList(origin, "Immio Rule Guide", getAllRules())),
    ],
    bodyHtml,
  });
}

function buildRuleItemList(origin: string, name: string, rules: RuleDoc[]): object {
  return buildItemListJsonLd({
    origin,
    name,
    items: rules.map((rule) => ({
      name: rule.frontmatter.title,
      pathname: `/rules/${rule.frontmatter.id}`,
    })),
  });
}

function renderCategoryDocument({ origin, appDownloadUrl, noindex, analytics }: RenderContext, category: Category): string {
  const pathname = `/rules/${category.slug}`;
  const title = `${category.title} Rules | Immio Rule Guide`;
  const description = category.description;
  const rules = getRulesForCategory(category.id);
  const usStateRules = category.id === "tax" ? getUsStateRules() : [];
  const listedRules = usStateRules.length > 0 ? [...rules, ...usStateRules] : rules;
  const bodyHtml = renderToStaticMarkup(
    createElement(RuleTypePage, { category, rules, usStateRules, appDownloadUrl }),
  );

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    noindex,
    analytics,
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCategoryBreadcrumbs(category), origin)),
      renderJsonLd(buildRuleItemList(origin, `${category.title} rules`, listedRules)),
    ],
    bodyHtml,
  });
}

function renderCountriesDocument({ origin, appDownloadUrl, noindex, analytics }: RenderContext): string {
  const pathname = "/rules/countries";
  const title = "Rules by Country | Immio Rule Guide";
  const description = "Browse tax residency, travel, and immigration rules by country.";
  const bodyHtml = renderToStaticMarkup(
    createElement(CountriesPage, { places: getAllPlaces(), rules: getAllRules(), appDownloadUrl }),
  );

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    noindex,
    analytics,
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCountriesBreadcrumbs(), origin)),
      renderJsonLd(
        buildItemListJsonLd({
          origin,
          name: "Rules by country",
          items: getAllPlaces().map((place) => ({
            name: place.name,
            pathname:
              getRulesForPlace(place.id).length > 1
                ? `/rules/countries/${place.slug}`
                : `/rules/${getRulesForPlace(place.id)[0].frontmatter.id}`,
          })),
        }),
      ),
    ],
    bodyHtml,
  });
}

function renderCountryDocument({ origin, appDownloadUrl, noindex, analytics }: RenderContext, place: RulePlace): string {
  const pathname = `/rules/countries/${place.slug}`;
  const title = `${place.name} Rules | Immio Rule Guide`;
  const description = `Tax residency, travel, and immigration rules for ${place.name}.`;
  const rules = getRulesForPlace(place.id);
  const bodyHtml = renderToStaticMarkup(createElement(CountryPage, { place, rules, appDownloadUrl }));

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    noindex,
    analytics,
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCountryBreadcrumbs(place), origin)),
      renderJsonLd(buildRuleItemList(origin, `${place.name} rules`, rules)),
    ],
    bodyHtml,
  });
}

function renderRuleDocument(
  { origin, appDownloadUrl, noindex, analytics }: RenderContext,
  category: Category,
  rule: RuleDoc,
): string {
  const pathname = `/rules/${rule.frontmatter.id}`;
  const { title, description } = rule.frontmatter.seo;
  const place = getPlaceForRule(rule);
  const bodyHtml = renderToStaticMarkup(createElement(RulePage, { category, rule, appDownloadUrl }));

  const faqJsonLd = buildFaqPageJsonLd(rule);

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    ogType: "article",
    noindex,
    analytics,
    page: { ruleId: rule.frontmatter.id, ruleTitle: rule.frontmatter.title },
    jsonLd: [
      renderJsonLd(buildArticleJsonLd({ origin, pathname, rule, place })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildRuleBreadcrumbs(category, rule), origin)),
      ...(faqJsonLd ? [renderJsonLd(faqJsonLd)] : []),
    ],
    bodyHtml,
  });
}

function renderLegalDocument({ origin, appDownloadUrl, noindex, analytics }: RenderContext, slug: "privacy" | "terms"): string {
  const document = getLegalDocument(slug);
  if (!document) {
    throw new Error(`Missing legal document: ${slug}`);
  }

  const pathname = slug === "privacy" ? "/privacy" : "/terms";
  const description =
    slug === "privacy"
      ? "Learn how Immio handles personal information and anonymous app data."
      : "Read the terms that apply to using the Immio app.";
  const bodyHtml = renderToStaticMarkup(createElement(LegalPage, { document, appDownloadUrl }));

  return renderDocument({
    title: `${document.headline} | Immio`,
    description,
    canonical: new URL(pathname, origin).toString(),
    noindex,
    analytics,
    jsonLd: [renderJsonLd(buildWebPageJsonLd({ origin, pathname, title: document.headline, description }))],
    bodyHtml,
  });
}

route(
  "/privacy",
  htmlHandler((context) => renderLegalDocument(context, "privacy")),
);
route(
  "/terms",
  htmlHandler((context) => renderLegalDocument(context, "terms")),
);

route("/rules", htmlHandler(renderCatalogDocument));
route("/rules/countries", htmlHandler(renderCountriesDocument));

for (const place of getAllPlaces()) {
  const rules = getRulesForPlace(place.id);
  // Single-rule countries link directly to their rule, whose Back target is
  // the countries index because there is no country-specific listing page.
  if (rules.length === 1) {
    const target = `/rules/${rules[0].frontmatter.id}`;
    content.on(["GET", "HEAD"], `/rules/countries/${place.slug}`, (c) => c.redirect(target, 301));
    content.on(["GET", "HEAD"], `/rules/countries/${place.slug}/`, (c) => c.redirect(target, 301));
    continue;
  }
  route(
    `/rules/countries/${place.slug}`,
    htmlHandler((context) => renderCountryDocument(context, place)),
  );
}

for (const category of getAllCategories()) {
  route(
    `/rules/${category.slug}`,
    htmlHandler((context) => renderCategoryDocument(context, category)),
  );
}

for (const rule of getAllRules()) {
  const category = getCategoryBySlug(rule.frontmatter.category);
  if (!category) {
    continue;
  }
  route(
    `/rules/${rule.frontmatter.id}`,
    htmlHandler((context) => renderRuleDocument(context, category, rule)),
  );
}

// Derived from the rule registry, so it can never drift from what is served.
content.on(["GET", "HEAD"], "/sitemap.xml", (c) =>
  c.body(renderSitemap(), 200, {
    "content-type": "application/xml; charset=utf-8",
    "cache-control": "public, max-age=3600",
  }),
);

/**
 * SPA routes are listed explicitly rather than served by a wildcard fallback:
 * an unknown path must 404, not return the shell with a 200 and become an
 * indexable near-duplicate of the homepage.
 */
async function serveAppShell(c: { env: ContentBindings; req: { url: string } }): Promise<Response> {
  const origin = new URL(c.req.url).origin;
  const shell = await fetchStaticPage(c.env.ASSETS, origin, "/index.html");
  return new Response(shell.body, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

content.on(["GET", "HEAD"], "/contact", (c) => serveAppShell(c));
content.on(["GET", "HEAD"], "/contact/", (c) => c.redirect("/contact", 301));

/**
 * The asset handler redirects `/404.html` to its extensionless form and the
 * ASSETS binding does not follow redirects, so an unfollowed 3xx would return
 * an empty body. Hence the single hop.
 */
async function fetchStaticPage(assets: Fetcher, origin: string, path: string): Promise<Response> {
  const response = await assets.fetch(new URL(path, origin));
  const location = response.status >= 300 && response.status < 400 ? response.headers.get("location") : null;
  return location ? assets.fetch(new URL(location, origin)) : response;
}

/**
 * Registered on the root app in worker/index.ts, not here — Hono ignores a
 * `notFound` handler on a mounted sub-app and falls back to the parent's,
 * which is the bare `404 Not Found` text response.
 */
export const notFoundHandler: NotFoundHandler<{ Bindings: ContentBindings }> = async (c) => {
  try {
    const origin = new URL(c.req.url).origin;
    const page = await fetchStaticPage(c.env.ASSETS, origin, "/404.html");
    return new Response(page.body, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return c.text("Not found", 404);
  }
};

export default content;
