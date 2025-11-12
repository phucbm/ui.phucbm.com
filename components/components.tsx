import * as React from 'react';
import {Cards} from "nextra/components";
import {getComponents} from "@/lib/getComponents";

type Props = {};

export async function Components(props: Props): Promise<React.ReactElement> {
    const components = await getComponents();

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