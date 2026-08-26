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

**When asked to fill a gap in day-count-rule coverage, exclude countries whose residency test has
no day threshold at all** — Belgium's domicile/center-of-economic-interests test and Mexico's
vital-interests test are the reference cases. A rule built entirely from a "Threshold" table row
and a callout that leads with a day figure doesn't work for a country where no day figure is the
actual trigger; forcing one in produces a misleading article rather than a useful one. These belong
to a separate, differently-shaped article template — flag them and hold them for that, don't fold
them into a day-count batch to hit a target count.

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

**Specific mistakes worth checking for by name, because each has actually happened:**
- **The exact-day-counting mechanic, guessed rather than verified.** Whether a day counts on any
  presence, on a full 24 hours, or only as a whole calendar day is a real difference between
  countries and cannot be assumed from how a similar-looking neighbour's rule works. China requires
  a full 24 hours present (a day under 24 hours doesn't count, so arrival and departure days are
  both excluded) — the opposite of the "any part of a day" default that correctly applies to most
  other countries in the corpus. Verify this per country; never carry it over from the last article
  you wrote.
- **"More than," "at least," or "N or more," stated with confidence but not actually checked.**
  These read as interchangeable and are not — see the Key parameters table section above for two
  real cases (Denmark, Montenegro) where this was wrong in a published article.
- **A regime detail imported from the wrong taxpayer class.** A partial-income exemption, a special
  rate, or a relief that applies to companies does not automatically apply to individuals (or vice
  versa) just because it's the same country's tax system. Confirm which class of taxpayer a benefit
  actually applies to before including it in an individual-residency article.
- **A formula or figure that changed on a specific recent date.** Interest rates tied to a central
  bank rate, penalty percentages, and similar figures move — and can move for reasons unrelated to
  tax law, such as a country's interest-rate benchmark changing on currency adoption. Check whether
  the figure you're citing is still current as of the article's `updatedAt` date, not just correct
  as of whenever the source you found was last edited.
- **A source URL that returns 403/404/500 the moment it's actually requested**, as opposed to one
  that merely looked plausible in a search result. Curl or fetch every source URL before shipping;
  don't include a URL you haven't confirmed resolves.

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

**2–3 sentences, 210–320 characters, median around 270.** Short enough to read at a glance, long
enough to carry the day rule and the other ways in.

**Lead with the day count and its period, always.** This is the fact most readers came for, and it
belongs in the first clause of the first sentence — not after a framing sentence about how many
tests the rule has. Then the alternative day route if one exists, then the non-day tests, then at
most one further fact worth knowing up front.

```text
Not:      "You're an Australian tax resident if you meet any one of four tests: you reside in
           Australia, have your domicile there, are present for 183 days or more..."
Instead:  "Spending **183 days or more** in Australia in the **income year** (1 July to 30 June)
           can make you a tax resident. You can also qualify if you are **living** there, having
           your **permanent home** in Australia, or through the **superannuation test**."
```

**Bold 3–7 spans, median 5.** Bold every day count, every period, the name of each alternative
test, and phrases that carry the mechanic — `**no day count**`, `**first day**`, `**rolling**`,
`**deemed resident**`. This is heavier bolding than ordinary prose takes, and it's deliberate: the
callout doubles as a scannable summary.

**Period phrasing is standardised, and differs between callout and table.** In callout prose use
`any 12-month`, `any 365-day`, `any 36 months`, `calendar year`, `tax year (1 April to 31 March)`,
`income year (1 July to 30 June)`. The table uses the `Rolling 12 months` form instead — don't
carry `Rolling` into the callout, and don't carry `any 12-month` into the table.

**For a rolling window, say it doesn't reset "with a new year"** — never "on 1 January" or "each
January". Plenty of these rules run on a tax year that doesn't start in January, and naming the
month makes the sentence wrong for them.

**Tax callouts hedge the day-count outcome with `can make you`, never `makes you`.** Crossing the
threshold *can* make someone resident; other tests, treaties, and carve-outs still apply. Write
`can make you a tax resident`, `can make you resident`, or `can make you fully liable`. Sweep the
`:::callout` only — body, FAQ, and examples may still state the legal test more directly. If a
callout already uses `may trigger` or similar, leave it; don't stack `can` onto a hedge that's
already there.

**Vary the opening.** The corpus opens on a bare threshold (`**More than 183 days** in...`), a
gerund (`Spending`, `Staying`, `Being`), or the subject itself (`The **Substantial Presence
Test** needs...`). Pick whichever fits the rule; don't let consecutive articles share a stem.

