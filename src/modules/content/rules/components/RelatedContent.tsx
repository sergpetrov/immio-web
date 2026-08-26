import { getRuleById, getRuleFlagFile } from "../registry";
import type { RuleDoc } from "../types";

/**
 * "Related content" at the end of a rule article, built from the
 * `relatedContent` IDs in frontmatter. Order is authored, not computed.
 *
 * Renders nothing when a rule has no `relatedContent`, so rules can be
 * back-filled one at a time.
 */

/** Also enforced at build time by scripts/validate-content.mjs. */
const MAX_RELATED = 6;

export default function RelatedContent({ rule }: { rule: RuleDoc }) {
  const ids = rule.frontmatter.relatedContent ?? [];
  if (ids.length === 0) {
    return null;
  }

  const related = ids
    .filter((id) => id !== rule.frontmatter.id)
    .slice(0, MAX_RELATED)
    .map((id) => getRuleById(id))
    .filter((doc): doc is RuleDoc => doc !== undefined);

  if (related.length === 0) {
    return null;
  }

  return (
    <aside className="content-related" aria-labelledby="related-content-heading">
      <h2 id="related-content-heading" className="content-related__heading">
        Related content
      </h2>
      <ul className="content-related__list">
        {related.map((doc) => {
          return (
            <li key={doc.frontmatter.id} className="content-related__item">
              <a className="content-related__link" href={`/rules/${doc.frontmatter.id}`}>
                <img
                  className="content-related__flag"
                  src={`/flags/${getRuleFlagFile(doc)}`}
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="content-related__title">{doc.frontmatter.title}</span>
                <span className="content-related__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
