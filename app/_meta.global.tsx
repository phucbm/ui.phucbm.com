import {MetaRecord} from "nextra";

const pages = {
    'Text': ['text-ripple', 'text-flower'],
    'Image': ['infinite-grid', 'image-carousel'],
    'Mouse Interaction': ['magnetic'],
    'Border': ['moving-border'],
};
const COMPONENTS: MetaRecord = getPagesList(pages, {sortCategories: true, sortPages: true});


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
function getPagesList(
    pages: Record<string, string[]>,
    options?: {
        sortCategories?: boolean;
        sortPages?: boolean;
    }
): MetaRecord {
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
            result[page] = '';
        }
    }

    return result;
}