**Write for a non-native reader.** Short sentences, ordinary words, active voice. Use numerals
always — `12-month` not twelve-month, `2 tax years` not two, `1 of 4 routes` not one of four.
Never use "carve-out"; say what actually happens instead ("taxed by France as if they never left",
"sit outside the day test").

No legal citations, no exceptions detail, and nothing already stated in the table below.

### Key parameters table

One table per article, no exceptions. **The default is these 4 rows, in this order** — 23 of the
33 tax articles use exactly this shape and nothing else:

```markdown
| Key parameters          |                          |
|:------------------------|-------------------------:|
| Threshold               | *bare number, or "More than N days"* |
| Period / Window         | *short standard pattern* |
| Counting                | *"Any part of a day", or "Nights (...)"* |
| Alternative             | *the other way in — a second day route, or a named test* |
```

**`Alternative` comes last, after `Counting`, and it is the normal case rather than the exception.**
An earlier version of this plan placed it directly after `Period / Window` and said to add it only
where a genuine second *counting* route exists, with named non-day tests going to `Additional
requirements` instead. Both of those are reversed. In practice almost every rule has some other way
in, and a reader scanning the table wants the primary threshold and its mechanics together at the
top, with the alternatives beneath. `Alternative` now carries whichever applies:

- a second day route — `60 days`, `270 days / Rolling 36 months`, `549 days / 3 years`,
  `30 days / year + 425 days / 3 years`
- a named non-day test — `Domicile test`, `Residential ties test`, `Permanent place of abode`,
  `Dwelling test (Wohnsitz)`. These are examples from rules whose sources do use "test"; don't copy
  the word across to a new rule without checking (see the `Alternative row` bullet below)
- several of either, comma-separated — `Permanent home, economic interests`

**`Additional requirements` is now a 5th row used only where something genuinely sits outside the
routes themselves** — 9 of 33 articles have it. Reserve it for conditions layered on top of
qualifying (`No 183-day residence elsewhere`, `Tax home, closer connection tests`), consequences
that change what residency means (`Remittance-based foreign income`), or history the test reaches
back into (`Previous 3 tax years`). If the thing you want to put here is just another way to
qualify, it belongs in `Alternative`.

**This is the second most commonly violated rule, right behind the Understanding-section one
above** — a review of 18 new articles found a qualifying route misplaced in `Additional
requirements` in 12 of them: `Domicile test (Wohnsitz)`, `Permanent home plus any presence` (in
fact the *primary* route for that rule), `Linked-period and following-year tests`, `Domicile and
permanent abode test` — all routes, all in the wrong row. The test that catches it: read the row's
value and ask "does meeting this alone make someone resident?" If yes, it's a route and belongs in
`Alternative`, however unlike a plain day-count it looks. `Additional requirements` should never by
itself answer "how do I qualify" — only "what else, once I have."

- **Right-align the second column** (`--:` in the header separator) — the shared CSS
  (`public/content/content.css`) renders it at medium weight automatically.
