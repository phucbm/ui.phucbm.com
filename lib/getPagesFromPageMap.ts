export function getPagesFromPageMap(pageMapArray: any[], parentTitle?: string): any[] {
    // Extract metadata from the first item
    const metaData = pageMapArray[0]?.data || {};

    // Process all items except the first one (which is metadata)
    return pageMapArray
        .slice(1) // Skip the first item (metadata)
        .filter((item: any) => {
            // Skip items without route
            if (!item.route) return false;

            // Check if this item is marked as hidden in metadata
            const itemMeta = metaData[item.name];
            if (itemMeta?.display === 'hidden') return false;

            // Skip display:hidden from item itself
            return item.display !== 'hidden';
        })
        .flatMap((item: any) => {
            const result = [];

            // Add the page itself
            result.push({
                title: item.title,
                url: item.route,
                parent: parentTitle
            });

            // If item has children, recursively process them
            if (item.children && Array.isArray(item.children)) {
                const childPages = getPagesFromPageMap(item.children, item.title);
                result.push(...childPages);
            }

            return result;
        });
}