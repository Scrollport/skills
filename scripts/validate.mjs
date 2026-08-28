import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const SKILL_CATEGORIES = new Set([
  "leads-prospecting",
  "media-creation",
  "seo-search",
  "web-research-extraction",
  "finance",
  "ecommerce",
  "social-media",
  "connected-apps",
]);
const CONTROL_TOOLS = new Set(["apps", "discover", "inspect", "run", "wallet"]);
const NON_TOOL_DOTTED_TERMS = new Set(["usage.meta", "provider.action"]);
const SECRET_PATTERNS = [
  [/sp_(?:live|at|rt|oc)_[A-Za-z0-9_-]{8,}/g, "Scrollport credential"],
  [/spdc_[A-Za-z0-9_-]{8,}/g, "Scrollport device code"],
  [/gh[pousr]_[A-Za-z0-9]{20,}/g, "GitHub credential"],
  [/AIza[0-9A-Za-z_-]{30,}/g, "Google API key"],
  [/sk-(?:live-)?[A-Za-z0-9_-]{20,}/g, "secret key"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, "private key"],
  [/(?:client_secret|refresh_token)\s*[:=]\s*["']?[A-Za-z0-9._-]{12,}/gi, "OAuth secret"],
];

function listFiles(root) {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if ([".git", "dist", "node_modules"].includes(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else found.push(path);
    }
  };
  walk(root);
  return found.sort();
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const raw = text.slice(4, end);
  const scalar = (name) => {
    const match = new RegExp(`^${name}:\\s*(.+)$`, "m").exec(raw);
    return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? null;
  };
  return { name: scalar("name"), description: scalar("description"), license: scalar("license") };
}

function validateLinks(file, root, errors) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, "");
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    const withoutAnchor = target.split("#", 1)[0];
    if (!withoutAnchor) continue;
    const resolved = resolve(dirname(file), decodeURIComponent(withoutAnchor));
    if (!resolved.startsWith(`${root}/`) && resolved !== root) {
      errors.push(`${relative(root, file)}: relative link escapes the repository: ${target}`);
    } else if (!existsSync(resolved)) {
      errors.push(`${relative(root, file)}: missing relative link target: ${target}`);
    }
  }
}

