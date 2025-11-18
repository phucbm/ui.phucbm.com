// RegistryDemo.tsx (Server Component)
import {getRegistryItem} from "@/lib/getRegistryItem";
import React from "react";
import SandpackDemo from "@/components/sandpack-demo";

type Props = {
    name?: string;
    height?: number;
    editorHeight?: number;
    exampleFileName?: string;
    codeEditor?: boolean;
    resizable?: boolean;
    openInV0?: boolean;
};

export async function RegistryDemo({
                                       name,
                                       height,
                                       editorHeight,
                                       exampleFileName,
                                       codeEditor = true,
                                       resizable = true,
                                       openInV0 = true,
                                   }: Props) {
    const registryItem = await getRegistryItem(name, exampleFileName);

    return <SandpackDemo registryItem={registryItem}
                         height={height}
                         editorHeight={editorHeight}
                         exampleFileName={exampleFileName}
                         codeEditor={codeEditor}
                         resizable={resizable}
                         openInV0={openInV0}
    />;
}