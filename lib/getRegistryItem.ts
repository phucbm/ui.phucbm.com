import {RegistryItem} from "shadcn/schema";

/**
 * Load a registry item for a component.
 * If exampleFileName is provided, loads {exampleFileName}.json and merges it with registry-item.json:
 * - Other fields are overridden by example JSON
 * - Files array is merged (example files are added to base files)
 * - Falls back to registry-item.json if example JSON not found
 */
export async function getRegistryItem(
    name: string,
    exampleFileName?: string
): Promise<RegistryItem> | null {
    if (!name) return null;

    // Load default registry-item.json first
    let baseItem: RegistryItem | null = null;
    try {
        const mod = await import(`@/registry/phucbm/blocks/${name}/registry-item.json`);
        baseItem = mod.default as RegistryItem;
    } catch (error) {
        console.warn(`Registry item not found for: "${name}"`, error);
        return null;
    }

    // If no exampleFileName, return base item as-is
    if (!exampleFileName) {
        return baseItem;
    }

    // Try to load example-specific overrides
    try {
        const mod = await import(
            `@/registry/phucbm/blocks/${name}/${exampleFileName}.json`
        );
        const exampleOverrides = mod.default as Partial<RegistryItem>;

        // Merge: base item with example overrides
        // Files array is merged, other fields are overridden
        const merged: RegistryItem = {
            ...baseItem,
            ...exampleOverrides,
            // Merge files arrays instead of replacing
            files: [
                ...(baseItem.files || []),
                ...(exampleOverrides.files || []),
            ],
        };

        return merged;
    } catch (error) {
        // Example JSON doesn't exist - return base item
        return baseItem;
    }
}