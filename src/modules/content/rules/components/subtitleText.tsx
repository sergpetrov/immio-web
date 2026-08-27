import { Fragment } from "react";

const BULLET = "•";

/**
 * Renders a subtitle, scaling down any "•" separators so they match the
 * smaller "∙" used elsewhere.
 */
export default function SubtitleText({ text }: { text: string }) {
  const parts = text.split(BULLET);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? <span className="content-bullet">{BULLET}</span> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