- **Thresholds row: always a bare number — "183 days," never "More than 183 days."**
  **The number is the one the law states, not the first day that actually qualifies.** A statute reading "more than
  183 days" gives a `Threshold` of `183 days`, not `184 days`. This was got wrong across ten state articles and had
  to be corrected: converting to the first qualifying day silently re-states the law, makes the cell disagree with
  every source a reader will check, and hides the very distinction the table exists to show — Minnesota's "at least
  183" and Connecticut's "more than 183" both belong in the table as `183 days`, with the qualifier carried in the
  callout and explained in "How to keep track" and an FAQ. Watch the knock-on effects when correcting this: the
  subtitle, the callout, the SEO description and any FAQ that called a flat figure "a day short" all have to move
  together, or the article contradicts its own table. This reverses
  an earlier version of this plan, which asked for "More than N days" whenever that was genuinely
  the law's own phrasing. In practice that produced a table cell doing two jobs at once — carrying
  the number *and* the qualifier — when the table's job is the lookup and the qualifier is prose.
  "More than," "at least," "N or more" all belong in the callout and in "How to keep track," where
  the distinction can actually be explained; the table cell is just the figure. This matters more
  than it looks: get the qualifier wrong in the table and it's cosmetic, but state it wrong in
  prose and you've misdescribed the rule — Denmark's "more than 6 consecutive months" (law says "at
  least") and Montenegro's "at least 183 days" (law says "more than") were both real errors caught
  in review, not rounding disputes. Confirm the source's exact word before writing prose, every
  time — don't infer it from how a similar country's rule usually reads.
  For a rule with several distinct route thresholds, list them comma-separated in the order
  they're introduced in the article; for a rule with banded thresholds that each matter on their
  own, list every boundary number. If the underlying law states the threshold in a unit other than
  days (a number of months, say), lead with that native unit, then **append an approximate day
  figure in parentheses** — `9 months (about 270 days)`. The tracker counts days, so a cell a
  reader cannot act on in days is a cell that fails its job. The word "about" is doing real work
  and is not optional: it marks the figure as arithmetic, not law. Never present a converted figure
  as if the source gave it, and where the source gives no equivalent, say so plainly in "How to
  keep track" and in an FAQ entry ("Is 9 months the same as 270 days?"). California is the
  reference — FTB states the threshold in months and publishes no day equivalent and no partial-day
  rule anywhere in Publication 1031 or its Residency and Sourcing Technical Manual, so the article
  says exactly that. Check before converting: months are not uniform, and a rule stated in months
  may deliberately avoid a day count. **Name what is being counted when the cell
  would otherwise be ambiguous** — "330 days abroad" rather than "330 full days," since a reader
  scanning the table needs to know *what* the number measures, and a qualifier like "full" is a
  counting mechanic that belongs in "How to keep track" where it can actually be defined.
- **Period / Window row: use the `Rolling` form here, not the callout's `any` form.** The corpus
  uses exactly these: `Calendar year (1 Jan – 31 Dec)`, `Rolling 12 months`, `Rolling 365 days`,
  `Tax year (1 Apr – 31 Mar)`, `Income year (1 Jul – 30 Jun)`, `UK tax year (6 Apr – 5 Apr)`. Match
  one of these unless the rule genuinely doesn't fit any (Germany's `Continuous stay, not tied to a
  calendar year` is the reference exception). Where a jurisdiction's own year is a calendar year but
  its law calls it something else, use `Tax year (1 Jan – 31 Dec)`.
  **"Tax year" is the house term everywhere in the article, including where the source says
  "taxable year."** US sources say "taxable year" throughout; we don't. This is a house-style
  substitution, not a quotation change — so it is safe in our prose, and it is the one place to
  stay alert if the article ever quotes statutory language directly.
- **Period / Window row: use short, standard patterns only** — "Rolling 12 months," "Rolling 365
  days," "Calendar year (1 Jan – 31 Dec)," "Income year (1 Jul – 30 Jun)." Don't elaborate in the
  cell ("Any rolling 12-month period," "Rolling 12-month period from entry") — a detail like "from
  entry" belongs in "How to keep track," not the table.
- **Alternative row**: see above — it is the default 4th row, sits after `Counting`, and takes
  either a second day route or the named non-day test(s). Keep the value short and label-like; a
  day route reads `N days / Rolling M months`, a test reads by its name.
  **Never append an explanatory gloss to the value.** `Domicile, with no day count` was written and
  had to be cut back to `Domicile`: the table is a lookup, and the absence of a day figure in the
  cell already says there is no day count. Anything that explains rather than labels belongs in
  prose.
  **Add "test" or "tests" only where the official source itself uses that word.** Check before
  writing it — FTB uses "domicile" 87 times across its two residency publications and never once
  writes "domicile test", so California's cell is a bare `Domicile`. New York's own tax department
  does write "statutory residency test", so there the word is right. This cuts both ways: don't
  strip a "test" the source genuinely uses, and don't manufacture one it doesn't.
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
  **This holds even when the threshold itself is stated in months.** A months-based rule still gets
  a day-based `Counting` cell, because the reader is tracking days regardless of the unit the law
  chose. Say in "How to keep track" that counting any part of a day is the safe reading rather than
  a published rule, where that is the honest position.
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

**This is the single most commonly violated rule in the whole plan — check for it explicitly before
calling a draft done.** A batch of 18 new articles shipped with the mechanic explained in
Understanding in 5 of them regardless: Estonia's rolling-window framing, Czech Republic's
"cumulative and don't need to run consecutively," Bulgaria's rolling-vs-calendar-year distinction,
Montenegro's "measured against a fixed calendar year," Saint Vincent's "days do not need to be
consecutive." None of these looked wrong in isolation while writing — each read as a natural
sentence explaining *why* the rule works the way it does. That naturalness is exactly the trap:
the fix isn't to write worse prose, it's to notice that the explanatory sentence is restating a
mechanic and delete it, trusting How to keep track to carry it alone. After drafting, grep the
Understanding section specifically for "consecutive," "rolls," "resets," "cumulative," "arrival and
departure" — if any hit, move the sentence, don't just reword it.

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

