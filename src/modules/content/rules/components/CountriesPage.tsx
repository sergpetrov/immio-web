import SiteFooter from "../../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../../react-app/components/SiteHeaderView";
import { buildCountriesBreadcrumbs } from "../breadcrumbs";
import { getPlaceFlagId, getPlaceForRule, getRulesForPlace } from "../registry";
import type { RuleDoc, RulePlace } from "../types";
import Breadcrumbs from "./Breadcrumbs";
import RuleChip from "./RuleChip";

export default function CountriesPage({
  places,
  rules,
  appDownloadUrl,
}: {
  places: RulePlace[];
  rules: RuleDoc[];
  appDownloadUrl: string;
}) {
  return (
    <div className="content">
      <SiteHeaderView appDownloadUrl={appDownloadUrl} isLanding={false} solid={false} navOpen={false} />
      <main className="content-main">
        <div className="content-content content-catalog">
          <Breadcrumbs items={buildCountriesBreadcrumbs()} />

          <header className="content-article__header">
            <h1>Search a rule</h1>
          </header>

          <div className="content-country-search">
            <img src="/content/ic_search.svg" alt="" width={28} height={28} />
            <input
              type="search"
              placeholder="Country, US state or rule name"
              aria-label="Search rules by country"
              data-country-search
            />
            <button
              type="button"
              className="content-country-search__clear"
              aria-label="Clear search"
              data-clear-search
              hidden
            >
              <img src="/content/ic_clear.svg" alt="" width={18} height={18} />
            </button>
          </div>

          <ul className="content-search-results content-type-list is-active" data-search-results hidden>
            {rules.map((rule) => {
              const place = getPlaceForRule(rule);
              const searchableText = [
                rule.frontmatter.title,
                rule.frontmatter.subtitle,
                rule.frontmatter.seo.description,
                place.id,
                place.name,
              ]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase();

              return <RuleChip key={rule.frontmatter.id} rule={rule} backHref="/rules/countries" searchableText={searchableText} />;
            })}
          </ul>

          <ul className="content-country-grid" data-country-grid>
            {places.map((place) => {
              const rules = getRulesForPlace(place.id);
              const count = rules.length;
              const href = count === 1 ? `/rules/${rules[0].frontmatter.id}` : `/rules/countries/${place.slug}`;

              return (
                <li key={place.id}>
                  <a className="content-country-card" href={href} data-rule-origin={count === 1 ? "/rules/countries" : undefined}>
                    <img
                      className="content-country-card__flag"
                      src={`/flags/${getPlaceFlagId(place)}.svg`}
                      alt=""
                    />
                    <span className="content-country-card__body">
                      <span className="content-country-card__name">{place.name}</span>
                      <span className="content-country-card__count">
                        {count} {count === 1 ? "Rule" : "Rules"}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
