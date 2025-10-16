export function getDocsUrl({mdxPath}: { mdxPath: string[] }) {
    const path = mdxPath.filter(Boolean).join("/");
    const base = process.env.NEXT_PUBLIC_LIVE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;

    return `${base}/${path}`;
}