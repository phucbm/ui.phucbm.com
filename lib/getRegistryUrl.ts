export function getRegistryUrl({name}: { name: string }) {
    const folder = process.env.NEXT_PUBLIC_REGISTRY_FOLDER || "r";
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${folder}/${name}.json`;

    return url;
}