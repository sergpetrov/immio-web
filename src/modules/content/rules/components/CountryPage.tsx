import SiteFooter from "../../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../../react-app/components/SiteHeaderView";
import { buildCountryBreadcrumbs } from "../breadcrumbs";
import { getPlaceFlagId } from "../registry";
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
            {rules.map((rule) => (
              <RuleChip key={rule.frontmatter.id} rule={rule} backHref={`/rules/countries/${place.slug}`} />
            ))}
          </ul>

          <LegalDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
