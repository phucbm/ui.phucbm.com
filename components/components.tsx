import * as React from 'react';
import {getComponents} from "@/lib/getComponents";
import Link from "next/link";

type Props = {};

export async function Components(props: Props): Promise<React.ReactElement> {
    const components = await getComponents();

    return (
        <div className="grid grid-cols-3 gap-5">
            {components.map(component => (
                <div key={component.name} className="px-border p-2 bg-accent">
                    <Link href={component.url}>
                        <div>{component.title}</div>
                        <div>{component.mdx.createdTime}</div>
                        <div>{component.mdx.lastUpdatedTime}</div>
                        <div>{component.isNew ? "NEW" : ""}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
}