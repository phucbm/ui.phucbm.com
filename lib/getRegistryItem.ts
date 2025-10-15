// lib/getRegistryItem.ts (runs client or server; no Node APIs)
export interface RegistryItem {
    name: string;
    description: string;
    title: string;
}

export async function getRegistryItem(name: string) {
    if (!name) {
        return {
            name: "unnamed-registry",
            title: "Unnamed Registry",
            description: "",
        };
    }

    const mod = await import(
        `@/registry/perxel/blocks/${name}/registry-item.json`
        );
    return mod.default as RegistryItem;
}
