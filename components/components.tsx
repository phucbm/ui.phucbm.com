import * as React from 'react';
import {getComponentMdxFiles, PageFrontMatter} from "@/lib/getComponentMdxFiles";
import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryItem} from "shadcn/schema";
import {Cards} from "nextra/components";

type Props = {};

interface Component {
    title: string;
    name: string;
    description: string;
    frontMatter: PageFrontMatter;
    registry: RegistryItem | null;
}

export async function Components(props: Props): Promise<React.ReactElement> {
    const components: Component[] = [];
    const mdxFiles = await getComponentMdxFiles();

    for (const file of mdxFiles) {
        const registry = await getRegistryItem(file.name);
        components.push({
            title: file.frontMatter.title || registry.title,
            description: file.frontMatter.description || registry?.description,
            name: file.name,
            frontMatter: file.frontMatter,
            registry: registry
        });
    }

    console.log('components', components);

    return (
        <Cards>
            {components.map(component => (
                <Cards.Card
                    key={component.name}
                    title={component.title}
                    href=""
                />
            ))}
        </Cards>
    );
}