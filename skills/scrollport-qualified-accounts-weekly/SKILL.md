---
name: scrollport-qualified-accounts-weekly
description: Find up to five evidence-backed companies, relevant decision-makers and verified work emails within a $0.50 research ceiling.
license: MIT
metadata:
  scrollport-status: verified
---

# Qualified Accounts to Contact This Week

Turn a narrow ideal-customer profile into a small, contact-ready prospect list.
Find companies, verify the material fit claims, select one relevant current
person at each company, and return a verified work email with source evidence.

Use one authorised Scrollport connection and its `apps`, `discover`, `inspect`,
`run` and `wallet` control tools. Never call a supplier directly.

## Outcome boundary

Produce **up to five contact-ready prospects**. Each accepted row must contain:

- the company name, domain and geography;
- evidence for every material ideal-customer-profile claim;
- one relevant current person and role;
- a public professional work email with current verification status;
- source URLs, confidence and any unresolved uncertainty.

Contact-ready means researched enough for a human to review and decide whether
to approach. It does not prove need, budget, authority, timing, buying intent or
sales qualification. Do not describe the output as five guaranteed leads or as
fully qualified. Return fewer than five rather than weaken the evidence.

This Skill does not send outreach, write to a CRM, infer a private email, use
personal telephone numbers or private email addresses, or make a consequential
decision about a person.

## Inputs and trial-safe defaults

Require:

- one narrow ideal-customer profile with geography, business type, size and
  hard exclusions;
- the offer or problem used to judge company fit;
- one buyer role or an ordered set of acceptable roles;
- any must-have signal and its time window;
- existing customer, suppression and do-not-contact domains.

Default to five requested prospects, one discovery call, no more than 100
locally examined discovery rows, at most two public searches and one page
scrape per attempted company, one contact search per attempted company, and
email verification only when the selected address lacks a sufficiently current
valid result. Never exceed **$0.500000**.

Attempt at most five companies under the initial plan. A replacement candidate
is permitted only when settled savings from skipped conditional work preserve
the remaining worst-case reserve; otherwise return fewer results.

Use public business information only. Deduplicate company domains before any
company-specific paid call. Treat a company returned by discovery as a
candidate, not evidence that it satisfies every filter.

## Select and inspect the route

Discover by intent and inspect every selected tool immediately before use. The
currently verified route is:

- `hunter.discover` for one structured company candidate pool;
- `serper.google-search` for bounded public evidence and identity resolution;
- `brightdata.web-scrape` for one selected first-party company page;
- `hunter.domain-search` for public professional people and email evidence;
- `hunter.email-verifier` only when the selected address needs a fresh check;
- `companies-house.company-search` for an official UK identity and active
  status when the company is expected to be registered in the United Kingdom.

Hunter discovery is the structured candidate spine. Search and page extraction
verify material claims; they must not silently manufacture missing
firmographics. Companies House is a jurisdiction-specific check, not a generic
global company database. Outside the UK, use a supported authoritative registry
only after inspection and re-pricing, or label official identity as unavailable.

If a required tool is not live, its contract cannot express the bounded input,
or current prices cannot fit the ceiling, stop. Do not substitute a more
expensive enrichment provider without a new plan and approval.

## Price the complete path

Save each inspected price, unit and exact input. At the route verified on 28
August 2026, the worst-case default is:

| Step | Maximum per use | Uses | Reserved maximum |
| --- | ---: | ---: | ---: |
| Company discovery | $0.005000 | 1 | $0.005000 |
| Public search | $0.001400 | 10 | $0.014000 |
| First-party page extraction | $0.003300 | 5 | $0.016500 |
| Contact search | $0.070000 | 5 | $0.350000 |
| Conditional email verification | $0.015400 | 5 | $0.077000 |
| UK company search | $0.005000 | 5 | $0.025000 |
| **Total** |  |  | **$0.487500** |

Prices are examples from the successful verification, not permanent quotes.
Recompute the maximum from current inspections. Reserve the full worst-case
cost for every not-yet-attempted requested row. Before starting another paid
candidate step, confirm that:

`spent + pending holds + next step + remaining worst-case reserve <= $0.500000`

Unused conditional email-verifier reserve may fund a targeted recovery call,
but only if the exact revised maximum remains within the approved ceiling. A
failed or rejected candidate can consume budget, so never promise an exact
count.

## Plan and approval

Before the first paid run, show:

- the exact ideal-customer query, hard exclusions and accepted buyer roles;
- requested count, local examination bound and selection rule;
- exact tools, paid inputs, inspected prices and price units;
- the conditional email-verification rule;
- the workflow maximum, which must be at or below **$0.500000**;
- confirmation that the workflow will not send or save outreach.

Wait for explicit approval of the exact plan and maximum. Changing the profile,
geography, requested count, provider, paid input or ceiling invalidates it.

