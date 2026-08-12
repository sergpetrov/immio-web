import { lexer, marked, parser } from "marked";
import type { Token, Tokens } from "marked";
import type { FaqItem, RuleSection, TocHeading } from "./types";

const FAQ_SECTION_TITLE = "faq";

/** Custom markdown container: :::callout … ::: → rounded callout box. */
marked.use({
  extensions: [
    {
      name: "callout",
      level: "block",
      start(src: string) {
        return src.match(/:::callout/)?.index;
      },
      tokenizer(src: string) {
        const match = /^:::callout\s*\n([\s\S]*?)\n:::(?:\n|$)/.exec(src);
        if (!match) {
          return undefined;
        }

        const text = match[1];
        const token: Tokens.Generic = {
          type: "callout",
          raw: match[0],
          text,
          tokens: [],
        };
        this.lexer.blockTokens(text, token.tokens as Token[]);
        return token;
      },
      renderer(token) {
        const inner = this.parser.parse(token.tokens ?? []);
        return `<aside class="content-callout">${inner}</aside>\n`;
      },
    },
  ],
});

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let counter = 2;
  while (used.has(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  used.add(id);
  return id;
}

/** Splits an FAQ section's tokens into {question, answerHtml} pairs at each H3. */
function extractFaqItems(tokens: Token[]): FaqItem[] | undefined {
  const items: { question: string; tokens: Token[] }[] = [];
  let current: { question: string; tokens: Token[] } | null = null;

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 3) {
      if (current) {
        items.push(current);
      }
      current = { question: token.text, tokens: [] };
      continue;
    }

    current?.tokens.push(token);
  }

  if (current) {
    items.push(current);
  }

  if (items.length === 0) {
    return undefined;
  }

  return items.map((item) => ({ question: item.question, answerHtml: parser(item.tokens) }));
}

export interface ParsedRuleBody {
  headline: string;
  sections: RuleSection[];
  toc: TocHeading[];
}

/**
 * Splits a rule's Markdown body into a headline (the leading H1) and a list
 * of sections, one per H2 heading, so the page can render each as a
 * semantic <section> and derive the table of contents from the same data.
 *
 * Callout boxes use a fenced container in the source:
 *
 *   :::callout
 *   Paragraph(s) shown in the rounded rectangle.
 *   :::
 */
export function parseMarkdownBody(body: string, filePath: string): ParsedRuleBody {
  const tokens = lexer(body);

  let headline: string | undefined;
  const usedIds = new Set<string>();
  const sections: RuleSection[] = [];
  let current: { id: string; title: string; tokens: Token[] } | null = null;

  const flush = () => {
    if (!current) {
      return;
    }

    const isFaqSection = current.title.trim().toLowerCase() === FAQ_SECTION_TITLE;
    const faqItems = isFaqSection ? extractFaqItems(current.tokens) : undefined;

    sections.push({
      id: current.id,
      title: current.title,
      html: faqItems ? "" : parser(current.tokens),
      faqItems,
    });
    current = null;
  };

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 1 && headline === undefined) {
      headline = token.text;
      continue;
    }

    if (token.type === "heading" && token.depth === 2) {
      flush();
      current = { id: uniqueId(slugify(token.text), usedIds), title: token.text, tokens: [] };
      continue;
    }

    current?.tokens.push(token);
  }

  flush();

  if (headline === undefined) {
    throw new Error(`Rule content file is missing an H1 headline: ${filePath}`);
  }

  const toc: TocHeading[] = sections.map((section) => ({ id: section.id, title: section.title }));

  return { headline, sections, toc };
}
