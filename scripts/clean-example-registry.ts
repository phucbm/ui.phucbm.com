#!/usr/bin/env ts-node

/**
 * Cleanup script to remove generated/transformed example files
 * Usage:
 * pnpm clean-example-registry
 * pnpm tsx scripts/clean-example-registry.ts --dry (preview what will be deleted)
 */

import { promises as fs } from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_DIR = path.join(ROOT, "registry");
const REGISTRY_OUTPUT_DIR = path.join(ROOT, "public/r");

const argv = new Set(process.argv.slice(2));
const isDry = argv.has("--dry");

interface CleanupStats {
    transformedFiles: number;
    outputFiles: number;
    totalSize: number;
}

async function findTransformedFiles(dir: string): Promise<string[]> {
    const hits: string[] = [];

    async function walk(d: string) {
        try {
            const entries = await fs.readdir(d, { withFileTypes: true });
            for (const e of entries) {
                const full = path.join(d, e.name);
                if (e.isDirectory()) {
                    await walk(full);
                } else if (e.isFile() && e.name.endsWith(".transformed.tsx")) {
                    hits.push(full);
                }
            }
        } catch (err) {
            // Skip directories we can't read
        }
    }

    await walk(dir);
    return hits;
}

async function findOutputFiles(dir: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        return entries
            .filter((e) => e.isFile() && e.name.endsWith(".json"))
            .map((e) => path.join(dir, e.name));
    } catch {
        return [];
    }
}

async function getFileSize(filePath: string): Promise<number> {
    try {
        const stats = await fs.stat(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

async function deleteFile(filePath: string): Promise<void> {
    try {
        await fs.unlink(filePath);
    } catch (err) {
        console.error(`Failed to delete ${filePath}:`, err);
    }
}

async function main() {
    console.log("🔍 Scanning for transformed example files...\n");

    const stats: CleanupStats = {
        transformedFiles: 0,
        outputFiles: 0,
        totalSize: 0,
    };

    // Find transformed files in registry directory
    const transformedFiles = await findTransformedFiles(REGISTRY_DIR);
    stats.transformedFiles = transformedFiles.length;

    if (transformedFiles.length > 0) {
        console.log(`📄 Found ${transformedFiles.length} transformed example file(s):`);
        for (const file of transformedFiles) {
            const size = await getFileSize(file);
            stats.totalSize += size;
            console.log(`   - ${path.relative(ROOT, file)} (${formatBytes(size)})`);
        }
        console.log();
    }

    if (transformedFiles.length === 0) {
        console.log("✨ No transformed example files found. Nothing to clean!");
        return;
    }

    console.log(`📊 Summary:`);
    console.log(`   - Transformed example files: ${stats.transformedFiles}`);
    console.log(`   - Total size: ${formatBytes(stats.totalSize)}`);
    console.log();

    if (isDry) {
        console.log("🔍 DRY RUN - No files were deleted");
        console.log("   Run without --dry flag to delete these files");
    } else {
        console.log("🗑️  Deleting transformed example files...\n");

        // Delete transformed files only
        for (const file of transformedFiles) {
            await deleteFile(file);
            console.log(`   ✓ Deleted ${path.relative(ROOT, file)}`);
        }

        console.log();
        console.log(`✅ Cleanup complete! Deleted ${transformedFiles.length} file(s) (${formatBytes(stats.totalSize)})`);
    }
}

main().catch((err) => {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
});