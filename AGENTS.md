# Agent instructions

- Read `docs/AUTHORING.md` before editing a Skill or candidate.
- `registry.json` and each `skill.json` are the structured source for lifecycle,
  dependencies and website exports.
- Only `skills/*/SKILL.md` is publishable and installable; candidates must not
  contain a file named `SKILL.md`.
- Run `npm run sync`, `npm test` and `npm run build` after changes. Bundled
  `references/AUTHORING.md` files are generated; edit only `docs/AUTHORING.md`.
- Do not commit secrets, customer data, access links, approval links or raw
  provider payloads as evidence.
- Do not publish a release or submit to an external registry without explicit
  human authorization.
