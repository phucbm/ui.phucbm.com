import {getRegistryItem} from "@/lib/getRegistryItem";
import {DemoRegistryClient} from "@/components/demo-registry-client";
import React from "react";

type Props = { children: React.ReactNode, name?: string };

export async function DemoRegistry({children, name}: Props) {
    return (
        <DemoRegistryClient children={children} registryItem={await getRegistryItem(name)}/>
    );
}