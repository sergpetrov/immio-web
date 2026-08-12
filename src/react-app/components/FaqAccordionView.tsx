import type { ReactNode } from "react";

export interface FaqAccordionItem {
  question: string;
  answer: ReactNode;
}

export interface FaqAccordionViewProps {
  items: FaqAccordionItem[];
  idPrefix: string;
  openIndex: number | null;
  onToggle?: (index: number) => void;
}

/**
 * Pure presentational accordion — no window/document references, so it can
 * be renderToStaticMarkup'd by the Worker as well as hydrated on the client.
 * See FaqAccordion.tsx for the client-only wrapper (owns open/close state)
 * used on the landing page; the Rule Guide renders this directly and relies
 * on pageShell.ts's inline script for the click behavior instead.
 */
export default function FaqAccordionView({ items, idPrefix, openIndex, onToggle }: FaqAccordionViewProps) {
  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${idPrefix}-faq-trigger-${index}`;
        const panelId = `${idPrefix}-faq-panel-${index}`;

        return (
          <div key={index} className={`faq-accordion__item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              id={triggerId}
              className="faq-accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={onToggle ? () => onToggle(index) : undefined}
            >
              <span>{item.question}</span>
              <span className="faq-accordion__icon" aria-hidden="true" />
            </button>
            <div
              id={panelId}
              className="faq-accordion__panel"
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
            >
              <div className="faq-accordion__panel-inner">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
