---
name: scrollport-qualified-accounts-weekly
description: Draft a small weekly account shortlist from a narrow ideal-customer profile and structured company evidence.
license: MIT
metadata:
  scrollport-status: draft
---

# Qualified Accounts Weekly

Answer: **Which accounts should I contact this week?** Start with a narrow
ideal-customer profile, disqualify weak discovery results locally, validate the
survivors with structured firmographics and add a timely reason to act only
when the evidence supports one.

> Draft: do not install or present this as Verified. The current company
> discovery route can return a large, noisy and unbounded result set. One
> relevant company can be rescued and enriched, but the complete promised
> shortlist is not repeatable enough to publish.

Use Scrollport's `apps`, `discover`, `inspect`, `run` and `wallet` controls and
no direct supplier access.

## Intended bounded route

The route under evaluation is:

1. `hunter.discover` for one natural-language company search;
2. local disqualification against every hard profile constraint;
3. `akta.company-enrichment` for each approved survivor;
4. optional `akta.company-news` for one current trigger;
5. optional `exa.search` for labelled public context.

Structured company evidence must remain the spine. News and web search may add
freshness but cannot repair an identity or firmographic mismatch.

## Publication gate

Before this candidate can move to `skills/`, a public synthetic rehearsal must:

- produce a bounded or safely truncatable result set;
- yield the requested number of relevant accounts without manually scanning a
  huge unrelated list;
- validate each survivor against geography, company type, size and exclusions;
- stay below the approved price without repeated discovery calls;
- produce a weekly ranking with a cited fit reason and either a cited timely
  signal or an explicit `no timely signal found` label;
- record exact tool ids, run ids, final costs and rejection reasons.

Until then, use the candidate only to improve the route and supplier contract.
