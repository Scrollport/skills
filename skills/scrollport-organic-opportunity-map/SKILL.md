---
name: scrollport-organic-opportunity-map
description: Build a cited, prioritised organic opportunity map from a target domain, its search competitors and bounded keyword evidence.
license: MIT
metadata:
  scrollport-status: verified
---

# Organic Opportunity Map

Turn public search evidence into a practical organic growth plan. Compare one
target domain with real search competitors, validate a small set of candidate
topics, and distinguish provider facts from agent inference.

Use one authorized Scrollport connection and its `apps`, `discover`, `inspect`, `run`
and `wallet` control tools. Never call a supplier directly.

## Outcome boundary

Produce a prioritised table of organic opportunities with:

- the target and market examined;
- the competitor or target observation behind each candidate;
- current volume, difficulty, intent and useful SERP features when returned;
- a confidence label and the evidence needed to raise it;
- one recommended next action per candidate.

This is an evidence-backed opportunity map, not a ranking forecast or a
complete site audit. A bounded ranked-keyword response is a sample. Absence from
that sample does not prove the target has no ranking, and the Skill must never
describe a sampled absence as a confirmed content gap.

## Inputs and trial-safe defaults

Require:

- one public target domain;
- one country and language;
- the business objective and intended audience;
- excluded products, topics, competitors or brand terms.

Default to one target sample of at most 20 rows, one competitor-discovery call,
at most two selected competitors with at most 40 ranked-keyword rows each, and
one keyword-overview batch of at most ten unique topics. Stop if the current
inspected plan exceeds **$0.100000**.

Use the supplied market consistently. Do not mix countries or languages in one
table. Remove navigational brand queries unless the objective explicitly needs
them.

## Select and inspect the route

Discover by intent and inspect every selected tool immediately before use. The
currently verified route is:

- `dataforseo.ranked-keywords` for bounded target and competitor samples;
- `dataforseo.organic-competitors` for overlapping search competitors;
- `dataforseo.keyword-overview` for shortlisted-topic validation.

The named ids are the validated route, not permanent entitlement. If any
required tool is not live, its schema no longer supports the bounded plan, or
its price cannot be mapped to an exact maximum, stop without substituting a
scraper or another data source.

Save the inspected price unit, current schema, exact input and maximum cost for
each planned call. Deduplicate the overview batch before pricing it.

## Plan and staged approvals

Before the first paid run, show:

- target, country, language and business objective;
- target sample size;
- exact target-baseline and competitor-discovery inputs;
- the rule for selecting at most two competitors;
- the reserved maximum for competitor samples and one overview batch;
- inspected phase-one prices and the maximum total, which must remain at or
  below **$0.100000**.

Wait for explicit approval of the exact phase-one calls and reserved workflow
maximum. That approval does not cover competitor domains or topics that do not
exist yet. Changing a domain, market, sample size, selection rule or total
ceiling invalidates it.

Save state after planning and every terminal run:

```json
{
  "skill": "scrollport-organic-opportunity-map",
  "version": 1,
  "status": "planned",
  "target": {"domain": "example.com", "country": "United Kingdom", "language": "English"},
  "objective": "...",
  "plan": [],
  "completed": [],
  "competitors": [],
  "candidates": [],
  "pending": "phase-one approval",
  "spent_usd": "0.000000",
  "updated_at": "ISO-8601"
}
```

Do not store credentials, approval URLs or raw access artifacts in the state.

## Execute the evidence pass

### 1. Establish the target baseline

Run the approved `dataforseo.ranked-keywords` target sample. Save the run id,
final cost and the returned keyword, position, URL and search signals that are
actually present. Summarise visible themes and pages without inferring coverage
beyond the sample.

An empty result is a valid finding. Do not repeat the call automatically or
quietly enlarge the sample.

### 2. Find and select search competitors

Run `dataforseo.organic-competitors` once. Distinguish genuine business or
content competitors from generic platforms, directories and very large sites
whose overlap is not decision-useful.

Select at most two competitors using returned overlap evidence plus clear
relevance to the target's audience. Record rejected domains and the reason for
rejection. Do not spend on every returned domain.

Now inspect and present the exact ranked-keyword input for each selected domain,
the current per-call maximum, spend so far, remaining reserved budget and new
workflow maximum. Wait for a second explicit approval before either competitor
sample. A domain chosen after discovery is never covered by phase-one approval.
Save the approved domains and inputs in state.

### 3. Sample competitor visibility

Run the approved `dataforseo.ranked-keywords` sample once for each selected
competitor. Build candidate topics locally from terms that are relevant to the
target's objective and supported by a useful ranking, page or SERP observation.

Compare candidates with the target sample, but label a term **uncovered in the
sample**, not **the target does not rank**, unless a separate exact provider
check proves that claim.

### 4. Validate the shortlist

Remove duplicates, brand-only terms, topics outside the business boundary and
ambiguous terms whose relevance to the target objective cannot be supported.
Record every rejected or deferred term and the reason. Choose at most ten
candidates, inspect the exact deduplicated
`dataforseo.keyword-overview` input, and present the topic list, current price,
spend so far, remaining reserved budget and final workflow maximum. Wait for a
third explicit approval before the overview run. Preserve returned volume,
difficulty, intent, competition and SERP features as provider facts. Mark
absent fields as unavailable rather than estimating them.

### 5. Prioritise transparently

Score locally; do not invent a provider score. Use a simple, visible rubric:

- business fit: high, medium or low;
- evidence strength: exact observation, sampled observation or hypothesis;
- demand and difficulty: the current provider values;
- intent fit: aligned, adjacent or unclear;
- next action cost: small validation, content brief, technical fix or deeper
  research.

Prioritise high-fit, supported opportunities that have a realistic next action.
Large volume alone is not a reason to rank a topic first.

When target-page ownership remains uncertain, make mapping the topic to an
existing page and inspecting the live search results the next action before
recommending new content.

## Deliverable

Return:

1. a short scope and limitations note;
2. a target baseline and selected-competitor summary;
3. a table with topic, evidence source, volume, difficulty, intent, SERP
   features, business fit, confidence and next action;
4. the top three actions for the next four weeks;
5. exact tool ids, run ids, final costs and total spend;
6. rejected or deferred candidates and the reason.

Every conclusion must identify whether it came from DataForSEO or local agent
analysis. Cite the saved provider observation behind each top priority.

## Recovery and acceptance

On resume, poll every saved non-terminal run id before creating another run.
Reuse each successful result. If a server estimate requests confirmation, hand
the approval URL to the human and wait. If a required tool fails after uncertain
provider execution, poll the same run; do not pay for a replacement merely
because the wait loop ended.

The Skill is complete only when the final map:

- stays inside the approved domain, market, samples and cost;
- contains at least one decision-useful priority or honestly reports none;
- separates provider facts, sampled absence and inference;
- gives an actionable validation or creation step for every priority;
- records exact run ids and final spend.

A successful response envelope without a semantically useful map does not pass.
