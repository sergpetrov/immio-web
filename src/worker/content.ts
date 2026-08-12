import { Hono } from "hono";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { getAppDownloadUrlForUserAgent } from "../react-app/appStoreLinks";
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
import {
  getAllCategories,
  getAllPlaces,
  getAllRules,
  getCategoryBySlug,
  getRulesForCategory,
  getRulesForPlace,
} from "../modules/content/rules/registry";
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildWebPageJsonLd,
  renderJsonLd,
} from "../modules/content/rules/seo";
import type { Category, RulePlace, RuleDoc } from "../modules/content/rules/types";

const content = new Hono();

function htmlHandler(render: (origin: string, appDownloadUrl: string) => string) {
  return (request: Request) => {
    const headers = new Headers({
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600",
    });

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    const origin = new URL(request.url).origin;
    const appDownloadUrl = getAppDownloadUrlForUserAgent(request.headers.get("user-agent") ?? "");
    return new Response(render(origin, appDownloadUrl), { status: 200, headers });
  };
}

function renderCatalogDocument(origin: string, appDownloadUrl: string): string {
  const pathname = "/rules";
  const title = "Immio Rule Guide | Tax Residency, Travel & Immigration Rules";
  const description =
    "Plain-English explanations of tax residency, travel, and immigration rules, sourced from official guidance.";
  const bodyHtml = renderToStaticMarkup(
    createElement(RulesPage, { categories: getAllCategories(), appDownloadUrl }),
  );

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCatalogBreadcrumbs(), origin)),
    ],
    bodyHtml,
  });
}

function renderCategoryDocument(origin: string, appDownloadUrl: string, category: Category): string {
  const pathname = `/rules/${category.slug}`;
  const title = `${category.title} Rules | Immio Rule Guide`;
  const description = category.description;
  const bodyHtml = renderToStaticMarkup(
    createElement(RuleTypePage, { category, rules: getRulesForCategory(category.id), appDownloadUrl }),
  );

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCategoryBreadcrumbs(category), origin)),
    ],
    bodyHtml,
  });
}

function renderCountriesDocument(origin: string, appDownloadUrl: string): string {
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
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCountriesBreadcrumbs(), origin)),
    ],
    bodyHtml,
  });
}

function renderCountryDocument(origin: string, appDownloadUrl: string, place: RulePlace): string {
  const pathname = `/rules/countries/${place.slug}`;
  const title = `${place.name} Rules | Immio Rule Guide`;
  const description = `Tax residency, travel, and immigration rules for ${place.name}.`;
  const bodyHtml = renderToStaticMarkup(
    createElement(CountryPage, { place, rules: getRulesForPlace(place.id), appDownloadUrl }),
  );

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    jsonLd: [
      renderJsonLd(buildWebPageJsonLd({ origin, pathname, title, description })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildCountryBreadcrumbs(place), origin)),
    ],
    bodyHtml,
  });
}

function renderRuleDocument(origin: string, appDownloadUrl: string, category: Category, rule: RuleDoc): string {
  const pathname = `/rules/${rule.frontmatter.id}`;
  const { title, description } = rule.frontmatter.seo;
  const bodyHtml = renderToStaticMarkup(createElement(RulePage, { category, rule, appDownloadUrl }));

  return renderDocument({
    title,
    description,
    canonical: new URL(pathname, origin).toString(),
    jsonLd: [
      renderJsonLd(buildArticleJsonLd({ origin, pathname, rule })),
      renderJsonLd(buildBreadcrumbListJsonLd(buildRuleBreadcrumbs(category, rule), origin)),
    ],
    bodyHtml,
  });
}

const catalogHandler = htmlHandler(renderCatalogDocument);
content.on(["GET", "HEAD"], "/rules", (c) => catalogHandler(c.req.raw));
content.on(["GET", "HEAD"], "/rules/", (c) => catalogHandler(c.req.raw));

const countriesHandler = htmlHandler(renderCountriesDocument);
content.on(["GET", "HEAD"], "/rules/countries", (c) => countriesHandler(c.req.raw));
content.on(["GET", "HEAD"], "/rules/countries/", (c) => countriesHandler(c.req.raw));

for (const place of getAllPlaces()) {
  const rules = getRulesForPlace(place.id);
  // Single-rule countries link directly to their rule, whose Back target is
  // the countries index because there is no country-specific listing page.
  if (rules.length === 1) {
    const target = `/rules/${rules[0].frontmatter.id}`;
    content.on(["GET", "HEAD"], `/rules/countries/${place.slug}`, (c) => c.redirect(target, 301));
    continue;
  }
  const handler = htmlHandler((origin, appDownloadUrl) => renderCountryDocument(origin, appDownloadUrl, place));
  content.on(["GET", "HEAD"], `/rules/countries/${place.slug}`, (c) => handler(c.req.raw));
}

for (const category of getAllCategories()) {
  const handler = htmlHandler((origin, appDownloadUrl) => renderCategoryDocument(origin, appDownloadUrl, category));
  content.on(["GET", "HEAD"], `/rules/${category.slug}`, (c) => handler(c.req.raw));
}

for (const rule of getAllRules()) {
  const category = getCategoryBySlug(rule.frontmatter.category);
  if (!category) {
    continue;
  }
  const handler = htmlHandler((origin, appDownloadUrl) =>
    renderRuleDocument(origin, appDownloadUrl, category, rule),
  );
  content.on(["GET", "HEAD"], `/rules/${rule.frontmatter.id}`, (c) => handler(c.req.raw));
}

export default content;
