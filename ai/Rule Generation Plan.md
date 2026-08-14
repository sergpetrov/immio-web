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

Generate or update exactly one file, in the subfolder matching its category:

```text
content/rules/{category}/{rule-slug}.md
```

`{category}` is `tax`, `travel`, or `immigration` — matching the article's frontmatter `category`
field. Markdown body + YAML frontmatter, following the schema in
`src/modules/content/rules/types.ts` and validated by `src/modules/content/rules/validate.ts`. Do
not create a separate TSX page, and do not put article content inside React components — the
rendering pipeline (`import.meta.glob("**/*.md")` in `registry.ts`, server-side rendering in
`src/worker/content.ts`) already handles any file dropped anywhere under `content/rules/`. File
location is purely organizational — routing, categorization, and display all come from the
frontmatter (`id`, `category`, `place`), never from the file path.

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
the 35-word ceiling in section 17. Use headings, lists, tables, and examples; don't let the article
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

**Don't open with a meta-announcement sentence** like "{Subject} is decided by three tests, not a
single day count" or "{Subject} uses a single test:" — go straight to the actual routes/tests
instead. If the rule genuinely has multiple routes, that's already obvious from listing them; a
separate sentence announcing "there are multiple tests" first adds words without adding
information.

```text
Not:      "Poland decides tax residency with two independent tests, not a single day count.
           You're a resident if..."
Instead:  "You're a resident if your centre of personal or economic interests is in Poland, or
           if you spend more than 183 days there in a calendar year — meeting either one is
           enough."
```

No exceptions detail, no dates/periods already stated in the table below (don't duplicate
information across the callout and the table), and no legal citations. Bold only the defining
threshold(s) and one or two truly load-bearing terms — not full clauses.

**The shape above is the required content, not a sentence template to fill in with a new country's
name each time.** Don't let every callout read as the same three clauses in the same order with
only the nouns swapped — vary the phrasing, sentence rhythm, and even which clause leads, based on
what's actually distinctive about this specific rule. If the rule's own official source, or how its
target audience commonly refers to it, has a well-known, natural framing — a named test everyone in
that market already calls by name, a phrasing convention used in the country's own official
guidance — lean into that instead of defaulting to the generic pattern. It should read as the most
natural way to explain *this* rule, not as visually consistent with every other article's callout.

### Key facts table

This shape, one table per article, no exceptions. Add the **Alternative** row only when the rule
genuinely has a second, independent counting route (see below) — otherwise the table has four
rows, not five:

```markdown
| Key facts               |                          |
|:------------------------|-------------------------:|
| Thresholds               | *bare number, or "More than N days"* |
| Period / Window          | *short standard pattern* |
| Alternative               | *N days / rolling M months — only if a second route exists* |
| Counting                 | *"Any part of a day", or "Nights (...)"* |
| Additional requirements  | *short label*            |
```

- **Right-align the second column** (`--:` in the header separator) — the shared CSS
  (`public/content/content.css`) renders it at medium weight automatically.
- **Thresholds row: say "More than N days" when that's genuinely how the law phrases it — don't
  round up to a derived N+1 number.** An earlier version of this plan asked for a bare number
  (e.g. "184 days" for a "more than 183 days" rule) so the cell stayed a plain figure. In practice
  this repeatedly produced a number that doesn't appear anywhere in the actual source, which reads
  as false precision and desyncs the table from prose that correctly says "more than 183 days."
  Use the bare number only when the official source itself states that exact figure as the
  threshold (not derived from an "more than" phrasing) — for example, a country whose statute
  literally reads "184 days," not "more than 183." When in doubt, quote the source's own words.
  For a rule with several distinct route thresholds, list them comma-separated in the order
  they're introduced in the article; for a rule with banded thresholds that each matter on their
  own, list every boundary number. If the underlying law states the threshold in a unit other than
  days (a number of months, say), state it in that native unit — don't force a day-count
  conversion the primary source doesn't actually give.
