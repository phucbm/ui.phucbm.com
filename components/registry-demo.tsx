// RegistryDemo.tsx (Server Component)
import {getRegistryItem} from "@/lib/getRegistryItem";
import React from "react";
import {CodeItem} from "@/components/code-block-view";
import SandpackDemo from "@/components/sandpack-demo";

type Props = {
    children: React.ReactNode;
    name?: string;
    code?: CodeItem[];
    hashId?: string; // for maximizable registry
    subtitle?: string; // for maximizable registry
    fullScreenDemo?: React.ReactNode; // new prop
};

export async function RegistryDemo({name}: Props) {
    const registryItem = await getRegistryItem(name);

    return <SandpackDemo registryItem={registryItem}/>;
}