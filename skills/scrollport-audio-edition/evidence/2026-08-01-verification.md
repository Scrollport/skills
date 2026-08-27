# Audio Edition verification — 2026-08-01

Status: **Verified migration evidence; fresh rehearsal due by 2026-09-01.**

- The narration bake-off used real captured outputs and Alan selected one voice
  on Eleven v3.
- `elevenlabs.dialogue` and `elevenlabs.music` were live and published when the
  launch recipe moved from Draft to live.
- The exact reviewed change was merged as
  [`v20x/scrollport#258`](https://github.com/v20x/scrollport/pull/258) at commit
  `df478400563f5d2e5d95740ea5b9539f4d38d855`.
- The merged recipe and its public copy passed the monorepo build, typecheck and
  1,285-test suite; the release handoff required a direct fetch of the public
  Skill and control-surface index.

This file preserves the prior decision and release provenance. It contains no
customer content, credentials, approval links or raw provider payloads. The
first-five review must add a fresh end-to-end outcome before the review date;
otherwise publication automation withholds the Skill.
