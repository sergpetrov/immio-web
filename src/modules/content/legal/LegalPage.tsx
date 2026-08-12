import SiteFooter from "../../../react-app/components/SiteFooter";
import SiteHeaderView from "../../../react-app/components/SiteHeaderView";
import TableOfContents from "../components/TableOfContents";
import type { LegalDocument } from "./registry";

export default function LegalPage({ document, appDownloadUrl }: { document: LegalDocument; appDownloadUrl: string }) {
  return (
    <div className="content">
      <SiteHeaderView appDownloadUrl={appDownloadUrl} isLanding={false} solid={false} navOpen={false} />
      <main className="content-main content-main--rule">
        <div className="content-layout">
          <div className="content-content">
            <article className="content-article content-legal-article">
              <header className="content-article__header">
                <h1>{document.headline}</h1>
              </header>
              <div className="content-legal__intro" dangerouslySetInnerHTML={{ __html: document.introHtml }} />
              {document.sections.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                  <h2 id={`${section.id}-heading`}>{section.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.html }} />
                </section>
              ))}
            </article>
          </div>
          <TableOfContents headings={document.toc} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