Save state after planning and every terminal run:

```json
{
  "skill": "scrollport-qualified-accounts-weekly",
  "version": 1,
  "status": "planned",
  "profile": {"geography": "...", "business_type": "...", "size": "..."},
  "buyer_roles": [],
  "requested": 5,
  "plan": [],
  "completed": [],
  "accepted": [],
  "incomplete": [],
  "rejected": [],
  "pending": "paid-plan approval",
  "spent_usd": "0.000000",
  "remaining_max_usd": "0.500000",
  "updated_at": "ISO-8601"
}
```

Do not store credentials, approval URLs, provider secrets or unnecessary raw
personal data in state.

## Execute the research

### 1. Build a bounded company pool

Run the approved `hunter.discover` input once. Consider at most the first 100
returned rows and ignore the rest. Do not repeat discovery because the pool is
noisy or manually expand it with guessed domains.

Remove duplicates, suppressed domains and obvious violations locally. Rank the
remaining candidates using only returned identity plus inexpensive public
evidence. Record why each examined candidate was accepted for deeper research,
rejected or left incomplete.

### 2. Verify company fit

For an attempted company, use at most two approved `serper.google-search`
queries to resolve identity and test the hard profile claims. Select one
first-party HTTPS page that best supports the material business-type, offer or
audience claim, then run `brightdata.web-scrape` once.

Accept a material claim only when the returned source states it or an
authoritative structured source returns the field. A search snippet is usable
evidence when its URL, title and claim are preserved, but prefer the current
first-party page. Conflicting size or geography evidence must be shown, not
silently resolved. Reject a hard mismatch. Mark an unprovable hard requirement
incomplete.

For a UK company, run `companies-house.company-search` once using the resolved
legal or trading name. Select an exact, active identity match and keep the
company number and source URL. If the first query exposes the trading name but
not the legal entity, a revised exact-name query is a recovery call and must
pass the remaining-budget test.

### 3. Find one relevant current person

Only after company fit passes, run `hunter.domain-search` once for that domain
with `type: "personal"`, `limit: 10` and the narrowest useful seniority or
department filter supported by the inspected contract.

Choose the first result that matches the approved buyer-role order and has
evidence connecting the person to the current company. Prefer founder, owner,
chief executive, managing director or the functional leader named by the human;
do not assume the most senior returned person is the right buyer.

Preserve name, role, email, confidence, professional profile URL, verification
status and date, and the useful source URLs. Do not infer an email from a domain
pattern or return generic addresses such as `info@` as a person.

### 4. Verify the selected work email

If domain search returns `verification.status: "valid"` with a date no more
than 90 days old, reuse it. Otherwise, inspect the remaining budget and run
`hunter.email-verifier` once for the selected address. Accept deliverability
only from the returned current status; do not use the deprecated result label.

An `accept_all`, unknown, pending or failed result is not verified. Mark that
row incomplete unless the human approves a revised outcome that permits a
risk-labelled address.

### 5. Rank without inventing intent

Rank accepted rows locally using a visible rubric:

- hard profile fit: complete or incomplete;
- offer relevance: direct, adjacent or weak;
- buyer-role relevance: primary or fallback role;
- evidence freshness: current, dated or unclear;
- contactability: valid work email or incomplete.

Do not add a buying-intent score unless the plan includes a separate inspected,
approved signal source and the result directly supports it. A company publishing
about a topic is not proof that it intends to buy.

## Deliverable

Return:

1. the profile, selection rule, date and limitations;
2. accepted prospects ranked in a table with company, domain, fit evidence,
   person, role, verified work email, verification date, confidence and sources;
3. incomplete and rejected candidates with explicit reasons;
4. a research receipt with every tool id, run id, input summary, final cost and
   total spend;
5. the recommended human review step before any outreach.

Do not bury uncertainty in prose. Attach each material fit claim to its source
and distinguish provider-returned facts from local agent judgement.

## Recovery and acceptance

On resume, poll every saved non-terminal run id before creating a new run. Reuse
successful results and the same logical idempotency key only for an exact retry.
If a run requests confirmation, give the approval URL to the human and wait. Do
not repeat a paid call because a local draft or wait loop was lost.

The Skill passes only when:

- every accepted company satisfies every hard profile requirement with sources;
- every accepted person matches an approved role and is tied to the company;
- every accepted email is a public professional address with current valid
  verification evidence;
- duplicates, suppressed domains and hard mismatches are absent;
- accepted, incomplete and rejected rows are separated;
- exact run ids, final costs and total spend are recorded;
- total spend stays at or below the approved maximum and **$0.500000**.

A five-row spreadsheet without fit evidence, relevant people and verified work
emails does not pass. A smaller, defensible list does.
