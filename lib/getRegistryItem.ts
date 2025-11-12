import {RegistryItem} from "shadcn/schema";

export async function getRegistryItem(name: string): Promise<RegistryItem> | null {
    if (!name) return null;

    try {
        const mod = await import(`@/registry/phucbm/blocks/${name}/registry-item.json`);
        return mod.default as RegistryItem;
    } catch (error) {
        console.warn(`Registry item not found for: ${name}`, error);
        return null;
    }
}