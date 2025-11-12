import {MetaRecord} from "nextra";
import * as React from "react";
import {getRegistryItem} from "@/lib/getRegistryItem";
import {IconDeviceGamepad} from "@tabler/icons-react";
import {getComponentMdxFiles} from "@/lib/getComponentMdxFiles";

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
export async function getComponentPages(componentsDir: string = 'content/components'): Promise<MetaRecord> {
    const result: MetaRecord = {};

    // Get raw MDX data
    const mdxData = await getComponentMdxFiles(componentsDir);

    // Group pages by category
    const grouped: GroupedPages = {};

    for (const {name: pageName, frontMatter} of mdxData) {
        const category = frontMatter.category || 'Other';

        if (!grouped[category]) {
            grouped[category] = [];
        }

        grouped[category].push({
            name: pageName,
            frontMatter,
            order: frontMatter.order ?? 999
        });
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
    const isPlayground = frontMatter['tags'] && Array.from(frontMatter['tags']).includes('playground');

    return (
        <div className="flex justify-between gap-2 [aside_&]:pr-[40px] relative w-full">
            <div>{frontMatter.title || registry.title}</div>
            <div className="hidden [aside_&]:flex absolute top-0 right-0 bottom-0 w-[40px] items-center justify-end">
                {isPlayground && <IconDeviceGamepad className="w-5 text-brand"/>}
            </div>
        </div>
    );
}