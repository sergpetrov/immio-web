import { useState } from "react";
import FaqAccordionView, { type FaqAccordionItem } from "./FaqAccordionView";

export interface FaqAccordionProps {
  items: FaqAccordionItem[];
  idPrefix: string;
}

/** Client-only wrapper that owns the single-open accordion state (used on the landing page). */
export default function FaqAccordion({ items, idPrefix }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <FaqAccordionView
      items={items}
      idPrefix={idPrefix}
      openIndex={openIndex}
      onToggle={(index) => setOpenIndex((current) => (current === index ? null : index))}
    />
  );
}
