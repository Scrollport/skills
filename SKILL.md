---
name: scrollport
description: >-
  Give this agent new capabilities through scrollport — discover a tool, inspect
  its contract, run it and pay per call from one prepaid wallet, with no
  per-provider signups (scraping, search, enrichment, voice, video). Keep this
  document and re-read it each session; it is the capability contract, not the
  signup. No key yet? Start at https://scrollport.com/start.
license: MIT
---

# scrollport skill

> Status: live. The four public tools below are the deployed contract. Doctrine
> here is load-bearing — keep it as the surfaces evolve.
>
> **No key yet?** Get one first: [https://scrollport.com/start](https://scrollport.com/start).
> That takes one round trip and is read once. This document is the one to keep.

## Doctrine: discover first

Never assume a capability's name or price. Always `discover` before you `run`.
The catalog is data returned by four meta-tools, not a fixed tool list:

- **discover** — semantic + keyword search over the catalog. Returns name,
  one-line summary, price, health, and connection state. Free to browse.
- **inspect** — the full contract for one capability: input schema, a
  human-verified worked example, output shape, and common errors. Read the
  worked example; copy its shape.
- **run** — execute one capability. Validates input and returns errors that
  teach (missing field + a corrected example), not bare 400s. Async: poll for
  the result.
- **wallet** — one prepaid balance. Per-call debits, a confirmation threshold
  for expensive calls, and top-up links.

## Calling the four tools

Once you hold a key, `Authorization: Bearer sp_live_…` on
`https://api.scrollport.com/v1` is all you need — `GET /capabilities/search`,
`GET /capabilities/:id`, `POST /runs`, `GET /runs/:id`, `GET /wallet`.

**MCP is a transport, not a second way to onboard.** If your harness speaks MCP,
point it at `POST https://api.scrollport.com/mcp` and you get the same four tools
over JSON-RPC, from the same process, calling the same handlers — carrying the
same bearer key you obtained at setup. Choosing MCP changes how you call the
tools; it does not change how you get a key, and there is no MCP-specific signup.

`wallet` is read-only over MCP: an agent that can raise its own spend gate is a
prompt-injection target, so top-ups and threshold changes are a human's job.

## Skills

A skill is a markdown recipe the **agent** executes by chaining individual `run`
calls — the server never orchestrates pipelines. Checkpointing = each step is
its own billed run; resume = re-read skill state; estimate-before-run = sum the
step estimates; approval gates = ask in conversation.

Launch recipes in validation:

- [Prospecting](https://scrollport.com/skills/prospecting/SKILL.md) — **draft**
  until every load-bearing step has a live fallback and the route is validated
  against the dedicated launch HubSpot destination; structured find → validate
  → enrich → verify → human-approved update.
- [Audio Edition](https://scrollport.com/skills/audio-edition/SKILL.md) —
  **draft** until narration and music have live fallback suppliers, the
  narration bake-off is adopted and the selected music capability is
  published; content and optional Exa context → approved broadcast script →
  narration/music → MP3 or agent-side audiogram.

Read the recipe in full before starting. Both follow the shared
[authoring contract](https://scrollport.com/skills/AUTHORING.md) for estimates,
state, resumability, failure recovery and honest provider boundaries.
