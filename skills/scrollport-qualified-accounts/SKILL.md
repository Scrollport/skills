---
name: scrollport-qualified-accounts
description: Build a source-backed account-and-contact list at a caller-approved scale, with relevant decision-makers and verified work emails.
license: MIT
metadata:
  scrollport-status: verified
---

# Qualified Accounts to Contact

Turn a narrow ideal-customer profile into a contact-ready prospect list of the
requested size. Find companies, verify the material fit claims, select one
relevant current person at each company, and return a verified work email with
source evidence.

Use one authorised Scrollport connection and its `apps`, `discover`, `inspect`,
`run` and `wallet` control tools. Never call a supplier directly.

## Outcome boundary

Produce up to the caller's requested number of contact-ready prospects without
exceeding the approved spend ceiling. Each accepted row must contain:

- the company name, domain and geography;
- evidence for every material ideal-customer-profile claim;
- one relevant current person and role;
- a public professional work email with current verification status;
- source URLs, confidence and any unresolved uncertainty.

Contact-ready means researched enough for a human to review and decide whether
to approach. It does not prove need, budget, authority, timing, buying intent or
sales qualification. Do not describe the output as guaranteed leads or as fully
qualified. Return fewer results rather than weaken the evidence or exceed the
approved ceiling.

This Skill does not send outreach, write to a CRM, infer a private email, use
personal telephone numbers or private email addresses, or make a consequential
decision about a person.

## Inputs and defaults

Require:

- one narrow ideal-customer profile with geography, business type, size and
  hard exclusions;
- the offer or problem used to judge company fit;
- one buyer role or an ordered set of acceptable roles;
- a target number of accepted prospects;
- a maximum total research spend;
- any must-have signal and its time window;
- existing customer, suppression and do-not-contact domains.

If the caller omits quantity or budget, propose the verified trial-safe starter:
five requested prospects with a **$0.500000** ceiling. Treat roughly $0.10 per
requested prospect as planning guidance at the prices inspected on 28 August
2026, not as a permanent quote or guaranteed yield. A caller may instead approve
any positive target and spend ceiling that the current inspected route can
bound, including a 100-prospect, $10 plan.

For more than five requested prospects, set a resumable batch size; default to
25 or the remaining target when smaller. Propose a finite candidate-examination
limit and enough distinct discovery segments to support the target. The total
approval covers all planned batches, so a batch boundary does not require fresh
approval unless the profile, tools, paid inputs, quantity or ceiling changes.

Use public business information only. Deduplicate company domains across every
batch before any company-specific paid call. Treat a company returned by
discovery as a candidate, not evidence that it satisfies every filter.

## Select and inspect the route

Discover by intent and inspect every selected tool immediately before use. The
currently verified route is:

- `hunter.discover` for structured company candidate pools;
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
or current prices cannot fit the approved ceiling, stop. Do not substitute a
more expensive enrichment provider without a revised plan and approval.

## Price the complete path

Save each inspected price, unit and exact input. At the route verified on 28
August 2026, the clean path has these planning maxima:

| Step | Maximum per use | Planning use |
| --- | ---: | --- |
| Company discovery | $0.005000 | Shared by one candidate segment |
| Public search | $0.001400 | Up to two per attempted company |
| First-party page extraction | $0.003300 | One per attempted company |
| Contact search | $0.070000 | One per company that passes fit review |
| Conditional email verification | $0.015400 | One per selected address when needed |
| UK company search | $0.005000 | One per applicable company |

The complete clean-path maximum is **$0.096500 per accepted prospect**, plus
discovery calls. Five prospects with one discovery call therefore plan to
$0.487500. One hundred prospects with two discovery calls would have a
$9.660000 clean-path base, before paid replacement or recovery work. A $10
ceiling is plausible at those prices, but it cannot guarantee 100 accepted rows
when candidates fail fit, contact or verification checks.

