import type { TocHeading } from "../types";

function TocLinks({ headings }: { headings: TocHeading[] }) {
  return (
    <ol className="content-toc__list">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>
      ))}
    </ol>
  );
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

/**
 * Desktop-only sticky sidebar (a grid sibling of the content column). On
 * compact/mobile viewports there is no in-page section nav — just the
 * standalone Back link (rendered separately by RulePage) — so this
 * component renders nothing there.
 */
export default function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="content-toc content-toc--desktop" aria-label="On this page">
      <TocLinks headings={headings} />
    </aside>
  );
}
