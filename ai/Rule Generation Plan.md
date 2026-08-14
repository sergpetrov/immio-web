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

**When asked to compare a specific article against a competitor page, work in this order:**

1. **Confirm the two pages cover the same rule before treating any difference as a gap.** A
   competitor page titled for the same country can be about a neighbouring rule entirely — their
   Spain page covers *keeping* an existing permit (12 months outside the EU), ours covers
   *qualifying* for long-term residence (5 years, 6/10-month absence caps). Different figures there
   are correct on both sides, not an error in ours.
2. **Don't guess their URL.** A 404 from a slug you constructed is not evidence the page doesn't
   exist — search for it. This produced a wrong "they have no page for this" conclusion once
   already.
3. **Verify every candidate fact against a primary source before adopting it**, including facts
   that merely look like precision. Competitor pages carry stale figures: one gave Italy's renewal
   deadlines as 30/60/90 days scaled by permit length, where the current rule is 60 days generally
   and 90 for indefinite employment contracts. Adopting it unverified would have shipped a wrong
   deadline.
4. **Never adopt a competitor's framing that blurs two legally distinct thresholds**, even when
   theirs is simpler. Two worked cases: the UK's "6 months" visitor limit is not "180 days," and a
   US B-1/B-2 six-month admission is not the >180-day unlawful-presence bar. Precision outranks
   borrowed simplicity every time.
5. **Report back in three parts** — what was adopted and from which source, what was corrected in
   our article, and what was deliberately declined with the reason. A comparison that only reports
   additions hides the judgement calls, which are the valuable part.

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
[callout + Key parameters table]

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

## 8. Overview — callout + Key parameters table

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

**Use plain subject-verb constructions and ordinary words.** The callout is the first thing a
reader meets and the place abstraction does the most damage. Write "A UAE residence visa is
canceled automatically if you stay outside the country for more than 180 consecutive days" — not
"What it measures is a single absence rather than a yearly total," which describes the rule instead
of stating it. Avoid inverted openers ("What the rule protects is…"), nominalizations, and framing
clauses that talk *about* the mechanism rather than giving it. If a sentence would survive being
cut without losing a fact, cut it.

**Where a rule has a reset, a restart, or a clock that breaks, say so in the callout.** That
consequence is usually what a reader actually needs — "Break either and the 5-year clock
**restarts**," "any entry back into the UAE **resets** the count." A callout that lists thresholds
without saying what happens when you cross one is only half the rule.

**The shape above is the required content, not a sentence template to fill in with a new country's
name each time.** Don't let every callout read as the same three clauses in the same order with
only the nouns swapped — vary the phrasing, sentence rhythm, and even which clause leads, based on
what's actually distinctive about this specific rule. If the rule's own official source, or how its
target audience commonly refers to it, has a well-known, natural framing — a named test everyone in
that market already calls by name, a phrasing convention used in the country's own official
guidance — lean into that instead of defaulting to the generic pattern. It should read as the most
natural way to explain *this* rule, not as visually consistent with every other article's callout.

### Key parameters table

This shape, one table per article, no exceptions. Add the **Alternative** row only when the rule
genuinely has a second, independent counting route (see below) — otherwise the table has four
rows, not five:

