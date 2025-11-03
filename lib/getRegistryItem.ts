// lib/getRegistryItem.ts (runs client or server; no Node APIs)
export interface RegistryItem {
    name: string;
    description: string;
    title: string;
    files: {
        path: string;
        type: string;
        target: string;
    }[];
    dependencies?: string[]
}

export async function getRegistryItem(name: string) {
    if (!name) {
        return {
            name: "unnamed-registry",
            title: "Unnamed Registry",
            description: "",
            files: []
        };
    }

    const mod = await import(
        `@/registry/phucbm/blocks/${name}/registry-item.json`
        );
    return mod.default as RegistryItem;
}
