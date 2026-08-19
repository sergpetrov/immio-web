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
  appDownloadUrl,
}: {
  category: Category;
  rules: RuleDoc[];
  appDownloadUrl: string;
}) {
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

          {rules.length === 0 ? (
            <p className="content-empty">Content for this category is coming soon.</p>
          ) : (
            <ul className="content-type-list is-active">
              {rules.map((rule) => (
                <RuleChip key={rule.frontmatter.id} rule={rule} backHref={`/rules/${category.slug}`} />
              ))}
            </ul>
          )}

          <LegalDisclaimer />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
