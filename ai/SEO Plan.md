# Immio SEO Plan — Audit, Roadmap & Ongoing Standard

**Site:** https://immio.app  **Audit date:** 2026-08-20  **Last updated:** 2026-08-20
**Scope:** whole site, with depth on `/rules` and all subpages.
**Benchmarks:** [bounded.app](https://bounded.app/), [atlasdays.app](https://atlasdays.app/)

This document is the standing reference for all SEO work on immio.app: what is broken, what to
build, in what order, and the rules to keep applying so it stays healthy. Update this file in place
as items ship (tick the checkboxes, mark findings **SHIPPED**); do not fork it into versioned copies.

**Status:** Phase 1 (foundations) and Phase 2 (head & schema) are implemented and verified locally
against the Workers runtime — see §4. Not yet deployed, and four items in §9 need input from the
site owner before they can be finished.

---

## 0. How to use this document

| Section | Use it for |
|:--|:--|
| §1 Current state | What exists today, verified against the live site |
| §2 Competitive benchmark | What bounded.app / atlasdays.app do that we don't |
| §3 Findings | The full audit, prioritised P0 → P3, each with fix + file to touch |
| §4 Roadmap | The order to ship in, grouped into shippable phases |
| §5 Content strategy | Keyword architecture, slug standard, expansion backlog |
| §6 Standing rules | Checklists that apply to every new page and every release |
| §7 Measurement | What to track, where, and the review cadence |
| §8 Appendix | Raw competitor inventories and current rule inventory |
| §9 Needed from you | The four things only the site owner can supply |

**Severity key:** **P0** = blocks or actively damages indexing, fix first. **P1** = material ranking or
CTR loss. **P2** = growth work with clear upside. **P3** = polish / long-horizon.

---

## 1. Current state (verified 2026-08-20)

### Architecture

| Layer | Reality |
|:--|:--|
| Landing `/` and `/contact` | Client-rendered React SPA. `index.html` is a 929-byte shell; all content is in a 219 KB JS bundle. |
| `/rules/**`, `/privacy`, `/terms` | Fully server-rendered HTML from the Cloudflare Worker ([src/worker/content.ts](src/worker/content.ts)) via [pageShell.ts](src/modules/content/pageShell.ts). No hydration — good, fast, crawlable. |
| Content source | 54 Markdown rules in [content/rules/](content/rules/), parsed at build time by [registry.ts](src/modules/content/rules/registry.ts). |
| Routing | Routes generated per rule / category / country in [content.ts](src/worker/content.ts). Single-rule countries 301 → their rule. |
| Asset fallback | `wrangler.json` → `not_found_handling: "404-page"` + explicit `/contact` route (was `"single-page-application"`, which returned 200 for every unknown path). |

### What is already right (don't regress it)

- Rule pages are true SSR HTML — headings, tables, FAQ text, and sources are all in the initial response.
- `<title>`, `<meta name="description">`, `<link rel="canonical">` present on every `/rules/**`, `/privacy`, `/terms` page.
- `Article` + `BreadcrumbList` JSON-LD on rule pages; `WebPage` + `BreadcrumbList` on listings ([seo.ts](src/modules/content/rules/seo.ts)).
- Clean, readable, keyword-bearing URL slugs. No IDs, no query-string routing.
- Every rule has a FAQ block, an "Official sources" block with authoritative `.gov` citations, and an `updatedAt` date rendered as "Verified in {Month Year}".
- Median rule length **1,201 words**, 8–9 `<h2>` sections — competitive depth.
- All `<img>` have `alt`; width/height set (no CLS from images).
- `cache-control: public, max-age=3600` on content pages.
- Category switch on `/rules` renders **all three** category lists server-side — crawlable without JS. Good call.

### Shipped 2026-08-20 (Phases 1–2)

`robots.txt` · Worker-generated `sitemap.xml` (73 URLs) · real 404s · trailing-slash normalisation ·
canonical-host + `noindex` gating for preview hosts · GA4/gtag wiring · Open Graph + Twitter Cards ·
`og:image` (1200×630, generated) · `FAQPage` schema on all 54 rules · enriched `Article` schema with
`citation[]` · `ItemList` on listings · `Organization` / `WebSite` / `MobileApplication` schema ·
full static head on the homepage · GA4 analytics, gated to the production host.

### Still missing

Internal "Related rules" links · `llms.txt` · hreflang / i18n · HTTPS enforcement (dashboard) ·
Search Console + Bing verification · server-rendered landing page · self-hosted fonts ·
`/about` + `/methodology`.

---

## 2. Competitive benchmark

### Scale

| | Immio | bounded.app | atlasdays.app |
|:--|--:|--:|--:|
| Indexable URLs (sitemap) | 73 *(was 0)* | 466 (233 × 2 langs) | 115 EN + 7 more languages |
| Rule / article pages | 54 | 126 | ~90 (`/learn/`) |
| Languages | 1 (en) | 2 (en, fr) | 8 (en, ja, nl, de, es, fr, ru, uk) |
| Country hub pages | 20 | 20 | — |
| Help/docs section | ✗ | ✗ | 26 pages (`/help/`) |
| US state coverage | ✗ | ~25 states | ~20 states |

### Technical features, head-to-head

| Feature |                                     Immio                                      |                             bounded.app                             | atlasdays.app |
|:--|:------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|:-:|
| `robots.txt` |                                   ✓ *(new)*                                    |             ✓ (+ Sitemap directive, `Disallow: /start`)             | ✓ (+ Sitemap directive) |
| `sitemap.xml` |                ✓ *(new)* — `<lastmod>` from real content dates                 | ✓ with `<lastmod>`, `changefreq`, `priority`, `xhtml:link` hreflang | ✓ sitemap **index** → per-language sitemaps |
| Canonical |                                       ✓                                        |                                  ✓                                  | ✓ |
| hreflang |                                       ✗                                        |                          ✓ en/fr/x-default                          | ✓ 8 langs + x-default |
| Open Graph |                                   ✓ *(new)*                                    |                                  ✓                                  | ✓ |
| Twitter Card |                                   ✓ *(new)*                                    |                       ✓ `summary_large_image`                       | ✓ `summary_large_image` |
| `og:image` |              ✓ *(new)* sitewide 1200×630 + alt; per-page pending               |                  ✓ **per-page generated** 1200×630                  | ✓ 1200×630 + `og:image:alt` |
| `Article` schema | ✓ *(enriched)* + `inLanguage`, `about`, `citation[]`, `datePublished`, `image` |         ✓ + `inLanguage`, `about`, `citation[]`, publisher          | ✓ |
| `FAQPage` schema |                       ✓ *(new)* all 54 rules + homepage                        |                                  ✓                                  | ✓ (homepage + articles) |
| `BreadcrumbList` |              ✓ 3 levels, ends on country — deliberate (see P1-5)               |            ✓ 4 levels → Rulebook / Tax / Country / Rule             | ✓ |
| `Organization` + `WebSite` |                        ✓ *(new)* — `sameAs` still empty                        |                        ✓ (`sameAs` socials)                         | ✓ |
| App schema |    ✓ *(new)* `MobileApplication` + `aggregateRating` 4.8/100, shown on page    |   ✓ `MobileApplication` + `aggregateRating` 4.8/100 + `review[]`    | ✓ `SoftwareApplication` + `downloadUrl` |
| `apple-itunes-app` smart banner | ✗ *(removed by choice)* | ✗ | ✓ |
| `ItemList` on listings |                                   ✓ *(new)*                                    |                                  ✗                                  | ✗ |
| Analytics |              ✓ *(new)* GA4 `G-KVJFE2FFJ3`, production-host gated               |                    ✓ GTM (`GTM-M3RBRGW5`) + GA4                     | (server-side / none detected) |
| Real 404 for unknown URLs |                          ✓ *(fixed)* 404 + `noindex`                           |                          ✓ 404 + `noindex`                          | ✓ |
| `llms.txt` |                                       ✗                                        |                             ✓ 605 lines                             | ✓ 1,014 lines |
| Responsive image `srcset` |                                       ✗                                        |                        ✓ 8 widths per image                         | ✓ |

### What each does well that we should copy

**bounded.app**
1. **Keyword-in-slug rule naming** — `portugal-nhr-183-day-tax-residency`, `uk-ilr-180-day-absence-rule`, `us-feie-330-days-12-month-rolling`. The threshold and window are *in the URL*. Ours are generic (`portugal-tax-residency`).
2. **A rendered "Related rules" block** — exactly **3** entries per rule page, same-country first. (An earlier draft of this document said "21 unique internal links per rule page"; that counted nav, footer, and language-switcher links. Measured rule→rule, Bounded's pages carry **7** links, of which 3 are the related block. Corrected 2026-08-20.)
3. **4-level breadcrumbs** ending on the rule itself, with the country level pointing to the country hub — more sitelink surface in SERPs. *(Evaluated and declined for Immio — see P1-5.)*
4. **`citation[]` in Article schema** built from their sources list. We already store `sources[]` in frontmatter and throw it away.
5. **`aggregateRating` + `review[]`** on `MobileApplication` — this is what produces star ratings in SERPs.
6. **Separate marketing hubs from the rulebook**: `/tax`, `/residency`, `/visas`, `/citizenship` are conversion pages; `/rules/*` is the reference library. Two different intents, two different page types.
7. **Section structure tuned for snippets**: Summary → Who it applies to → The rule → Counting the days → Examples → Exceptions → **Common misconceptions** → FAQ → Sources → Related.

**atlasdays.app**
1. **`/learn/` long-tail question content** — `does-a-layover-count-as-visiting-a-country`, `how-to-track-travel-days`, `prove-time-spent-in-country-without-perfect-records`, `country-counting-rules-every-list-compared`. These capture question queries and AI-overview citations that pure rule pages don't.
2. **US state tax residency at scale** — ~20 state pages (`california-tax-residency`, `new-york-tax-residency`…). High-volume, low-competition, perfectly on-topic for a day counter.
3. **`/help/` documentation indexed** — 26 pages of product docs earning branded + how-to traffic and feeding topical authority.
4. **8-language sitemap index** with per-language sitemaps and full hreflang.
5. **`/changelog`** — a durable freshness signal.
6. **`og:image:alt`, explicit `og:image:width/height`** — clean unfurls everywhere.
7. **Product-fact and privacy sections** ("Product facts you can verify") — strong E-E-A-T signalling on a YMYL-adjacent topic.

> **YMYL note:** tax residency and immigration are Your-Money-Your-Life topics. Google applies elevated
> quality standards. Everything in §6.3 (authorship, sourcing, dates, disclaimers) is not optional polish —
> it is a ranking prerequisite in this niche.

---

## 3. Findings

### P0 — Fix first (blocks or damages indexing)

---

#### P0-1 · No `robots.txt`

> **✅ SHIPPED 2026-08-20** — [public/robots.txt](public/robots.txt), including explicit allows for AI/answer-engine crawlers.

**Evidence:** `GET https://immio.app/robots.txt` → `200`, `content-type: text/html`, 929 bytes — it is serving the SPA shell.
**Impact:** No sitemap discovery. Crawlers receive an HTML document where a directives file is expected.
**Fix:** Add `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://immio.app/sitemap.xml
```

Do **not** add `Disallow` rules for `?source=inapp` — the canonical tag already consolidates those, and a
`Disallow` would prevent Google from *seeing* the canonical.
**Touch:** `public/robots.txt` (new).

---

#### P0-2 · No `sitemap.xml`

> **✅ SHIPPED 2026-08-20** — [src/modules/content/sitemap.ts](src/modules/content/sitemap.ts), served at `/sitemap.xml`. 73 URLs, derived from the rule registry. Single-rule country hubs (which 301) are excluded; `<lastmod>` comes from real `updatedAt` dates, and listing pages take the newest date of the rules they contain. **Still needs submitting in Search Console — see §9.**

**Evidence:** `GET /sitemap.xml` → `200 text/html` (SPA shell). Bounded ships 466 URLs, AtlasDays a sitemap index.
**Impact:** 78 indexable URLs are discoverable only by crawl. New rules take far longer to be found; no `lastmod` signal on updates.
**Fix:** Generate it in the Worker from the existing registry — it is fully derivable, so it can never go stale:

```ts
// src/worker/sitemap.ts (new), mounted in src/worker/index.ts
// URLs: /, /contact, /privacy, /terms, /rules, /rules/countries,
//       /rules/{category.slug} × 3,
//       /rules/countries/{place.slug} for multi-rule places only (single-rule places 301),
//       /rules/{rule.frontmatter.id} × 54
// <lastmod> from rule.frontmatter.updatedAt; site pages use the build date.
// content-type: application/xml
```

Exclude 301-redirecting single-rule country paths. Then submit in Search Console (P0-6).
**Touch:** `src/worker/sitemap.ts` (new), `src/worker/index.ts`, `wrangler.json` (`run_worker_first` += `/sitemap.xml`, `/robots.txt`).

---

#### P0-3 · Soft 404s — every unknown URL returns `200`

> **✅ SHIPPED 2026-08-20** — `not_found_handling` switched to `"404-page"`, `ASSETS` binding added, `/contact` served explicitly by the Worker, branded [public/404.html](public/404.html) with `noindex`. Every route now returns a permanent redirect or a real status; verified against the Workers runtime (see §4).

**Evidence:**
```
GET /foo          → 200  (SPA shell)
GET /contact/xyz  → 200  (SPA shell)
GET /rules/tax/   → 404  ← inconsistent with /rules/ and /rules/countries/, which are 200
```
**Cause:** `wrangler.json` → `"not_found_handling": "single-page-application"` serves `index.html` with `200` for any unmatched path.
**Impact:** Infinite indexable near-duplicate URLs, all with the same title and no content. This dilutes crawl
budget and is a classic quality-signal problem. Any bad inbound link creates an indexable page.
**Fix:**
1. Have the Worker own routing end-to-end: keep the content routes, then a catch-all that serves `/` and `/contact` from `env.ASSETS` and returns a genuine `404` (with a branded 404 page and `<meta name="robots" content="noindex">`) for everything else. Requires widening `run_worker_first` and adding an `assets.binding`.
2. Normalise trailing slashes with a `301` in both directions rather than a mix of `200` and `404`: `/rules/tax/` → `/rules/tax`.

**Touch:** `wrangler.json`, `src/worker/index.ts`, `src/modules/content/pageShell.ts` (404 view).

---

#### P0-4 · `http://` is served directly with `200`; no HSTS

> **⛔ BLOCKED — needs you.** This is a Cloudflare dashboard toggle, not code. Doing it in the Worker would only cover HTML routes (not `/assets/*`) and risks a sitewide redirect loop if scheme detection is wrong behind the proxy. See §9.

**Evidence:** `curl -I http://immio.app/` → `HTTP/1.1 200 OK` (no redirect). No `Strict-Transport-Security` header on HTTPS responses.
**Impact:** Every URL exists on two protocols — duplicate content and split link equity. Also a security and trust signal Google reads.
**Fix:** In the Cloudflare dashboard for `immio.app`: enable **SSL/TLS → Edge Certificates → Always Use HTTPS**, then enable **HSTS** (`max-age=31536000; includeSubDomains; preload`). Enable HSTS only after confirming everything is HTTPS-clean — it is hard to reverse.
**Touch:** Cloudflare dashboard (no code).
**Note:** `www.immio.app` does not resolve, so there is no www/apex duplication to fix. Leave it that way, or add www with a 301 to apex if you ever create the DNS record.

---

#### P0-5 · Homepage and `/contact` have almost no crawlable head

> **◐ STAGE 1 SHIPPED 2026-08-20** — [index.html](index.html) now carries the full head: description, canonical, robots, OG, Twitter, and four JSON-LD blocks (`Organization`, `WebSite`, `MobileApplication`, `FAQPage`). Stage 2 (server-rendering the page) is Phase 5 — and matters more than it looks, because most AI crawlers do not execute JS at all (see LLM-1).

**Evidence:** `index.html` is 929 bytes. It has a `<title>` and nothing else — **no meta description, no canonical, no OG, no Twitter, no structured data**. All content requires JS execution.
**Impact:** The most linked, highest-authority page on the domain competes for `tax residency tracker`, `day counter app` etc. with a blank description; Google writes its own snippet. Every share on iMessage, WhatsApp, Slack, X, LinkedIn, Reddit renders as a bare URL with no title card — a direct, measurable loss of referral clicks. Both competitors have full head markup here.
**Fix — two stages:**

*Stage 1 (cheap, do immediately)* — write the full head statically into [index.html](index.html):
```html
<meta name="description" content="…155 chars…" />
<link rel="canonical" href="https://immio.app/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Immio" />
<meta property="og:title" content="Immio — Tax Residency & Travel Day Tracker" />
<meta property="og:description" content="…" />
<meta property="og:url" content="https://immio.app/" />
<meta property="og:image" content="https://immio.app/og/immio-home.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="…" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="…" />
<meta name="twitter:description" content="…" />
<meta name="twitter:image" content="https://immio.app/og/immio-home.png" />
```
Plus JSON-LD: `Organization` (with `logo` + `sameAs`), `WebSite`, `MobileApplication`/`SoftwareApplication`
(both stores, `offers`, and — once you have store reviews — `aggregateRating`, which is what puts stars in
the SERP), and `FAQPage` mirroring the landing FAQ in [LandingPage.tsx](src/react-app/LandingPage.tsx).

*Stage 2* — server-render `/` and `/contact` through the same `renderDocument` shell the rules pages use, so
the homepage ships real HTML. The components already exist; the blocker is `LandingPage`'s client state
(FAQ accordion, header) — the rules pages already solve exactly this with server-rendered markup plus the
inline vanilla scripts in [pageShell.ts](src/modules/content/pageShell.ts). Reuse that pattern.
**Touch:** `index.html`, later `src/worker/content.ts` + `src/react-app/LandingPage.tsx`.

---

#### P0-6 · No analytics, no Search Console, no Bing Webmaster

> **◐ ANALYTICS DONE / SEARCH CONSOLE PENDING.** GA4 via gtag is implemented in [src/shared/analytics.ts](src/shared/analytics.ts) (server-rendered pages) and [src/react-app/analytics.ts](src/react-app/analytics.ts) (SPA routes, with per-navigation page views). Measurement ID `G-KVJFE2FFJ3` — the `measurementId` from the `immio-app` Firebase web config — is set in `.env.local` (gitignored). The `firebase` npm package is deliberately **not** installed: Firebase Analytics for web is GA4, so the SDK would add ~45 KB to send identical events to the same property.
>
> Two independent gates: no markup at all when the ID is unset, and nothing loads at run time unless the hostname is `immio.app`. That second gate is what keeps `npm run dev`, `wrangler dev`, and preview deployments out of the property — without it every local page load would be a real session.
>
> **Still needed: Search Console + Bing verification — see §9.2.** Confirm the tag itself in GA4 Realtime after the first deploy.

**Evidence:** No `gtag`, GTM, Plausible, or verification meta on any page. Bounded runs GTM + GA4.
**Impact:** Zero visibility. Every recommendation below is unmeasurable until this exists, and indexing
problems (P0-1 → P0-4) will stay invisible.
**Fix:**
1. **Google Search Console** — verify the domain (DNS TXT is best; it covers both protocols and all subdomains), submit `/sitemap.xml`, then check Pages → *Why pages aren't indexed*.
2. **Bing Webmaster Tools** — import from GSC in one click. Bing also feeds ChatGPT search results.
3. **Analytics** — **decided: GA4**, using the `measurementId` from the existing `immio-app` Firebase project (see §9.1). An earlier draft of this document recommended Cloudflare Web Analytics instead; GA4 was chosen because it can track the outbound "Get the app" click, which is the only conversion on the site and which Cloudflare Web Analytics cannot measure. Cloudflare Web Analytics remains worth adding for one specific job — see §9.7.

**Touch:** DNS, `index.html`, `src/modules/content/pageShell.ts`.

---

#### P0-7 · No Open Graph or Twitter Card on **any** page, including all 54 rule pages

> **✅ SHIPPED 2026-08-20** — full OG + Twitter block in [pageShell.ts](src/modules/content/pageShell.ts), `og:type: article` on rule pages. Card image generated by [scripts/generate-og-images.mjs](scripts/generate-og-images.mjs) → `public/og/immio-default.png` (1200×630, real Rethink Sans, 92 KB). Per-rule cards remain Phase 5; the script's layout is already parameterised for them.

**Evidence:** Zero `og:*` or `twitter:*` in [pageShell.ts](src/modules/content/pageShell.ts). Confirmed absent on live `/rules/portugal-tax-residency`.
**Impact:** Rule pages are the most shareable asset — a Reddit/X/Slack link to "Portugal 183-day rule" currently unfurls as naked text. Bounded generates a unique OG image *per rule*.
**Fix:** Extend `PageShellParams` with `ogImage`, `ogType`, and emit the full block. Then per-page images:
- **Phase 1:** one branded 1200×630 default at `/og/immio-default.png`.
- **Phase 2:** per-rule OG images — generate at build time from flag + rule title + threshold (all three already exist in frontmatter), or render on demand in the Worker. This is a visible differentiator vs. AtlasDays, which uses one static image sitewide.

**Touch:** `src/modules/content/pageShell.ts`, `src/worker/content.ts`, `public/og/`.

---

#### P0-8 · No `FAQPage` schema, despite all 54 rules having an FAQ

> **✅ SHIPPED 2026-08-20** — `buildFaqPageJsonLd` in [seo.ts](src/modules/content/rules/seo.ts), emitted on every rule page from the already-parsed `RuleSection.faqItems`. Answer HTML is stripped to prose with block-level boundaries preserved.

**Evidence:** Every rule renders an `<h2>FAQ</h2>` accordion ([FaqSection.tsx](src/modules/content/rules/components/FaqSection.tsx)), and `RuleSection.faqItems` is fully structured — but [seo.ts](src/modules/content/rules/seo.ts) has no `buildFaqPageJsonLd`. Both competitors ship it.
**Impact:** Forfeits FAQ rich results, People-Also-Ask placement, and — increasingly the bigger prize —
citation in AI Overviews and LLM answers, which lean heavily on `FAQPage` markup. This is the single
highest-leverage schema addition available: the data is already parsed and sitting in memory.
**Fix:** Add `buildFaqPageJsonLd(rule)` in `seo.ts`, emit from `renderRuleDocument`. Strip HTML from
`answerHtml` for the `text` value. Also add `FAQPage` to the landing page (P0-5).
**Touch:** `src/modules/content/rules/seo.ts`, `src/worker/content.ts`.

---

### P1 — Material ranking / CTR loss

---

#### P1-1 · `relatedContent` is validated but never rendered — the internal-linking gap

**Evidence:** `relatedContent?: string[]` exists in [types.ts](src/modules/content/rules/types.ts:44) and is validated in [validate.ts](src/modules/content/rules/validate.ts:55), but grep finds **no render site**, and **all 54 files leave it empty**. Measured 2026-08-20: every rule page has **3–4 inbound** internal links (from the catalog, its category page, the country index, and its country hub) and **0 rule→rule** links. No orphans. Bounded carries 7 rule→rule links per page, 3 of them a curated "Related rules" block.
**Impact:** The largest single ranking gap after the P0 set. PageRank cannot flow between rules; topical
clusters never form; users hit a dead end at the bottom of every article.
**Fix:**
1. Render a **Related rules** section at the end of `RulePage`, above the disclaimer, as flag + title + one-line cards.
2. Populate `relatedContent` in all 54 files, 3–5 entries each, following this precedence:
   - same country, different category (Portugal tax ↔ Portugal visa) — strongest signal;
   - same category, comparable regime (Portugal ↔ Spain ↔ Italy tax residency);
   - the rule a reader most plausibly needs next (US SPT ↔ US FEIE ↔ US green card).
3. Add a **"Rules for {Country}"** strip to every rule page linking its country hub, and cross-link
   category pages from each other.
4. Add a real footer nav ([SiteFooter.tsx](src/react-app/components/SiteFooter.tsx) currently links only
   `/privacy`, `/terms`, `mailto:`) with: Rule Guide, Tax residency, Travel limits, Immigration,
   Rules by country. Sitewide footer links are how the rulebook gets authority from the homepage.

**Touch:** `src/modules/content/rules/components/RulePage.tsx`, `RelatedRules.tsx` (new), all 54 `content/rules/**/*.md`, `SiteFooter.tsx`.

---

#### P1-2 · Meta descriptions were list-shaped, not answer-shaped

> **✅ SHIPPED 2026-08-21** — all 54 rewritten. **The original finding here was wrong and is corrected
> below.**

**The original claim was that 51 of 54 descriptions exceeded 160 characters and should be cut to
150–158.** Measuring the competitors showed that advice was mistaken:

| | range | median |
|:--|:--|--:|
| bounded.app rule pages | 146–223 | ~170 |
| atlasdays.app `/learn/` | 148–260 | ~210 |
| Immio (before) | 153–261 | 188 |

Immio's lengths were already in the same band as both competitors. Cutting to 155 would have thrown
away useful material for no gain — Google truncates the *display* at ~155 but reads the whole thing,
and the tail is material it can select from.

**The real defect was structure.** All 54 opened with the word "How", and all were shaped as a table
of contents rather than an answer:

> *before:* "How Portuguese tax residency works — the 183-day rule and its overnight-stay
> requirement, the habitual home test, and the IFICI regime for new residents."
>
> *bounded:* "Brazil's 183-day tax residency rule explained: spend more than 183 days in any rolling
> 12-month window and you become a Brazilian tax resident on day 184."

Competitors **state the rule**; Immio **listed what the page covered**. That matters at the cut
point: truncating a list mid-item gives "…the 12-month and 90-", which conveys nothing, whereas
truncating a sentence still leaves a complete thought. That is why competitors can safely run to 200+.

**One pattern, across all 54.** Title names the subject and its threshold; description is the
Overview callout compressed, opening on the fact with no lead-in phrase:

```
title:        {Country} {Subject} – {Threshold} | Immio          ≤60 chars
description:  {the rule, stated directly}. {second test or consequence}.   140-160 chars
```

The `{Subject}` is what the reader is actually looking up, using the name that rule is known by
rather than a generic category — `UK Naturalisation` not "UK Citizenship Residence",
`Thailand Visa Exemption` not "Thailand Travel Rules", `India e-Tourist Visa`, `UK Settlement (ILR)`,
`Schengen Area`. Check the official source titles already in each rule's frontmatter first, then
confirm against how the rule is actually searched and discussed.

The `{Threshold}` is the number plus what it measures, and the phrasing differs by category:

| category | threshold phrasing | example |
|:--|:--|:--|
| tax | presence | `183-Day Rule` |
| immigration, absence limit | absence, singular | `180-Day Absence Rule` |
| immigration, presence limit | presence | `913-Day Presence Rule` |
| immigration, multiple limits, no nickname | absence, no number | `Absence Rule` |
| travel, per-entry cap | per visit | `60 Days Per Visit Limit` |
| travel, rolling window | the window itself | `90/180-Day Rule` |

**Always singular — `Absence Rule`, never `Absence Rules`** — even where the rule has more than one
limit. Where such a rule has a widely-used numbered nickname, use the nickname rather than the
generic form: UK naturalisation is searched as the **"450-day rule"**, the US green card as the
**"6-month rule"**, so those titles carry the number despite each rule having a second threshold.
Where no nickname dominates (Italy and Spain long-term residence), the plain singular form is used.

Where an official body has its own name for the requirement, prefer it: Australian Home Affairs calls
it the **Residence Requirement** (their calculator is named that), so the title does too rather than
inventing a numbered label.

**A named test carries its acronym in brackets** — `Statutory Residence Test (SRT)`,
`Substantial Presence Test (SPT)` — because both the full name and the acronym are searched, and the
bracketed form captures each. Only add one where the acronym is genuinely established; "Residence
Requirement" and "Absence Rule" have none, and inventing one would help nobody. Where the acronym is
already the subject (`US FEIE`, `UK Settlement (ILR)`, `US ESTA`, `US B-1/B-2 Visa`) it is not
repeated.

Note SRT and SPT are different tests in different countries and are easy to transpose — the UK's is
the **S**tatutory **R**esidence **T**est, the US's the **S**ubstantial **P**resence **T**est.

Rolling-window travel rules keep the window rather than a per-visit figure, because "90/180 rule" is
the established term and the limit genuinely is not per visit.

**Where a rule has two thresholds a reader could fail independently, show both** — `Cyprus Tax
Residency – 60 & 183-Day Rules`, `Norway Tax Residency – 183 & 270-Day Rules`,
`India e-Tourist Visa – 90 Days/Visit & 180 Days/Year`. Listed ascending. This applies to genuinely
parallel limits only; a *window* is not a second threshold ("Rolling 12 months", "Starts Jan 1"
belong in the description, not the title), and neither is an extension of the same grant (Indonesia's
30 days extendable to 60).

The 60-character ceiling binds here. `India e-Tourist Visa – 90 Days Per Visit & 180 Days Per Year
Limit | Immio` is 74 and truncates before the year figure, defeating the point; `90 Days/Visit & 180
Days/Year` carries the same information in 60.

e.g. `Canada Tax Residency – 183-Day Rule | Immio` /
"183 days or more in Canada in a calendar year can make you a deemed resident. Significant
residential ties — home, spouse, dependants — need no day count."

**Result across all 54:** titles 39–59 (all under 60), descriptions 143–160 (median 154), **49 of 54
titles carry a number** (was 3). The five without are where no number belongs: Italy and Spain
long-term residence, Australia's Residence Requirement, and the two Statutory Residence Test /
Substantial Presence Test pages, where the test's name *is* the query. Every description written from that rule's own Overview
callout, so nothing is invented.

Where the rule is not a plain day count the threshold slot takes its real name —
`UK Tax Residency – Statutory Residence Test`, `US Tax Residency – Substantial Presence Test`,
`Germany Tax Residency – 6-Month Rule`. Where there are two thresholds both appear:
`Cyprus Tax Residency – 60 & 183-Day Rules`, `UAE Visit Visa – 90/180-Day Rule`.

Two title tails repeat across more than four pages — `180-Day Absence Rule` (Italy, Spain, UAE, UK
ILR, US green card) and `183-Day Rule` (most tax pages). That is unavoidable when the rules genuinely
share a threshold, and the `{Country} {Subject}` prefix still differentiates every one. It is only a
problem if the *whole* title repeats, which none do.

**Title titles containing a colon must be quoted in YAML** — an unquoted colon inside a scalar breaks
parsing. The en dash separator (`–`) avoids this entirely, which is part of why it was chosen.

**Enforced at build time** in [scripts/validate-content.mjs](scripts/validate-content.mjs):
description 140–220 chars (the library now sits at 143–160), `seo.title` ≤ 60, and a check for mid-word line-wrap artifacts — a
hyphenated word split across two lines of a folded YAML scalar comes back as "tax- home" once the
newline folds to a space, which is exactly what happened on the first pass and shipped silently.

---

#### P1-3a · Rule titles omitted the threshold — the thing people search

> **✅ SHIPPED 2026-08-21 — all 54 rules.**

Measured against the competitors:

| | title length | median | contains a number |
|:--|:--|--:|:--|
| bounded.app | 53–78 | 66 | most |
| atlasdays.app | 52–77 | 61 | most |
| Immio (before) | 38–60 | 46 | **3 of 54** |

Two defects. **The threshold was missing from 51 of 54 titles** — yet "portugal 183 day rule" is how
the query is actually typed, and the number is what gets bolded in the result. And **26 of 54 titles
were the identical string** apart from the country (`{Country} Tax Residency Rules Explained`), so
half the library was undifferentiated.

There was also unused room: median 46 characters against Google's ~55–60 display budget — almost
exactly the cost of adding "183-Day ".

---

#### P1-3b · Weak title patterns on category and index pages

**Evidence (live):**

| URL | Current `<title>` | Problem |
|:--|:--|:--|
| `/rules/tax` | `Tax residency Rules \| Immio Rule Guide` | Ungrammatical; "Rule Guide" is a brand term nobody searches |
| `/rules/travel` | `Travel, Visa & Stay limits Rules \| Immio Rule Guide` | Same, plus comma soup |
| `/rules/immigration` | `Citizenship & Residency requirements Rules \| Immio Rule Guide` | 62 chars, truncates |
| `/rules/countries` | `Rules by Country \| Immio Rule Guide` | Acceptable, but the page's **`<h1>` is "Search a rule"** — no keyword |
| `/rules` | `Immio Rule Guide \| Tax Residency, Travel & Immigration Rules` | Brand-first; put the keywords first |

**Fix:** Adopt one pattern — `{Primary keyword} {modifier} | Immio`:
- `/rules` → `Tax Residency, Visa & Immigration Day Rules | Immio`
- `/rules/tax` → `Tax Residency Rules by Country (183-Day Tests) | Immio`
- `/rules/travel` → `Visa & Stay Limit Rules by Country | Immio`
- `/rules/immigration` → `Residency & Citizenship Day Requirements | Immio`
- `/rules/countries` → `Travel, Tax & Visa Rules by Country | Immio`, `<h1>` → **"Rules by Country"** (keep the search box, demote it below the heading)

**Touch:** `src/worker/content.ts`, `src/modules/content/rules/categories.ts`, `CountriesPage.tsx`.

---

#### P1-4 · `Article` schema is minimal; sources are discarded

> **✅ SHIPPED 2026-08-20** — `citation[]` built from `frontmatter.sources`, plus `about`, `inLanguage`, `datePublished` (new optional `publishedAt` field, falling back to `updatedAt`), `image`, `url`, and a publisher `logo` as an `ImageObject`.

**Evidence:** [seo.ts](src/modules/content/rules/seo.ts) emits `headline`, `description`, `dateModified`,
`author`, `publisher`, `mainEntityOfPage`. Bounded additionally emits `inLanguage`, `about`, and
`citation[]` built from their sources.
**Impact:** On a YMYL topic, machine-readable citations to `.gov` sources are a direct trust signal — and
`citation[]` is exactly what LLM-based answer engines use to decide whether to quote you.
**Fix:** Extend `buildArticleJsonLd` with:
- `citation: rule.frontmatter.sources.map(s => s.url)` — **the data is already there**, this is a two-line change
- `about: { "@type": "Country", name: place.name }`
- `inLanguage: "en"`
- `datePublished` (add a `publishedAt` frontmatter field, defaulting to `updatedAt` for existing files)
- `publisher.logo` as an `ImageObject`, `author.url`
- `image` (the per-rule OG image from P0-7)
- Consider `@type: ["Article","FAQPage"]` or a separate `FAQPage` node (P0-8)

**Touch:** `src/modules/content/rules/seo.ts`, `src/modules/content/rules/types.ts`, `validate.ts`.

---

#### P1-5 · Breadcrumbs stop one level short and self-reference

> **✗ REVERTED 2026-08-20 — will not do.** A four-level trail was implemented and then rolled back at the
> site owner's request: `RULES / TAX RESIDENCY / UNITED KINGDOM` is the intended design, and the rule
> title as a fourth crumb made the trail long and wrapped it onto two lines on mobile.
>
> Re-examining the original finding, most of it was overstated. The final crumb never rendered as a
> link — [Breadcrumbs.tsx](src/modules/content/rules/components/Breadcrumbs.tsx) renders the last item
> as `<span aria-current="page">` — so there was no self-referencing *link* on the page. In the
> BreadcrumbList JSON-LD, a final `item` pointing at the current URL is the expected shape, not a
> defect. What remains is only that the final crumb is named for the country rather than the page,
> which is a legitimate design choice and costs little.
>
> **Do not re-implement this without asking.** If the country level is ever wanted as a *link* to the
> country hub, that is a separate change, and it must keep the visible trail and the emitted schema
> identical — structured data has to describe what is actually on the page.

**Evidence:** Live Portugal page breadcrumb: `Rules › Tax residency › Portugal` — where "Portugal" links to
*the current page*. Bounded: `Rulebook › Tax › Portugal (→ country hub) › Portugal — NHR (183-Day Tax Residency)`.
**Impact:** A self-linking final crumb wastes a level and produces a less informative SERP breadcrumb trail.
**Fix:** In [breadcrumbs.ts](src/modules/content/rules/breadcrumbs.ts), make `buildRuleBreadcrumbs` emit four
levels: `Rules › {Category} › {Country → /rules/countries/{slug}} › {Rule title}`. For single-rule countries
whose hub 301s to the rule, keep three levels ending on the rule title. This also creates a second
crawl path into the country hubs, reinforcing P1-1.
**Touch:** `src/modules/content/rules/breadcrumbs.ts`.

---

#### P1-6 · Performance: heavy hero assets and render-blocking fonts

**Evidence:**
| Asset | Size |
|:--|--:|
| `public/immio/landing-hero/world-map.svg` | **643 KB** |
| `assets/index-*.js` | 219 KB |
| `landing-hero/immio-mockup.webp` | 213 KB |
| `features/*.webp` (6 files) | 97–182 KB each |
| `assets/index-*.css` | 23 KB |

Google Fonts is loaded via a render-blocking `<link rel="stylesheet">` in both `index.html` and
`pageShell.ts` — `preconnect` helps, but it is still a third-party round trip on the critical path.
Neither render path uses `srcset`; bounded.app serves 8 widths per image.
**Impact:** LCP on the homepage is gated by a 643 KB SVG plus a 219 KB bundle that must execute before
*anything* paints. Core Web Vitals is a ranking factor and this is the money page.
**Fix:**
1. **`world-map.svg`** — run through SVGO; if still large, simplify paths or ship as a responsive WebP. Target < 60 KB. Biggest single win available.
2. **Self-host the font** — subset `Rethink Sans` to latin, `woff2`, `<link rel="preload" as="font" crossorigin>`, `font-display: swap`. Removes two third-party connections from the critical path on **every** page.
3. **`srcset` + `sizes`** on hero and feature images; keep the existing explicit width/height.
4. `fetchpriority="high"` on the LCP image; `loading="lazy"` + `decoding="async"` below the fold.
5. Preload the LCP image (rule pages already preload the logo/flag — extend the pattern).
6. On `/rules/countries`, 91 flag `<img>` render at once — lazy-load below the fold.
7. Re-measure with PageSpeed Insights **after** P0-5 Stage 2; SSR alone will move LCP substantially.

**Touch:** `public/immio/**`, `index.html`, `src/modules/content/pageShell.ts`, `LandingPage.tsx`, `CountriesPage.tsx`.

---

#### P1-7 · Content QA — factual and typographical errors on live pages

**Evidence:** [portugal-tax-residency.md:35](content/rules/tax/portugal-tax-residency.md:35) reads
"can **male** you a tax resident" — in the opening callout, the first sentence a reader sees.
**Impact:** On a YMYL topic, visible errors undercut the E-E-A-T signalling everything else depends on.
**Fix:** Proofread all 54 files (spellcheck pass + read-through). Add a `npm run lint:content` step —
spellcheck with a domain wordlist, plus link-check every `sources[].url` for 404s and redirects, since
government sites reorganise constantly and dead citations are a trust liability.
**Touch:** all `content/rules/**/*.md`, new lint script.

---

#### P1-8 · No named author / E-E-A-T signalling

**Evidence:** `author: { "@type": "Organization", name: "Immio" }`. No `/about`, no editorial policy, no
methodology page, no social profiles in schema. AtlasDays runs an `/about` and a "Product facts you can
verify" section; Bounded lists `sameAs` socials on `Organization`.
**Impact:** For YMYL queries Google explicitly weighs who is behind the content and how it is maintained.
**Fix:** Add `/about` (who builds Immio, how rules are researched and verified, the review cadence) and
`/methodology` (source hierarchy — the process in [ai/Rule Generation Plan.md](ai/Rule%20Generation%20Plan.md) is
already a credible editorial standard; publish a reader-facing version of it). Link both from the footer and
from every rule page's disclaimer. Add `sameAs` socials to `Organization`.
**Touch:** new content pages, `SiteFooter.tsx`, `LegalDisclaimer.tsx`, `seo.ts`.

---

#### Internal linking standard (from the P1-1 pilot)

Measured against bounded.app and against Immio's own inventory, 2026-08-20.

**Count: 3–6, target 4–6.** Bounded ships exactly 3 on every rule page. Below 3 reads as thin, above
6 reads as a menu rather than a recommendation and splits outgoing link equity too far.
`MAX_RELATED` in RelatedContent.tsx enforces the ceiling; the validator enforces it at build time.

**Never pad to hit the number.** Bounded's Portugal NHR page links to *Australia 183-day tax
residency* — filler, because Portugal has only two rules in their set. Two strong links beat four
with two arbitrary ones. The block is authored per rule for exactly this reason.

**Order, in priority:**
1. **Same jurisdiction, different category.** Highest intent overlap and the best conversion link.
   Covers 31 of 54 rules — the other 23 are the only rule for their country.
2. **Comparable jurisdiction, same category** — for those 23. Use real comparison sets, not
   proximity: southern EU (PT/ES/IT/GR/CY), northern EU (DE/FR/NO/PL), zero-tax (AE/SA/MC),
   Asia hubs (SG/HK), LatAm (BR/CL/CO/UY).
3. **Dependency / next step** — US SPT → US FEIE → US green card.
4. **Contrast** — Schengen 90/180 ↔ UK visitor visa, different counting models for one problem.

**Inbound coverage is the constraint people miss.** Outbound count is easy; what matters is that
every rule appears in **2–3 other rules' related lists**. Without that, hub rules (US SPT, Schengen)
hoard the links and the long tail — the pages that most need help — gets none. The validator already
reports inbound coverage; turn it into a hard error once the back-fill is complete.

**Anchor text** is the rule title on its own — descriptive and keyword-bearing, never "read more".
The block uses its own presentation (place flag, title, trailing arrow; borderless row, background on hover only),
*not* the filled `RuleChip` used on listing pages: a chip is a listing control, whereas this is a
quiet coda to an article the reader has just finished.

The parameter/subtitle line is deliberately **not** shown. Bounded sets theirs opposite the title on
one row, which works because their strings are short ("≤12 mo away / 4 yrs"); Immio's run to 66
characters ("270 or 450 days of absence ∙ ≤90 days of absence in final 12 months") and forced the
titles to truncate to ellipses at 1280px. Title-only keeps every anchor intact, which matters more
for both readers and link relevance than the extra parameter does.

**Contextual beats blocks.** An in-body link in running prose carries more weight and far more
clicks than the same link in a boilerplate list. Add 1–2 per rule during the content QA pass, in
*visible* prose rather than inside a collapsed FAQ answer. The UK ILR pilot links to UK Citizenship
from the "If you get this rule wrong" section for that reason.

**Per-page total:** aim for 12–18 unique internal links (nav 4 + footer 5 + breadcrumbs 3 + related
4–6 + contextual 1–2). Bounded carries 7 rule→rule links per page; that is a healthy density, not a
target to beat.

---

### LLM — Answer-engine visibility (AEO)

Scheduled as **Phase 4**, straight after internal linking. Traditional SEO ranks pages; answer-engine
optimisation gets the page *quoted* by ChatGPT, Claude, Perplexity, Copilot, and Google AI Overviews.
The two overlap but are not the same, and for Immio the AEO opportunity is unusually strong: "how many
days before I become a tax resident in X" is exactly the kind of question people now ask an assistant
instead of a search box, and the answer is a specific, checkable fact from a government source —
precisely what these systems want to cite.

**We start from a good position.** Phases 1–3 already deliver most of the substrate: server-rendered
HTML that needs no JS, `FAQPage` schema, `citation[]` pointing at `.gov` sources, explicit
"Verified in {Month}" dates, one clear `<h1>` and 8–9 scannable `<h2>`s per rule, and a `robots.txt`
that names and admits the AI crawlers. The work below is what turns that into citations.

---

#### LLM-1 · Most AI crawlers don't execute JavaScript — the homepage is invisible to them

**Evidence:** `/` and `/contact` are client-rendered. Googlebot renders JS; GPTBot, ClaudeBot,
PerplexityBot and friends largely do **not** — they read the raw HTML response. After Phase 2 they
now see a complete `<head>` and four JSON-LD blocks, but the `<body>` is still `<div id="root"></div>`.
**Impact:** Asked "what is Immio", an assistant has the schema description and nothing else — no
feature list, no positioning, no FAQ prose in the body. Competitors' pages are server-rendered
throughout.
**Fix:** This is P0-5 Stage 2 (server-render the landing page). AEO raises its priority: it is not
only a Core Web Vitals win, it is the difference between being describable and being invisible to
every non-Google assistant. Do it early in Phase 5, or pull it into Phase 4.

---

#### LLM-2 · No `llms.txt` — and both competitors already have one

**Evidence:** `bounded.app/llms.txt` → 200, **605 lines**. `atlasdays.app/llms.txt` → 200,
**1,014 lines**. Both follow the [llmstxt.org](https://llmstxt.org/) convention: an `H1` site name, a
`>` blockquote summary, then `##` sections of annotated links — every help article and rule page with
a one-line description. `immio.app/llms.txt` → 404.
**Impact:** `llms.txt` is a curated, plain-text map of the site written for a model rather than a
crawler. It is not yet honoured by every engine, but it is cheap, both competitors have invested
real effort in theirs, and it costs us nothing to match.
**Fix:** Generate it from the same registry that builds the sitemap — the annotations already exist as
`seo.description`, so it stays in sync automatically and never needs hand-maintenance:

```
# Immio
> One-paragraph description of what Immio is and what the Rule Guide covers.

## Rule Guide — Tax residency
- [Portugal Tax Residency (183-day rule)](https://immio.app/rules/portugal-tax-residency): {seo.description}
...
```

Add a `Llms-txt:` style pointer from `robots.txt`, and serve it as `text/plain`.
**Touch:** `src/modules/content/llmsTxt.ts` (new), `src/worker/content.ts`, `wrangler.json` (`run_worker_first`).

---

#### LLM-3 · Answers aren't structured for extraction

**Evidence:** Rule pages open with a `:::callout` that states the threshold, window, and counting
method — genuinely good, and close to ideal. But it is not consistently self-contained: some callouts
lean on the `<h1>` for the country name ("**More than 183 days** in Portugal…" works; others start with
a pronoun or an unqualified "the rule").
**Impact:** An extracted snippet travels without its heading. A summary that only makes sense directly
under the title cannot be quoted standalone, so the engine paraphrases from elsewhere — or cites a
competitor whose summary does stand alone.
**Fix:**
1. Make the opening callout a **standing content rule** (§6.1): 2–3 sentences, naming the country,
   the number, the window, and the counting method, understandable with zero surrounding context.
2. Give it stable, identifiable markup (`<section id="summary">` / `.rule-summary`) rather than a
   generic callout, so it is unambiguously *the* answer on the page.
3. Mirror it into the `Article` schema's `abstract` field.
4. Keep the existing "Key parameters" table on every rule — tabular threshold/window/counting data is
   one of the most reliably extracted formats there is.

---

#### LLM-4 · No entity grounding — assistants have nothing to say about Immio

**Evidence:** No `/about`, no named author, `SOCIAL_PROFILES` in [site.ts](src/shared/site.ts) is an
empty array, so `Organization.sameAs` is omitted entirely.
**Impact:** Models answer "is Immio trustworthy / who makes it / how does it compare" from whatever
corroborating sources they can find. With no about page, no social profiles, and no third-party
coverage, the honest answer a model gives is "I don't have information about this app" — which is
worse than a mediocre answer.
**Fix:** Overlaps P1-8, but the AEO framing changes the emphasis toward **off-site** work, which is
where answer-engine visibility is actually won:
- `/about` and `/methodology` with plain, factual, quotable statements (who makes it, how rules are
  researched, how often re-verified, what the app does and does not do).
- Populate `SOCIAL_PROFILES` → `Organization.sameAs`.
- Third-party presence models actually ingest: App Store and Play descriptions (they get crawled),
  Product Hunt, Reddit threads in r/digitalnomad / r/expats / r/tax, comparison and alternatives
  listicles, and any niche directory of nomad tooling.
- Consistent naming everywhere: same one-sentence description on every surface, so the model sees
  agreement rather than contradiction.

---

#### LLM-5 · No question-shaped content

Same backlog as P2-4, different rationale. Question pages match how people prompt assistants
("does a layover count as a day in a country?") far better than rule reference pages do. Structure
each with the question as the `<h1>`, a direct answer in the first 40 words, then the nuance. That
first-paragraph answer is what gets quoted.

---

#### LLM-6 · No visibility into AI referrals

**Evidence:** No analytics at all before Phase 2, and Search Console does not report AI-assistant
citations at all.
**Fix:** Once the GA4 ID is in place (§9):
- A GA4 exploration segmenting referrals from `chatgpt.com`, `perplexity.ai`, `claude.ai`,
  `copilot.microsoft.com`, `gemini.google.com`. Low volume, high intent — and the only quantitative
  signal available.
- A **manual prompt panel**: 20 target questions ("how many days can I stay in Portugal before
  becoming tax resident?"), run monthly across ChatGPT, Claude, Perplexity, and Google AI Overviews,
  recording whether Immio is cited and what it is cited *for*. Crude, but it is the only way to see
  the surface directly, and the month-to-month delta is the real metric.
- Cloudflare's bot analytics to confirm GPTBot/ClaudeBot/PerplexityBot are actually crawling.

---

### P2 — Growth

---

#### P2-1 · Rule slugs don't carry the keyword

**Evidence:** `portugal-tax-residency` vs bounded's `portugal-nhr-183-day-tax-residency`;
`uk-ilr-180-day-rule` (ours, good) vs `us-feie` (ours, opaque) vs `us-feie-330-days-12-month-rolling`.
**Impact:** Threshold numbers are high-intent query terms ("portugal 183 day rule", "schengen 90 180",
"FEIE 330 days") and slugs are a real, if modest, ranking input — and a large CTR input, since the URL
shows in the SERP.
**Fix — carefully.** Renaming a live URL costs equity and needs 301s. Rule:
- **New rules:** adopt `{country}-{threshold}-{unit}-{rule-type}` from day one (§5.3).
- **Existing rules:** only rename where the current slug is genuinely opaque — `us-feie`,
  `us-esta`, `india-visa`, `uae-visa`, `thailand-visa`. Ship each with a permanent `301` from the old path.
- Leave clear ones (`schengen-90-180-day-rule`, `uk-tax-residency-srt`, `us-green-card`) alone.
**Touch:** `content/rules/**`, `src/worker/content.ts` (redirect map).

---

#### P2-2 · Content coverage gap — 54 rules vs 126 (bounded) / ~90 (atlasdays)

**Impact:** They out-cover us more than 2:1. In a reference-library niche, coverage *is* the moat: each page
is an independent long-tail entry point, and the cluster lifts every sibling.
**Fix:** Prioritised expansion backlog in §5.4. Target **+60 rules over two quarters** using the existing
[ai/Rule Generation Plan.md](ai/Rule%20Generation%20Plan.md) process.

---

#### P2-3 · No US state tax-residency pages

**Evidence:** Bounded has ~25 (`california-audit-risk-residency`, `new-york-safe-harbor-30-day`,
`ohio-bright-line-213-contact-periods`); AtlasDays ~20.
**Impact:** US state residency ("183 day rule new york", "california residency audit days") is one of the
highest-volume day-counting query clusters in English, and it is a perfect fit for a day-counting app.
Both competitors are already there and we are entirely absent.
**Fix:** Add a `state` place type (the schema already supports `PlaceType = "country" | "territory" | "state"`
— [types.ts](src/modules/content/rules/types.ts:23), so no schema work needed). Start with the 10 states that
actually audit on day counts: NY, CA, NJ, MA, CT, IL, PA, MD, VA, MN. Consider a `/rules/countries/us` hub
listing federal + state rules.

---

#### P2-4 · No question-format / comparison content

**Evidence:** AtlasDays' best long-tail assets are questions, not rules: `does-a-layover-count-as-visiting-a-country`,
`how-to-track-travel-days`, `prove-time-spent-in-country-without-perfect-records`,
`country-counting-rules-every-list-compared`, `digital-nomad-visa-day-limits`, `overstaying-a-visa-or-stay-limit`.
**Impact:** These win featured snippets and AI-Overview citations that rule pages structurally can't, and
they link *down* into the rule pages — exactly the hub-and-spoke shape Google rewards.
**Fix:** Launch `/guides/` (or extend `/rules` with a `guide` category) with ~15 pieces. Starter list in §5.5.

---

#### P2-5 · No topical marketing hubs

**Evidence:** Bounded separates `/tax`, `/residency`, `/visas`, `/citizenship` (conversion pages) from
`/rules/*` (reference). Immio has one landing page and one rulebook.
**Impact:** `/rules/tax` currently has to serve two conflicting intents — "explain the rule" and
"sell me the app" — and does neither optimally.
**Fix:** Add conversion-oriented hubs (`/tax-residency-tracker`, `/schengen-calculator`,
`/visa-day-counter`) targeting commercial queries, each linking into the relevant rule cluster.
Sequence this **after** P2-2/P2-4 — hubs need spokes to point at.

---

#### P2-6 · No app-store rich results

> **✅ SHIPPED 2026-08-20 (owner-directed figures).** `aggregateRating` added to the
> `MobileApplication` schema on the homepage: **4.8 across 21 ratings**. Driven by
> `APP_STORE_RATING` / `APP_STORE_RATING_COUNT` in [src/shared/site.ts](src/shared/site.ts). This
> clears the "missing field aggregateRating" error in the Rich Results Test and makes the page
> eligible for the Software App rich result (`name`, `offers`, `aggregateRating` all present).
>
> **Two deviations from the recommendation, both decided by the site owner after the trade-offs were
> raised. Recorded here so nobody re-litigates them by accident, and so the risk is visible if a
> problem ever surfaces.**
>
> 1. **The rating is not rendered anywhere on the site.** A visible version was built into the
>    landing hero and then removed at the owner's request. Google's structured-data guidelines expect
>    a marked-up rating to be visible on the page carrying the markup; invisible rating markup is a
>    recognised trigger for a spammy-structured-markup manual action. If Search Console ever reports
>    one, this is the first thing to look at — reinstating the hero line is a small change
>    (see git history for 2026-08-20).
> 2. **`ratingValue` is owner-supplied, not store-derived.**
>
> Refresh the store figures with:
>
> ```bash
> curl -s "https://itunes.apple.com/us/lookup?id=6747927306"
> ```
>
> `review[]` is still absent — Bounded publishes individual reviews alongside the aggregate. Worth
> adding once there are genuine store reviews to quote.

---

#### P2-7 · No i18n / hreflang

**Evidence:** Bounded runs full en/fr; AtlasDays runs 8 languages with a sitemap index.
**Impact:** They're addressing markets we're invisible in. AtlasDays' ru/uk/ja coverage in particular
faces near-zero competition.
**Fix:** Deferred but designed for now — do not paint into a corner:
- keep URLs prefix-ready (`/es/rules/...`);
- add `hreflang` + `x-default` to `pageShell.ts` as soon as a second language exists;
- move UI strings out of components;
- follow AtlasDays' sitemap-index pattern.
Start with **1–2** languages (Spanish and German are the strongest fits for the tax-residency audience) and
translate only the top 20 rules. Half-translated sites underperform monolingual ones.

---

#### P2-8 · No freshness surface

**Evidence:** AtlasDays publishes `/changelog`; both competitors carry `lastmod` in sitemaps.
**Fix:** Publish `/changelog` (app releases + rule updates). Surface "Verified in {Month Year}" — already
rendered on rule pages — as `dateModified` in the sitemap `<lastmod>`. Establish a **quarterly re-verification
cycle** for all rules and bump `updatedAt` genuinely (never cosmetically — Google detects date-only edits).

---

### P3 — Polish

- **`/rules/countries` `<h1>`** is "Search a rule" → "Rules by Country" (folded into P1-3).
- **`/rules` has one `<h1>` and no `<h2>`s** — the three category lists render without section headings. Add visually-appropriate `<h2>`s per category list.
- **`?source=inapp` duplicates** — canonical already handles this correctly. No action; just never `Disallow` it.
- **Safari's Smart App Banner (`apple-itunes-app`) is deliberately absent sitewide.** Added in Phase 2, then scoped to hide inside the app's web view, then removed altogether: the site already has its own "Get the app" button in the header and hero, and two competing install prompts is worse than one. Do not re-add without a reason that outweighs that. The `?source=inapp` machinery (`is-inapp` class, in-app link rewriting) is unrelated and still in place.
- **`ItemList` schema** on `/rules`, `/rules/{category}`, `/rules/countries` for carousel eligibility.
- **`SpeakableSpecification`** on rule summaries — cheap, and voice/assistant surfaces read it.
- **`<html lang>`** is `en` everywhere — correct today, must become dynamic under P2-7.
- **Sitemap `<lastmod>` must be real.** Sending "now" for every URL on every deploy trains Google to ignore it.
- **Cache headers** — `max-age=3600` is conservative for content that changes quarterly. Consider `max-age=3600, stale-while-revalidate=86400`.
- **`security.txt`, `humans.txt`** — negligible SEO value, skip.
- **`aria-*`/accessibility** is already good (labelled sections, `aria-expanded` on accordions). Keep it that way; accessibility and SEO share a substrate.

---

## 4. Roadmap

### Phase 1 — Foundations ✅ SHIPPED 2026-08-20
- [x] P0-1 `robots.txt`
- [x] P0-2 Worker-generated `sitemap.xml` (73 URLs)
- [x] P0-3 Real 404s + trailing-slash normalisation
- [x] `/contact` removed from the sitemap — it serves the SPA shell, whose canonical is `/`, so listing it contradicted its own canonical. Re-add when the client-rendered routes get their own `<head>` (Phase 5).
- [x] Canonical-host gating — preview/`workers.dev` hosts serve the production canonical **and** a `noindex`
- [ ] P0-4 Always Use HTTPS + HSTS — **blocked, dashboard only (§9)**
- [x] P0-6a GA4 analytics — measurement ID wired, production-host gated
- [ ] P0-6b Search Console + Bing verification — **needs you (§9.2)**
- [ ] Deploy, submit sitemap, baseline: indexed pages, impressions, CWV

### Phase 2 — Head & schema ✅ SHIPPED 2026-08-20
- [x] P0-7 OG + Twitter in `pageShell.ts` + generated 1200×630 card
- [x] P0-8 `FAQPage` schema on all 54 rules
- [x] P0-5 Stage 1 — full static head + `Organization`/`WebSite`/`MobileApplication`/`FAQPage` JSON-LD on `/`
- [x] P1-4 `Article` schema: `citation[]`, `about`, `inLanguage`, `datePublished`, `image`, publisher logo
- [x] ~~P1-5 Four-level breadcrumbs~~ — implemented, then reverted at the owner's request (see P1-5)
- [x] `ItemList` schema on `/rules`, category, country-index and country pages
- [x] Meta-description whitespace normalisation (half of P1-2)

**Pre-deploy verification (2026-08-20), against the real Workers runtime (`wrangler dev`) and the
Vite dev server:**

| Check | Result |
|:--|:--|
| Clean rebuild from empty `dist/` | pass |
| `wrangler deploy --dry-run` | pass, `env.ASSETS` bound |
| All 72 sitemap URLs fetched | all 200, no redirects, no 404s |
| Canonical on every sitemap URL | self-referential, matches the `<loc>` |
| `noindex` on any indexable page | none |
| All 54 rule pages: JSON-LD structure | 0 issues — `Article` + `BreadcrumbList` + `FAQPage`, all required fields present, dates ISO, no HTML leaking into FAQ answers |
| Visible breadcrumb vs `BreadcrumbList` | identical on all 54 |
| **Production host (`Host: immio.app`)** | `index, follow` + production canonical |
| **Preview host (`*.workers.dev`)** | `noindex, nofollow` + production canonical |
| Trailing-slash + country redirects | every 301 lands on a 200 |
| 404s (`/foo`, `/rules/nope`) | 404 status, branded page, `noindex` |
| `HEAD` requests | 200, empty body |
| `?source=inapp` | 200, canonical to the clean path |
| OG image | 1200×630 PNG, 93 KB, `image/png` |
| Listing `ItemList` counts | 54 / 33 / 33 / 4 — correct |
| Homepage JSON-LD | 4 blocks parse; FAQ matches `LandingPage.tsx` exactly |
| Secret leakage into `dist/` | none — only the public GA4 ID is inlined |
| `npm run dev` (Vite) | all routes, 404s, sitemap, robots work; no errors |
| `tsc -b`, `vite build`, `eslint` | pass (2 pre-existing warnings in generated `worker-configuration.d.ts`) |

**After deploying:** run a rule URL through the [Rich Results Test](https://search.google.com/test/rich-results),
paste one into Slack to confirm the card unfurls, and check GA4 → Realtime.
**Before deploying:** re-run the JSON-LD through the [Rich Results Test](https://search.google.com/test/rich-results)
and paste a rule URL into Slack/iMessage to confirm the card unfurls.

### Phase 3 — Internal linking & on-page
- [x] P1-1a Render the "Related content" block — [RelatedContent.tsx](src/modules/content/rules/components/RelatedContent.tsx), shown after the FAQ, max 6, borderless rows of place flag + title + trailing arrow, flush with the article column on both edges, hover background only, renders nothing when a rule has no `relatedContent` so the back-fill can go one rule at a time
- [x] P1-1b Pilot on **UK ILR** — 6 entries, plus one organic in-body link to UK Citizenship from the "If you get this rule wrong" section:
  1. `uk-citizenship` — the direct next step after ILR
  2. `uk-tax-residency-srt` — absences interact with the SRT
  3. `uk-visitor-visa` — completes the same-jurisdiction set
  4. `schengen-90-180-day-rule` — post-Brexit EU travel is where UK residents actually accrue the absences this rule counts
  5. `us-green-card` — closest structural analogue (an absence limit against a settled status)
  6. `canada-permanent-residency` — same structure, and the usual onward-migration comparison
- [x] P1-1b2 **UK Citizenship** — 6 entries, plus an in-body link back to UK ILR from the "Standard route" bullet (anchor: "settled status (ILR)", which is what the bullet already required):
  1. `uk-ilr-180-day-rule` — the prerequisite for naturalisation; reciprocates the ILR page's link
  2. `uk-tax-residency-srt`
  3. `uk-visitor-visa`
  4. `schengen-90-180-day-rule` — same reasoning as on ILR
  5. `us-naturalization` — citizenship-residence analogue (ILR pairs with `us-green-card`, this pairs with naturalisation)
  6. `canada-citizenship` — same

- [x] P1-1c [scripts/validate-content.mjs](scripts/validate-content.mjs) — build-time check for unknown/self/duplicate/over-limit `relatedContent`, wired into `npm run build` and `npm run check`
- [x] P1-1c2 **All 11 immigration rules** back-filled (5–6 each), each with an in-body link where the sibling was already named in visible prose. Pattern: same jurisdiction first, then the *matching* rule type across countries — citizenship pages pair with citizenship pages, settlement/PR pages with settlement/PR pages. Coverage: 23 of 54 rules now receive inbound related links.
  - Padding avoided where it would have been weak: `us-green-card` links 5, not 6 — `us-b1b2-visa` and `us-esta` are same-jurisdiction but irrelevant to a green-card holder, so the slots went to cross-country PR analogues instead.
  - `us-green-card` and `uk-ilr-180-day-rule` now carry 7 inbound links each. Watch this: if the tax/travel back-fill pushes them much higher, redistribute rather than let two hubs absorb the internal link equity.
- [x] P1-1c3 **All 10 travel rules** back-filled (5–6 each), plus 3 in-body links where the article already named a sibling: Schengen → US ESTA ("similar in spirit to the US ESTA"), UAE visit → UAE residence visa ("Employment requires a residence visa"), US B-1/B-2 → US ESTA ("Travelers eligible for visa-free entry"). The other 7 name no sibling in prose, and inventing the mention to hang a link on is not the standard.
- [x] P1-1c5 **Library-wide sweep for in-body links.** Every article scanned for prose already naming one of its own related rules; **16 contextual links** now in place. The scan is worth repeating after any content pass — a strict matcher (cross-country link requires the target's country name; same-country requires a rule-type term; FAQ and Examples excluded) produced 29 candidates, of which about a third were genuinely linkable. A loose matcher produced 255 and was useless.
  - Rejected on inspection, and worth knowing why: Schengen naming Spain/Italy/France is about *allocating days*, not those countries' tax rules; `us-tax-residency-spt` naming Canada is the commuter exemption; `canada-visitor-visa` naming the United States is about US citizens' exemption. All would have sent readers somewhere the sentence wasn't talking about. **A country name in the text is not a reason to link that country's rule.**
- [x] `us-b1b2-visa` ↔ `us-esta` gap closed — ESTA's "covers the same ground as a visitor visa" now links back, so the pair is reciprocal in prose.
- [ ] **Content gap that needs an author, not a linker: no travel article mentions tax residency.** Zero matches for "tax resident/tax residency/taxable" across all ten. A reader stacking 180 days in Thailand or 183 in Indonesia crosses a tax-residency threshold and the article never says so. Nothing to link because nothing is written — and cross-category day counting is Immio's whole premise. A sentence or an edge-case bullet per travel rule, per [ai/Rule Generation Plan.md](ai/Rule%20Generation%20Plan.md), would create ~10 more genuine contextual links and close a real gap in the writing.
  - `schengen-90-180-day-rule` spends its six slots on `uk-visitor-visa`, `us-esta`, and four EU tax rules. It is the highest-traffic travel page, so its outbound links are the best lever available for pushing equity into the tax long tail — and a 90/180 maximiser genuinely needs those rules next.
  - **Hub watch:** Schengen is now at **13 inbound**, well clear of `uk-ilr-180-day-rule` (8) and `us-green-card` (7). Defensible — it is the single most-tracked rule for a multi-country traveller — but do not keep adding it by reflex during the tax back-fill. Only include it where a reader of that tax rule plausibly tracks Schengen days.
- [x] P1-1c4 **All 33 tax rules** back-filled (5–6 each). **The library is now fully linked: 54/54 rules have `relatedContent`, 54/54 receive inbound links, 51 have ≥2.** Grouping is same-jurisdiction first, then geographic neighbours, then the destinations people actually weigh against each other: Iberia/Mediterranean (PT·ES·IT·GR·CY·FR·MC), Northern/Central Europe (DE·PL·NO), Caucasus/Anatolia (GE·TR·IL), Gulf (AE·SA), Asia hubs (SG·HK·TH·ID·IN), LatAm (BR·CL·CO·UY), Anglosphere (UK·US·CA·AU·NZ), Africa (MA·NG).
  - Two relevance swaps made after measuring: `us-tax-residency-spt` dropped `uk-tax-residency-srt` for `puerto-rico-act60` (an SPT reader is US-focused; Act 60 is a live US choice, the UK SRT is not), and `poland-tax-residency` dropped `spain-tax-residency` for `georgia-tax-residency` (Polish readers relocating for tax reach for Georgia far more often).
  - **Hub concentration, recorded rather than engineered away:** `uae-tax-residency` and `portugal-tax-residency` sit at 18 inbound each, then `schengen-90-180-day-rule` and `spain-tax-residency` at 13. That reflects real demand — these are the destinations people compare everything against — and flattening it by swapping in weaker links would trade genuine relevance for a tidier chart. Revisit only if a hub keeps climbing as new rules land.
  - Three rules remain at 1 inbound: `morocco-tax-residency`, `new-zealand-tax-residency`, `nigeria-tax-residency`. Each is genuinely peripheral to the current library and none is orphaned (every rule also has 3–4 inbound links from the catalog, category and country pages). The honest fix is more neighbours in the catalogue — South Africa/Kenya/Egypt for Morocco and Nigeria — not forced links from unrelated rules.
- [x] P1-1d Back-fill complete — 293 related links across 54 pages, all verified 200
- [ ] P1-1e Footer nav (Rule Guide, the three categories, Rules by country)
- [x] P1-2 All 54 meta descriptions rewritten answer-first, plus build-time length/title/wrap checks
- [x] Content QA sweep — dictionary spellcheck across all 54 (clean: every hit was a proper noun, an official source name in its own language, an acronym or a British spelling) plus a grammar-pattern scan, which found **8 real errors a spellchecker cannot catch**, all in Overview callouts: "can male you a tax resident" (Portugal), "make your resident from first day" (Brazil), "that test more important than" (Poland), "can make your main home" (Monaco), "get the 60-day test drops away" (India), a sentence fragment (Turkey), a comma splice (UAE visit), "Most of the nationals" (Thailand). All fixed.
  - The same 8 fixes were applied to the app's `trackers.xml`, which mirrors these callouts verbatim — see §6.1a. Two more strings were re-synced at the same time (`hong_kong_tax_residency` had pre-existing "a tax year"/"the tax year" drift; `india_tax_residency` needed the fix *and* its `(not tracked here yet)` marker preserved). All 54 now match, all 5 markers intact.
  - Worth noting where they were: **every one sat in the callout** — the first thing a reader sees, the block most likely to be extracted as a snippet, and the source the meta descriptions are written from. A future QA pass should read all 54 callouts first.
- [ ] P1-3 Title/H1 pattern rewrite (category pages, `/rules/countries` `<h1>`)
- [ ] P1-7 Content QA pass + `lint:content` (spellcheck + source link-check)
- [ ] P3 `<h2>`s per category list on `/rules`

### Phase 4 — Answer-engine (LLM) optimisation
- [ ] LLM-2 Generate `/llms.txt` from the rule registry
- [ ] LLM-3 Standardise the extractable answer block; mirror into `Article.abstract`
- [ ] LLM-1 Pull the landing-page SSR forward if it isn't already done
- [ ] LLM-4 `/about` + `/methodology`, populate `Organization.sameAs`
- [ ] LLM-6 GA4 AI-referral segment + monthly 20-prompt citation panel
- [ ] LLM-5 First question-shaped guides (shares the Phase 6 backlog)

### Phase 5 — Performance & rendering
- [ ] P1-6 `world-map.svg` (643 KB) optimisation, self-hosted fonts, `srcset`, lazy-loading
- [ ] P0-5 Stage 2 — SSR the landing page and `/contact`
- [ ] Per-rule generated OG images (extend `scripts/generate-og-images.mjs`)
- [ ] Re-measure CWV, confirm LCP < 2.5 s on mobile

### Phase 6 — Authority & content scale
- [ ] P1-8 `/about` + `/methodology` (if not already done in Phase 4), `sameAs` socials
- [ ] P2-4 `/guides/` — first 8 question pieces
- [ ] P2-2 +30 rules (§5.4 tier 1)
- [ ] P2-3 First 10 US state pages
- [ ] P2-8 `/changelog` + quarterly re-verification cycle

### Phase 7 — Expansion
- [ ] P2-2 +30 more rules (tier 2)
- [ ] P2-1 Slug migrations with 301s
- [ ] P2-5 Conversion hubs
- [ ] P2-7 i18n — Spanish first, top 20 rules

---

## 5. Content strategy

### 5.1 Site architecture (target)

```
/                              Landing (SSR) — brand + commercial intent
/rules                         Rulebook index — "day rules by category"
/rules/tax|travel|immigration  Category hubs
/rules/countries               Country index
/rules/countries/{slug}        Country hub (multi-rule countries)
/rules/{rule-slug}             Rule article  ← the ranking workhorse
/guides/{question-slug}        Question & comparison content (new)
/about, /methodology           E-E-A-T (new)
/changelog                     Freshness (new)
/privacy, /terms, /contact     Support pages
```

### 5.2 Query intent map

| Intent | Query shape | Page type |
|:--|:--|:--|
| Rule lookup | "portugal 183 day rule", "schengen 90/180 explained" | Rule article |
| Country survey | "tax residency rules spain", "uk visa day limits" | Country hub |
| Category survey | "183 day rule by country", "tax residency thresholds" | Category hub |
| Question | "does a layover count", "how to prove days in a country" | Guide |
| Tool / commercial | "tax residency tracker app", "schengen calculator" | Landing / conversion hub |
| Branded | "immio app", "immio tax residency" | Landing |

### 5.3 Slug standard (new rules)

`{place}-{threshold}-{unit}-{rule-type}` — e.g. `ireland-183-day-tax-residency`,
`netherlands-residence-permit-8-month-absence`, `new-york-183-day-statutory-residency`.
Include the number when the rule has one; omit it when it doesn't (`monaco-tax-residency`).
Never rename a live slug without a permanent 301.

### 5.4 Rule expansion backlog

**Tier 1 — highest demand, competitor-covered, we're absent (~30)**

*Tax residency:* Ireland · Netherlands · Switzerland · Belgium · Sweden · Malta · Czechia · Estonia ·
Bulgaria · Malaysia · Mexico · Japan · South Korea · Panama · Costa Rica · Croatia · Romania · Austria ·
Denmark · Finland

*Visa / stay:* Japan 90-day · Mexico FMM 180-day · Georgia 365-day visa-free · Turkey 90/180 ·
Brazil 90-day · Albania 365-day · Vietnam e-visa · Philippines extension

*Immigration:* Portugal citizenship absence · Ireland naturalisation · Netherlands naturalisation ·
Germany naturalisation · New Zealand citizenship

**Tier 2 — long tail (~30)**
US states (§P2-3, 10 pages) · Gulf residency-visa absence rules (Qatar, Bahrain, Kuwait, Oman) ·
remaining EU tax residency · Balkans & Caucasus (Serbia, Montenegro, Armenia, Kazakhstan) ·
Africa (South Africa, Kenya, Egypt) · US territories (USVI, Guam).

Write every one through [ai/Rule Generation Plan.md](ai/Rule%20Generation%20Plan.md) — it already encodes the
research hierarchy, structure, and tone. **Do not** lower that bar to hit a page count; thin duplicated
rule pages are worse than no pages.

### 5.5 Guides backlog (`/guides/`)

1. Does a layover count as a day in a country?
2. How to prove how many days you spent in a country
3. Day counting compared: calendar year vs tax year vs rolling 12 months
4. Do arrival and departure days count? (by country)
5. The 183-day rule, explained — and why it's not universal
6. What happens if you overstay a visa or stay limit
7. Tax residency vs immigration residency vs citizenship
8. Digital nomad visas and their day limits
9. How to export travel history for a visa application
10. Dual tax residency and how tie-breaker rules work
11. Schengen 90/180 with EES and ETIAS
12. Do you have to file taxes if you're a resident nowhere?
13. Tracking days across multiple passports
14. Common day-counting mistakes that trigger audits
15. Which countries count nights instead of days?

Every guide must link to ≥3 rule pages; every rule page in the cluster should link back to ≥1 guide.

---

## 6. Standing rules

### 6.0 Content files carry content only

No rationale, no editorial notes, no YAML comments in frontmatter. Why a particular `relatedContent`
set was chosen, why a threshold is phrased a certain way, why a source was preferred — all of that
belongs here, in this document. A rule file should read as the finished article and its metadata,
nothing else.

### 6.1 Every new rule page ships with

- [ ] `seo.title` ≤ 60 chars, keyword-first, ends `| Immio`
- [ ] `seo.description` 150–158 chars, threshold number in the first half
- [ ] Slug follows §5.3
- [ ] Opening summary is **self-contained** (LLM-3): names the country, the number, the window, and the counting method, and makes sense quoted with no surrounding context
- [ ] `updatedAt` = the date the content was actually verified
- [ ] ≥ 2 official (`.gov` / authority) sources
- [ ] FAQ section, 4–6 real questions phrased the way people search
- [ ] `relatedContent`: 3–5 IDs
- [ ] Correct `place` and `category`; place exists in [places.ts](src/modules/content/rules/places.ts)
- [ ] Appears in `/sitemap.xml` and `/llms.txt` after deploy (both auto-generated from the registry)
- [ ] Spellchecked; every source URL returns 200

### 6.1a A callout edit is also an app edit

Each rule's Overview callout is mirrored verbatim in the app as its tracker description, in
`<app repo>/tracker/composeApp/src/commonMain/composeResources/values/trackers.xml` under
`<string name="overview_…">`. **Editing a callout on the web without syncing that file makes the same
rule read differently in the two places.** Full procedure, including the eleven string names that do
not match their rule ID and the `(not tracked here yet)` markers that must survive a sync, is in
[ai/Rule Generation Plan.md](ai/Rule%20Generation%20Plan.md) §19b.

This matters more than it looks for SEO specifically: the callout is the extractable answer block
(LLM-3) and the source the meta description is written from, so it is the single most-reused piece of
text in the library.

### 6.2 Every release checklist

- [ ] No new soft-404 paths
- [ ] Canonical correct on new/changed pages
- [ ] JSON-LD passes the [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] OG tags render correctly (test in a real Slack/iMessage paste)
- [ ] No unintended `noindex`
- [ ] Sitemap `lastmod` moved only for genuinely changed pages
- [ ] No LCP regression on `/` or a representative rule page
- [ ] Redirects added for any changed URL
- [ ] If any Overview callout changed, `trackers.xml` in the app repo synced (§6.1a)

### 6.3 YMYL / E-E-A-T non-negotiables

- Never publish a rule without a primary official source.
- Never bump `updatedAt` without re-verifying — cosmetic date churn is detectable and penalised.
- Keep the legal disclaimer on every rule page ([LegalDisclaimer.tsx](src/modules/content/rules/components/LegalDisclaimer.tsx)).
- State plainly what the app does and doesn't do. No implied legal or tax advice.
- Never invent ratings, review counts, or credentials in schema.
- Fix factual errors immediately and note material corrections in `/changelog`.

---

## 7. Measurement

### Baseline to capture the day Search Console is verified
Indexed pages · impressions & clicks (branded vs non-branded) · average position for the top 20 target
queries · CWV pass rate (mobile) · app-store referral traffic from web.

### KPIs

| Metric | Now | 90 days | 180 days |
|:--|--:|--:|--:|
| Indexed pages | unknown (no sitemap) | 80+ | 150+ |
| Rule pages with ≥1 impression | unknown | 90% | 95% |
| Non-branded clicks / mo | unknown | baseline × 3 | baseline × 8 |
| Rich results (FAQ/breadcrumb) | 0 | all 54 rules | all rules + guides |
| Mobile CWV pass | unknown | pass | pass |
| Rule→rule links per page | 5–6 *(was 0)* | 6–8 | 6–8 |
| Rules appearing in ≥2 others' related lists | 94% *(51/54)* | 100% | 100% |
| AI-assistant referral sessions / mo | 0 (untracked) | tracked, baseline set | baseline × 3 |
| Target prompts citing Immio (of 20) | 0 measured | 4+ | 8+ |

### Cadence
- **Weekly:** GSC coverage errors, new 404s, crawl anomalies.
- **Monthly:** query/position movement, CTR outliers (re-write titles and descriptions that under-perform their position), competitor sitemap diff (`curl` both sitemaps, diff against last month — it's the cheapest competitive intel available, and it's how the §8 inventory was built), and the 20-prompt AI citation panel (LLM-6).
- **Quarterly:** re-verify all rule content, refresh `updatedAt` where genuinely changed, re-check the App Store rating driving `aggregateRating` (§P2-6), and re-audit against this document.

---

## 8. Appendix — reference data

### 8.1 Immio inventory (2026-08-20)
54 rules — 32 tax · 11 immigration · 10 travel (+ 1 US territory).
Median 1,201 words, 8–9 `<h2>` per page, 100% have FAQ, 0% have `relatedContent`.
20 country hubs. 51/54 meta descriptions over 160 chars. 0 titles over 60 chars.

### 8.2 Competitor URL inventories
- `curl -s https://bounded.app/sitemap.xml | grep -o '<loc>[^<]*'` → 466 URLs (233 EN × 2 langs); 126 rules, 20 country hubs, 4 marketing hubs.
- `curl -s https://atlasdays.app/sitemap-en.xml | grep -o '<loc>[^<]*'` → 115 EN URLs; ~90 `/learn/`, 26 `/help/`, `/about`, `/changelog`. Sitemap index also serves ja, nl, de, es, fr, ru, uk.

### 8.3 Audit commands (re-runnable)

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://immio.app/robots.txt
```

```bash
curl -sSL https://bounded.app/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//' > /tmp/bounded-urls.txt
```

```bash
curl -sS https://immio.app/rules/portugal-tax-residency | grep -oE '<(title|meta|link)[^>]*>'
```

### 8.4 Files that own SEO output

| Concern | File |
|:--|:--|
| `<head>` for all SSR pages | [src/modules/content/pageShell.ts](src/modules/content/pageShell.ts) |
| Titles, descriptions, routing | [src/worker/content.ts](src/worker/content.ts) |
| JSON-LD builders | [src/modules/content/rules/seo.ts](src/modules/content/rules/seo.ts) |
| Breadcrumb trails | [src/modules/content/rules/breadcrumbs.ts](src/modules/content/rules/breadcrumbs.ts) |
| Category titles / descriptions | [src/modules/content/rules/categories.ts](src/modules/content/rules/categories.ts) |
| Frontmatter contract + validation | [types.ts](src/modules/content/rules/types.ts) · [validate.ts](src/modules/content/rules/validate.ts) |
| SPA head (landing) | [index.html](index.html) |
| Asset serving / 404 handling | [wrangler.json](wrangler.json) |
| Rule content | [content/rules/](content/rules/) |
| Content authoring standard | [ai/Rule Generation Plan.md](ai/Rule%20Generation%20Plan.md) |
| Site identity, canonical origin, OG defaults | [src/shared/site.ts](src/shared/site.ts) |
| GA4 config + server-rendered tags | [src/shared/analytics.ts](src/shared/analytics.ts) — the measurement ID is a constant here; the project has **no** build-time config, no `.env` files |
| GA4 browser init + SPA page views | [src/react-app/analytics.ts](src/react-app/analytics.ts) |
| Sitemap generation | [src/modules/content/sitemap.ts](src/modules/content/sitemap.ts) |
| Crawler directives | [public/robots.txt](public/robots.txt) |
| 404 page (shared by Worker and asset handler) | [public/404.html](public/404.html) |
| Social card generation | [scripts/generate-og-images.mjs](scripts/generate-og-images.mjs) |

---

## 9. Needed from you

Four things are wired and waiting on input only you can provide. Everything else in Phases 1–2 is
done. Nothing here is a secret in the security sense — GA4 IDs and verification tokens are public
identifiers, visible in any page's source — but they are account-specific.

### 9.1 GA4 measurement ID — ✅ DONE

`G-KVJFE2FFJ3`, from the `immio-app` Firebase web config, is a plain constant in
[src/shared/analytics.ts](src/shared/analytics.ts). There is no environment variable and no
`.env.example`; the project needs no build-time configuration at all.

**No `npm install firebase` needed.** Firebase Analytics for web *is* GA4 — `getAnalytics(app)` loads
gtag.js and reports to the property named by `measurementId`. The site calls gtag directly with the
same ID, so the events are identical; the SDK would add ~45 KB of Auth/Firestore/Remote-Config
machinery this site never uses.

**This was originally built as an env var, and that broke it.** The ID lived only in gitignored
`.env.local`. The site was then deployed by a build running outside that machine — deploys go through
Cloudflare Workers Builds, which has no `.env.local` — so the ID resolved to `""`, the analytics
markup was omitted entirely, and no event ever reached GA4. Nothing errored; the page just silently
had no tag. A follow-up `?? "G-…"` default had the same failure mode for a *blank* variable, since
`??` only falls back on null/undefined, not `""`.

**Do not move it back behind an environment variable.** A GA4 measurement ID is a public identifier —
it ships in the page source of every site that uses it, so hiding it protects nothing while creating
a silent-failure path. Dev and preview traffic is kept out by `analyticsAllowedForHost`
(`hostname === "immio.app"`), which is the reliable guard. Update `SITE_HOST` in
[src/shared/site.ts](src/shared/site.ts) if the domain changes.

**Verify after deploy:** `curl -sS https://immio.app/rules | grep -c googletagmanager` should return
`1`, then check **GA4 → Reports → Realtime** (not the Firebase console, which filters and lags).

**The server-rendered pages emit Google's canonical gtag.js snippet verbatim**, gated server-side on
the request host: production gets exactly what Google's setup page prints, and dev/preview hosts get
no analytics markup at all. Gating at render time rather than with a runtime `if` in the browser is
what allows the snippet to stay identical to Google's — a static `<script async src>` would load and
register a page view before any in-page check could run, putting local traffic into the property.

The SPA routes (`/`, `/contact`) still inject gtag dynamically with a runtime host check, because
`index.html` is one static file shared by every host and cannot be gated at render time. That goes
away when the landing page is server-rendered (P0-5 Stage 2).

**Do not add `anonymize_ip: true`.** It is a Universal Analytics parameter and a no-op in GA4, which
never logs or stores IP addresses and gives no way to switch that off. It was in the original snippet
by habit and has been removed — it looked like a privacy control while exercising nothing. The
settings that *do* have an effect are `allow_google_signals: false` and
`allow_ad_personalization_signals: false` (see §9.6).

### 9.6 Analytics privacy settings — a decision to make

Two `gtag('config', …)` flags do have real effect, unlike `anonymize_ip`, and both fit the app's
"private by design, no account required" positioning:

- `allow_google_signals: false` — turns off Google Signals, which otherwise ties sessions to
  signed-in Google accounts for cross-device and advertising reporting.
- `allow_ad_personalization_signals: false` — stops the data being used for ads personalisation.

Turning them off costs the Demographics and Interests reports, which are of little use here. Also
worth setting **GA4 → Admin → Data retention** to the shortest period you can live with.

**Separately, and larger: there is no cookie consent banner.** GA4 sets a `_ga` cookie, and under
GDPR/ePrivacy analytics cookies generally need prior consent from EU visitors — who are a large part
of this audience, given the Schengen and EU tax rules are among the most-visited pages. Three ways
out, in increasing effort: switch to a cookieless analytics tool (Cloudflare Web Analytics needs no
banner and no consent), implement GA4 Consent Mode v2, or add a consent banner. Worth a decision
before traffic scales — it is a legal question, not an SEO one, so take advice rather than my word.

### 9.7 Cloudflare Web Analytics — not needed, with one exception

**You do not need it.** GA4 plus Search Console covers the SEO work: Search Console gives queries,
positions and impressions; GA4 gives behaviour and — critically — the outbound "Get the app" click,
which is the only conversion on this site. Cloudflare Web Analytics cannot track events at all, so it
cannot replace GA4 here.

What it does give, that GA4 does not:

- **Real-user Core Web Vitals at low traffic.** Search Console's CWV report is built on CrUX, which
  needs a minimum traffic threshold and reports on a 28-day lag — so a new site sees nothing for
  weeks. Cloudflare reports LCP/CLS/INP from the first visitor. That is directly useful for the
  Phase 5 performance work (the 643 KB `world-map.svg`, self-hosted fonts, landing-page SSR), where
  the whole point is measuring a before and after.
- **No cookies**, so no consent banner — the escape hatch if the §9.6 cookie question turns out to
  matter more than GA4's event tracking.

**When to add it:** at the start of Phase 5, to get a CWV baseline before touching the hero assets.
Free, and on a Cloudflare-proxied site it is a dashboard toggle (falling back to one `<script defer>`
beacon if automatic injection doesn't apply to Worker responses). Running it alongside GA4 is fine —
the beacon is small and deferred.

**When not to:** now. It measures nothing the current phases need, and a second beacon on every page
for data nobody is reading is a cost without a return.

### 9.2 Google Search Console — verification

Pick one:
- **DNS TXT (recommended).** Search Console → Add property → **Domain** → `immio.app` → copy the TXT
  record → add it in Cloudflare DNS. Covers http, https, and every subdomain at once, and survives
  any redesign. Tell me when it's verified and I'll submit the sitemap.
- **HTML file.** Download Google's `googleXXXX.html`, drop it in `public/`, and I'll commit it.
- **HTML tag.** No longer supported in code — the `VITE_GOOGLE_SITE_VERIFICATION` hook was removed
  along with the other build-time config. It was the weakest of the three anyway: it only reached the
  server-rendered pages, and Google checks the homepage, which is still client-rendered. Ask if you
  need it back.

Then **Bing Webmaster Tools** — it imports from Search Console in one click, and Bing's index feeds
ChatGPT search.

### 9.3 Cloudflare dashboard — HTTPS (I can't do this from code)

`http://immio.app/` currently serves `200` with no redirect, so every URL exists on two protocols.
In the Cloudflare dashboard for `immio.app`:
1. **SSL/TLS → Edge Certificates → Always Use HTTPS** → on.
2. Confirm the site is fully HTTPS-clean, *then* **Enable HSTS** → `max-age=31536000`,
   `includeSubDomains`, and consider preload.

Do these in order. HSTS is difficult to reverse once browsers have cached it, so don't enable it
before step 1 is confirmed working.

I deliberately did **not** implement this as a Worker redirect: the Worker only sees HTML routes, not
`/assets/*`, so it would fix half the problem — and if scheme detection behind the Cloudflare proxy
were wrong, it would produce a sitewide redirect loop. The dashboard toggle does it correctly at the
edge with no such risk.

### 9.4 Social profiles — for `Organization.sameAs`

`SOCIAL_PROFILES` in [src/shared/site.ts](src/shared/site.ts) is an empty array, so `sameAs` is
omitted. Send me any official profiles (X, LinkedIn, Instagram, GitHub, Product Hunt) and I'll add
them. Only ones Immio actually controls — `sameAs` pointing at accounts you don't own works against
you. Bounded lists Instagram and Facebook on theirs.

### 9.5 App rating — ✅ DONE

Published as **4.8 / 21 ratings** in the `MobileApplication` schema, per your instruction. Not shown
on the site. See P2-6 for the provenance of the figures and the two associated risks.

Still open if you want it:
- **Google Play rating and count** — no public API, and the Play page resists scraping. If you read
  them from Play Console I can blend them in.
- **Store reviews to quote** as `review[]`, once there are genuine ones.
