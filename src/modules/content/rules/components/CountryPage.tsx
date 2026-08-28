import SiteFooter from "../../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../../react-app/components/SiteHeaderView";
import { buildCountryBreadcrumbs } from "../breadcrumbs";
import { getPlaceFlagId, isSubnationalPlaceId } from "../registry";
import type { RulePlace, RuleDoc } from "../types";
import Breadcrumbs from "./Breadcrumbs";
import LegalDisclaimer from "./LegalDisclaimer";
import RuleChip from "./RuleChip";

export default function CountryPage({
  place,
  rules,
  appDownloadUrl,
}: {
  place: RulePlace;
  rules: RuleDoc[];
  appDownloadUrl: string;
}) {
  const countryRules = rules.filter((rule) => {
    const placeId = rule.frontmatter.place;
    return !placeId || !isSubnationalPlaceId(placeId);
  });
  const usStateRules = rules.filter((rule) => {
    const placeId = rule.frontmatter.place;
    return Boolean(placeId) && isSubnationalPlaceId(placeId);
  });
  const backHref = `/rules/countries/${place.slug}`;
  return (
    <div className="content">
      <SiteHeaderView appDownloadUrl={appDownloadUrl} isLanding={false} solid={false} navOpen={false} />
      <main className="content-main">
        <div className="content-content content-catalog">
          <Breadcrumbs items={buildCountryBreadcrumbs(place)} />

          <header className="content-article__header content-article__header--with-flag">
            <h1>{place.name}</h1>
            <img
              className="content-article__flag"
              src={`/flags/${getPlaceFlagId(place)}.svg`}
              alt=""
              width={24}
              height={24}
            />
          </header>

          <ul className="content-type-list is-active">
            {countryRules.map((rule) => (
              <RuleChip key={rule.frontmatter.id} rule={rule} backHref={backHref} />
            ))}
            {usStateRules.length > 0 ? (
              <>
                <li className="content-catalog-group">
                  <h2 className="content-catalog-group__label">US States</h2>
                </li>
                {usStateRules.map((rule) => (
                  <RuleChip key={rule.frontmatter.id} rule={rule} backHref={backHref} />
                ))}
              </>
            ) : null}
          </ul>

          <LegalDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
