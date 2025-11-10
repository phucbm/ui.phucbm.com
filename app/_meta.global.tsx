import {MetaRecord} from "nextra";
import * as React from "react";
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import {getRegistryItem} from "@/lib/getRegistryItem";

const pages = {
    'Text': ['text-ripple', 'text-flower'],
    'Image': ['infinite-grid', 'infinite-image-carousel'],
    'Mouse Interaction': ['magnetic', 'shimmer-layer'],
    'Border': ['moving-border'],
    'SVG': ['draw-svg'],
};
const COMPONENTS: MetaRecord = await getPagesList(pages, {sortCategories: true, sortPages: true});


export default {
    components: {
        type: 'doc',
        title: 'Components',
        items: COMPONENTS
    },
    dev: {
        type: 'page',
        display: 'hidden'
    }
}


// Helpers
async function getPagesList(
    pages: Record<string, string[]>,
    options?: {
        sortCategories?: boolean;
        sortPages?: boolean;
    }
): Promise<MetaRecord> {
    const result: MetaRecord = {};

    // Get categories, optionally sorted
    const categories = options?.sortCategories
        ? Object.keys(pages).sort()
        : Object.keys(pages);

    for (const category of categories) {
        // Add separator for the category
        result[`---${category}`] = {
            type: 'separator',
            title: category
        };

        // Get pages, optionally sorted
        const pageList = options?.sortPages
            ? [...pages[category]].sort()
            : pages[category];

        for (const page of pageList) {
            result[page] = await customPage(page);
        }
    }

    return result;
}

// Get frontmatter by reading file directly
async function getFrontMatter(pageName: string) {
    try {
        const filePath = path.join(process.cwd(), 'content/components', `${pageName}.mdx`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const {data} = matter(fileContent);
        return data;
    } catch (error) {
        console.error(`Error reading frontmatter for ${pageName}:`, error);
        return null;
    }
}

// Custom page title renderer - automatically applied to all pages
async function customPage(pageName: string): Promise<React.ReactElement> {
    const registry = await getRegistryItem(pageName);
    const frontMatter = await getFrontMatter(pageName);
    console.log('frontMatter', frontMatter)

    return (
        <div className="flex flex-col gap-2">
            <div>{registry.title}</div>
            {frontMatter?.description && <div className="text-sm">{frontMatter.description}</div>}
        </div>
    );
}