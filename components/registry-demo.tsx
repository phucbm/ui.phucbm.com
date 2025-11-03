// RegistryDemo.tsx (Server Component)
import {getRegistryItem} from "@/lib/getRegistryItem";
import React from "react";
import SandpackDemo from "@/components/sandpack-demo";

type Props = {
    name?: string;
    height?: number;
    editorHeight?: number;
};

export async function RegistryDemo({name, height, editorHeight}: Props) {
    const registryItem = await getRegistryItem(name);

    return <SandpackDemo registryItem={registryItem} height={height} editorHeight={editorHeight}/>;
}