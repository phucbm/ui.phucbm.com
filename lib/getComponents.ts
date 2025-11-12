import {getMdxData, getMdxFiles, MdxData} from "@/lib/mdx";
import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryItem} from "shadcn/schema";

export interface Component {
    title: string;
    name: string;
    description: string;
    isNew: boolean | string;
    url: string;
    category?: string;
    tags?: string[];
    mdx: MdxData;
    registry: RegistryItem | null;
}

export async function getComponents(componentsDir: string = "content/components"): Promise<Component[]> {
    const mdxFiles = await getMdxFiles(componentsDir); // returns [{ name, filePath, dir }, ...]

    // Load mdx frontmatter + registry in parallel for each file
    const maybeComponents = await Promise.all(
        mdxFiles.map(async (file) => {
            const [mdxData, registry] = await Promise.all([
                getMdxData(file.dir),       // resolves fileDir -> .mdx/.md and returns content + frontMatter
                getRegistryItem(file.name), // whatever this does in your codebase
            ]);

            if (!mdxData) return null; // skip if file couldn't be read

            const title = mdxData.frontMatter.title || registry?.title || file.name;
            const description = mdxData.frontMatter.description || registry?.description || "";

            const daysAgo = Math.round((Date.now() - mdxData.createdTimestamp) / (1000 * 60 * 60 * 24));
            const isNew = daysAgo <= 3; // new is created in <= 7 days

            return {
                title,
                name: file.name,
                isNew: isNew ? `${daysAgo}d ago` : false,
                url: mdxData.dir.replace('content', ''),
                description,
                category: mdxData.frontMatter.category || '',
                tags: mdxData.frontMatter.tags,
                mdx: mdxData,
                registry: registry ?? null,
            } as Component;
        })
    );

    // Filter out any nulls (failed reads)
    return maybeComponents.filter((c): c is Component => c !== null);
}