**Keep it short and structured — prefer bullet groups over prose paragraphs.** Where a run of
paragraphs each carries one fact, they are usually a bullet list that hasn't been written as one
yet. A second short bullet group, introduced by its own lead-in line, reads far better than three
more paragraphs: California pairs "the two routes to residence" with "what time does" —
`More than 9 months … presumes residence` against `Fewer than 9 months … presumes nothing` — so the
one-way nature of the presumption is visible in the structure instead of needing a sentence to
explain it. That rewrite cut the section by 18% while keeping every fact.

**A rule with no threshold still has to say what to count.** Stating that a jurisdiction "has no 183-day rule" is
half an answer, and on its own it reads as "you can stop tracking" — which is usually wrong. Say what the days are
for instead. Illinois is the reference: there is no limit to stay under, but the presumption compares Illinois days
against **each other state separately**, so the reader has to track per state rather than per jurisdiction, and that
matters most for someone moving between states often. Carry the point into the callout, "How to keep track" and an
FAQ, not just one of them.

**Don't narrate a scenario here that an Example already walks through.** A case illustrating that a
presumption can be rebutted belongs in Examples, not in both — an anecdote in Understanding that
restates Example 1 is duplication of the same kind as a counting mechanic appearing twice, and it
gets cut the same way. State the principle in Understanding; let Examples carry the story.

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
article, not one of the longest. **The concrete target is the library median: about 395 characters
of prose, measured excluding the mandatory closing sentence** (min 162, max 531 across 73 rules).
Measure against that rather than guessing — a draft that feels long is often already at the median,
and one that reads tight can be well over it.

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

**The same ban covers margin-of-safety counsel — telling the reader how close to a limit they ought
to run.** "Because months vary in length, 270 is a guide rather than a threshold. Leave margin
instead of steering close to it" was written into a How to keep track list and had to be cut, along
with the same advice where it had leaked into an FAQ answer. State the figure and how it is
counted; how much room to leave is the reader's call, or their adviser's. Watch for the tell —
"leave margin," "a guide rather than," "don't steer close to," "to be safe" — and cut the sentence
rather than softening it.

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
- **Bold the whole threshold phrase, qualifier included** — `**more than 183 days**`, never
  `more than **183 days**`. The qualifier is not decoration around the number, it is half of what
  the threshold means: "more than 183" and "at least 183" are different rules that qualify on
  different days, and bolding only the figure visually asserts the number while hiding the part
  that decides which day actually counts. This applies to every qualifier — `more than`,
  `at least`, `no more than`, `fewer than`, `up to`, `under` — and to trailing ones, which move
  inside too: `**183 days or more**`, not `**183 days** or more`. The library was mixed on this and
  62 instances across 39 files had to be corrected in one pass.
  **The one exception is a sentence contrasting the wording itself.** Where the point being made is
  that a statute says one thing rather than the other, bold the qualifier alone so the contrast
  lands: Minnesota's "set at **at least** 183 days rather than more than 183" is the reference.
  **Never let a bold span cross a line break** — rewrap the sentence so the phrase sits on one line.
- **Never use italics.** Not for emphasis, not for contrast between two things, not for
  foreign-language terms, not for a defined term's first appearance. Bold is the library's only
  emphasis marker. Where a contrast genuinely needs marking — "time in the issuing country" versus
  "time in other member states" — rewrite the sentence so the contrast is carried by the words,
  or bold the single word that turns the meaning, and use nothing at all where the sentence
  already reads correctly without it.
- **American spellings throughout** — "center" not "centre", "license" not "licence", "program"
  not "programme", "organization", "recognize", "traveling", "neighbor", "defense", "favor",
  "behavior", "enroll". The exception is a proper noun genuinely spelled the British way — an
  official scheme or document whose registered name carries it — which keeps its own spelling.
  **Never fix these with a bare find-and-replace.** `s/centre/center/` matched inside "centred" and
  shipped "centerd" to five files before it was caught; run any such sweep with word boundaries and
  then read every changed line, including the inflected forms ("centred" → "centered", "centring" →
  "centering") that a naive pattern either mangles or misses entirely.
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

