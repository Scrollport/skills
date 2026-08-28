import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateRepository } from "../scripts/validate.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function fixture({ frontmatter = true, secret = false, undeclared = false, mutateManifest } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "scrollport-skill-test-"));
  const skillDir = join(dir, "skills", "fixture-skill");
  mkdirSync(skillDir, { recursive: true });
  const credential = secret ? `sp_${"live"}_${"A".repeat(24)}` : "ordinary-state";
  const dependencyLine = undeclared ? "Use `other.lookup`." : "Use `demo.lookup`.";
  writeFileSync(join(dir, "registry.json"), JSON.stringify({ schema_version: 2, repository: "https://github.com/Scrollport/skills", skills: [{ id: "fixture-skill", path: "skills/fixture-skill", status: "verified", customer_proven: false }] }));
  const manifest = {
    schema_version: 2,
    id: "fixture-skill",
    title: "Fixture Skill",
    version: "1.0.0",
    status: "verified",
    customer_proven: false,
    summary: "Fixture",
    outcome: "Fixture outcome",
    boundary: "Fixture boundary",
    category: "web-research-extraction",
    capabilities: [{ id: "web-search", tool_ids: ["demo.lookup"] }],
    license: "MIT",
    instruction_path: "SKILL.md",
    changelog_path: "CHANGELOG.md",
    dependencies: {
      scrollport_control_tools: ["discover", "inspect", "run", "wallet"],
      catalog_tools: [{ tool_id: "demo.lookup", required: true, purpose: "Fixture lookup" }],
      connected_apps: [],
    },
    inputs: ["Input"],
    outputs: ["Output"],
    cost: { currency: "USD", model: "Per call", trial_safe_max_usd: "0.010000", notes: "Fixture" },
    approvals: ["Approve cost"],
    compatibility: ["Agent Skills host"],
    evidence: { verified_at: "2026-08-27", review_due_at: "2026-09-27", summary_path: "EVIDENCE.md", customer_proof_path: null },
  };
  mutateManifest?.(manifest);
  writeFileSync(join(skillDir, "skill.json"), JSON.stringify(manifest));
  const yaml = frontmatter ? "---\nname: fixture-skill\ndescription: Run a fixture lookup when testing independent Skill installation.\nlicense: MIT\n---\n" : "";
  writeFileSync(join(skillDir, "SKILL.md"), `${yaml}# Fixture\n\nCall discover, inspect, run and wallet. ${dependencyLine}\n\nState: ${credential}\n`);
  writeFileSync(join(skillDir, "CHANGELOG.md"), "# Changelog\n");
  writeFileSync(join(skillDir, "EVIDENCE.md"), "# Evidence\n");
  return dir;
}

test("the canonical repository satisfies its publication contract", () => {
  assert.deepEqual(validateRepository(root), []);
});

test("the generated export includes the shared installation guide", () => {
  const install = readFileSync(join(root, "INSTALL.md"), "utf8");
  assert(install.includes("https://scrollport.com/start"));
  assert(install.includes("one unique match in `aliases`"));
  assert(readFileSync(join(root, "scripts", "build-exports.mjs"), "utf8").includes('join(out, "INSTALL.md")'));
});

test("runtime Skills use GitHub manifests as their only version authority", () => {
  const source = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
  for (const entry of source.skills) {
    const instruction = readFileSync(join(root, entry.path, entry.status === "verified" ? "SKILL.md" : "DRAFT.md"), "utf8");
    assert(!instruction.includes("scrollport-version:"), `${entry.id} repeats its canonical version`);
    assert(!instruction.includes("AUTHORING.md"), `${entry.id} loads maintainer-only authoring guidance`);
  }
});

test("generated runtime packages exclude maintainer provenance", () => {
  const build = readFileSync(join(root, "scripts", "build-exports.mjs"), "utf8");
  assert(!build.includes('join(out, "AUTHORING.md")'));
  assert(!build.includes("cpSync(sourceDir, targetDir, { recursive: true })"));
  assert(build.includes('for (const runtimeDirectory of ["assets", "references", "scripts"])'));
});

test("a complete fixture Skill validates independently", () => {
  assert.deepEqual(validateRepository(fixture()), []);
});

test("malformed frontmatter is rejected", () => {
  assert(validateRepository(fixture({ frontmatter: false })).some((error) => error.includes("YAML frontmatter")));
});

test("secret-bearing instructions are rejected", () => {
  assert(validateRepository(fixture({ secret: true })).some((error) => error.includes("Scrollport credential")));
});

test("undeclared catalog dependencies are rejected", () => {
  assert(validateRepository(fixture({ undeclared: true })).some((error) => error.includes("undeclared catalog tool other.lookup")));
});

test("non-canonical Skill categories are rejected", () => {
  assert(validateRepository(fixture({ mutateManifest: (manifest) => { manifest.category = "miscellaneous"; } })).some((error) => error.includes("canonical Scrollport category")));
});

test("capabilities cannot reference undeclared catalog tools", () => {
  assert(validateRepository(fixture({ mutateManifest: (manifest) => { manifest.capabilities[0].tool_ids = ["other.lookup"]; } })).some((error) => error.includes("references undeclared catalog tool other.lookup")));
});

test("every catalog dependency must have a capability association", () => {
  assert(validateRepository(fixture({ mutateManifest: (manifest) => { manifest.capabilities[0].tool_ids = ["demo.lookup"]; manifest.dependencies.catalog_tools.push({ tool_id: "extra.lookup", required: false, purpose: "Extra lookup" }); } })).some((error) => error.includes("catalog dependency extra.lookup has no capability association")));
});

test("duplicate capability declarations are rejected", () => {
  assert(validateRepository(fixture({ mutateManifest: (manifest) => { manifest.capabilities.push({ id: "web-search", tool_ids: ["demo.lookup"] }); } })).some((error) => error.includes("duplicate capability web-search")));
});

test("build output excludes candidates", () => {
  const source = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
  assert(source.skills.some((entry) => entry.status === "draft"));
  assert(!source.skills.filter((entry) => entry.status === "verified").some((entry) => entry.path.startsWith("candidates/")));
});

test("the first five Skills retain their evidence-based dispositions", () => {
  const source = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
  assert.deepEqual(
    source.skills.map(({ id, status, customer_proven }) => ({ id, status, customer_proven })),
    [
      { id: "scrollport-organic-opportunity-map", status: "verified", customer_proven: false },
      { id: "scrollport-qualified-accounts", status: "verified", customer_proven: false },
      { id: "scrollport-evidence-led-content-brief", status: "verified", customer_proven: false },
      { id: "scrollport-audio-edition", status: "verified", customer_proven: false },
      { id: "scrollport-prospecting", status: "draft", customer_proven: false },
    ],
  );
});

test("qualified accounts keeps the former package id as a scalable v2 alias", () => {
  const manifest = JSON.parse(readFileSync(join(root, "skills", "scrollport-qualified-accounts", "skill.json"), "utf8"));
  assert.equal(manifest.version, "2.0.0");
  assert(manifest.aliases.includes("scrollport-qualified-accounts-weekly"));
  assert(manifest.inputs.some((input) => input.includes("target number")));
  assert(manifest.inputs.some((input) => input.includes("maximum total research spend")));
});
