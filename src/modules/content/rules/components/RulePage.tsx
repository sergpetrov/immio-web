import SiteFooter from "../../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../../react-app/components/SiteHeaderView";
import { buildRuleBreadcrumbs } from "../breadcrumbs";
import { getPlaceFlagId, getPlaceForRule } from "../registry";
import type { Category, RuleDoc } from "../types";
import Breadcrumbs from "./Breadcrumbs";
import LegalDisclaimer from "./LegalDisclaimer";
import FaqSection from "./FaqSection";
import RelatedContent from "./RelatedContent";
import RuleAppCta from "./RuleAppCta";
import TableOfContents from "../../components/TableOfContents";

function formatMonthYear(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function RulePage({
  category,
  rule,
  appDownloadUrl,
}: {
  category: Category;
  rule: RuleDoc;
  appDownloadUrl: string;
}) {
  const { frontmatter, headline, sections, toc } = rule;
  const place = getPlaceForRule(rule);

  return (
    <div className="content">
      <SiteHeaderView appDownloadUrl={appDownloadUrl} isLanding={false} solid={false} navOpen={false} />
      <main className="content-main content-main--rule">
        {/* Defaults to /rules; pageShell.ts replaces it with a remembered listing-page origin when available. */}
        <a className="content-back-link content-back-row" href="/rules" data-back-link>
          ← Back
        </a>

        <div className="content-layout">
          <div className="content-content">
            <Breadcrumbs items={buildRuleBreadcrumbs(category, rule)} />

            <article className="content-article">
              <header
                className="content-article__header content-article__header--with-flag"
              >
                <h1>{headline}</h1>
                <img
                  className="content-article__flag"
                  src={`/flags/${getPlaceFlagId(place)}.svg`}
                  alt={`${place.name} flag`}
                  width={24}
                  height={24}
                />
              </header>
              <p className="content-article__meta">
                Verified in {formatMonthYear(frontmatter.updatedAt)}
              </p>
              {sections.map((section) => {
                const keepTrack = section.title.trim().toLowerCase() === "how to keep track";

                if (section.faqItems) {
                  return <FaqSection key={section.id} section={section} />;
                }

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className={keepTrack ? "content-keep-track-block" : undefined}
                    aria-labelledby={`${section.id}-heading`}
                  >
                    <h2 id={`${section.id}-heading`}>{section.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: section.html }} />
                    {keepTrack ? (
                      <aside className="content-callout">
                        <p>
                          <strong className="content-callout__lead">
                            Automatically track this rule and see where you stand.
                          </strong>{" "}
                          Immio app correctly counts the days, alerts before you exceed
                          the limit, and privately stores your travel data and attached travel proofs.{" "}
                          <br />
                          <a
                            className="content-callout__cta"
                            href={appDownloadUrl}
                            data-app-download
                            data-app-source="rule_content_keep_track"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <strong>Get the app →</strong>
                          </a>
                        </p>
                      </aside>
                    ) : null}
                  </section>
                );
              })}
              <RuleAppCta appDownloadUrl={appDownloadUrl} />
              <RelatedContent rule={rule} />
              <LegalDisclaimer />
            </article>
          </div>

          <TableOfContents headings={toc} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