The Markdown `# H1` (the article page title) follows:

```text
{Country/place} {Rule category} ({the defining mechanism})
```

The frontmatter `title` is what listings show (chips, related content, JSON-LD). It uses a short
country/place name when one exists. It **omits a trailing threshold parenthetical** — that fact
already lives in `subtitle`. Write `title: California Tax Residency`, not
`title: California Tax Residency (9-month presumption)`. **Keep** a trailing bracket on
frontmatter `title` only when it names a test, programme, or status rather than restating a
day count: "(Statutory Residence Test)", "(Substantial Presence Test)", "(Naturalization)" /
"(Naturalisation)", "(Abandonment, Absence rule)", "(Settlement)", "(FEIE)", "(Act 60)".
Mid-title disambiguation stays on both: `Georgia (US State) Tax Residency`. Do not strip
thresholds at render time — author them correctly in the Markdown.

- **Markdown H1**: always the full country/place name, never abbreviated, even when the
  frontmatter title uses a short form (UK vs United Kingdom). **Keep the threshold bracket on
  the H1** whenever section 18 would put one there — chips use frontmatter; the article uses
  the H1.
- **The bracketed suffix** (on the H1, and on frontmatter only for named tests) names the
  rule's defining mechanism — the test's proper name if it has one, or the day-threshold
  shape if it doesn't (a single number: "N-day rule"; two alternative thresholds: "N-day and
  M-day rules"). Use "rule," not "route" or another synonym, as the connecting word — this was
  tried both ways and "rule" is the settled choice. Only include a bracket at all when it's a
  genuine 1–2-keyword phrase that fairly represents the rule and is worth targeting for search
  — not a list of every route. If the rule has more named tests than that (three or four
  distinct routes, none of them clearly the one thing people search for), omit the bracket
  entirely rather than force a reductive or overloaded one — a plain "{Country} Tax Residency"
  with no suffix is a legitimate, expected outcome for a genuinely multi-test rule.
- **On the H1, the bracket must carry the day number whenever the rule has one.** A label
  alone — "(actual residency rule)", "(statutory residency test)" — hides the single fact the
  reader came for, even when it is the jurisdiction's own term. Lead with the count and keep
  the official name alongside it where that name is genuinely used in the source:
  "(183-day actual residency rule)" for Virginia, "(183-day statutory residency rule)" for New
  York and New Jersey. A bracket with no numeric at all is right only where the rule genuinely
  has no count, as with Illinois's "(temporary or transitory purpose)" — still H1-only; frontmatter
  is `Illinois Tax Residency`.
- **`subtitle`**: a short, ∙-separated string of 2–3 key facts (the core threshold, the window
  type, and one other defining feature).
- **`seo.title`**: "{Country/place} {Rule category} Rules Explained | Immio" — no brackets.

### Sub-national rules — US states, and later cities

US states are **not** registered as places and get **no URL path of their own**. A state rule is a
US rule that happens to be about a state. Breadcrumbs stay
`Rules / Tax residency / United States`. There is no `/rules/states/...` and no new `PlaceType`.

- **`place: us-{subdivision}`** — `us-ca`, `us-ny`, `us-dc`. Do not register the state in
  `places.ts`. The compound id is how the rule gets its own flag; grouping, country pages, and
  breadcrumbs use the parent (`us`). Do **not** use `place: us` plus a separate `flag` field —
  that older pattern is obsolete. No registered place id contains a hyphen, so the split is
  unambiguous (`getParentPlaceId` / `isSubnationalPlaceId` in `places.ts`).
- **Frontmatter `category` stays `tax`** (or travel/immigration if a future state rule belongs
  there). State rules are not a fourth content category. Catalog display is separate (below).
- **File location**: `content/rules/{category}/united-states/`. This directory holds the federal
  US rules and the state rules together, and later cities. It is organisational only — the
  registry globs `content/rules/**/*.md` and the validator walks recursively. Routing still comes
  from frontmatter `id`, never from the path.
- **`id` / URL**: the bare state name — `california-tax-residency`, `new-york-tax-residency`.
- **Name collisions with countries**: disambiguate the state, never the country. Georgia is the
  live case: the country keeps `georgia-tax-residency`; the US state takes
  **`georgia-us-state-tax-residency`**.
