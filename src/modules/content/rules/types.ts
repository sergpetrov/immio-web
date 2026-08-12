export type CategoryId = "tax" | "travel" | "immigration";

export interface Category {
  id: CategoryId;
  slug: string;
  title: string;
  description: string;
}

export type PlaceType = "country" | "territory" | "state";

export interface RulePlace {
  id: string;
  name: string;
  type: PlaceType;
  slug: string;
}

export interface RuleSource {
  title: string;
  url: string;
  type: string;
}

export interface RuleFrontmatter {
  id: string;
  title: string;
  subtitle?: string;
  category: CategoryId;
  place: string;
  description: string;
  seo: {
    title: string;
    description: string;
  };
  updatedAt: string;
  sources: RuleSource[];
  relatedContent?: string[];
}

export interface TocHeading {
  id: string;
  title: string;
}

export interface FaqItem {
  question: string;
  answerHtml: string;
}

export interface RuleSection {
  id: string;
  title: string;
  html: string;
  faqItems?: FaqItem[];
}

export interface RuleDoc {
  frontmatter: RuleFrontmatter;
  headline: string;
  sections: RuleSection[];
  toc: TocHeading[];
}
