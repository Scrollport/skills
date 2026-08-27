---
name: scrollport-evidence-led-content-brief
description: Turn a business topic into a cited, writer-ready content brief using current search-demand signals and public-source evidence.
license: MIT
metadata:
  scrollport-status: verified
  scrollport-version: "1.0.0"
---

# Evidence-led Content Brief

Turn a seed topic into an evidence package a professional writer can use. The
workflow combines current keyword signals with source research, then makes the
agent show which claims are supported, which are vendor perspectives and which
are editorial recommendations.

Read [the bundled authoring contract](references/AUTHORING.md) first. Use one
authorized Scrollport connection and its `apps`, `discover`, `inspect`, `run`
and `wallet` control tools. Never call a supplier directly.

## Outcome boundary

Produce a writer-ready brief containing:

- a defined audience, job and intended action;
- one primary topic and a small supporting-topic set;
- current demand, difficulty, intent and SERP evidence when available;
- a differentiated angle grounded in cited public sources;
- a claim ledger, outline, exclusions and acceptance criteria.

This Skill does not write the finished article or publish anything. It does not
copy source prose, manufacture a statistic, or turn a vendor's assertion into
independent fact. Research supports the brief; it does not replace editorial
judgement or first-party expertise.

## Inputs and trial-safe defaults

Require:

- a seed topic or question;
- intended audience and business objective;
- the action the finished content should enable;
- country and language;
- excluded claims, products, competitors or sources;
- any required first-party material supplied by the human.

Default to at most five unique topics in one keyword batch and at most five
public sources in one research call. Stop if the inspected plan exceeds
**$0.050000**. Do not run a second search simply because the first sources
challenge the preferred angle.

## Select and inspect the route

Discover by intent and inspect every selected tool immediately before use. The
currently verified route is:

- `dataforseo.keyword-overview` for topic demand, difficulty, intent and SERP
  context;
- `exa.search` for current public evidence and source diversity.

If either required tool is not live, its schema cannot express the bounded
plan, or its current unit price cannot be mapped to a maximum, stop. Do not
quietly replace structured search data with a general web result.

Save the exact market, deduplicated topic batch, research query, requested
result count, price unit, inspected price and maximum for both calls.

## Plan and approval

Construct a narrow topic set locally from the supplied seed and objective. Do
not use a paid expansion call in trial-safe mode. Present:

- the primary question and intended reader;
- at most five topics to validate;
- one research query and at most five requested sources;
- any required domains or excluded domains;
- exact tool ids, paid inputs, inspected prices and maximum total.

Wait for explicit approval. Changing the audience, market, topics, query,
result count or provider invalidates it.

Save state:

```json
{
  "skill": "scrollport-evidence-led-content-brief",
  "version": 1,
  "status": "planned",
  "brief": {"topic": "...", "audience": "...", "objective": "..."},
  "market": {"country": "United Kingdom", "language": "English"},
  "topics": [],
  "plan": [],
  "completed": [],
  "keyword_evidence": [],
  "sources": [],
  "pending": "paid-plan approval",
  "spent_usd": "0.000000",
  "updated_at": "ISO-8601"
}
```

Do not put credentials, approval URLs or licensed full-text source copies in
state.

## Execute

### 1. Validate the topic set

Run one approved `dataforseo.keyword-overview` batch. Preserve only fields the
provider returned. For each topic record volume, difficulty, intent,
competition and SERP features when present.

Select a primary topic using business fit and search intent first, then demand
and difficulty. A lower-volume, high-fit commercial topic can be a better
primary target than a broad informational phrase. Explain the choice; do not
invent a composite provider score.

### 2. Gather current source evidence

Run the approved `exa.search` request once. Inspect each returned result before
using it. Prefer a mix of primary or expert sources, recognised practitioner
analysis and concrete examples. Record title, publisher, URL, date when
returned, source role and the exact claim it can support.

Treat vendor research, consultancy viewpoints and practitioner essays as such.
Do not repeat an embedded statistic unless the result exposes a credible
original source and the claim is relevant. A relevant snippet is a lead, not
permission to fabricate details beyond it.

### 3. Build a claim ledger

Before the outline, create a compact ledger:

- supported claim;
- source URL and publisher;
- evidence type: primary, expert analysis, vendor example or practitioner
  perspective;
- caveat or counterpoint;
- planned section.

Exclude claims that lack enough source evidence. Identify assertions that must
come from the human's first-party experience rather than public research.

### 4. Design the brief

Create the editorial angle locally. The outline should answer the reader's job,
not merely place keywords in headings. Map each substantive section to at least
one ledger item or explicitly label it as first-party opinion to be supplied.

Include:

- working title and one-sentence promise;
- reader, problem, objective and intended action;
- primary topic, supporting topics and intent rationale;
- differentiated angle and what the piece will not claim;
- section-by-section outline with evidence notes;
- source and claim ledger;
- original examples, screenshots or first-party inputs still needed;
- internal-link and call-to-action suggestions when supplied context supports
  them;
- completion checklist for the writer and editor.

## Deliverable and acceptance

Return the brief plus exact tool ids, run ids, final costs, total spend and any
skipped optional work. Distinguish DataForSEO fields, Exa-returned source
evidence and agent editorial judgement.

On resume, poll every saved non-terminal run id before creating a new one.
Reuse successful results. If a server estimate requests confirmation, hand the
approval URL to the human and wait. Do not repeat a paid search because a local
draft was lost.

The Skill passes only when:

- one primary topic is selected with an explicit market and intent rationale;
- every externally verifiable substantive claim has a usable citation;
- vendor claims and statistics are labelled or excluded;
- the outline is specific enough for a writer to draft without repeating the
  research pass;
- the brief stays inside the approved calls and cost;
- exact run ids and final spend are recorded.

A list of keywords and links without a coherent, supported editorial plan does
not qualify.
