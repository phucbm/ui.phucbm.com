import * as React from 'react';
import {getComponents} from "@/lib/getComponents";
import {ComponentsClient} from "@/components/componentsClient";

type Props = {};

export async function Components(props: Props): Promise<React.ReactElement> {
    const components = await getComponents();

    // Extract all unique tags from components
    const allTags = Array.from(
        new Set(components.flatMap(c => c.tags || []))
    ).sort();

    return (
        <div className="mt-8">
            <ComponentsClient
                components={components}
                availableTags={allTags}
            />
        </div>
    );
}