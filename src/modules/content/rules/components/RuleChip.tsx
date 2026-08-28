import { getRuleIconSrc } from "../registry";
import type { RuleDoc } from "../types";
import SubtitleText from "./subtitleText";

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
  const iconSrc = getRuleIconSrc(rule);

  return (
    <li data-searchable-rule={searchableText}>
      <a className="content-rule-chip" href={href} data-rule-origin={backHref}>
        <span className={`content-rule-chip__title-row${iconSrc ? " has-flag" : ""}`}>
          {iconSrc ? (
            <img
              className={`content-rule-chip__flag${frontmatter.icon ? " content-rule-chip__flag--mono" : ""}`}
              src={iconSrc}
              alt=""
            />
          ) : null}
          <span className="content-rule-chip__content">
            <span className="content-rule-chip__title">{frontmatter.title}</span>
            {frontmatter.subtitle ? (
              <span className="content-rule-chip__subtitle">
                <SubtitleText text={frontmatter.subtitle} />
              </span>
            ) : null}
          </span>
        </span>
      </a>
    </li>
  );
}
