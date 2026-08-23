---
name: scrollport-prospecting
description: Build a small, verified prospect list and apply an approved update to matching contacts in a connected HubSpot account.
license: MIT
metadata:
  status: draft-until-supplier-redundancy-and-live-validation
---

# Prospecting

Turn a supplied company list or narrow ideal-customer profile into verified
contacts. Structured providers are the load-bearing path; web search is optional
freshness. The final CRM update is a separate human-approved step.

> Draft: do not execute this as a launch skill until each load-bearing find,
> enrich, verify and CRM step has a validated, live supplier and the complete
> route is validated against the dedicated launch HubSpot destination.

Read [the authoring contract](../AUTHORING.md) first. Use scrollport's public
`discover`, `inspect`, `run` and `wallet` tools; do not call providers directly.

## Inputs and safe default

Ask for:

- target company domains, or a narrow profile from which the human approves a
  short domain list;
- desired role, department or seniority;
- the HubSpot property and value to apply to an already-existing matched
  contact.

Default to **one company and one contact**. Never expand beyond three contacts
on trial credit. A net-new contact is out of scope because the launch catalog
has HubSpot search and update, not contact creation; return the verified lead to
the human instead of pretending it was written.

## Candidate validation route

Discover each intent and inspect the selected result immediately before use.
The route to validate is:

1. `hunter.email-search` to find people already known for a domain; use
   `hunter.email-finder` only when the human supplied a named person.
2. Local filtering against the requested role. This is the validation step and
   costs nothing.
3. `akta.company-enrichment` for firmographic enrichment of the chosen company.
4. `hunter.email-verify` for the one selected address.
5. `hubspot.contacts.search` to find the same address in the connected CRM.
6. `hubspot.contacts.update` to apply the approved property change.

`exa.search` may be added for recent company context after the structured match.
It must be labelled as web evidence and must not replace Hunter/Akta identity or
firmographic fields. Do not use a scraper in trial-safe mode.

Hunter calls are for deliberate user workflows only. They are never repeated as
canaries and an exhausted Hunter credit pool is a clean stop, not permission to
switch to an unverified source.

## Plan and estimate

Inspect all selected catalog tools and save their current price and schema. Build
the exact inputs before the first paid call. The historical one-contact shape is
roughly one Hunter search block, one Akta enrichment, one Hunter verification,
one HubSpot search request and one HubSpot update request, but the inspected
prices and server estimates are authoritative.

Show the human:

- maximum number of companies and contacts;
- each planned catalog tool and input-sensitive quantity;
- maximum total USD;
- that the final step mutates their HubSpot account;
- any optional Exa call as a separately removable line item.

Save state in this shape:

```json
{
  "skill": "scrollport-prospecting",
  "version": 1,
  "status": "planned",
  "targets": [{"domain": "example.com"}],
  "criteria": {"department": "marketing", "seniority": "senior"},
  "plan": [],
  "candidates": [],
  "selected": null,
  "completed": [],
  "pending": "paid-plan approval",
  "spent_usd": "0.000000"
}
```

## Execute with checkpoints

### 1. Find

Run the inspected Hunter search with the smallest useful limit. Save the run id,
final cost and returned candidates. If it returns nothing, stop for the human;
do not spray related domains or retry alternate spellings automatically.

### 2. Validate

Filter locally. Explain why each retained candidate matches the requested role
and why rejected candidates do not. Choose at most the approved count.

### 3. Enrich

Run Akta once for each approved company using only the sections needed for the
decision. Save the provider-backed fields separately from agent inference. If
enrichment contradicts the profile, mark the lead rejected and do not spend on
email verification.

### 4. Verify

Run Hunter verification for each surviving address. Keep the returned status,
score and risk signals. Only `valid` addresses continue by default; show
`accept_all` or `unknown` to the human rather than silently treating them as
deliverable.

### 5. Match the CRM

If HubSpot is not connected, preserve state and give the human the returned
connection URL. After confirmation, search HubSpot by the verified email with
one page. No match means “verified lead, not written”; multiple matches require
a human choice.

### 6. Approve and act

Present a diff containing the HubSpot contact id, email, property name, old
value if returned, new value and the preflight maximum calculated from the
inspected price and exact input. Ask for explicit approval of that exact diff.
Only then create the `hubspot.contacts.update` run. If the server requires
confirmation at its authoritative estimate, hand that second checkpoint to the
human and wait; never create a run merely to obtain an estimate.

Poll the saved run to a terminal state and read the returned contact. Do not
retry an uncertain write until a fresh HubSpot search proves the property was
not changed.

## Resume and completion

On resume, poll every saved non-terminal run id before starting a new call.
Continue from the first step without a successful record. A completed run
reports:

- accepted and rejected prospects with reasons;
- exact tool ids, run ids and final costs;
- the HubSpot contact and changed property, or the explicit reason no write was
  made;
- total spend and any optional step skipped.

Completion requires the verified data to be semantically useful and the CRM
destination to show the approved value. HTTP success alone does not qualify.
