export function getRegistryUrl({name, fileNamePostfix = ''}: { name: string, fileNamePostfix?: string }) {
    const folder = process.env.NEXT_PUBLIC_REGISTRY_FOLDER || "r";

    // point to example of the registry so v0 can deploy with full demo
    return `${process.env.NEXT_PUBLIC_SITE_URL}/${folder}/${name}${fileNamePostfix}.json`;
}