# Contributing

Scrollport Skills are curated outcome contracts, not a general prompt dump.
Propose a candidate with a narrow promised result, concrete inputs and outputs,
declared Scrollport dependencies, bounded cost, human checkpoints, recovery
rules and observable acceptance evidence.

## Lifecycle

1. Author candidates under `candidates/<id>/` using `DRAFT.md` and `skill.json`.
2. Rehearse the complete workflow against current inspected tool contracts.
3. Record a redacted maintainer verification note when it adds useful review
   provenance; never commit credentials, customer data or private provider
   responses.
4. Promote by moving the candidate to `skills/<id>/`, renaming `DRAFT.md` to
   `SKILL.md`, setting `status` to `verified`, and recording current
   `verified_at` and `review_due_at` dates. A redacted verification note is
   optional.
5. Run `npm test` and `npm run build` before opening a pull request.

Every dependency named in instructions must be declared in `skill.json`.
`skill.json` is the only editable version authority. Do not repeat its version
in `SKILL.md` metadata. A breaking change uses a new major version; a changed
workflow or dependency uses a minor version; copy or maintainer-verification
corrections use a patch version. Git history and GitHub releases are the
canonical change record; a per-Skill `CHANGELOG.md` is optional.

External registry submissions are human-reviewed release work and do not happen
automatically from a pull request.
