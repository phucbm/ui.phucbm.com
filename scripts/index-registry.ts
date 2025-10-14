#!/usr/bin/env ts-node

/**
 * This script is used to build the registry.json file.
 * It is called by the build script.
 * pnpm tsx scripts/build-registry.ts
 * pnpm tsx scripts/build-registry.ts --dry
 * pnpm tsx scripts/build-registry.ts --merge
 */

import { promises as fs } from "fs";
import path from "path";
import url from "url";

interface RegistryFile {
  path: string;
  type?: string;
}

interface RegistryItem {
  $schema?: string;
  name: string;
  type?: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  files?: RegistryFile[];
}

interface RegistryRoot {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_DIR = path.join(ROOT, "registry");
const REGISTRY_JSON = path.join(ROOT, "registry.json");

const argv = new Set(process.argv.slice(2));
const isDry = argv.has("--dry");
const isMerge = argv.has("--merge");

function toPosix(p: string) {
  return p.split(path.sep).join("/");
}

async function walkForRegistryItems(dir: string): Promise<string[]> {
  const hits: string[] = [];
  async function walk(d: string) {
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name === "registry-item.json") {
        hits.push(full);
      }
    }
  }
  await walk(dir);
  return hits;
}

function normalizeItemFiles(item: RegistryItem, itemDir: string): RegistryItem {
  if (!Array.isArray(item.files)) return item;

  item.files = item.files.map((f) => {
    const out = { ...f };
    if (out.path && !out.path.startsWith("registry/")) {
      const abs = path.resolve(itemDir, out.path);
      const rel = path.relative(ROOT, abs);
      out.path = toPosix(rel);
    } else if (out.path) {
      out.path = toPosix(out.path);
    }
    return out;
  });

  return item;
}

function dedupeByName(items: RegistryItem[]): RegistryItem[] {
  const map = new Map<string, RegistryItem>();
  for (const it of items) {
    if (!it?.name) continue;
    map.set(it.name, it); // last one wins
  }
  return Array.from(map.values());
}

async function readJsonSafe<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function main() {
  const files = await walkForRegistryItems(REGISTRY_DIR);
  const collected: RegistryItem[] = [];

  for (const file of files) {
    try {
      const json = await readJsonSafe<RegistryItem>(file, {} as RegistryItem);
      if (!json.name) {
        console.warn(`⚠️  Skip ${path.relative(ROOT, file)} (missing "name")`);
        continue;
      }
      const itemDir = path.dirname(file);
      collected.push(normalizeItemFiles(json, itemDir));
    } catch (err: any) {
      console.error(`❌ Failed to read ${file}:`, err.message);
    }
  }

  let items = dedupeByName(collected).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const existing = await readJsonSafe<Partial<RegistryRoot>>(REGISTRY_JSON, {});
  const base: RegistryRoot = {
    $schema:
      existing.$schema ?? "https://ui.shadcn.com/schema/registry.json",
    name: existing.name ?? "perxel",
    homepage: existing.homepage ?? "https://ui.perxel.com",
    items: [],
  };

  if (isMerge && Array.isArray(existing.items)) {
    const byName = new Map(
      existing.items.map((i: RegistryItem) => [i.name, i])
    );
    for (const it of items) byName.set(it.name, it);
    items = Array.from(byName.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const output: RegistryRoot = { ...base, items };
  const pretty = JSON.stringify(output, null, 2) + "\n";

  if (isDry) {
    console.log(pretty);
  } else {
    await fs.writeFile(REGISTRY_JSON, pretty, "utf8");
    console.log(
      `✅ registry.json updated with ${items.length} items from ${files.length} sources`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
