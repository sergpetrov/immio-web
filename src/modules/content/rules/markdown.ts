import { lexer, marked, parser } from "marked";
import type { Token, Tokens } from "marked";
import type { FaqItem, RuleSection, TocHeading } from "./types";

const FAQ_SECTION_TITLE = "faq";

function isExternalHref(href: string | undefined): boolean {
  return typeof href === "string" && /^https?:\/\//i.test(href);
}

/** Title row of the Key parameters table: empty extra header cells are dropped
 *  so the title can colspan the full table width. */
function isKeyParametersHeader(header: Tokens.Table["header"]): boolean {
  return (
    header.length >= 2 &&
    header[0].text.trim() === "Key parameters" &&
    header.slice(1).every((cell) => cell.text.trim() === "")
  );
}

marked.use({
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title}"` : "";
      const newTabAttrs = isExternalHref(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${titleAttr}${newTabAttrs}>${text}</a>`;
    },
    table(token) {
      if (!isKeyParametersHeader(token.header)) {
        return false;
      }

      const title = this.parser.parseInline(token.header[0].tokens);
      const header = this.tablerow({
        text: `<th colspan="${token.header.length}">${title}</th>\n`,
      });

      let body = "";
      for (const row of token.rows) {
        let cells = "";
        for (const cell of row) {
          cells += this.tablecell(cell);
        }
        body += this.tablerow({ text: cells });
      }
      if (body) {
        body = `<tbody>${body}</tbody>`;
      }

      return `<table>\n<thead>\n${header}</thead>\n${body}</table>\n`;
    },
  },
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
