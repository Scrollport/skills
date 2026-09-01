import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const instruction = readFileSync(resolve(root, "skills/scrollport/SKILL.md"), "utf8");

test("publishes one current five-tool control Skill", () => {
  assert.match(instruction, /^---\nname: scrollport\nversion: 2026-09-01\n/);
  for (const tool of ["apps", "discover", "inspect", "run", "wallet"]) {
    assert.match(instruction, new RegExp(`\\*\\*${tool}\\*\\*`));
  }
  assert.match(instruction, /native Skill discovery/);
  assert.match(instruction, /https:\/\/scrollport\.com\/skill/);
});
