import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface PageFrontMatter {
    category?: string;
    description?: string;
    title?: string;
    order?: number;
}

/**
 * Reads all MDX files from the specified directory and returns raw frontmatter data
 * @param componentsDir - Path to the components directory (e.g., 'content/components')
 * @returns Promise<Array> - Array of objects with name and frontMatter
 */
export async function getComponentMdxFiles(componentsDir: string = 'content/components'): Promise<Array<{ name: string; frontMatter: PageFrontMatter }>> {
    const mdxData: Array<{ name: string; frontMatter: PageFrontMatter }> = [];

    // Read all MDX files
    const fullPath = path.join(process.cwd(), componentsDir);
    const files = await fs.readdir(fullPath);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    for (const file of mdxFiles) {
        const pageName = file.replace('.mdx', '');
        const filePath = path.join(fullPath, file);

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const {data} = matter(fileContent);
            const frontMatter = data as PageFrontMatter;

            mdxData.push({
                name: pageName,
                frontMatter
            });
        } catch (error) {
            console.error(`Error reading ${file}:`, error);
        }
    }

    return mdxData;
}