- **Period / Window row: use short, standard patterns only** — "Rolling 12 months," "Rolling 365
  days," "Calendar year (1 Jan – 31 Dec)," "Income year (1 Jul – 30 Jun)." Don't elaborate in the
  cell ("Any rolling 12-month period," "Rolling 12-month period from entry") — a detail like "from
  entry" belongs in "How to keep track," not the table.
- **Alternative row (only when it applies)**: for a rule with a genuine second counting route —
  a different day threshold measured over a different window, both independently sufficient to
  qualify (Norway's 183-days-in-12-months *or* 270-days-in-36-months is the reference case) — add
  this row directly after Period / Window, combining the second threshold and its own window into
  one cell: `270 days / Rolling 36 months`. Don't add this row for a rule that merely has other,
  non-day-based qualifying routes (a domicile test, a ties test, a resides test) — those stay in
  "Additional requirements" as before. The Alternative row is specifically for a second **counting**
  rule, not a second route in general.
- **Counting row: always exactly `Any part of a day` or `Nights ({rule name})`, with at most a
  short qualifier appended** (e.g. "Any part of a day, except departure"). Do not invent bespoke
  phrasing for a rule with no officially stated day-counting formula (a country's law that says
  only "presence" or "duration" with no explicit partial-day rule) — this has been tried (wording
  like "Days of stay, continuous or summed" or "Actual presence, compared country by country") and
  it breaks the table's scannability as a lookup. Default to `Any part of a day` even when the
  official source doesn't explicitly confirm partial-day counting, and note the genuine uncertainty
  in "How to keep track" prose instead, where nuance has room.
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

**The bullet-list-of-routes structure above is the required shape for a multi-route rule, not a
sentence template.** "You are a [rule subject] if you meet any one of three routes" shouldn't
appear near-verbatim across a dozen articles with only the country and number changed. If the
official source, or how the rule is actually taught, searched for, or discussed by practitioners
in that country, uses a different well-established framing or entry point, use that instead of
forcing the generic pattern — the goal is the clearest, most natural explanation of this rule, not
paragraph-shape consistency with every other article.

Close with one short paragraph on the practical stakes if genuinely useful (e.g. why qualifying
matters in this rule's specific context) — one paragraph only, not restated again in Edge cases.

**Keep this section as short as it can be while still giving a correct mental model — cut anything
that belongs in another section.** Three things repeatedly creep in and should come back out:
day-counting mechanics (arrival/departure treatment, window-restart mechanics, what counts as a
day) belong in "How to keep track," not here; elaborated consequences beyond the one-line "taxed on
worldwide income / taxed only on local-source income" pairing belong in "If you get this rule
wrong" or Edge cases; and a carve-out's full mechanics belong in Edge cases, with only a short
flag here that a carve-out exists ("subject to a carve-out for a genuine overseas home") rather
than the whole condition spelled out inline. If an embedded sub-list (conditions specific to one
route, say) has several closely related items, merge the ones that are variations on the same idea
rather than listing every micro-variant separately — a list of "50% or more of income is
local-source" / "50% or more of assets are managed locally" / "50% or more of assets are held
locally" is one merged bullet, not three.

**Never compare the rule to another country's rule or reference another article on the site.**
Every rule page must read as fully self-contained — if a contrast with another country's approach
would genuinely help, it belongs in that other article, not as a comparison hanging off this one.
**No markdown anchor links to other sections, ever** — write `(see **How to keep track** below)`
in plain text, and only when the forward-reference is genuinely needed.

---

## 10. How to keep track

Numbered list, ordered by importance to the reader, not by document structure or chronology. Keep
it light — this section is specifically about the mechanics of counting and tracking days, not a
second pass over the whole rule. Typical shape:

1. The core threshold(s), restated precisely even though the callout already states them — this
   is deliberate duplication, since this is where a reader lands wanting the exact mechanics, and
   making them scroll back to the callout is worse than one repeated line.
2. The core presence/counting rule (e.g. "a day counts if you're there at midnight," "any part of
   a day counts").
3. Everything that changes what counts as a day — exceptions, exclusions, anti-avoidance counting
   mechanics — combined into as few list items as the material allows. Prefer one dense, precise
   sentence over three thin ones with overlapping content.

Then, as a **trailing sentence after the numbered list, not a numbered item itself**: what
documents/evidence to retain, tailored to the rule's actual qualifying path(s) — not a generic
"keep good records" placeholder. Base it on what the rule actually requires proof of: travel
records (boarding passes, entry/exit stamps) are always relevant; a tenancy agreement, title deed,
or utility bills for any home/habitual-residence test; employment or business documents for any
work-tie condition; a foreign qualifying-status certificate for any rule where excluding time
depends on proving status elsewhere.

**Cut any numbered item that isn't genuinely about counting or tracking days, or that repeats a
fact already stated elsewhere in the article** — even when it's day-adjacent. A residence-loss
mechanic ("you cease to be resident after N days of absence"), an exit/departure procedure, or a
carve-out's full qualifying conditions are different topics from "how do I count my days," and if
they're already covered in Edge cases or FAQ (which they usually should be), repeating them here
just pads the section. The test: does this line help someone literally tallying their days right
now? If not, it belongs elsewhere, and if it's said elsewhere already, don't say it a third time
here. If a detailed "what evidence do I need" FAQ already exists for the rule, don't duplicate its
procedural detail here (which form, which authority) — this trailing sentence is about the habit
of recordkeeping as you go; let the FAQ carry the procedural detail. Skip this section entirely for
a rule not measured in days (a points-based or income-threshold rule).

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
  so the detail doesn't live in two places. Where the FAQ previously had multiple entries about the
  regime, consolidate them into one disambiguation question instead — the thing readers most need
  clarified is that the regime and the underlying residency test are separate determinations — and
  point to the new section in plain text (`see **Section Name** above`) rather than repeating its
  numbers there too. This has now happened for three regimes across the library (a domicile-based
  status, a foreign-income exemption for skilled workers, and a flat-rate election for new
  arrivals), confirming the pattern generalizes rather than being a one-off.
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

**Prefer keeping a given fact in one place rather than restating it near-identically in both Edge
cases and FAQ.** A gotcha framed as "X doesn't automatically mean Y" in Edge cases and then
answered again almost word-for-word as "Does X automatically mean Y? No..." in FAQ is padding, not
two genuinely useful angles — cut it from whichever section is weaker for that specific fact (FAQ
usually wins for something phrased as a direct, searchable question; Edge cases usually wins for a
genuine "gotcha" with no natural question form). The exception is the single most important,
distinctive fact in the whole article — the one thing most likely to flip a reader's outcome — 
which can legitimately appear in Edge cases, FAQ, *and* an Example, each in a different form
(terse gotcha, direct answer, worked scenario), because that's the fact worth reinforcing from
multiple angles. Everything else gets one home. When trimming duplicates this way, keeping the
section down to 2–3 bullets for an otherwise-simple rule is fine — the "4–6" above is a typical
range, not a quota to fill with restatements.

---

## 13. If you get this rule wrong

Plain prose, ideally 2 sentences and rarely more than 3, no bullet list, no bold except the
mandatory closing sentence (see below). Factual and calm, no scare language — a plain blog
explainer's tone, not a legal warning. If a draft runs longer than the library's typical length for
this section, tighten it before moving on — this section should be one of the shortest in the
article, not one of the longest.

**This section needs real, country-specific research — never default to a generic template.**
"You may owe back taxes, interest, and penalties... the authority can assess this retroactively"
is true of literally every country and tells the reader nothing they couldn't already guess — it
reads as filler because it is filler. This was tried across the whole library and had to be redone
once the pattern became obvious. Research the actual penalty mechanism instead:

- **The real penalty structure** — statutory percentage tiers by culpability (careless vs.
  deliberate vs. fraud), not a vague "penalties apply." These are almost always published as exact
  percentages of the tax owed, which you can state directly — the currency ban in section 17
  doesn't apply to rates.
- **How the authority actually catches this**, only if there's something concrete and genuinely
  interesting (a data-sharing agreement like FATCA/CRS, cross-referencing a certificate application
  against immigration records) — skip this if the only honest answer is "they can audit you," and
  don't force it in just to fill space.

**Do not mention voluntary disclosure, self-correction programs, amnesties, or any other way to
reduce or avoid the penalty, and do not give advice about what a reader should do.** An earlier
version of this plan required naming a voluntary-disclosure mechanism here; that guidance is
reversed. State the consequence, not the workaround — this section's job is to convey the stakes
of getting the rule wrong, not to counsel the reader on damage control, which strays toward the
personal tax advice this whole project avoids giving (see section 22).

Official tax-authority guidance and statute come first, same as everywhere else. If the specific
penalty percentages aren't clearly stated officially, reputable professional-firm write-ups are the
next best source — cross-check at least two independent ones before using a specific number. Fall
back to community discussion (Reddit, forums) only if both are thin, and only cite sources from the
last 1–2 years — an older thread may describe a rule that has since changed. Never invent a
plausible-sounding percentage; if a specific number can't be verified, describe the mechanism
qualitatively ("a penalty scaled to how serious the mistake is judged to be") instead of
fabricating a figure. No exact currency amounts either way (see section 17).

Close every instance of this section with the same sentence, verbatim and bolded — the one
deliberate exception to "no bold" here:

**Professional tax advice is strongly recommended in situations like this.**

---

## 14. Examples

**Exactly three** short second-person examples ("You move to...", never a named individual), each
a single short paragraph — situation, the relevant numbers, and the result folded into 2–4
sentences. Draft each one lean from the start: one clause for the situation, the operative
numbers, and the outcome — don't restate context the callout or "Understanding the rule" already
established, and don't pad with qualifiers that aren't doing mechanical work. No "Situation / Facts / How it applies / Result" sub-structure and no manual "Example
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
  its lead bolded by default rather than necessity, cut it back. The one fixed exception is the
  closing sentence of "If you get this rule wrong" (section 13), which is always bolded.
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
- **Spell out an abbreviation in full the first time it's used in body prose, with the
  abbreviation in parentheses immediately after** ("Dirección de Impuestos y Aduanas Nacionales
  (DIAN)," "Australian Taxation Office (ATO)"), then use the bare abbreviation from that point on.
  This applies to the first bare use anywhere in the body — if the authority is never named before
  "If you get this rule wrong," that's where the expansion goes. The `sources` frontmatter and
  "Official sources" list are exempt (they already follow the English-titles rule in section 15,
  which is about something else — translating descriptive text, not abbreviation).
- **When combining two sentences to shorten a passage, don't join them with a semicolon** — use
  two short sentences, an em dash, or a genuine restructure instead. A semicolon used this way
  (`"...taxed on worldwide income; falling short makes you a nonresident..."`) tends to sneak back
  toward the exact wordiness you were trying to cut. This doesn't apply to a semicolon used as
  conventional punctuation inside a bulleted list (separating list items that end in semicolons and
  a final period) — that's a different, acceptable use.

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
  thresholds: "N-day and M-day rules"). Use "rule," not "route" or another synonym, as the
  connecting word — this was tried both ways and "rule" is the settled choice. Only include a
  bracket at all when it's a genuine 1–2-keyword phrase that fairly represents the rule and is
  worth targeting for search — not a list of every route. If the rule has more named tests than
  that (three or four distinct routes, none of them clearly the one thing people search for), omit
  the bracket entirely rather than force a reductive or overloaded one — a plain "{Country} Tax
  Residency" with no suffix is a legitimate, expected outcome for a genuinely multi-test rule.
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