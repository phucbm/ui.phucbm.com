import {MetaRecord} from "nextra";
import * as React from "react";
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {getRegistryItem} from "@/lib/getRegistryItem";

interface PageFrontMatter {
    category?: string;
    description?: string;
    title?: string;
    order?: number;
}

interface GroupedPages {
    [category: string]: Array<{
        name: string;
        frontMatter: PageFrontMatter;
        order: number;
    }>;
}

/**
 * Reads all MDX files from the specified directory and generates Nextra meta structure
 * @param componentsDir - Path to the components directory (e.g., 'content/components')
 * @returns Promise<MetaRecord> - Nextra meta structure with categories and pages
 */
export async function getComponentPages(componentsDir: string): Promise<MetaRecord> {
    const result: MetaRecord = {};

    // Read all MDX files
    const fullPath = path.join(process.cwd(), componentsDir);
    const files = await fs.readdir(fullPath);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    // Group pages by category
    const grouped: GroupedPages = {};

    for (const file of mdxFiles) {
        const pageName = file.replace('.mdx', '');
        const filePath = path.join(fullPath, file);

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const {data} = matter(fileContent);
            const frontMatter = data as PageFrontMatter;

            const category = frontMatter.category || 'Other';

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push({
                name: pageName,
                frontMatter,
                order: frontMatter.order ?? 999
            });
        } catch (error) {
            console.error(`Error reading ${file}:`, error);
        }
    }

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort();

    // Build meta structure
    for (const category of sortedCategories) {
        // Add category separator
        result[`---${category}`] = {
            type: 'separator',
            title: category
        };

        // Sort pages by order, then alphabetically
        const sortedPages = grouped[category].sort((a, b) => {
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            return a.name.localeCompare(b.name);
        });

        // Add pages
        for (const page of sortedPages) {
            result[page.name] = await customPageTitle(page.name, page.frontMatter);
        }
    }

    return result;
}

/**
 * Custom page title renderer with description
 */
async function customPageTitle(pageName: string, frontMatter: PageFrontMatter): Promise<React.ReactElement> {
    const registry = await getRegistryItem(pageName);

    return (
        <div className="flex flex-col gap-2">
            <div>{frontMatter.title || registry.title}</div>
        </div>
    );
}