function validateManifest(root, entry, errors) {
  if (!SKILL_ID.test(entry.id ?? "")) errors.push(`registry: invalid skill id ${entry.id}`);
  if (!entry.path || !existsSync(join(root, entry.path))) {
    errors.push(`registry: missing path for ${entry.id}: ${entry.path}`);
    return;
  }
  const pathKind = entry.status === "verified" ? "skills/" : "candidates/";
  if (!entry.path.startsWith(pathKind)) {
    errors.push(`${entry.id}: ${entry.status} entries must live under ${pathKind}`);
  }
  const manifestPath = join(root, entry.path, "skill.json");
  if (!existsSync(manifestPath)) {
    errors.push(`${entry.id}: missing skill.json`);
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`${entry.id}: invalid skill.json: ${error.message}`);
    return;
  }

  const requiredStrings = ["id", "title", "version", "status", "summary", "outcome", "boundary", "license", "instruction_path", "changelog_path"];
  for (const field of requiredStrings) {
    if (typeof manifest[field] !== "string" || manifest[field].length === 0) {
      errors.push(`${entry.id}: ${field} must be a non-empty string`);
    }
  }
  if (manifest.schema_version !== 2) errors.push(`${entry.id}: schema_version must be 2`);
  if (manifest.id !== entry.id) errors.push(`${entry.id}: manifest id does not match registry`);
  if (manifest.status !== entry.status) errors.push(`${entry.id}: manifest status does not match registry`);
  if (manifest.customer_proven !== entry.customer_proven) errors.push(`${entry.id}: customer_proven does not match registry`);
  if (!SEMVER.test(manifest.version ?? "")) errors.push(`${entry.id}: version must be semantic x.y.z`);
  if (manifest.license !== "MIT") errors.push(`${entry.id}: license must be MIT`);
  if (!SKILL_CATEGORIES.has(manifest.category)) errors.push(`${entry.id}: category must be a canonical Scrollport category`);

  const instruction = join(root, entry.path, manifest.instruction_path ?? "");
  const changelog = join(root, entry.path, manifest.changelog_path ?? "");
  if (!existsSync(instruction)) errors.push(`${entry.id}: missing instruction file ${manifest.instruction_path}`);
  if (!existsSync(changelog)) errors.push(`${entry.id}: missing changelog ${manifest.changelog_path}`);

  if (entry.status === "verified") {
    if (manifest.instruction_path !== "SKILL.md") errors.push(`${entry.id}: verified instruction must be SKILL.md`);
    if (!manifest.evidence?.verified_at || !manifest.evidence?.review_due_at || !manifest.evidence?.summary_path) {
      errors.push(`${entry.id}: verified skills require dated evidence and a review due date`);
    }
  } else {
    if (existsSync(join(root, entry.path, "SKILL.md"))) errors.push(`${entry.id}: draft candidates must not contain SKILL.md`);
    if (manifest.instruction_path === "SKILL.md") errors.push(`${entry.id}: draft instruction cannot be installable`);
  }
  if (manifest.customer_proven && (!manifest.evidence?.customer_proof_path || manifest.status !== "verified")) {
    errors.push(`${entry.id}: customer-proven requires a Verified Skill and a proof path`);
  }

  for (const evidenceField of ["summary_path", "customer_proof_path"]) {
    const evidencePath = manifest.evidence?.[evidenceField];
    if (evidencePath && !existsSync(join(root, entry.path, evidencePath))) {
      errors.push(`${entry.id}: missing ${evidenceField} ${evidencePath}`);
    }
  }

  const deps = manifest.dependencies;
  if (!deps || !Array.isArray(deps.scrollport_control_tools) || !Array.isArray(deps.catalog_tools) || !Array.isArray(deps.connected_apps)) {
    errors.push(`${entry.id}: dependencies must declare control tools, catalog tools and connected apps`);
    return;
  }
  const declaredControls = new Set(deps.scrollport_control_tools);
  for (const tool of declaredControls) {
    if (!CONTROL_TOOLS.has(tool)) errors.push(`${entry.id}: unknown Scrollport control tool ${tool}`);
  }
  const declaredCatalog = new Set();
  for (const dependency of deps.catalog_tools) {
    if (!dependency || typeof dependency.tool_id !== "string" || !dependency.tool_id.includes(".") || typeof dependency.required !== "boolean" || !dependency.purpose) {
      errors.push(`${entry.id}: malformed catalog dependency`);
    } else if (declaredCatalog.has(dependency.tool_id)) {
      errors.push(`${entry.id}: duplicate catalog dependency ${dependency.tool_id}`);
    } else {
      declaredCatalog.add(dependency.tool_id);
    }
  }

  if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
    errors.push(`${entry.id}: capabilities must declare at least one canonical capability`);
  } else {
    const declaredCapabilities = new Set();
    const associatedCatalog = new Set();
    for (const capability of manifest.capabilities) {
      if (!capability || !SKILL_ID.test(capability.id ?? "") || !Array.isArray(capability.tool_ids) || capability.tool_ids.length === 0) {
        errors.push(`${entry.id}: malformed capability association`);
        continue;
      }
      if (declaredCapabilities.has(capability.id)) errors.push(`${entry.id}: duplicate capability ${capability.id}`);
      declaredCapabilities.add(capability.id);
      const capabilityTools = new Set();
      for (const toolId of capability.tool_ids) {
        if (capabilityTools.has(toolId)) errors.push(`${entry.id}: duplicate tool ${toolId} for capability ${capability.id}`);
        capabilityTools.add(toolId);
        associatedCatalog.add(toolId);
        if (!declaredCatalog.has(toolId)) errors.push(`${entry.id}: capability ${capability.id} references undeclared catalog tool ${toolId}`);
      }
    }
    for (const toolId of declaredCatalog) {
      if (!associatedCatalog.has(toolId)) errors.push(`${entry.id}: catalog dependency ${toolId} has no capability association`);
    }
  }

  if (!existsSync(instruction)) return;
  const instructions = readFileSync(instruction, "utf8");
  if (entry.status === "verified") {
    const frontmatter = parseFrontmatter(instructions);
    if (!frontmatter) errors.push(`${entry.id}: SKILL.md needs YAML frontmatter`);
    else {
      if (frontmatter.name !== entry.id) errors.push(`${entry.id}: frontmatter name must match directory`);
      if (!frontmatter.description || frontmatter.description.length > 1024) errors.push(`${entry.id}: frontmatter description must be 1-1024 characters`);
      if (frontmatter.license !== "MIT") errors.push(`${entry.id}: frontmatter license must be MIT`);
    }
    if (instructions.split("\n").length > 500) errors.push(`${entry.id}: SKILL.md exceeds 500 lines`);
  }

  for (const match of instructions.matchAll(/`([a-z][a-z0-9-]*\.[a-z][a-z0-9._-]*)`/g)) {
    const toolId = match[1];
    if (!NON_TOOL_DOTTED_TERMS.has(toolId) && !declaredCatalog.has(toolId)) {
      errors.push(`${entry.id}: instruction names undeclared catalog tool ${toolId}`);
    }
  }
  for (const tool of CONTROL_TOOLS) {
    if (new RegExp(`\\b${tool}\\b`).test(instructions) && !declaredControls.has(tool)) {
      errors.push(`${entry.id}: instruction uses undeclared control tool ${tool}`);
    }
  }
}

export function validateRepository(rootPath) {
  const root = resolve(rootPath);
  const errors = [];
  const registryPath = join(root, "registry.json");
  if (!existsSync(registryPath)) return ["missing registry.json"];

  let registry;
  try {
    registry = JSON.parse(readFileSync(registryPath, "utf8"));
  } catch (error) {
    return [`invalid registry.json: ${error.message}`];
  }
  if (registry.schema_version !== 2 || !Array.isArray(registry.skills)) errors.push("registry: unsupported schema or missing skills array");
  const seen = new Set();
  for (const entry of registry.skills ?? []) {
    if (seen.has(entry.id)) errors.push(`registry: duplicate id ${entry.id}`);
    seen.add(entry.id);
    validateManifest(root, entry, errors);
  }

  for (const file of listFiles(root)) {
    const rel = relative(root, file);
    if (rel.startsWith("candidates/") && file.endsWith("/SKILL.md")) {
      errors.push(`${rel}: candidates cannot be client-discoverable`);
    }
    if (file.endsWith(".md")) validateLinks(file, root, errors);
    if (/\.(?:md|json|ya?ml|mjs|js|ts|tsx|sh)$/i.test(file)) {
      const text = readFileSync(file, "utf8");
      for (const [pattern, label] of SECRET_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) errors.push(`${rel}: possible ${label}`);
      }
    }
  }
  return [...new Set(errors)].sort();
}

function main() {
  const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
  const errors = validateRepository(root);
  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error}`);
    process.exitCode = 1;
  } else {
    const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
    const published = registry.skills.filter((skill) => skill.status === "verified").length;
    console.log(`Validated ${registry.skills.length} entries; ${published} published.`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
