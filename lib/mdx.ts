import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {getLastCommitTime} from "@/lib/getLastCommitTime";
import {formatDate} from "@/lib/formatDate";
import {getCreatedTime} from "@/lib/getFileCreatedTime";

export interface MdxFile {
    name: string;
    filePath: string; // absolute path to the file
    dir: string;      // the input path (without extension), e.g. 'content/components/text-ripple'
}

export interface PageFrontMatter {
    category?: string;
    tags?: string[];
    description?: string;
    title?: string;
    order?: number;
}

export interface MdxData {
    name: string;
    filePath: string;
    content: string;
    frontMatter: PageFrontMatter;
    /** last updated time */
    timestamp: number;
    lastUpdatedTime: string;
    /** created time */
    createdTimestamp: number;
    createdTime: string;
}

/**
 * Try to resolve a file path without extension to a real file (.mdx or .md).
 * Accepts inputs like 'content/components/text-ripple' and returns MdxFile or null.
 */
export async function getMdxFile(fileDir: string): Promise<MdxFile | null> {
    const exts = ['.mdx', '.md'];
    const base = path.join(process.cwd(), fileDir);

    for (const ext of exts) {
        const candidate = `${base}${ext}`;
        try {
            // Attempt to stat/read the file to confirm it exists
            await fs.access(candidate);
            return {
                name: path.basename(candidate, ext),
                filePath: candidate,
                dir: fileDir,
            };
        } catch {
            // try next extension
        }
    }

    return null;
}

/**
 * Scan a directory that contains .mdx/.md files and return an array of MdxFile items.
 * The returned items have the same shape as getMdxFile returns.
 *
 * Example:
 *  getMdxFiles('content/components')
 *  -> will look for files like content/components/text-ripple.mdx
 */
export async function getMdxFiles(dir: string = 'content/components'): Promise<MdxFile[]> {
    const fullPath = path.join(process.cwd(), dir);
    let entries: string[];

    try {
        entries = await fs.readdir(fullPath);
    } catch (err) {
        // directory doesn't exist or not readable
        return [];
    }

    const results: MdxFile[] = [];

    for (const entry of entries) {
        // only consider files with .mdx or .md extension
        const match = entry.match(/^(.*)\.(mdx|md)$/i);
        if (!match) continue;

        const basename = match[1]; // e.g. 'text-ripple'
        if (basename === 'index') continue; // skip index.mdx

        const resolved = await getMdxFile(path.join(dir, basename));
        if (resolved) results.push(resolved);
    }

    return results;
}

/**
 * Read file content + frontMatter using getMdxFile to resolve the file.
 */
export async function getMdxData(fileDir: string): Promise<MdxData | null> {
    try {
        const file = await getMdxFile(fileDir);
        if (!file) return null;

        const raw = await fs.readFile(file.filePath, 'utf-8');
        const {data, content} = matter(raw);


        // Example usage:
        const time = getLastCommitTime(file.filePath);
        const createdTime = getCreatedTime(file.filePath);

        return {
            name: file.name,
            filePath: file.filePath,
            content,
            frontMatter: data as PageFrontMatter,
            timestamp: time,
            lastUpdatedTime: formatDate(time),
            createdTimestamp: createdTime,
            createdTime: formatDate(createdTime)
        };
    } catch (error) {
        console.error(`Error reading MDX from ${fileDir}:`, error);
        return null;
    }
}


/**
 * Get content + frontMatter for all MDX files under `content/components`
 * (or any directory if you pass one)
 */
export async function getAllMdxData(dir: string = "content/components"): Promise<MdxData[]> {
    const mdxFiles = await getMdxFiles(dir); // [{ name, filePath, dir }, ...]

    const all = await Promise.all(
        mdxFiles.map(async (file) => {
            return await getMdxData(file.dir);
        })
    );

    // filter out null results
    return all.filter((d): d is MdxData => d !== null);
}