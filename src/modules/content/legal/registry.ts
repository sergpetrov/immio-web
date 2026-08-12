import { lexer, parser } from "marked";
import type { Token } from "marked";
import type { TocHeading } from "../components/TableOfContents";

export interface LegalSection {
  id: string;
  title: string;
  html: string;
}

export interface LegalDocument {
  headline: string;
  introHtml: string;
  sections: LegalSection[];
  toc: TocHeading[];
}

const rawLegalFiles = import.meta.glob("../../../../content/legal/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseLegalDocument(body: string, filePath: string): LegalDocument {
  const tokens = lexer(body);
  let headline: string | undefined;
  const usedIds = new Set<string>();
  const sections: LegalSection[] = [];
  const introTokens: Token[] = [];
  let current: { id: string; title: string; tokens: Token[] } | null = null;

  const flush = () => {
    if (!current) return;
    sections.push({ ...current, html: parser(current.tokens) });
    current = null;
  };

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 1 && headline === undefined) {
      headline = token.text;
      continue;
    }
    if (token.type === "heading" && token.depth === 2) {
      flush();
      const baseId = slugify(token.text);
      let id = baseId;
      let suffix = 2;
      while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
      usedIds.add(id);
      current = { id, title: token.text, tokens: [] };
      continue;
    }
    if (current) {
      current.tokens.push(token);
    } else if (headline !== undefined) {
      introTokens.push(token);
    }
  }
  flush();

  if (!headline) throw new Error(`Legal content file is missing an H1 headline: ${filePath}`);
  return {
    headline,
    introHtml: parser(introTokens),
    sections,
    toc: sections.map(({ id, title }) => ({ id, title })),
  };
}

const legalDocuments = new Map(
  Object.entries(rawLegalFiles).map(([filePath, body]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "");
    if (!slug) throw new Error(`Invalid legal content file path: ${filePath}`);
    return [slug, parseLegalDocument(body, filePath)];
  }),
);

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.get(slug);
}
