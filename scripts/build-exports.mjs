import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { validateRepository } from "./validate.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = validateRepository(root);
if (errors.length) throw new Error(`Cannot build invalid Skills repository:\n${errors.join("\n")}`);

const out = join(root, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "skills"), { recursive: true });
cpSync(join(root, "docs", "AUTHORING.md"), join(out, "AUTHORING.md"));
cpSync(join(root, "INSTALL.md"), join(out, "INSTALL.md"));

const source = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const published = [];
for (const entry of source.skills.filter((skill) => skill.status === "verified").sort((a, b) => a.id.localeCompare(b.id))) {
  const sourceDir = join(root, entry.path);
  const targetDir = join(out, "skills", entry.id);
  cpSync(sourceDir, targetDir, { recursive: true });
  const manifest = JSON.parse(readFileSync(join(sourceDir, "skill.json"), "utf8"));
  const skillBytes = readFileSync(join(sourceDir, "SKILL.md"));
  published.push({
    ...manifest,
    path: `skills/${entry.id}`,
    source_repository: source.repository,
    source_ref: process.env.SCROLLPORT_SKILLS_REF ?? "working-tree",
    skill_sha256: createHash("sha256").update(skillBytes).digest("hex"),
  });
}

const registry = {
  schema_version: 1,
  source_repository: source.repository,
  source_ref: process.env.SCROLLPORT_SKILLS_REF ?? "working-tree",
  skills: published,
};
writeFileSync(join(out, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Built ${published.length} published Skill export${published.length === 1 ? "" : "s"}.`);
