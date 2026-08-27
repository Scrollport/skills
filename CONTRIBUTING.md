# Contributing

Scrollport Skills are curated outcome contracts, not a general prompt dump.
Propose a candidate with a narrow promised result, concrete inputs and outputs,
declared Scrollport dependencies, bounded cost, human checkpoints, recovery
rules and observable acceptance evidence.

## Lifecycle

1. Author candidates under `candidates/<id>/` using `DRAFT.md` and `skill.json`.
2. Rehearse the complete workflow against current inspected tool contracts.
3. Record redacted evidence; never commit credentials, customer data or private
   provider responses.
4. Promote by moving the candidate to `skills/<id>/`, renaming `DRAFT.md` to
   `SKILL.md`, setting `status` to `verified`, and adding a current evidence file.
5. Run `npm run sync`, `npm test` and `npm run build` before opening a pull
   request. `references/AUTHORING.md` is generated; edit only `docs/AUTHORING.md`.

Every dependency named in instructions must be declared in `skill.json`.
Changing a Skill version requires a changelog entry. A breaking change uses a
new major version; a changed workflow or dependency uses a minor version; copy
or evidence-only corrections use a patch version.

External registry submissions are human-reviewed release work and do not happen
automatically from a pull request.