Prices are examples, not permanent quotes. Recompute the plan from current
inspections, the requested target, discovery segments, candidate-examination
limit, conditional work and recovery allowance. Before every paid call confirm:

`spent + pending holds + next call maximum <= approved maximum`

Also refresh the forecast to the requested target. If the remaining target no
longer fits, stop or ask the human to approve a lower target, a higher ceiling
or a revised route. Never consume the remaining ceiling merely to chase the
requested count.

## Plan and approval

Before the first paid run, show:

- the exact ideal-customer query, hard exclusions and accepted buyer roles;
- target count, batch size, candidate-examination limit and selection rule;
- every distinct discovery segment and the global deduplication rule;
- exact tools, paid inputs, inspected prices and price units;
- the conditional email-verification rule;
- clean-path estimate, recovery allowance and maximum total spend;
- confirmation that the workflow will not send or save outreach.

Wait for explicit approval of the exact plan and maximum. Expanding from the
trial-safe starter to a larger batch always needs that approval. Changing the
profile, geography, target, batch plan, provider, paid input or ceiling
invalidates it.

Save state after planning and every terminal run:

```json
{
  "skill": "scrollport-qualified-accounts",
  "version": 2,
  "status": "planned",
  "profile": {"geography": "...", "business_type": "...", "size": "..."},
  "buyer_roles": [],
  "target_count": 100,
  "batch_size": 25,
  "candidate_examination_limit": 300,
  "discovery_segments": [],
  "plan": [],
  "completed": [],
  "accepted": [],
  "incomplete": [],
  "rejected": [],
  "pending": "paid-plan approval",
  "spent_usd": "0.000000",
  "approved_max_usd": "10.000000",
  "updated_at": "ISO-8601"
}
```

Do not store credentials, approval URLs, provider secrets or unnecessary raw
personal data in state.

## Execute the research

### 1. Build bounded company pools

Use as few approved `hunter.discover` calls as the target requires. For a small
run, one candidate pool is normally enough. For a larger run, use pre-approved,
meaningfully distinct segments such as geography, company-size band or
sub-industry. Do not repeat the same discovery input because a pool is noisy.

Apply the inspected per-call result limit, stop when the approved local
candidate-examination limit is reached, and deduplicate every domain globally.
Remove suppressed domains and obvious hard mismatches locally. Record why each
examined candidate was accepted for deeper research, rejected or left
incomplete.

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
not the legal entity, a revised exact-name query is recovery work and must pass
the remaining-budget test.

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

### 5. Complete and checkpoint batches

Rank accepted rows locally using a visible rubric:

- hard profile fit: complete or incomplete;
- offer relevance: direct, adjacent or weak;
- buyer-role relevance: primary or fallback role;
- evidence freshness: current, dated or unclear;
- contactability: valid work email or incomplete.

At each batch boundary, save the accepted rows, incomplete and rejected rows,
run receipts, total spend and remaining forecast. Continue under the original
approval while the plan remains unchanged. Stop when the target is reached, the
approved spend or candidate limit is exhausted, the remaining target no longer
fits, or a required dependency becomes unavailable.

Do not add a buying-intent score unless the plan includes a separate inspected,
approved signal source and the result directly supports it. A company publishing
about a topic is not proof that it intends to buy.

## Deliverable

Return:

1. the profile, target, selection rule, date and limitations;
2. accepted prospects ranked with company, domain, fit evidence, person, role,
   verified work email, verification date, confidence and sources;
3. incomplete and rejected candidates with explicit reasons;
4. a research receipt with every tool id, run id, input summary, final cost and
   total spend;
5. the recommended human review step before any outreach.

For a large result, save accepted rows and receipts in durable CSV or JSON files
and give the human a concise summary plus paths. Do not bury uncertainty in
prose. Attach each material fit claim to its source and distinguish
provider-returned facts from local agent judgement.

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
- execution stops at the requested count or approved ceiling without exceeding
  either.

A large spreadsheet without fit evidence, relevant people and verified work
emails does not pass. A smaller, defensible list does.
