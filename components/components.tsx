import * as React from 'react';
import {getComponents} from "@/lib/getComponents";
import {ComponentsClient} from "@/components/componentsClient";

type Props = {
    sortByCreatedTime?: 'asc' | 'desc';
    max?: number;
};

export async function Components({ sortByCreatedTime, max = 9 }: Props): Promise<React.ReactElement> {
    let components = await getComponents();

    // Sort by created time if specified
    if (sortByCreatedTime) {
        components.sort((a, b) => {
            const timeA = a.mdx.createdTimestamp || 0;
            const timeB = b.mdx.createdTimestamp || 0;
            return sortByCreatedTime === 'asc' ? timeA - timeB : timeB - timeA;
        });
    }

    // Extract all unique tags from components
    const allTags = Array.from(
        new Set(components.flatMap(c => c.tags || []))
    ).sort();

    return (
        <div className="mt-8">
            <ComponentsClient
                components={components}
                availableTags={allTags}
                max={max}
                totalCount={components.length}
            />
        </div>
    );
}