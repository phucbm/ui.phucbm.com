import * as React from "react";
import {getRegistryItem} from "@/lib/getRegistryItem";
import {SandpackExampleCode} from "@/components/sandpack-example-code";

type Props = { name: string };

export async function RegistryExample({name}: Props) {
    const registryItem = await getRegistryItem(name);
    return (
        <SandpackExampleCode registryItem={registryItem}/>
    );
}
