import {getMdxData, getMdxFiles, MdxData} from "@/lib/mdx";
import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryItem} from "shadcn/schema";

export interface Component {
    title: string;
    name: string;
    description: string;
    isNew: boolean;
    url: string;
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

            const NEW_DAYS_MS = (day = 3) => day * 24 * 60 * 60 * 1000; // 259200000
            const isNew = Date.now() - mdxData.createdTimestamp < NEW_DAYS_MS(7); // created in <= 3 days

            return {
                title,
                name: file.name,
                isNew,
                url: mdxData.dir.replace('content', ''),
                description,
                mdx: mdxData,
                registry: registry ?? null,
            } as Component;
        })
    );

    // Filter out any nulls (failed reads)
    return maybeComponents.filter((c): c is Component => c !== null);
}
