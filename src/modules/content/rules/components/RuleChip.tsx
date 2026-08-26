import type { RuleDoc } from "../types";
import { getRuleFlagFile } from "../registry";

/** A single rule as a full-width rounded chip: flag + title + subtitle. */
export default function RuleChip({
  rule,
  backHref,
  searchableText,
}: {
  rule: RuleDoc;
  backHref: string;
  searchableText?: string;
}) {
  const { frontmatter } = rule;
  const href = `/rules/${frontmatter.id}`;

  return (
    <li data-searchable-rule={searchableText}>
      <a className="content-rule-chip" href={href} data-rule-origin={backHref}>
        <span className="content-rule-chip__title-row has-flag">
          <img
            className="content-rule-chip__flag"
            src={`/flags/${getRuleFlagFile(rule)}`}
            alt=""
          />
          <span className="content-rule-chip__content">
            <span className="content-rule-chip__title">{frontmatter.title}</span>
            {frontmatter.subtitle ? (
              <span className="content-rule-chip__subtitle">{frontmatter.subtitle}</span>
            ) : null}
          </span>
        </span>
      </a>
    </li>
  );
}
