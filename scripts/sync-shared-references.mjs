import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = readFileSync(join(root, "docs", "AUTHORING.md"), "utf8");
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const check = process.argv.includes("--check");
let stale = false;

for (const entry of registry.skills.filter((skill) => skill.status === "verified")) {
  const target = join(root, entry.path, "references", "AUTHORING.md");
  if (existsSync(target) && readFileSync(target, "utf8") === source) continue;
  if (check) {
    console.error(`${entry.id}: references/AUTHORING.md is missing or stale; run npm run sync`);
    stale = true;
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, source);
    console.log(`Updated ${entry.id}/references/AUTHORING.md`);
  }
}

if (stale) process.exitCode = 1;
