---
name: scrollport-audio-edition
description: Adapt a newsletter or post into an approved short episode, then generate narration, a music sting, MP3 and optional agent-side audiogram.
license: MIT
metadata:
  status: draft-until-supplier-redundancy-bakeoff-and-music-publication
---

# Audio Edition

Turn written content into a concise episode written for the ear. The agent
adapts rather than reads verbatim, the human approves the script before any
audio spend, and scrollport supplies bounded narration and music primitives.

> Draft: do not execute this as a launch skill until narration and music each
> have a validated, live supplier, the human narration bake-off is adopted and
> the selected music capability is returned by discover.

Read [the authoring contract](../AUTHORING.md) first. Use the four scrollport
tools and only capabilities that `discover` currently returns as live.

## Inputs and safe default

Accept pasted content, a post/newsletter URL or an RSS item. Ask for audience,
tone and any words or names whose pronunciation matters.

- Default: one episode of **five minutes or less**.
- Trial-safe mode: at most 4,000 narration characters, one three-second
  instrumental sting, and no second render.
- Full-length mode: estimate and quote first; never silently expand the script.
- Feed hosting, distribution and publishing are out of scope.

Resolve the source before drafting the script. If the host environment can
safely retrieve a supplied public URL, it may do so. Otherwise plan the smallest
`exa.search` retrieval, obtain approval for that research spend, then run it
with the URL/title and page text enabled. Any optional fresh context must also
be gathered before the script checkpoint; label it as external and preserve the
author's claims separately. Never invent access to a paywalled or private
newsletter.

## Capability selection

Discover and inspect web research, speech and music immediately before use. The
expected launch capabilities are:

- `exa.search` for optional source retrieval or enrichment;
- the narration capability chosen by the documented human bake-off;
- `elevenlabs.music` for one bounded instrumental sting.

The narration choice is a product decision, not an agent preference. Use the
single-voice or dialogue route recorded as the adopted default after comparing:

1. one voice on Eleven Flash;
2. one voice on Eleven v3;
3. two voices stitched from Flash clips;
4. two voices through Eleven v3 dialogue.

If that verdict has not been recorded, stop before generation and run the
bake-off with the human; do not silently select the most expressive or most
expensive option. Dialogue requests are capped at 2,000 characters, so longer
scripts must be split at section boundaries and stitched agent-side.

## Research, then script before audio spend

Before drafting, complete any required Exa source retrieval and optional
context search with the smallest useful result count. Save the run, source text
and citations. Research is useful only when the returned text supports the
script; a non-empty search envelope is not enough.

Produce a broadcast script locally. For a newsletter, use short segments with
spoken transitions; remove visual-only references, expand ambiguous acronyms,
and attribute externally researched facts. Keep the script within the approved
character budget. Do not paraphrase a source into claims it did not make.

Present this checkpoint:

- final script and character count;
- estimated duration;
- narration format and voice ids;
- exact narration chunks;
- music prompt and duration;
- inspected per-unit prices and maximum total USD;
- output choice: MP3 only or MP3 plus agent-side audiogram.

Wait for explicit approval of the script and plan. Any later script, voice,
duration or music change invalidates that approval.

Save state:

```json
{
  "skill": "scrollport-audio-edition",
  "version": 1,
  "status": "awaiting_script_approval",
  "source": {"kind": "newsletter", "ref": "..."},
  "script_sha256": "hex",
  "script_characters": 0,
  "narration": {"capability_id": "...", "chunks": []},
  "music": {"capability_id": "elevenlabs.music", "music_length_ms": 3000},
  "plan": [],
  "completed": [],
  "pending": "human script approval",
  "spent_usd": "0.000000"
}
```

## Generate

### 1. Narration

After approval, run the chosen live narration capability chunk by chunk. Poll
each run to terminal and download its MP3 artifact before starting the next
chunk. Save run id, final cost, artifact reference and script span. On an
uncertain result, poll the same run; never regenerate simply because a download
was slow.

Listen-check or inspect every artifact for non-empty audio, expected duration
and obvious truncation. Pronunciation and performance quality remain a human
judgement for the bake-off and any named-entity-heavy episode.

### 2. Music

Generate one three-second instrumental sting by default. The prompt must state
instrumental, mood and clean ending. Inspect the artifact before use; valid MP3
bytes are not proof that the sting fits the episode.

### 3. Assemble locally

Concatenate narration chunks and place the sting at the opening and/or closing
using local audio tooling. This is agent-side work and creates no scrollport
run. Do not loop the music underneath speech unless the human approved that mix.

For an audiogram, combine the final MP3 with a supplied or locally generated
cover, waveform and timed captions using local tooling. If those tools are not
available, return the MP3 and caption text; do not purchase a video capability
as an undeclared fallback.

## Resume and completion

On resume, verify the saved script hash still matches the approved script, then
poll all non-terminal run ids. Reuse downloaded successful chunks. A completed
episode reports:

- source and any added citations;
- approved script hash, character count and duration;
- narration and music capability ids, run ids and final costs;
- final MP3 path/artifact and optional audiogram path;
- total spend and skipped optional steps.

Completion requires a human-audible, non-truncated episode whose content matches
the approved script. A provider success status alone is insufficient.
