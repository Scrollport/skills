---
name: scrollport-setup
description: >-
  Connect this agent to Scrollport — hundreds of tools and APIs through one key
  and one prepaid balance. Use when the user pastes "set up
  https://scrollport.com/SKILL.md" or asks the agent to give itself new
  capabilities (scraping, search, enrichment, voice, video) without per-provider
  signups. Discover a capability, pay per call from one wallet, run it.
license: MIT
---

# Scrollport Setup Skill

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

## Setup (2 clicks, no keys typed)

1. Install the CLI or register the remote MCP server (this file can do either).
2. Run setup — it prints a device-flow URL with the code already embedded.
3. The human taps the link and approves on one combined screen.
4. The confirmation page says "Done — go back to your agent." The key is
   provisioned automatically; the human never sees or pastes it.

The consent click is a security boundary (prompt-injection protection): an
agent-printed URL must never auto-provision spending authority.

## Skills

A skill is a markdown recipe the **agent** executes by chaining individual `run`
calls — the server never orchestrates pipelines. Checkpointing = each step is
its own billed run; resume = re-read skill state; estimate-before-run = sum the
step estimates; approval gates = ask in conversation.
