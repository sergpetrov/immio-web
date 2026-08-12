import FaqAccordionView from "../../../../react-app/components/FaqAccordionView";
import type { RuleSection } from "../types";

/**
 * Renders an FAQ section using the exact same accordion component/CSS as
 * the landing page (FaqAccordionView). Starts fully closed, matching the
 * landing page's default state; pageShell.ts's inline script wires up the
 * same single-open click behavior as the landing page's React state, since
 * this page never hydrates.
 */
export default function FaqSection({ section }: { section: RuleSection }) {
  if (!section.faqItems || section.faqItems.length === 0) {
    return null;
  }

  const items = section.faqItems.map((item) => ({
    question: item.question,
    answer: <span dangerouslySetInnerHTML={{ __html: item.answerHtml }} />,
  }));

  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <FaqAccordionView items={items} idPrefix={section.id} openIndex={null} />
    </section>
  );
}
