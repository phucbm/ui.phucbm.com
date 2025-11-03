import {getRegistryItem} from "@/lib/getRegistryItem";
import React from "react";
import {SandpackPlayground} from "@/components/sandpack-playground";

type Props = {
    name?: string;
};

export async function RegistryPlayground({name}: Props) {
    const registryItem = await getRegistryItem(name);

    return <SandpackPlayground registryItem={registryItem}/>;
}