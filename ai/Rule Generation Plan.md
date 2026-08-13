# Immio Rule Guide — Phase 2: Rule Content Generation (Final)

This is the complete, standalone process and style reference for writing **any** Rule Guide
article. It reflects everything learned building and correcting multiple articles across different
countries and rule types, generalized into a reusable standard — apply it to whichever rule is
requested next, regardless of country or category.

## Objective

Generate a complete, high-quality Rule Guide article for the specific rule provided in the task,
as one Markdown file:

```text
content/rules/{rule-slug}.md
```

This is a **content-generation and research task**, using the Rule Guide architecture already
implemented in the app. Do not change page architecture, components, styling, routing, or the
content schema unless something is genuinely required to support the content — and if it is,
treat that as a separate, explicit ask, not a silent side effect of writing an article.

The article must feel like a **quick, trustworthy overview** a reader can finish in under two
minutes and walk away with a correct mental model — not a restatement of the official source (link
to those for full legal detail) and not a rewrite of a competitor's page in different words.

---

## 1. Output

Generate or update exactly one file:

```text
content/rules/{rule-slug}.md
```

Markdown body + YAML frontmatter, following the schema in `src/modules/content/rules/types.ts`
and validated by `src/modules/content/rules/validate.ts`. Do not create a separate TSX page, and
do not put article content inside React components — the rendering pipeline
(`import.meta.glob` in `registry.ts`, server-side rendering in `src/worker/content.ts`) already
handles any file dropped into `content/rules/`.

---

## 2. Research priority

Follow this source hierarchy, in order.

### Priority 1 — Official sources

Identify the single most authoritative government source(s) for the rule's jurisdiction — the
relevant tax authority, immigration authority, or equivalent body, plus the underlying legislation
where it's publicly available — and start there. Find the actual current rules and guidance rather
than relying on secondary summaries.

Check, where relevant to the rule: every route/test that can trigger it, the exact day-counting or
measurement method, the measurement window (calendar year, tax year, rolling window), residence or
qualifying history requirements, exceptional-circumstances carve-outs, deeming/anti-avoidance
provisions, transitional treatment, and any other condition or exception that materially affects
the outcome.

**Never assume a commonly repeated single-number rule (a "183-day rule," a flat threshold) is the
whole picture.** Every rule researched so far has turned out to be a compound test with
alternative routes, secondary conditions, or both — the official source is the authority on the
full shape of the rule, not the popular shorthand for it.

### Priority 2 — Competitor sites, for structure and tone only

After understanding the official rules, review:

- https://bounded.app/rules
- https://atlasdays.app/learn
- https://taxsummaries.pwc.com/ (navigate to the relevant country's individual-residence page)

Use them to see how they break a complex rule into sections, what they choose to explain, what
questions they anticipate, useful examples and edge cases, and accessible terminology — not as a
source of facts.

**Competitor content is not authoritative.** If a competitor's claim conflicts with your own
research, do not just pick a side — chase the disagreement down to the actual primary legal text,
then confirm with an independent secondary source (a professional firm's plain-language
breakdown, a reputable tax summary). This combination — primary text plus an unambiguous
independent confirmation — is what actually settles a real disagreement. In practice this matters
most in two recurring situations: a compound condition that hinges on whether two clauses are
joined by "and" or "or" (competitor summaries have been found to get this wrong even when stated
confidently — the only way to resolve it is reading the actual primary clause), and a rule that
changed on a specific date (a competitor page's own "last reviewed" stamp is not proof it reflects
a change that happened since — verify independently regardless of how fresh a competitor page
looks).

**Never copy competitor wording, sentence structure (even loosely paraphrased), invented
terminology (unless it's the official term used in the government's own guidance), or
example/scenario progression.** If two independently written articles about the same rule would
read as similar as ours and a competitor's, something was copied too closely — rewrite it. When
you do find something a competitor covers that your research is missing, verify it independently
before adding it; don't import a fact just because it appeared on a competitor page.

### Priority 3 — Community discussion, for question discovery only

