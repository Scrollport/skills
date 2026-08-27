---
name: scrollport-skill-install
description: >-
  Install and prepare one verified Scrollport Skill in the current agent. Use
  when a setup prompt names a Skill and points to
  https://scrollport.com/skills/install.
license: MIT
---

# Install a Scrollport Skill

This guide installs one verified Skill from the public
[Scrollport Skills repository](https://github.com/Scrollport/skills), connects
Scrollport when needed and checks that the Skill is ready to use. It does not
run the Skill or spend wallet credit.

## For humans

Give your agent the short setup prompt from the Skill page. The prompt names the
Skill; this shared guide supplies the installation and readiness checks.

The agent may ask before it:

- installs or updates software on your machine;
- connects Scrollport or another account; or
- runs a paid tool.

You should never paste an API key, OAuth token or other credential into chat.
Account authorisation stays in Scrollport's browser flow.

## For agents

Install only the Skill named in the user's prompt. Keep the human approval
boundary intact and do not claim readiness until the installed package,
Scrollport connection and required dependencies have all been checked.

### Resolve the verified package

1. Read the Skill id from the user's prompt. If it is missing or ambiguous, ask
   which Skill to install.
2. Fetch [the current verified registry](https://scrollport.com/skills/registry.json)
   and find that exact id. Stop if the Skill is absent: an absent package is not
   currently available for installation.
3. Retain the registry's `source_repository`, `source_ref`, Skill `path`,
   `version`, dependency declarations and `instruction_path`. Use the exact
   `source_ref` throughout; do not silently substitute a branch head or a
   different release.

### Choose one installation method

Identify the current agent host, its active Skill directory and whether the
user wants project or user scope. Reuse a correct installation at the same
source pin. Otherwise, try the methods below in order and ask before installing
or updating host software.

**GitHub CLI.** If `gh skill install --help` is available and lists the current
host, install the exact package path and pin:

```sh
gh skill install Scrollport/skills skills/<skill-id> --pin <source-ref> --agent <agent> --scope <project-or-user>
```

**Open Agent Skills CLI.** If Node.js and `npx` are available, use the exact
commit URL and current host. Add `-g` only for user scope:

```sh
npx skills add https://github.com/Scrollport/skills/tree/<source-ref>/skills/<skill-id> --skill <skill-id> --agent <agent>
```

**Manual installation.** If neither installer supports the host, offer to copy
the directory at `<source-repository>/tree/<source-ref>/<skill-path>` into the
host's active Skill directory. Preserve every referenced file and record the
source pin.

Do not run more than one method after a successful installation. Do not rely on
an installer's default agent or an unpinned default branch.

### Verify the installation

1. Confirm the installed `SKILL.md` is readable and discoverable by the current
   agent. If this host loads Skills only at session start, explain that a new or
   restarted session is required.
2. Confirm the installed frontmatter name and package version match the
   registry entry, and that every file referenced by `SKILL.md` is present.
3. Read the installed `SKILL.md` and only the supporting files it says are
   required for setup or the requested workflow.

### Connect Scrollport and check dependencies

1. Check whether Scrollport's five control tools — `apps`, `discover`,
   `inspect`, `run` and `wallet` — are available. If not, follow
   [Scrollport setup](https://scrollport.com/start). Never ask the human to paste
   a Scrollport credential into chat.
2. Verify the connection with the free `wallet` or `discover` tool.
3. Use `discover` and `inspect` to confirm every required catalog dependency in
   the registry entry. Required dependencies block readiness; optional ones do
   not.
4. Use `apps` to check declared connected-app dependencies. Ask the human to
   authorise a missing account through Scrollport before treating it as ready.
5. If the installed Skill requires host-side software, explain why and ask
   before installing it.

### Finish without starting the paid workflow

Report the installed Skill id and version, source pin, installation method and
scope, whether a restart is needed, Scrollport connection state, and each
required dependency's state. Then ask for the Skill's inputs.

Do not run a paid tool until the Skill has shown the exact proposed inputs,
scope and maximum cost and the human has approved them.
