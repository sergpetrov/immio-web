import SiteFooter from "../../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../../react-app/components/SiteHeaderView";
import { buildCategoryBreadcrumbs } from "../breadcrumbs";
import type { Category, RuleDoc } from "../types";
import Breadcrumbs from "./Breadcrumbs";
import LegalDisclaimer from "./LegalDisclaimer";
import RuleChip from "./RuleChip";

export default function RuleTypePage({
  category,
  rules,
  usStateRules = [],
  appDownloadUrl,
}: {
  category: Category;
  rules: RuleDoc[];
  usStateRules?: RuleDoc[];
  appDownloadUrl: string;
}) {
  const hasCountryRules = rules.length > 0;
  const hasStateRules = usStateRules.length > 0;

  return (
    <div className="content">
      <SiteHeaderView appDownloadUrl={appDownloadUrl} isLanding={false} solid={false} navOpen={false} />
      <main className="content-main">
        <div className="content-content content-catalog">
          <Breadcrumbs items={buildCategoryBreadcrumbs(category)} />

          <header className="content-article__header">
            <h1>{category.title}</h1>
            <p className="content-catalog__lede">{category.intro ?? category.description}</p>
          </header>

          {!hasCountryRules && !hasStateRules ? (
            <p className="content-empty">Content for this category is coming soon.</p>
          ) : (
            <ul className="content-type-list is-active">
              {rules.map((rule) => (
                <RuleChip key={rule.frontmatter.id} rule={rule} backHref={`/rules/${category.slug}`} />
              ))}
              {hasStateRules ? (
                <>
                  <li className="content-catalog-group">
                    <h2 className="content-catalog-group__label">US States</h2>
                  </li>
                  {usStateRules.map((rule) => (
                    <RuleChip key={rule.frontmatter.id} rule={rule} backHref={`/rules/${category.slug}`} />
                  ))}
                </>
              ) : null}
            </ul>
          )}

          <LegalDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