```markdown
| Key parameters          |                          |
|:------------------------|-------------------------:|
| Threshold               | *bare number, or "More than N days"* |
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
  conversion the primary source doesn't actually give. **Name what is being counted when the cell
  would otherwise be ambiguous** — "330 days abroad" rather than "330 full days," since a reader
  scanning the table needs to know *what* the number measures, and a qualifier like "full" is a
  counting mechanic that belongs in "How to keep track" where it can actually be defined.
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
- **Counting row: match the label to what the rule actually limits.** A rule that caps **presence**
  (how long you may stay, how many days you must accumulate) counts partial days *toward* the
  limit, so the cell is `Any part of a day`. A rule that caps **absence** (how long you may be away
  before a status or clock breaks) works in the mirror image: departure and return days almost
  always count as days of *presence* in the country, so only whole days abroad are absence, and the
  cell is `Whole days of absence`. Labelling an absence-based rule `Any part of a day` states the
  opposite of what it does — it implies partial days count against the traveller when they in fact
  help. This error shipped in the Spain, US green card, Italy and Australia articles and had to be
  corrected in all four; check which direction the rule runs before filling this cell. Where a
  rule limits absence, also state the mechanic in "How to keep track" — "an absence runs from the
  day after you leave to the day before you come back" — and give it an FAQ entry, since "do my
  travel days count?" is one of the most common reader questions.
- **Otherwise the presence-side cell is always exactly `Any part of a day` or `Nights ({rule
  name})`, with at most a short qualifier appended** (e.g. "Any part of a day, except departure"). Do not invent bespoke
  phrasing for a rule with no officially stated day-counting formula (a country's law that says
  only "presence" or "duration" with no explicit partial-day rule) — this has been tried (wording
  like "Days of stay, continuous or summed" or "Actual presence, compared country by country") and
  it breaks the table's scannability as a lookup. Default to `Any part of a day` even when the
  official source doesn't explicitly confirm partial-day counting, and note the genuine uncertainty
  in "How to keep track" prose instead, where nuance has room.
- **Additional requirements row**: a short label naming the secondary test(s), not a full
  sentence. Where the rule has a **second limit of the same kind** — a final-year absence cap on
  top of a total, a per-trip cap on top of a cumulative one — that second limit is what this row
  should carry, since it's the fact a reader scanning the table most needs next. Requirements of a
  different kind (language tests, good character, income) stay out of the table and live in
  "Understanding the rule" instead. UK citizenship is the reference: `Limit: 450 days of absence`
  with `Additional requirements: 90 days of absence in the final 12 months`, and nothing about the
  Life in the UK test or English in the table at all.
- **One value per row, and keep it short.** Don't pack two limits into one cell
  (`12 months over 4 years, 90 days in final year`) — split them across `Limit` and `Additional
  requirements`. Don't restate the window inside another row's value
  (`4 years back from application date` where a `Qualifying period: 4 years` row already exists);
  the moving-window mechanic belongs in "How to keep track."
- **Keep the source markdown aligned.** Pad the label column and right-pad the value column so
  every row in the block is the same character width. It doesn't change rendering, but a
  ragged table is unreadable when editing and hides real errors.
- Never include legal basis, "applies to," or order-of-tests rows — those belong in prose further
  down. This table is a lookup, not a summary paragraph. No second table anywhere else in the
  article, including under "Understanding the rule."

---

## 9. Understanding the rule

This is the single section that fully explains **how you qualify** — it carries both the
routes/tests themselves and all of their qualifying detail, not split across a separate section.
It does not cover day-counting mechanics (what counts as a day, the measurement window,
arrival/departure treatment) — that's "How to keep track," section 10. This applies to route
bullets too: a route bullet states the threshold and names the window it applies to ("more than 183
days within a rolling twelve-month window"), not the fine mechanics of how that window is measured
— whether days need to be consecutive, exactly how a lapsed window restarts, and so on. If the same
counting-mechanic phrase, beyond the bare threshold and named window, starts appearing in more than
one section, that's a sign it belongs in How to keep track alone.

**Open with who the rule applies to**, in one sentence, before any mechanism. "This applies to any
lawful permanent resident travelling outside the US, however the green card was obtained." "This
applies to anyone building toward settled status in Spain on a temporary residence permit, whatever
route they hold it under." A reader's first question is whether the page is about them, and an
article that opens on mechanics makes them infer it. Keep it to scope — nationality, status held,
or route — not eligibility conditions.

**Close with what else is required**, in one short paragraph, whenever the rule sits inside a
larger application: "Residence isn't the only requirement. You also need to be of **good
character**, pass the **Life in the UK test**…". Several articles covered only the day rule and
silently implied it was the whole test. Name the other requirements; don't explain how to satisfy
them.

The resulting shape for most articles is four beats — **who it applies to → the structural core as
a bullet list → supporting conditions in prose → what else is required.** Vary the wording, keep
the order.

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

**Put a route's conditions inside its own bullet, not in a follow-up paragraph that restates
them.** The recurring failure looks like this: a bullet says "a continuous stay of at least 183
days across two calendar years," and the paragraph below then says "your employment has to run
continuously across the two years, and your total stay must reach at least 183 days." That's the
same two conditions twice. Whatever a paragraph below the list is for, it isn't repeating what the
bullets already said — reserve it for what genuinely doesn't fit in a bullet, like the fact that a
route is an administrative concession rather than statute, or an exclusion that applies to only one
of the routes. If a route is complex enough that its conditions won't fit its bullet, that's a sign
the detail belongs in "How to keep track" or Edge cases, not in a second pass over the same ground.

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
Keep it to the bare pairing (worldwide vs. local-source, admitted vs. refused). Rates, penalty
tiers and the elaborated "why this is expensive" framing belong in "If you get this rule wrong,"
which now opens with exactly that (see section 13).

**This section has to earn its place by saying more than the callout did.** The callout states the
thresholds; this section explains the machinery around them. If a draft's prose reduces to the
callout with the numbers repeated, add the substance that's actually missing — who the rule applies
to regardless of nationality or immigration status, what it deliberately does *not* test (a rule
with no ties test at all is worth saying plainly, since readers arriving from other rules assume
there is one), which route the official source treats as primary, or the structural quirk that
makes this rule different from what a reader would guess.

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

**This cuts both ways: don't let counting-mechanic detail that belongs here leak back out into
other sections.** The callout, Understanding the rule, and FAQ can all state the bare threshold and
named window ("184 days within a twelve-month window") since that's a quick fact worth having close
at hand — but the mechanics of that count (consecutive or not, exactly how the window restarts if
it lapses, arrival/departure treatment) should appear once, here, and nowhere else. If an FAQ
question would otherwise just restate this section's mechanic in different words, answer the direct
question and point back in plain text — `see **How to keep track** above` — rather than re-deriving
it.

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

**Drop minor cases.** A bullet has to earn its place by changing someone's outcome. "Visa length
depends on how you got it" and "the two limits fail independently" are facts, but the first is
trivia and the second usually just restates a point Understanding already made. When a section
runs long, cut the weakest bullets rather than shortening every one — four sharp bullets beat six
mediocre ones.

**Edge cases is where detail lives when a thing is only named elsewhere.** If Understanding
mentions several variants — visa types, permit classes, status levels — Understanding names them
and Edge cases explains them, one bullet each, not one bullet covering all of them. The UAE
article is the reference: Understanding says only that the Golden, Green and Blue visas are exempt,
and Edge cases gives each its own bullet with duration, who it's for, and the shared caveat as a
separate closing bullet.

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

**The same restraint applies everywhere in the article, not just here.** Wherever a rule has
exceptions, carve-outs, grace periods, or discretionary relief, say that they exist and that they
are narrow, but don't lay out the qualifying conditions as a checklist a reader could aim at. "The
reasons that take an absence out of the count are very narrow — overseas crisis work and major
travel disruption, and nothing else" is right. Naming each qualifying category, the days you have
to apply within, and whose agreement you need turns the article into a guide for building a case,
which is exactly the personal advice this project doesn't give. The reader's takeaway should be
that an exception is unlikely to save them, not how to reach for one.

Official tax-authority guidance and statute come first, same as everywhere else. If the specific
penalty percentages aren't clearly stated officially, reputable professional-firm write-ups are the
next best source — cross-check at least two independent ones before using a specific number. Fall
back to community discussion (Reddit, forums) only if both are thin, and only cite sources from the
last 1–2 years — an older thread may describe a rule that has since changed. Never invent a
plausible-sounding percentage; if a specific number can't be verified, describe the mechanism
qualitatively ("a penalty scaled to how serious the mistake is judged to be") instead of
fabricating a figure. No exact currency amounts either way (see section 17).

**Open with why this particular mistake bites, then give the penalty.** The consequence of holding
the status — worldwide income vs. local-source only, losing a certificate, a refused application —
is what makes the error expensive, and stating it here in one clause is what stops the penalty
figures reading as free-floating trivia. It also keeps "Understanding the rule" from having to
carry an elaborated consequences paragraph (see section 9). One clause, not a paragraph: *"Residents
are taxed on worldwide income and worldwide wealth, so misjudging this usually surfaces as foreign
income left undeclared. An incorrect position normally attracts additional tax at 20%…"*

Close every instance of this section with the same sentence, verbatim and bolded — the one
deliberate exception to "no bold" here. Which sentence depends on the article's `category`:

```text
tax                     → **Professional tax advice is strongly recommended in situations like this.**
travel | immigration    → **Professional advice is strongly recommended in situations like this.**
```

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
- **A disambiguation question whenever the rule contains two similarly-named things.** Official
  terminology routinely produces near-collisions inside one rule — Puerto Rico's *closer connection
  test* (one of three required tests) versus *no significant connection to the United States* (one
  of five ways to satisfy just one of them). A reader who conflates them draws the wrong
  conclusion, so answer it head-on: what each one is, what role each plays, and the case where you
  pass one and still fail the other. Don't rename the official terms to avoid the clash — explain
  the clash.
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
- **Never use italics.** Not for emphasis, not for contrast between two things, not for
  foreign-language terms, not for a defined term's first appearance. Bold is the library's only
  emphasis marker. Where a contrast genuinely needs marking — "time in the issuing country" versus
  "time in other member states" — rewrite the sentence so the contrast is carried by the words,
  or bold the single word that turns the meaning, and use nothing at all where the sentence
  already reads correctly without it.
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
- **One table per article** — the Key parameters table in Overview. No second table anywhere else.
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
- **Never use a term of art the article hasn't defined.** An official shorthand that appears in
  guidance ("Arriver or Leaver," "domestic tax subject," "deemed domiciled") means nothing to a
  reader meeting it cold. Either define it in the same breath, or say the thing it stands for
  instead — "whether you were UK resident in any of the previous 3 tax years" beats "whether you
  are an Arriver or Leaver" when the underlying condition is what actually matters.
- **Prefer the active fact to the abstract nominalization.** "The exclusion isn't automatic — you
  have to claim it yourself, on Form 2555 filed with your return" beats "The exclusion is a choice
  you make rather than something applied automatically, claimed on Form 2555 with your return." If
  a sentence's main verb is *is* and the real action is buried in a trailing participial clause,
  rewrite it around the action.
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
paragraphs. The Key parameters table does much of this work on its own. Do not add hidden text,
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

## 23a. Categories other than tax — travel and immigration

Everything above was written against `category: tax` and stays the default. The `travel` (visitor
visas, entry permissions, stay limits) and `immigration` (residence permits, settlement,
citizenship) categories reuse the same section list, the same callout-plus-table Overview, the same
three-example rule and the same research standards. What changes is vocabulary and what the
consequences actually are. Adapt as follows, and don't adapt further than this — the point is one
recognisable house style across all three categories, not three dialects.

**Section list.** Identical to section 7, with one rename: `## If you get this rule wrong` stays as
the heading, but its content is about immigration consequences rather than tax ones. "How to keep
track" applies to any rule measured in days (nearly all travel rules, and any immigration rule with
an absence limit) and is omitted only for a rule with no day mechanic at all.

