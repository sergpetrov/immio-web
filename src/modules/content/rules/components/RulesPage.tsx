import SiteFooter from "../../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../../react-app/components/SiteHeaderView";
import { getPlaceFlagId, getPlaceForRule, getRulesForCategory } from "../registry";
import type { Category } from "../types";
import LegalDisclaimer from "./LegalDisclaimer";

export default function RulesPage({ categories, appDownloadUrl }: { categories: Category[]; appDownloadUrl: string }) {
  return (
    <div className="content">
      <SiteHeaderView appDownloadUrl={appDownloadUrl} isLanding={false} solid={false} navOpen={false} />
      <main className="content-main">
        <div className="content-content content-catalog">
          <header className="content-article__header">
            <h1>Rule Guide</h1>
            <p className="content-catalog__lede">
              Country-by-country guidance on tax residency thresholds, visa day limits, residence permits and citizenship requirements —
              how each rule counts your days, when it applies, edge cases, examples, and what it means for you. </p>
          </header>

          <div className="content-type-switch-row">
            <div className="content-type-switch" role="tablist" aria-label="Rule category">
              <span className="content-type-switch__pill" aria-hidden="true" />
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  className={`content-type-switch__item${index === 0 ? " is-selected" : ""}`}
                  data-category={category.id}
                  role="tab"
                  aria-selected={index === 0}
                >
                  {category.shortTitle ?? category.title}
                </button>
              ))}
            </div>
            <a className="content-search-button" href="/rules/countries?search=1" aria-label="Browse rules by country">
              <img src="/content/ic_search.svg" alt="" width={28} height={28} />
            </a>
          </div>

          {categories.map((category, index) => {
            const rules = getRulesForCategory(category.id);
            return (
              <ul
                key={category.id}
                className={`content-type-list${index === 0 ? " is-active" : ""}`}
                data-category-list={category.id}
              >
                {rules.length === 0 ? (
                  <li className="content-empty">Content for this category is coming soon.</li>
                ) : (
                  rules.map((rule) => (
                    <li key={rule.frontmatter.id}>
                      <a className="content-rule-chip" href={`/rules/${rule.frontmatter.id}`} data-rule-origin="/rules">
                        <span className="content-rule-chip__title-row has-flag">
                          <img
                            className="content-rule-chip__flag"
                            src={`/flags/${getPlaceFlagId(getPlaceForRule(rule))}.svg`}
                            alt=""
                          />
                          <span className="content-rule-chip__content">
                            <span className="content-rule-chip__title">{rule.frontmatter.title}</span>
                            {rule.frontmatter.subtitle ? (
                              <span className="content-rule-chip__subtitle">{rule.frontmatter.subtitle}</span>
                            ) : null}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))
                )}
              </ul>
            );
          })}

          <LegalDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
