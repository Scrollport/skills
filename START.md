---
name: scrollport-start
description: >-
  Set up Scrollport through the safest route this environment can retain: an
  existing connection, CLI-managed credentials, remote MCP OAuth, or a harness
  secret store. Use when the user pastes "set up
  https://scrollport.com/start" or asks for Scrollport capabilities.
license: MIT
---

# Scrollport — start here

Scrollport gives AI agents access to a growing catalog of verified tools through four control tools: `discover`, `inspect`, `run` and `wallet`. Most tools work through one Scrollport account and pay-as-you-go wallet instead of separate provider accounts, API keys and subscriptions. Connector tools may still ask you to authorise an account you already use.

Read this document once to establish or reuse a Scrollport connection. Keep and re-read the [Scrollport skill](https://scrollport.com/skill), which explains how to choose and use tools safely.

## For humans

This page helps your agent choose the safest connection method, ask for your authorisation and verify the connection. Setup does not run a paid catalog tool or charge your wallet.

This page is deliberately readable by both people and agents. It contains no hidden instructions and does not ask an agent to bypass human approval.

During setup:

- your agent may ask you to sign in with Google;
- it will separately ask you to authorise its connection;
- for CLI or direct API setup, you should check that the code shown by your agent matches the approval page;
- for remote MCP, you should check the connector name, requested scopes and return host before authorising; and
- a scoped credential is returned directly to the CLI, harness or connector and is never displayed on the web page.

If the code or connector details do not match, do not approve the request.

## For agents

Establish or reuse one working Scrollport connection, verify the four control tools, then install the Scrollport skill. Keep the human approval boundary intact throughout.

## Assess the environment deterministically

Follow these steps in order. Do not ask the human to choose between CLI, API and MCP.

1. Check whether the four Scrollport control tools or a working stored credential already exist. Verify them with the free `wallet` or `discover` control tool and reuse them when they work. Do not mint a duplicate.
2. If shell commands are available on a persistent machine, the current OS user's home directory is writable and you have permission to run `npx`, use the CLI-managed credential route by default.
3. Otherwise, if this harness supports a remote MCP connector with OAuth, use the remote MCP route and the client-specific guide below.
4. Otherwise, if this harness can make HTTPS requests and securely retain a bearer secret in its existing credential store, use the direct device API route.
5. If none of these routes can retain a safe connection, do not mint a credential that will immediately be lost and left live. Explain that Scrollport cannot be connected safely in this environment.
6. Choose the tool transport separately from credential acquisition. Use remote MCP when the harness supports it; otherwise use the four direct HTTP control-tool endpoints.
7. Verify with a free `wallet` or `discover` call, save and register the [Scrollport skill](https://scrollport.com/skill), then report the credential scope and transport without printing any secret.

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

### Remote MCP OAuth

Clients with remote MCP support connect to the canonical Streamable HTTP endpoint `https://mcp.scrollport.com/`. The connector opens Scrollport OAuth, where Google sign-in and `Authorise connection` are separate human actions. Scrollport issues short-lived access tokens and rotating refresh tokens directly to the connector; no raw API key or token goes through the human clipboard.

Identify the client and follow its guide:

- For claude.ai, Claude Desktop or Cowork, read [claude.ai setup](https://scrollport.com/docs/mcp/claude).
- For Claude Code, read [Claude Code setup](https://scrollport.com/docs/mcp/claude-code).
- For the Codex app, CLI or IDE extension, read [Codex setup](https://scrollport.com/docs/mcp/codex).
- For another compatible client, read the [Remote MCP overview](https://scrollport.com/docs/mcp) and proceed only when the client supports remote Streamable HTTP with OAuth.

Read the guide yourself. Give the same guide to the human only when the client requires manual configuration in its interface. Otherwise configure the client, then ask the human only to complete Google sign-in and select **Authorise connection**.

## Configure the tool transport

Credential acquisition and tool transport are separate decisions.

- For direct HTTP, save the [Scrollport skill](https://scrollport.com/skill) and expose its four endpoints: `discover`, `inspect`, `run` and `wallet`. Send `Authorization: Bearer <stored credential>` from the harness secret store.
- For remote MCP, follow the client-specific guide above. Existing `sp_live_…` credentials remain compatible for programmatic clients, but never commit one to project configuration or ask a human to paste it into a connector UI.

## Verify and install the skill

Call `wallet` or `discover` first. Both are free, so verification must not charge the wallet. If it fails, report the teaching error without exposing the credential and return to the relevant acquisition step; do not mint repeated credentials speculatively.

Fetch [https://scrollport.com/skill](https://scrollport.com/skill), save it wherever this harness loads durable skills or tool doctrine, and register or enable it for future sessions. At the first time you use scrollport in each later session, re-fetch it, compare its `version` with the saved copy, and replace the saved copy if they differ.

Report only that the fixed `discover inspect run wallet` scope works and whether the selected transport is direct HTTP or remote MCP. Never print the credential, authorization code, access token or refresh token.
