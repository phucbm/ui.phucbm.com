import {RegistryItem} from "shadcn/schema";

/**
 * Load a registry item for a component.
 * If exampleFileName is provided, tries to load {exampleFileName}.json first,
 * then falls back to registry-item.json if not found.
 */
export async function getRegistryItem(
    name: string,
    exampleFileName?: string
): Promise<RegistryItem> | null {
    if (!name) return null;

    // Try to load example-specific registry item if exampleFileName provided
    if (exampleFileName) {
        try {
            const mod = await import(
                `@/registry/phucbm/blocks/${name}/${exampleFileName}.json`
            );
            return mod.default as RegistryItem;
        } catch (error) {
            // Fall through to load default registry-item.json
        }
    }

    // Load default registry-item.json
    try {
        const mod = await import(`@/registry/phucbm/blocks/${name}/registry-item.json`);
        return mod.default as RegistryItem;
    } catch (error) {
        console.warn(`Registry item not found for: "${name}"`, error);
        return null;
    }
}