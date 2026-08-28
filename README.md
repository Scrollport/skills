# Scrollport Skills

**Tools provide capabilities. Skills package workflows. Agents deliver outcomes.**

This is the canonical source for verified, independently installable workflows
powered by [Scrollport](https://scrollport.com). Each published Skill has a
specific professional outcome, explicit cost and approval boundaries, declared
tool dependencies, recovery instructions and a current maintainer verification.

Skills and Tools share one taxonomy: every Skill has one primary outcome
category, composes canonical Scrollport capabilities and declares the exact
catalog tools that implement them. Skill badges are capability links, not a
second set of free-form tags.

## Install

Choose a verified Skill on [scrollport.com/skills](https://scrollport.com/skills)
and give its short setup prompt to your agent. The shared
[installation guide](INSTALL.md) lets the agent select a supported installer,
pin the current source, connect Scrollport when needed and verify the declared
dependencies before asking for workflow inputs.

Published Skills live under `skills/`. Draft candidates stay under
`candidates/` without a `SKILL.md`, so standard clients cannot discover or
install them. `registry.json` records both lifecycle states; generated exports
contain only Verified Skills.

`skill.json` in this GitHub repository is the sole editable source for each
Skill's semantic version. An exact commit or release tag pins the complete
package state; `SKILL.md` does not repeat the version. Git history and GitHub
releases are the canonical change record, so per-Skill changelogs are optional.

## First curated set

| Skill | State | Publication decision |
| --- | --- | --- |
| Organic Opportunity Map | Verified | Public, bounded end-to-end rehearsal passed |
| Qualified Accounts to Contact | Verified | Public, five-prospect starter rehearsal passed within the $0.50 ceiling; larger caller-approved batches are supported |
| Evidence-led Content Brief | Verified | Public, bounded end-to-end rehearsal passed |
| Audio Edition | Verified | Public, current technical route plus adopted human review |
| Prospecting | Draft | Withheld until load-bearing contracts and the CRM write pass |

## Trust model

- A Skill is free agent-side instruction; Scrollport catalog runs may cost the
  inspected per-call price.
- The agent shows bounded costs and pauses at the declared human checkpoints.
- A Skill never grants access beyond the Scrollport and connected-app authority
  the human already approved.
- `Verified` means the full outcome and every load-bearing dependency passed a
  recent end-to-end rehearsal. `Customer-proven` is a separate trust state.
- A degraded dependency or overdue maintainer review withholds the Skill until
  it is reverified.

Verification notes and historical changelogs are maintainer provenance, not
runtime Skill dependencies or customer-facing product content. They may remain
in GitHub when useful, but generated packages and the website exclude them.

See [the installation guide](INSTALL.md),
[authoring contract](docs/AUTHORING.md),
[contribution guide](CONTRIBUTING.md) and [security policy](SECURITY.md).
