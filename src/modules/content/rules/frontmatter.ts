import { load } from "js-yaml";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export interface ParsedContentFile {
  data: unknown;
  body: string;
}

export function parseContentFile(raw: string, filePath: string): ParsedContentFile {
  const match = FRONTMATTER_PATTERN.exec(raw);

  if (!match) {
    throw new Error(`Rule content file is missing YAML frontmatter: ${filePath}`);
  }

  const [, frontmatterBlock, body] = match;
  const data = load(frontmatterBlock);

  return { data, body: body.trim() };
}
