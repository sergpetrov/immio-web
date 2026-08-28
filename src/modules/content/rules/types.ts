export type CategoryId = "tax" | "travel" | "immigration";

export interface Category {
  id: CategoryId;
  slug: string;
  title: string;
  /** Compact label for breadcrumbs and the category switch, where the full
   *  title is too long. Falls back to `title` when omitted. */
  shortTitle?: string;
  /** Short summary — used as the page's SEO meta description. */
  description: string;
  /** Longer on-page intro shown under the category title. Falls back to
   *  `description` when omitted. */
  intro?: string;
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
  /**
   * Either a registered place id (`us`) or a sub-national `{parent}-{subdivision}`
   * id (`us-ut`). A sub-national rule still belongs to its parent country for
   * grouping, breadcrumbs and URLs; the compound id only changes which flag it
   * shows. See `getRuleFlagFile`.
   *
   * Omitted on conceptual guides that are not tied to one jurisdiction
   * (for example the 183-day rule explainer). Those pages show `icon` instead
   * of a flag and do not appear on country hubs.
   */
  place?: string;
  /**
   * Optional icon path (site-root, e.g. `/content/icons/tax_residency_tracker.svg`)
   * for conceptual guides that have no country flag.
   */
  icon?: string;
  seo: {
    title: string;
    description: string;
  };
  /** Date the content was last re-verified against its official sources. */
  updatedAt: string;
  /** First publication date. Falls back to `updatedAt` when absent. */
  publishedAt?: string;
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
