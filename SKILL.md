---
name: scrollport-setup
description: >-
  Connect this agent to scrollport — hundreds of tools and APIs through one key
  and one prepaid balance. Use when the user pastes "set up
  https://scrollport.com/SKILL.md" or asks the agent to give itself new
  capabilities (scraping, search, enrichment, voice, video) without per-provider
  signups. Discover a capability, pay per call from one wallet, run it.
license: MIT
---

# scrollport Setup Skill

> Status: scaffold. The install/auth steps below are the intended contract; the
> live endpoints land as later issues ship. Doctrine here is load-bearing —
> keep it as the surfaces are built.

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

## Setup — call the API directly

**Prefer the HTTP API.** It is the primitive; everything else is built on it, it
needs no install, and it works in an agent with no shell, no browser and no
filesystem — a container, a hosted runtime, a serverless function. Both endpoints
below are unauthenticated, because getting a key is the one thing you cannot
already have a key for.

```
POST https://api.scrollport.com/v1/auth/device
     { "client_name": "your-harness/1.0", "scopes": ["discover","inspect","run"] }
  -> { "verification_uri_complete": "...", "user_code": "HXTQ-4417",
       "device_code": "...", "interval": 5, "expires_in": 600 }
```

1. Show the human `verification_uri_complete` **and** `user_code`. Both, always —
   see the security note below.
2. Poll `POST /v1/auth/token { "device_code": "..." }` every `interval` seconds.
   While it waits it answers **HTTP 400** with `authorization_pending`, or
   `slow_down` (back off and use the new `interval`). Neither is an error.
3. On approval it returns `{ "api_key": "sp_live_…", "account_id": "..." }`
   **exactly once**. Store it wherever this agent keeps secrets — environment,
   secret manager, whatever you already use. Never print it, never write it to a
   file the human will read, never put it in a log.

**If a human already sent you an invite**, redeem it instead — one call, no
approval step, because the human decided when they created it:

```
POST /v1/auth/invite/redeem { "code": "...", "client_name": "your-harness/1.0" }
  -> { "api_key": "sp_live_…", "account_id": "..." }
```

### If you cannot make HTTP calls yourself

Run the CLI: `npx scrollport setup`. It performs exactly the flow above and
additionally stores the key at `~/.scrollport/credentials.json` (mode 0600),
where later sessions and `scrollport status` / `scrollport logout` will find it.
That local convention is the reason to prefer it **on a developer machine** — not
because the API path is lesser.

### Security note — this is not optional

The consent click is a security boundary against prompt injection: an
agent-printed URL must never auto-provision spending authority. Show the human
the `user_code` alongside the link so they can match it against the code on the
consent screen. An agent that hides the code has removed the only thing tying the
page in front of the human to the agent asking.

## Calling the four tools

Once you hold a key, `Authorization: Bearer sp_live_…` on
`https://api.scrollport.com/v1` is all you need — `GET /capabilities/search`,
`GET /capabilities/:id`, `POST /runs`, `GET /runs/:id`, `GET /wallet`.

**MCP is a transport, not a second way to onboard.** If your harness speaks MCP,
point it at `POST https://api.scrollport.com/mcp` and you get the same four tools
over JSON-RPC, from the same process, calling the same handlers — carrying the
same bearer key you obtained above. Choosing MCP changes how you call the tools;
it does not change how you get a key, and there is no MCP-specific signup.

`wallet` is read-only over MCP: an agent that can raise its own spend gate is a
prompt-injection target, so top-ups and threshold changes are a human's job.

## Skills

A skill is a markdown recipe the **agent** executes by chaining individual `run`
calls — the server never orchestrates pipelines. Checkpointing = each step is
its own billed run; resume = re-read skill state; estimate-before-run = sum the
step estimates; approval gates = ask in conversation.
