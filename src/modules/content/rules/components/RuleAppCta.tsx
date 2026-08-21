/**
 * Closing CTA after the FAQ: the rule reader's next step is tracking the rule
 * rather than counting days by hand. Copy matches the mid-article "how to keep
 * track" callout in RulePage. Hidden in the in-app WebView (see
 * `.content-app-cta` in content.css) alongside the other app promos.
 */
export default function RuleAppCta({ appDownloadUrl }: { appDownloadUrl: string }) {
  return (
    <aside className="content-app-cta" aria-labelledby="app-cta-heading">
      <img className="content-app-cta__app-icon" src="/logo.svg" alt="" width={40} height={40} />
      <h2 id="app-cta-heading" className="content-app-cta__heading">
        Automatically track this rule and<br/>see where you stand
      </h2>
      <p className="content-app-cta__lead">
        <strong>Immio</strong> app correctly counts the days, alerts before you exceed
        the limit, and privately stores your travel data and attached travel proofs.
      </p>
      <a
        className="content-app-cta__button"
        href={appDownloadUrl}
        data-app-download
        data-app-source="rule_content_bottom_section"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="content-app-cta__button-icon"
          viewBox="0 0 12 18"
          width={12}
          height={18}
          aria-hidden="true"
          focusable="false"
        >
          <rect x="0.75" y="0.75" width="10.5" height="16.5" rx="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="14.4" width="4" height="1.2" rx="0.6" fill="currentColor" />
        </svg>
        Get the app
      </a>
    </aside>
  );
}