- **Flags**: derived from the compound place id as `public/flags/{place}.webp` (raster, because
  the vector originals are too heavy for a 56px chip). Country flags stay SVG. Assets come from
  [HatScripts/circle-flags](https://github.com/HatScripts/circle-flags) (MIT) on the **`gh-pages`**
  branch, or a circle-masked public-domain flag in the same 512×512 WebP format when
  circle-flags has no file for that state.
- **Title**: frontmatter is the state name alone — "California Tax Residency". The H1 still
  carries the mechanism — "California Tax Residency (9-month presumption)". Do not prefix
  "US" or "United States". For a collision case, both carry the disambiguation
  ("Georgia (US State) Tax Residency" / H1 "Georgia (US State) Tax Residency (183-day rule)").
- **Where they list**
  - **Rule Guide catalog (`/rules`)**: a **US States** switch tab comes *after* Immigration.
    Country tax rules stay on Tax residency; state rules do **not** appear on that tab.
  - **`/rules/tax`**: country (and territory) tax rules first, then a grey **US STATES** divider
    (`content-catalog-group`), then every US state tax rule.
  - **`/rules/countries/united-states`**: federal US rules first (SPT, FEIE, visas, green card,
    naturalization, …), then the same **US STATES** divider, then the state rules. Other
    country pages have no divider.
  - Territories with their own place id — Puerto Rico, the US Virgin Islands — stay on their
    own country pages and on the Tax residency tab, not under the US States tab.

Territories with their own place id are unaffected. They stay in `content/rules/{category}/`.

---

## 19. Frontmatter schema

```yaml
---
id: {rule-slug}

title: {see section 18}
subtitle: {see section 18}

category: {the rule's category, e.g. tax, immigration, travel}

place: {a two-letter lowercase country code, a descriptive slug for a
         multi-country area, or `{parent}-{subdivision}` for a US state
         (`us-ca`) — see section 18}

seo:
  title: {see section 18}
  description: >
    {2–3 sentence description, 140–220 characters after YAML whitespace
    folds — this is now the ONLY description field on the article, see below}

updatedAt: YYYY-MM-DD

sources:
  - title: "..."
    url: https://...
    type: official

relatedContent:            # 3–6 rule IDs — see section 19a
  - {rule-slug}
  - {rule-slug}

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

**Length is enforced at build time** by `scripts/validate-content.mjs`: after collapsing YAML
folded-scalar whitespace, `seo.description` must be **140–220 characters**, and `seo.title` must
be **≤ 70 characters** (Google's safe display width is ~60; overflow on `| Immio` is acceptable).
A hyphenated word split across two lines of a folded scalar comes back as `"tax- home"` and also
fails validation — wrap with break-on-hyphens disabled. A description that only restates the
callout's first sentence often lands under 140; add the window (e.g. `1 July–30 June`) or a
counting detail (`any part of a day counts`) rather than padding.

**`relatedContent` is live again** (it was dormant for a period, and an earlier version of this
document said not to use it). It is rendered by
`src/modules/content/rules/components/RelatedContent.tsx` as the "Related content" block at the end
of the article, and validated at build time by `scripts/validate-content.mjs`. Every new rule needs
it — see section 19a.

Quote any YAML string value containing a colon — an unquoted colon inside a scalar breaks YAML
parsing.

---

## 19a. Related content — and updating the pages that should point back

A rule's `relatedContent` is authored, not computed. Choosing it is only half the job: **adding a
page is also a maintenance job on the pages already published.** The method for choosing entries —
the priority ladder, the count, why never to pad — lives in `ai/SEO Plan.md` under "Internal linking
standard"; read it before curating a set. What follows is the obligation that comes with shipping.

**1. Populate the new page's own list.** 3–6 entries, same jurisdiction first, then the *matching
rule type* across countries (a citizenship rule pairs with other citizenship rules, a
settlement/PR rule with other settlement/PR rules). Stop early rather than pad with a weak match:
five strong links beat six with two arbitrary ones. Six is the hard ceiling, enforced by the
validator.

**Batches are the exception: do this pass once, at the end.** When generating a set of related
rules together — all the US states, say — do not edit other rules' `relatedContent` as each one
lands. Populating the new page's own list (step 1) is still part of writing it, but the inbound
pass below waits until the whole batch exists and the user asks for it. Editing inbound links
rule-by-rule during a batch means churning the same files repeatedly and choosing each new page's
slots before its siblings exist. A brand-new rule sitting at zero inbound links mid-batch is the
expected state, not an error — the validator reports the count without failing on it.

**2. Then go back and update the existing pages that should now point at it.** This is the step
that gets skipped. A new rule that links out to six others but is linked *from* nowhere is
effectively invisible to the internal link graph — it collects no authority and readers never reach
it from a related article. So after writing the file:

- List the rules whose readers plausibly want the new one: same country first, then the same rule
  type in comparable jurisdictions.
- For each, open the file and decide whether the new rule earns a slot. If that page is already at
  six, either swap out its weakest entry or leave it alone — do not exceed six.
- Aim for the new rule appearing in **at least 2–3** other rules' lists before it is considered done.
- `npm run validate-content` prints how many rules receive inbound links; use it to check the new
  page is not left at zero.

Reciprocity is the normal outcome for same-country pairs (PR ↔ citizenship, tax ↔ visa) and is worth
making deliberate. It is not required for cross-country links — a page whose six slots are full of
closer matches should keep them.

**3. Watch for hub concentration.** A handful of canonical rules (currently `us-green-card` and
`uk-ilr-180-day-rule`) attract links from everywhere. If one is climbing well past the others,
redistribute rather than let two pages absorb the internal link equity the long tail needs.

### US rules and US state rules

US state rules (New York, California, and the rest of the statutory-residency set) are the
**most relevant** related content for the US federal rules and for each other — a reader on the
US Substantial Presence Test is very often the same person who needs New York or California
statutory residency.

So, for any US rule:

- Include the state rules that genuinely bear on it before reaching for another country.
- Where a US rule cannot find six genuinely relevant links from federal rules alone, **fill the
  remaining slots with US state rules** rather than padding with unrelated jurisdictions. This is
  the one place where filling to six is preferred, because the state rules are always relevant to a
  US reader.
- Every new state rule must also be added back into the federal US rules' lists per step 2 above,
  and cross-linked with the neighbouring states a reader is likely to be weighing (NY ↔ NJ ↔ CT,
  CA ↔ neighbouring western states).

Note the exception this creates: `us-green-card` and `us-naturalization` currently drop
`us-b1b2-visa` and `us-esta` because visitor-visa rules are irrelevant to someone who already holds
status. State residency rules are not in that category — they are relevant to every US reader.

### Articles that are not rules

The same obligation applies to non-rule content — a question answer ("does a layover count as a day
in a country?"), a comparison piece, a general explainer. These are the pieces most likely to be
published and then left unlinked, because they do not slot into the country/category grid the way a
rule does.

When one ships:

- Give it its own related content, mixing the rules it explains and any sibling articles.
- **Find every rule whose readers would want it and add it there.** A guide on proving days spent in
  a country belongs on the rules where evidence actually matters; a Schengen/EES explainer belongs
  on the Schengen rule and on the visitor-visa rules around it.
- An article that only links outward is the failure mode to avoid. Guides earn their place by
  feeding the rule pages *and* being reachable from them.

---

## 19b. The Overview callout is shared with the app — keep both in sync

The app renders the **same callout text** as each rule's tracker description, in:

```
<app repo>/tracker/composeApp/src/commonMain/composeResources/values/trackers.xml
```

as `<string name="overview_{tracker_name}">`. **Any edit to a callout — including a one-word typo fix
— must be applied there too**, or the two drift and the same rule reads differently in the app and on
the web.

Two things to know before editing that file:

**1. Mark untracked additional routes with `(not tracked here yet)`.** The parenthetical is app
state, not web content — it exists **only** in the XML and must survive a sync. Drop it only when
the app actually starts tracking that route.

The source of truth for *which* tax routes are untracked is
`<app repo>/tracker/tracker_rules_config.csv`: any **Additional Requirement** cell that starts with
`!!` is not implemented in the tracker. Place the marker immediately after the clause in the
overview string that describes that route — same pattern as Singapore's 2-year employment route,
Puerto Rico's and the USVI's 549-day alternatives, Hong Kong's 300-day route, India's
60-day-plus-history test, and Israel's 30+425 test. Later `!!` rows (Ireland's 280-day/2-year test,
Kenya's 122-day/3-year average, Mauritius's 270-day/3-year test, Denmark's shorter home-based
limits, New Zealand's 325-day cessation test) follow the same attachment.

The web callout should already mention that route, so stripping the parenthetical leaves XML and
web identical. If the `!!` route is missing from the callout, add a short mention there first,
then tag it in XML — don't invent a sentence that exists only in the app.

**2. The string names do not match rule IDs one-for-one.** Most are the ID with underscores, but
eleven differ — `australia_residency`, `canada_residency`, `india_tourist_visa`,
`italy_residence_permit`, `puerto_rico_act60_residency`, `schengen`, `thailand_visa_exemption`,
`uk_ilr`, `uk_srt`, `us_citizenship`, `us_spt`. Map by meaning, not by string similarity.

The file is **not under version control** — back it up before a scripted edit. **Never put the
backup inside `composeResources/values/`.** Compose Multiplatform scans every file in that folder;
a `trackers.xml.bak-*` there fails the build with `Unknown resource type: 'values'`. Copy the
backup to `/tmp` or a folder outside `composeResources`.

**Per-visit tax limits (app form, not the callout).** When the tracker's period is `PerEntry`,
`TaxTrackerForm` suffixes the day unit with the `per_visit` string so the row reads **Stay under
X days per visit**. Don't add "per visit" to the web callout just to match that label.

To check for drift, strip the Markdown from each callout (`**` and `[text](url)` → `text`), collapse
whitespace, remove the `(not tracked here yet)` inserts, and compare against the XML strings. A rule
whose callout changed but whose XML string did not is the failure this section exists to prevent.

---

## 20. SEO requirements

Optimize naturally — no keyword stuffing. The page should clearly target the natural search
variants for its country and rule (the rule's proper test name, its day-threshold shorthand, and
generic "{country} {rule category} residency/rules" phrasing), used naturally across the H1,
introduction, H2s, body content, FAQ questions, `seo.title`, and `seo.description`. The page should
answer search intent, not just repeat keywords. Keep `seo.description` inside the 140–220 character
band in section 19 — `npm run build` fails below 140.

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
5. **If a callout changed, sync `trackers.xml` in the app repo** (section 19b), preserving any
   `(not tracked here yet)` markers, adding the marker on any tax overview whose CSV additional
   requirement is prefixed `!!`, and never leaving a backup file in `composeResources/values/`.
6. **After a callout phrasing change (e.g. `makes you` → `can make you`), grep every tax
   `:::callout` — not the rest of the article — and confirm the XML overviews match once markers
   are stripped.**
7. **After adding a page, confirm it is reachable from pages that already shipped.**

   ```bash
   npm run check:new-rule-links
   ```

   This is stricter than `validate-content`, and the difference matters. `validate-content` asserts
   every rule receives at least one inbound `relatedContent` link — which a batch of new rules
   satisfies by linking to *itself*. Those pages are then reachable only from other pages Google has
   not crawled, so they inherit no authority and are discovered last. `check:new-rule-links` diffs
   against `origin/main` and fails when a new rule has no inbound link from an already-shipped page.

   It is not part of `npm run build` on purpose: it needs git history, and the deploy build runs on a
   clone that may be shallow. A failing build there would take the site down over a link-graph
   opinion.

   **Expect to swap, not append.** Well-connected pages sit at the 6-entry cap, so making room means
   dropping the weakest existing pair. That is the right trade — six strong links beat seven where
   one is filler.
7. **After a scripted or regex edit, re-check list numbering and table structure.** `sed` and
   `perl` substitutions across numbered lists have twice produced duplicate or malformed markers
   that render as broken lists. An `awk` pass for repeated consecutive list numbers, and a width
   check across each table block, catch both.
8. **For a batch of new articles (roughly 5 or more), run an independent review pass before
   treating the batch as done.** Spawn a fresh-context agent — high effort, no memory of how the
   batch was written — with two jobs: re-verify every threshold, window, counting rule, alternative
   test, and penalty figure against primary sources (not the article's own claims, not competitor
   pages), and separately check every article against this plan end to end. A batch of 18 articles
   reviewed this way surfaced 9 real factual errors the writer had missed, plus the Additional
   requirements/Alternative confusion in a third of the batch — none of it caught by the writer's
   own re-reading, because a second read of your own work tends to confirm what you already believe
   rather than question it. **Then verify the review's own findings before acting on them** — an
   independent reviewer can itself be wrong (one finding in that batch was a misreading of an
   ambiguous foreign-language clause, confirmed false on a direct primary-source check) — so spot-
   check the highest-stakes claims yourself rather than applying every finding automatically.

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
- **Related content, both directions** — the article has 3–6 curated entries, *and* the existing
  pages that should point at it have been updated (section 19a). Check the inbound count, not just
  the outbound list.
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