Search Reddit and similar public discussion for the rule's common misunderstandings, the questions
real people ask, unusual edge cases, and confusing terminology. **Never treat community discussion
as authoritative** — every factual or legal conclusion still needs official-source verification.
Don't include an unverifiable claim from a forum as fact.

---

## 3. Final verification pass

After drafting the article, return to the official sources and verify it again in full. Check
every threshold, date, window boundary, definition, counting rule, exception, and qualifying
condition. If something can't be supported by a reliable official source, research it further or
remove/rephrase it — never fill a gap by guessing.

**When simplifying, never let a merged sentence imply a requirement applies more broadly than it
does.** If an official source states that a requirement applies to only some items in a list (for
example, a form is required to exclude certain categories from a day count but not others),
preserve that distinction exactly, even at the cost of a slightly longer sentence. A merged
sentence that quietly drops "only categories A and B need this" is a factual error, not a
simplification — this kind of merge has caused a real factual error before and had to be
corrected.

---

## 4. Writing style

Write for an intelligent reader who is not a tax lawyer or immigration specialist. Use plain
English. Prefer "You may be a resident if..." over "An individual shall be deemed resident
where...". Explain specialist terminology the first time it appears. Keep sentences short — see
the 35-word ceiling in section 19. Use headings, lists, tables, and examples; don't let the article
read like an AI-generated legal document.

**No act, decision, code, law-by-number, article-by-number, or schedule name anywhere in the
frontmatter, callout, or body prose.** The only legitimate locations for a citation are the
`sources` frontmatter list and the "Official sources" section — see section 17. A colloquial name
for a regime or scheme is fine anywhere in the body — it's what the thing is actually called, not
a citation.

---

## 5. Accuracy vs. simplicity

Do not oversimplify a rule to the point of being wrong. The path is:

```text
Official rule → accurate interpretation → plain-English explanation
```

not:

```text
Complex rule → oversimplified statement → potentially misleading content
```

If an exception is important enough that omitting it could cause a reader to misunderstand the
rule, include it. If a highly technical exception is genuinely outside the scope of a two-minute
overview, mention it briefly and point to the official source rather than half-explaining it.

---

## 6. Article length

**900–1,300 words total, including FAQ and Official sources.** Treat it as a guideline, not a
ceiling: an article with a genuinely justified extra section (see section 11) can run over without
that being a problem. Do not add filler to reach the target, and don't force cuts to real
qualifying detail just to stay under it. Priority order:

**accuracy + usefulness + readability > word count.**

---

## 7. Fixed article structure

Every rule article uses this exact section list, in this order:

```markdown
# {Rule name}

## Overview
[callout + Key facts table]

## Understanding the rule

## How to keep track          <!-- day/night-based rules only -->

## {Secondary regime section}   <!-- only if the user explicitly asks for one -->

## Edge cases

## If you get this rule wrong

## Examples

## Official sources

## FAQ
```

Do not invent rule-specific `##` headings for individual tests or stages within the qualifying
logic — fold rule-specific mechanics into "Understanding the rule" and "How to keep track"
instead. Omit "How to keep track" only for a rule genuinely not measured in days/nights. The
parser matches the literal string `## FAQ` to build the accordion — never rename it.

Earlier drafts of this structure also had a standalone "Additional requirements" section between
"How the rule works" (now "Understanding the rule") and "Day Counting" (now "How to keep track").
That split existed to keep the routes/tests section short, but in practice it just made readers
jump between two sections both describing the same qualifying logic at different levels of
detail — so the structure now folds everything qualification-related into one section, described
next.

---

## 8. Overview — callout + Key facts table

### Callout

3–4 sentences, in this order:

