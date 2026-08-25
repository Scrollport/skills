# Authoring scrollport skills

A scrollport skill is a recipe an agent executes with the five public control tools. It
is not server-side orchestration and it never grants authority beyond the connection,
wallet and provider connections the human already approved.

## Required contract

Every skill must state:

1. **Outcome and boundary** — what is produced, what is deliberately not done,
   and which irreversible actions remain human decisions.
2. **Inputs** — required user material, safe defaults and explicit limits.
3. **Catalog-tool selection** — discover by intent, inspect before use, and name
   fixed `tool_id` values only as the currently validated route. Never assume a
   named tool is still live or unchanged. Categories and capabilities help a
   human or agent choose; a catalog tool is the executable operation.
4. **State** — a compact record that can be saved after every successful step.
5. **Estimate** — the inputs and inspected price used for every paid step, plus
   the maximum total before the first paid call.
6. **Checkpoints** — where the human must approve content, cost, a connection or
   a write.
7. **Recovery** — what can be retried, what must first be polled, and how to
   resume without repeating a paid call.
8. **Acceptance** — observable evidence that the outcome is complete.

## Discover, inspect, estimate

Start each run by discovering the required intent and inspecting every chosen
catalog tool. A saved recipe is not evidence that a tool is still live.

For each planned call, retain:

```json
{
  "tool_id": "provider.action",
  "input": {},
  "price_unit": "per_call",
  "price": "0.010000",
  "estimated_max_usd": "0.010000",
  "source": "inspect response at 2026-07-30T12:00:00Z"
}
```

Compute the maximum from the actual input. Pagination, requested result counts,
characters, seconds and images can all change it. Keep USD as decimal strings.
If the unit cannot be mapped to a bounded maximum, stop and ask the human.

Creating a run is not a quote operation: `POST /runs` may queue provider work
immediately. Before that request, calculate the maximum from the inspected
price and exact input, and obtain every required cost or mutation approval
against that maximum. The server estimate returned by `POST /runs` is
authoritative for billing. If the response is `confirmation_required`, replace
the plan value with that estimate, show the revised total, hand the approval URL
to the human and wait; the agent never submits its own approval.

## Checkpoint state

Persist only ordinary workflow data; never put API keys, OAuth tokens or
approval codes in skill state.

```json
{
  "skill": "example",
  "version": 1,
  "status": "planned",
  "inputs": {},
  "plan": [],
  "completed": [
    {
      "step": "research",
      "run_id": "uuid",
      "status": "succeeded",
      "cost_final": "0.007000",
      "result_ref": "inline-or-local-path"
    }
  ],
  "pending": "human approval of draft",
  "spent_usd": "0.007000",
  "updated_at": "ISO-8601"
}
```

Write the checkpoint after each terminal run, before beginning the next one.
On resume, poll every saved non-terminal `run_id` first. Never submit a
replacement call merely because the agent lost its local wait loop.

## Human checkpoints

The agent must pause before:

- the first metered call if the total or provider choice changed;
- any call whose server response requests confirmation;
- generating media from a script the human has not approved;
- creating, updating, sending or publishing in a connected account;
- expanding from a trial-safe sample to a larger batch.

Approval is scoped to the shown content, destination, inputs and maximum price.
Editing any of those invalidates it.

## Recovery rules

- `queued` or `running`: poll the same run.
- `awaiting_approval`: hand the approval URL to the human and wait.
- `failed` before provider execution: correct the teaching error and re-estimate.
- `failed` after uncertain provider execution: inspect the destination or
  provider result before retrying; writes are not assumed idempotent.
- `connection_required`: hand the connection URL to the human, preserve the
  exact input and retry only after the connection is confirmed.
- expired artifact URL: re-read the saved completed run first so scrollport can
  mint a fresh signed URL, then download the existing artifact. Regenerate only
  if the artifact itself is outside retention, and only after new approval.

Failed scrollport runs release their hold, but that is not proof a connected
provider write had no external effect. Verify the destination.

## Honest provider boundaries

Say which system supplied each fact and which system was mutated. Database
providers are the dependable spine for structured identity and company data;
web search or scrapers may add freshness, but must not silently replace the
spine. A provider result can be empty without being an error. Never promote a
refusal, placeholder or success envelope as a useful result.

Keep trials small. A trial-safe mode must bound the count and dollar maximum,
avoid repeated calls to consume free-tier credits, and stop before writes unless
the human explicitly selected a disposable or intended destination.

## Acceptance evidence

A completed skill records the exact tool ids, run ids, final costs,
artifact or destination references, and the human checkpoints obtained. It also
states any skipped optional step. “The request succeeded” is not enough: inspect
the returned data or artifact for the semantic outcome the skill promised.
