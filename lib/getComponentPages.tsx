import {MetaRecord} from "nextra";
import {getComponents} from "@/lib/getComponents";
import {PageFrontMatter} from "@/lib/mdx";
import {SidebarCustomItem} from "@/components/sidebar-custom-item";

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
    const components = await getComponents(componentsDir);

    // Group pages by category
    const grouped: GroupedPages = {};

    for (const {mdx, name} of components) {
        const category = mdx.frontMatter.category || 'Other';

        if (!grouped[category]) {
            grouped[category] = [];
        }

        grouped[category].push({
            name: name,
            frontMatter: mdx.frontMatter,
            order: mdx.frontMatter.order ?? 999
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
            const component = components.find(c => c.name === page.name);
            if (component) {
                result[page.name] = SidebarCustomItem(component);
            }
        }
    }

    return result;
}