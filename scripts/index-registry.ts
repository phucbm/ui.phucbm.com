#!/usr/bin/env ts-node

/**
 * This script is used to build the registry.json file.
 * It is called by the build script.
 * pnpm tsx scripts/build-registry.ts
 * pnpm tsx scripts/build-registry.ts --dry
 * pnpm tsx scripts/build-registry.ts --merge
 */

import {promises as fs} from "fs";
import path from "path";
import url from "url";
import {config} from "dotenv";

// Load environment variables from .env files
config({path: path.resolve(process.cwd(), ".env.local")});
config({path: path.resolve(process.cwd(), ".env")});

interface RegistryFile {
    path: string;
    type?: string;
    target?: string;
}

interface RegistryItem {
    $schema?: string;
    name: string;
    type?: string;
    title?: string;
    description?: string;
    dependencies?: string[];
    registryDependencies?: string[];
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

function getRegistryUrl({name, fileNamePostfix = ''}: { name: string, fileNamePostfix?: string }) {
    const folder = process.env.NEXT_PUBLIC_REGISTRY_FOLDER || "r";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
        throw new Error("NEXT_PUBLIC_SITE_URL environment variable is not set");
    }

    return `${siteUrl}/${folder}/${name}${fileNamePostfix}.json`;
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

async function findExampleFiles(itemDir: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(itemDir, { withFileTypes: true });
        const exampleFiles = entries
            .filter((e) => e.isFile() && /^example.*\.tsx$/.test(e.name))
            .map((e) => e.name)
            .sort(); // Sort to ensure consistent ordering
        return exampleFiles;
    } catch {
        return [];
    }
}

function generateExampleItem(
    baseItem: RegistryItem,
    exampleFileName: string,
    itemDir: string
): RegistryItem {
    // Extract suffix from example file (e.g., "example.tsx" -> "", "example-01.tsx" -> "-01")
    const match = exampleFileName.match(/^example(-.*)?\.tsx$/);
    const suffix = match?.[1] || "";
    const nameSuffix = suffix ? `-example${suffix}` : "-example";
    const titleSuffix = suffix ? ` Example${suffix.replace("-", " ").toUpperCase()}` : " Example";

    // Build the example file path
    const exampleFilePath = path.join(itemDir, exampleFileName);
    const exampleFileRel = path.relative(ROOT, exampleFilePath);

    // Determine target path for example file
    const baseTarget = baseItem.files?.[0]?.target;
    let exampleTarget: string | undefined;
    if (baseTarget) {
        const targetDir = path.dirname(baseTarget);
        const targetExt = path.extname(baseTarget);
        const targetBase = path.basename(baseTarget, targetExt);
        exampleTarget = `${targetDir}/${targetBase}${nameSuffix}${targetExt}`;
    }

    // Create files array: ONLY the example file (not the base component files)
    const files: RegistryFile[] = [
        {
            path: toPosix(exampleFileRel),
            type: baseItem.files?.[0]?.type,
            ...(exampleTarget && { target: exampleTarget }),
        },
    ];

    // Add base registry as registryDependencies using getRegistryUrl
    const registryDependencies: string[] = [
        getRegistryUrl({name: baseItem.name}),
        ...(baseItem.registryDependencies || []),
    ];

    const exampleItem: RegistryItem = {
        ...(baseItem.$schema && { $schema: baseItem.$schema }),
        name: `${baseItem.name}${nameSuffix}`,
        ...(baseItem.type && { type: baseItem.type }),
        title: `${baseItem.title || baseItem.name}${titleSuffix}`,
        ...(baseItem.description && { description: baseItem.description }),
        ...(baseItem.dependencies && { dependencies: [...baseItem.dependencies] }),
        registryDependencies,
        files,
    };

    return exampleItem;
}

async function generateExampleItems(
    baseItem: RegistryItem,
    itemDir: string
): Promise<RegistryItem[]> {
    const exampleFiles = await findExampleFiles(itemDir);
    const exampleItems: RegistryItem[] = [];

    for (const exampleFile of exampleFiles) {
        const exampleItem = generateExampleItem(baseItem, exampleFile, itemDir);
        exampleItems.push(exampleItem);
    }

    return exampleItems;
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
            const normalizedItem = normalizeItemFiles(json, itemDir);

            // Add the base item
            collected.push(normalizedItem);

            // Generate and add example items
            const exampleItems = await generateExampleItems(normalizedItem, itemDir);
            collected.push(...exampleItems);

            if (exampleItems.length > 0) {
                console.log(`📝 Generated ${exampleItems.length} example(s) for "${json.name}"`);
            }
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