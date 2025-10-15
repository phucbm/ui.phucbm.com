import {getRegistryItem} from "@/lib/getRegistryItem";
import {DemoRegistryClient} from "@/components/demo-registry-client";
import React from "react";

type Props = {
    children: React.ReactNode;
    name?: string;
    showAddRegistry?: boolean;
};

export async function DemoRegistry(props: Props) {
    return (
        <DemoRegistryClient
            children={props.children}
            registryItem={await getRegistryItem(props.name)}
            {...props}
        />
    );
}