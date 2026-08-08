---
name: scrollport-start
description: >-
  Set up Scrollport through the safest route this environment can retain: an
  existing connection, CLI-managed credentials, a harness secret store, or a
  live-verified remote MCP connector. Use when the user pastes "set up
  https://scrollport.com/start" or asks for Scrollport capabilities.
license: MIT
---

# Scrollport — start here

> This document is read **once**, to get a key. The document to keep and re-read every session is the [scrollport skill](https://scrollport.com/skill), which contains doctrine, the four control tools, pricing behaviour and error handling.

## For humans

This page is deliberately readable by both people and agents. It contains no hidden instructions and does not ask an agent to bypass human approval. During setup:

- the agent will ask you to sign in with Google; Scrollport creates an account if you are new;
- it will then request access to Scrollport — you see a short code and approve that request;
- the API key is securely returned to the agent and is never displayed in the web page; and
- setup itself does not run a catalog tool or charge the wallet.

Check the code shown by the agent against the code on the approval page. If they do not match, do not approve the request.

## For agents

For agents reading this, continue below and keep the human approval boundary intact.

## Assess the environment deterministically

Follow these steps in order. Do not ask the human to choose between CLI, API and MCP.

1. Check whether the four Scrollport control tools or a working stored credential already exist. Verify them with the free `wallet` or `discover` control tool and reuse them when they work. Do not mint a duplicate.
2. If shell commands are available on a persistent machine, the current OS user's home directory is writable and you have permission to run `npx`, use the CLI-managed credential route by default.
3. Otherwise, if this harness can make HTTPS requests and securely retain a bearer secret in its existing credential store, use the direct device API route.
4. If neither storage route is safe, do not mint a credential that will immediately be lost and left live. Explain that this environment cannot safely retain a bearer secret. Direct the human to a platform guide only after that guide is published following live client acceptance.
5. Choose the tool transport separately from credential acquisition. Configure remote MCP when this harness supports it and a tested guide exists; otherwise use the four direct HTTP control-tool endpoints.
6. Verify with a free `wallet` or `discover` call, save and register the [Scrollport skill](https://scrollport.com/skill), then report the credential scope and transport without printing any secret.

A CLI credential file is scoped to this machine and OS user, not to one agent. A direct-API credential is scoped to the harness secret store that retains it. A remote MCP authorization is scoped to one connector or connection.

## Acquire a credential

### CLI-managed credential

When step 2 applies, run:

```
npx scrollport setup
```

The CLI first checks its existing credential. A working credential is reused. A missing or revoked credential starts a device request and prints `verification_uri_complete` plus the matching `user_code`. The human signs in with Google, returns to the still-pending request, and then separately selects `Authorise agent`. The CLI stores the returned `sp_live_…` credential at `~/.scrollport/credentials.json` with mode `0600`, inside a `0700` directory, using an atomic write. Never print or copy that credential.

`npx scrollport setup --invite <code>` safely redeems a short-lived, single-use connection invite a human already created. The credential is still minted inside the CLI and never shown in the dashboard.

### Direct device API

Use this only when the harness already has a secure persistent secret store. Creating a device request does not sign the human in and does not authorize access.

```
POST https://api.scrollport.com/v1/auth/device
     { "client_name": "your-harness/1.0", "scopes": ["discover","inspect","run","wallet"] }
  -> { "verification_uri_complete": "...", "user_code": "HXTQ-4417",
       "device_code": "...", "interval": 5, "expires_in": 600 }
```

1. Show the human both `verification_uri_complete` and `user_code` so they can match the request.
2. Poll `POST https://api.scrollport.com/v1/auth/token { "device_code": "..." }` no faster than `interval` seconds. HTTP 400 `authorization_pending` means keep waiting; `slow_down` means use the returned longer interval. Stop on `access_denied` or `expired_token`.
3. Only after the human separately authorizes the request does the next poll return `{ "api_key": "sp_live_…", "account_id": "..." }` exactly once. Put it directly into the harness's existing secret store. Never display, log, or ask the human to copy it.

Request exactly `discover`, `inspect`, `run` and `wallet`. The fixed grant cannot be narrowed or widened, and never includes `sys-admin`.

If a human already supplied a connection invite, redeem it directly into the same secure store:

```
POST https://api.scrollport.com/v1/auth/invite/redeem
     { "code": "...", "client_name": "your-harness/1.0" }
  -> { "api_key": "sp_live_…", "account_id": "..." }
```

### Remote MCP OAuth (publication-gated)

Hosted clients that cannot safely retain a raw bearer secret use the canonical Streamable HTTP endpoint `https://mcp.scrollport.com/` after their platform guide passes live acceptance and is published. Do not direct a human to a draft guide or infer setup steps from generic MCP knowledge. The connector opens Scrollport OAuth, where Google sign-in and `Authorise connection` are separate human actions. Scrollport issues short-lived access tokens and rotating refresh tokens directly to the connector; no raw API key or token goes through the human clipboard.

## Configure the tool transport

Credential acquisition and tool transport are separate decisions.

- For direct HTTP, save the [Scrollport skill](https://scrollport.com/skill) and expose its four endpoints: `discover`, `inspect`, `run` and `wallet`. Send `Authorization: Bearer <stored credential>` from the harness secret store.
- For remote MCP, configure `https://mcp.scrollport.com/` only through a published, live-verified platform guide. Existing `sp_live_…` credentials remain compatible for programmatic clients, but never commit one to project configuration or ask a human to paste it into a connector UI.

## Verify and install the skill

Call `wallet` or `discover` first. Both are free, so verification must not charge the wallet. If it fails, report the teaching error without exposing the credential and return to the relevant acquisition step; do not mint repeated credentials speculatively.

Fetch [https://scrollport.com/skill](https://scrollport.com/skill), save it wherever this harness loads durable skills or tool doctrine, and register or enable it for future sessions. At the first time you use scrollport in each later session, re-fetch it, compare its `version` with the saved copy, and replace the saved copy if they differ.

Report only that the fixed `discover inspect run wallet` scope works and whether the selected transport is direct HTTP or remote MCP. Never print the credential, authorization code, access token or refresh token.