1. **What the rule decides**, and how it fits the bigger picture if relevant (e.g. "one of two
   ways someone becomes a resident — the other is holding a permanent status").
2. **The core mechanism, stated precisely.** If the rule isn't a single simple threshold, say so
   explicitly ("It is **not simply a single-threshold rule**") and then state the real, compound
   condition. This is the single most important sentence in the article.
3. **A short flag that exceptions exist**, without detailing them (e.g. "A special regime can
   change the outcome for some newcomers").

No exceptions detail, no dates/periods already stated in the table below (don't duplicate
information across the callout and the table), and no legal citations. Bold only the defining
threshold(s) and one or two truly load-bearing terms — not full clauses.

### Key facts table

Exactly this shape, one table per article, no exceptions:

```markdown
| Key facts               |                          |
|:------------------------|-------------------------:|
| Thresholds               | *bare number(s)*        |
| Period / Window          | *the measurement window*|
| Counting                 | *unit + rule, one line* |
| Additional requirements  | *short label*            |
```

- **Right-align the second column** (`--:` in the header separator) — the shared CSS
  (`public/content/content.css`) renders it at medium weight automatically.
- **Thresholds row: bare numbers only, never "more than."** For a threshold defined in law as
  exclusive ("more than N days"), use the next integer up (**N+1 days**) so the cell stays a plain
  number without a qualifying word — reserve the exact legal phrasing ("more than N days") for
  prose in "Understanding the rule." For a rule with several distinct route thresholds, list them
  comma-separated in the order they're introduced in the article; for a rule with banded
  thresholds that each matter on their own, list every boundary number.
- **Counting row**: either `Nights ({rule name})` (e.g. "Nights (Midnight rule)", "Nights
  (Overnight stay)") or `Any part of a day`, with a short qualifier appended if the rule has one
  (e.g. "Any part of a day, except departure").
- **Additional requirements row**: a short label naming the secondary test(s), not a full
  sentence.
- Never include legal basis, "applies to," or order-of-tests rows — those belong in prose further
  down. This table is a lookup, not a summary paragraph. No second table anywhere else in the
  article, including under "Understanding the rule."

---

## 9. Understanding the rule

This is the single section that fully explains **how you qualify** — it carries both the
routes/tests themselves and all of their qualifying detail, not split across a separate section.
It does not cover day-counting mechanics (what counts as a day, the measurement window,
arrival/departure treatment) — that's "How to keep track," section 10.

**If the rule is structured as independent alternative routes** (meet any one of several separate
tests), list them as a flat bullet list, in any order, each with a bolded route name:

```markdown
You are a [rule subject] if you meet any one of three routes, in any order:

- **Route A** — a qualifying condition stated in one clause. No day count, permit, or income
  needed.
- **Route B** — physically present for N days or more within the relevant window.
- **Route C** — a lower day count, but only alongside extra conditions: [condition one] and
  [condition two].
```

**A route short enough to fit in its own bullet gets no separate treatment elsewhere** — don't
create a redundant paragraph that restates it. **A route with genuine complexity** (a multi-factor
test, several exempt categories, a multi-condition test) gets its bullet kept terse, then a
paragraph or a second flat bullet list immediately after, still inside this section:

```markdown
- **Secondary test.** If the primary tests don't settle it, your day count and your number of
  qualifying factors decide it together.

Between the automatic thresholds, your day count is combined with your qualifying factors — the
fewer days you spend, the more factors it takes to trigger the rule.

- **Factor one** — a short definition of the first qualifying connection.
- **Factor two** — ...
```

Close with one short paragraph on the practical stakes if genuinely useful (e.g. why qualifying
matters in this rule's specific context) — one paragraph only, not restated again in Edge cases.

**Never compare the rule to another country's rule or reference another article on the site.**
Every rule page must read as fully self-contained — if a contrast with another country's approach
would genuinely help, it belongs in that other article, not as a comparison hanging off this one.
**No markdown anchor links to other sections, ever** — write `(see **How to keep track** below)`
in plain text, and only when the forward-reference is genuinely needed.

---

## 10. How to keep track

Numbered list, ordered by importance to the reader, not by document structure or chronology.
Typical shape:

1. The core threshold(s), restated precisely even though the callout already states them — this
   is deliberate duplication, since this is where a reader lands wanting the exact mechanics, and
   making them scroll back to the callout is worse than one repeated line.
2. The core presence/counting rule (e.g. "a day counts if you're there at midnight," "any part of
   a day counts").
3. Everything that changes what counts as a day — exceptions, exclusions, anti-avoidance counting
   mechanics — combined into as few list items as the material allows. Prefer one dense, precise
   sentence over three thin ones with overlapping content.
4. **Always end with a practical item on what documents/evidence to retain**, tailored to the
   rule's actual qualifying path(s) — not a generic "keep good records" placeholder. Base it on
   what the rule actually requires proof of: travel records (boarding passes, entry/exit stamps)
   are always relevant; a tenancy agreement, title deed, or utility bills for any home/habitual-
   residence test; employment or business documents for any work-tie condition; a foreign
   qualifying-status certificate for any rule where excluding time depends on proving status
   elsewhere.

If a detailed "what evidence do I need" FAQ already exists for the rule, don't duplicate its
procedural detail here (which form, which authority) — this list item is about the habit of
recordkeeping as you go; let the FAQ carry the procedural detail. Skip this section entirely for a
rule not measured in days (a points-based or income-threshold rule).

---

## 11. Secondary or special regimes (dedicated section — exception, not default)

The default treatment for a special regime layered on top of the main rule (e.g. a preferential
status available only to some qualifying people) is **2–3 bullets inside Edge cases plus 1–2 FAQ
entries** — not its own section. This keeps the fixed section list consistent across the library.

**Exception: add a dedicated section only when the user explicitly asks for one for that specific
rule.** When it applies:

- Give it a plain, descriptive H2 — a short, literal name for what the regime is actually called,
  not a marketing-style name.
- Position it **after "How to keep track" and before "Edge cases"** — core qualification logic and
  day-tracking mechanics first, then the bonus regime layered on top, then gotchas/exceptions.
- Structure it the same way as the rest of the article: one short framing sentence (e.g. "this is a
  separate determination — qualifying under the main rule doesn't grant it automatically"), then a
  flat bullet list. For a status/regime, the natural three bullets are **what it means**, **who can
  apply**, and **what it gives** — bold lead terms, numbers included (rates, year-counts,
  deadlines), never a vague gesture like "can reduce the tax bill."
- Once the dedicated section exists, trim any redundant Edge cases/FAQ coverage of the same regime
  so the detail doesn't live in two places.
- **When a regime's benefit list overlaps with a broader reform that changed for everyone,
  re-verify each benefit is still actually distinctive to the regime.** A benefit that used to be
  regime-specific can stop being one if a later, unrelated reform extends it to everyone — check
  before repeating an old claim.

Don't proactively add a dedicated section because a regime is popular — that's a per-article
judgment call the user makes explicitly, not a default trigger condition.

---

## 12. Edge cases

4–6 short bullets, bold lead phrase, one to two sentences each (fewer is fine if the rule has a
dedicated secondary-regime section carrying some of that content). Prioritize, in order:

1. The most consequential "gotcha" — the thing most likely to flip someone's outcome unexpectedly
   (an anti-avoidance rule, a deeming rule, a rule that overrides everything else).
2. Any relief/treatment that changes what's taxed/counted for part of a period (e.g. split-year
   treatment).
3. Recent regime changes, described by their **current** name only — never lead with what the
   regime used to be called.
4. Cross-border interaction (dual status, treaty tiebreakers) if relevant.
5. A common "still counts even though people assume it doesn't" case.

Don't restate anything already covered in "Understanding the rule" or "How to keep track." A
related concept from a different rule category that could be confused with this one (an
immigration permit confused with tax residency, a corporate regime confused with an individual
one) gets **exactly one** disambiguating bullet — what it is, one clarifying sentence, nothing
more. If it's popular enough that people will search for it on its own, that's a signal for a
future, separate rule page — not more content here.

---

## 13. If you get this rule wrong

Plain prose, 2–3 sentences, **no bullet list, no bold at all**. Factual and calm, no scare
language — think of a plain blog explainer's tone rather than a legal warning. Covers: that
getting the qualification call wrong means owing back taxes/interest/penalties (or the equivalent
consequence for a non-tax rule) on what should have applied, that the relevant authority can assess
this retroactively once they catch the mistake, and that correcting it yourself before being
caught typically earns a lighter or reduced penalty. No exact currency amounts (see section 19).

---

## 14. Examples

**Exactly three** short second-person examples ("You move to...", never a named individual), each
a single short paragraph — situation, the relevant numbers, and the result folded into 2–4
sentences. No "Situation / Facts / How it applies / Result" sub-structure and no manual "Example
1:" text in the heading — the shared CSS auto-numbers each `### heading` inside the Examples
section with a small circular badge, driven by a CSS counter scoped to `section#examples h3`; the
heading itself should be a short descriptive title only.

Each example must isolate a **different** mechanic of the rule — a useful default triad:

1. A case that **clearly clears every condition** — establishes the basic mechanism works as
   described.
2. A case that **falls just short** of the threshold via the rule's specific calculation (a
   weighted total, a factor count, a banding) — shows how "close" is actually measured.
3. A case where **one condition is satisfied strongly but another, independent condition still
   fails** — the example most likely to correct a reader's wrong mental model.

Every number and outcome must be mechanically correct against the rule as described earlier in the
article — these are illustrative, not official worked examples, but must be internally consistent.
**Before shortening an example in an editing pass, re-verify it against the article's current
body, not against memory** — sections get edited independently across passes, and an example's
numbers can drift out of sync with a since-changed "Understanding the rule" or "How to keep track"
section. When trimming for length, cut hedging qualifiers first ("with no other significant ties
abroad," "well above the threshold") — the situation, the numbers, and the outcome are load-
bearing; the hedging language usually isn't.

---

## 15. Official sources

A small number of high-quality, directly relevant official sources — prefer few and authoritative
over an exhaustive list. Each entry:

```yaml
sources:
  - title: "..."
    url: https://...
    type: official
```

Primary legislation can appear here even though it must never appear in body prose (section 4) —
this is the one place citing an act/decision/code by name is appropriate. Never include a
competitor URL as an authoritative source; competitor sites are research inputs only.

**Titles must be in English.** If an official source's own name reads naturally in another
language, translate the descriptive part of the title after the organization's name into English,
but keep the organization's own proper name as-is, untranslated (e.g. a local tax authority's own
name stays in its own language even though the description of what the linked page covers is
translated). Keep legal citation parentheticals (article/section numbers in their native
numbering) as-is. The frontmatter `sources:` entry and the matching link in the body `## Official
sources` list are two copies of the same title — edit both together so they never desync. Quote
any title string containing a colon; an unquoted colon inside a YAML scalar breaks parsing.

---

## 16. FAQ

Typically 4–6 questions, occasionally more when the rule genuinely has that many distinct
high-value questions — the count should reflect real search intent and misconceptions, not a
quota; some rules will naturally need more than others. Exact heading `## FAQ` (the parser matches
this literal string — never rename it). Order by importance.

Always consider including:

- **A "what happens if I meet/fail this" question** when the consequence isn't obvious from the
  rest of the article.
- **A dual-status / treaty-interaction question** for any rule where an official source confirms
  the interaction exists — verify the specific mechanism for that rule (the interaction, and any
  specific form or procedure involved, varies) rather than assuming it's identical to another
  rule's version of the same question.

Avoid a question that just restates a Key Facts table row with no new information. **Whenever you
reword a FAQ question, re-check that the answer's leading word/polarity still matches the new
phrasing.** A question like "Does X rule out Y?" answered "No" becomes wrong if reworded to "Can Y
still happen despite X?" — the correct answer flips to "Yes," but a title-only edit leaves the old
"No" contradicting the new question. Always re-read the answer's first sentence after any question
reword, even if you didn't intend to touch the answer.

---

## 17. Formatting rules (apply throughout)

- **Bold sparingly.** Only the defining threshold(s) per section and a handful of the most
  load-bearing terms — not every number, not every qualifying phrase, not every bullet's lead
  phrase out of habit. If a paragraph is more than roughly 15% bold, or every bullet in a list has
  its lead bolded by default rather than necessity, cut it back.
- **Sentences capped at ~35 words.** Split at the natural clause boundary when a sentence runs
  long — usually wherever "and," "which," "so," "though," or an em dash joins two facts that don't
  need to share a sentence. Applies everywhere: callout, bullets, Edge cases, FAQ answers. Re-scan
  for this after any significant edit pass — long sentences creep back in during rewrites.
- **No act/decision/code/law-by-number/article-by-number/schedule name anywhere except the
  `sources` frontmatter and the "Official sources" list.** A colloquial regime name is not a
  citation and is fine anywhere.
- **No markdown anchor links between sections, anywhere.** Use `(see **Section Name** below)` in
  plain text, and only when the forward-reference earns its place.
- **No comparisons to other countries or other rules on the site**, ever. Each article is fully
  self-contained.
- **One table per article** — the Key facts table in Overview. No second table anywhere else.
- **No exact currency amounts anywhere in the body** — Overview, Understanding the rule, Edge
  cases, If you get this rule wrong, Examples, FAQ. Describe qualitatively instead: "up to a set
  threshold" rather than a specific figure, "a lump-sum payment per period" rather than an exact
  amount, "can trigger a penalty" rather than a named penalty figure.
- **Tax rates (or other defining percentages) are exempt from the currency rule and should stay
  exact.** A flat rate that defines how a regime actually taxes or treats something is core
  mechanics, not a fine or fee — cutting it would make the regime impossible to explain. The line:
  *what you're taxed at, or the rate that defines the mechanic*, stays exact; *what you're fined,
  or the currency threshold a rate applies above*, doesn't.
- Second person throughout the body, especially Examples — never named individuals.
- Use the `:::callout ... :::` syntax only in Overview, nowhere else.

---

## 18. Titles and naming

Both the frontmatter `title` and the Markdown `# H1` follow:

```text
{Country/place} {Rule category} ({the defining mechanism})
```

- **Frontmatter `title`**: use a short, commonly recognized form of the country/place name when
  one genuinely exists — the full name otherwise.
- **Markdown H1**: always the full country/place name, never abbreviated, even when the
  frontmatter title uses a short form.
- **The bracketed suffix** names the rule's defining mechanism — the test's proper name if it has
  one, or the day-threshold shape if it doesn't (a single number: "N-day rule"; two alternative
  thresholds: "N-day and M-day rules"). Don't list every secondary test in the bracket.
- **`subtitle`**: a short, ∙-separated string of 2–3 key facts (the core threshold, the window
  type, and one other defining feature).
- **`seo.title`**: "{Country/place} {Rule category} Rules Explained | Immio" — no brackets.

---

## 19. Frontmatter schema

```yaml
---
id: {rule-slug}

title: {see section 18}
subtitle: {see section 18}

category: {the rule's category, e.g. tax, immigration, travel}

place: {a two-letter lowercase country code, or a descriptive slug for a
         multi-country area when the rule isn't specific to one country}

seo:
  title: {see section 18}
  description: >
    {2–3 sentence description — this is now the ONLY description field on the
    article, see below}

updatedAt: YYYY-MM-DD

sources:
  - title: "..."
    url: https://...
    type: official

---
```

Required fields enforced at validation (`assertValidRuleFrontmatter`): `id`, `title`, `place`,
`updatedAt`. `category`, `seo`, and `sources` aren't in that bare required-field check but are
structurally expected on every article in practice.

**There is no top-level `description` field — do not add one.** It used to duplicate
`seo.description` with slightly different text and had two separate consumers reading it
independently: the page's JSON-LD `Article.description` (built in `seo.ts`) and the countries-page
search index (`CountriesPage.tsx`). Both were repointed to read `frontmatter.seo.description`
instead, so `seo.description` is now the single source of descriptive text — write it to do both
jobs (a good search-result snippet and a good search-index match).

**There is no `relatedContent` field — do not add one.** It was removed from the schema; nothing
currently reads it.

Quote any YAML string value containing a colon — an unquoted colon inside a scalar breaks YAML
parsing.

---

## 20. SEO requirements

Optimize naturally — no keyword stuffing. The page should clearly target the natural search
variants for its country and rule (the rule's proper test name, its day-threshold shorthand, and
generic "{country} {rule category} residency/rules" phrasing), used naturally across the H1,
introduction, H2s, body content, FAQ questions, `seo.title`, and `seo.description`. The page should
answer search intent, not just repeat keywords.

---

## 21. AI / LLM search optimization

Make important information explicit and self-contained, so a retrieval system can extract answers
like "what is the rule," "what period does it use," "how are days counted," "is N days the only
test," and "what happens if I meet/fail the test" without needing to infer across several
paragraphs. The Key facts table does much of this work on its own. Do not add hidden text,
AI-specific keyword stuffing, or artificial content.

---

## 22. Content rules — do / don't

**Do not:**

- Copy competitor wording, structure, or invented terminology.
- Reproduce long source passages.
- Invent facts, or rely on an AI-generated summary as if it were authoritative.
- Treat competitor or community-discussion claims as fact.
- Keyword-stuff, or pad the article to reach a word-count target.
- Make definitive personal tax/legal recommendations.

**Do:**

- Research primary sources first, cross-check against secondary sources, cite official sources.
- Explain accurately in plain language.
- Identify and address common misunderstandings.
- Use practical, second-person examples.
- Clearly keep general information separate from personal advice.

---

## 23. Process note — applying instructions across the library

When an instruction reads as universal ("make sure X across the rules," "we don't mention exact
amounts anywhere"), apply it to every live article it logically applies to, not just the article
under discussion, unless the request is explicitly scoped to one rule. Before assuming a rule
applies everywhere, check whether every existing article has actually been migrated to the current
structure — an older article may predate a structural change and need it applied as its own
explicit step, rather than being assumed already compliant.

---

## 24. Verification workflow

After any batch content or schema change across multiple articles:

1. Grep for lingering old patterns (a removed field, an untranslated title, a stale section name)
   across every file in `content/rules/`.
2. For a schema change (a frontmatter field added, removed, or repointed), run `tsc --noEmit` on
   both `tsconfig.app.json` and `tsconfig.worker.json` and confirm both are clean.
3. Confirm every affected page still renders (HTTP 200) via full browser navigation and reload —
   not a bare `fetch()`, which can return stale cached HTML. Navigate to the page, then reload
   (`location.reload(true)` or equivalent), then re-check.

---

## 25. Final quality-control pass

Before delivering the Markdown file, audit it against:

- **Accuracy** — every number, date, threshold, condition, exception, and definition verified
  against official sources.
- **Completeness** — the article covers what the rule is, who it applies to, the period/window,
  thresholds, counting method, every route/test with its qualifying detail, edge cases, the
  consequences of getting it wrong, examples, FAQ, and official sources.
- **Readability** — could an educated person with no relevant background understand this without a
  specialist dictionary? Rewrite any sentence that fails this test.
- **SEO** — title, meta description, H1/H2 structure, natural keyword usage, search-intent
  questions, concise answers.
- **AI retrieval** — if a retrieval system pulled only one section, would it still make sense on
  its own?
- **Final official-source comparison** — compare the finished article against the official sources
  one more time. If a competitor or community source conflicts with official guidance, official
  guidance wins.

---

## Expected result

One complete file per rule:

```text
content/rules/{rule-slug}.md
```

containing YAML frontmatter and the Markdown article, following every section above. No separate
TSX page, no article content inside React components. This process is the reusable standard for
every future rule added to the library.

This plan itself is revised only when explicitly requested ("update the plan… provide the file") —
it is not automatically rewritten as a side effect of editing an article.