**Key parameters table.** Same shape, same right-alignment, same standard-pattern discipline. The row
labels shift to fit the subject:

```markdown
| Key parameters          |                          |
|:------------------------|-------------------------:|
| Limit              | *e.g. 90 days*           |   <!-- travel: replaces Thresholds -->
| Absence limit           | *e.g. 180 days*          |   <!-- immigration: replaces Thresholds -->
| Qualifying period       | *e.g. 5 years*           |   <!-- immigration only -->
| Period / Window         | *short standard pattern* |
| Alternative             | *only if a second route exists* |
| Counting                | *"Any part of a day", or "Nights (...)"* |
| Additional requirements | *short label*            |
```

Keep the row count in the same 4–6 range. "Validity," "Extensions," and "Processing time" are
tempting extra rows for a visa article — resist them unless one is genuinely a defining mechanic of
the rule, and put the rest in prose.

**What replaces the tax consequence.** The pairing that anchors a tax article ("worldwide income
vs. local-source only") has a direct analogue in each category, and "If you get this rule wrong"
should open on it the same way (section 13):

- **travel** — refused entry at the border, an overstay recorded against you, fines, removal, and
  re-entry bans of a stated length. Border refusal is discretionary in a way tax assessment isn't,
  so say so rather than implying a clean formula.
- **immigration** — a refused application, a broken continuous-residence clock that resets or
  delays eligibility, loss of an existing status, and any effect on later citizenship. The
  *clock resetting* is usually the real cost and is what readers most often underestimate.

Real, jurisdiction-specific facts are required here exactly as in section 13: actual ban lengths,
actual statutory penalties, the actual consequence for the qualifying clock. Generic "you may be
refused entry and face penalties" is the same filler the tax library had to be rewritten to remove.
Keep the same prohibition on damage-control advice — state the consequence, not the workaround, and
never suggest how to present a case to an officer or caseworker.

**Terminology.** Say "resident" only where it means immigration status, and never let a travel or
immigration article imply anything about tax residency — the categories are deliberately separate,
and conflating them is the single most damaging error available here. A person can hold a residence
permit and not be tax resident, and vice versa.

**But don't add a disclaimer sentence saying so.** An earlier version of this guidance produced a
boilerplate line — "This is an immigration test, not a tax one — where you're treated as tax
resident is decided separately" — appended to Understanding across several articles. That is
banned. It raises a question the reader didn't ask, points at a subject the article then refuses to
explain, and reads as hedging. The requirement is satisfied by *not implying* a tax consequence in
the first place: don't use "resident" loosely, don't describe a day threshold as making someone
"resident" without saying resident *of what*, and the ambiguity never arises. Section 17's ban on
cross-referencing other articles still applies.

**Earliest application date.** Where a status is reached by completing a qualifying period, state
whether the application can go in before that period ends — and say so either way, since both
answers are actionable. UK ILR accepts an application up to **28 days early** and treats it as made
on the completion date; UK naturalisation has no early window at all and the period must be
genuinely complete on the day the application is received. Readers routinely assume one behaves
like the other.

**FAQ.** The dual-status/treaty question that closes most tax articles has no analogue. Close
instead with whatever the genuine "what happens next" question is for that rule — how to extend,
what happens at renewal, whether time on this status counts toward settlement or citizenship.

**Closing sentence.** `**Professional advice is strongly recommended in situations like this.**` —
not "Professional immigration advice." The shorter form is deliberate: these rules sit next to tax,
employment and family questions, and naming only one discipline implies the others don't apply.

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
4. **Sweep the whole library for the pattern you just changed, not only the files you touched.**
   A phrasing being corrected in one article is nearly always present in others. Checking the
   counting label across all immigration articles found the same mislabel in four; checking the
   table alignment found six ragged tables nobody had asked about. The grep costs seconds and the
   article you didn't check is the one that stays wrong.
5. **After a scripted or regex edit, re-check list numbering and table structure.** `sed` and
   `perl` substitutions across numbered lists have twice produced duplicate or malformed markers
   that render as broken lists. An `awk` pass for repeated consecutive list numbers, and a width
   check across each table block, catch both.

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