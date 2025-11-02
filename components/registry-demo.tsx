// RegistryDemo.tsx (Server Component)
import {getRegistryItem} from "@/lib/getRegistryItem";
import React from "react";
import {getRegistryCodeItems} from "@/lib/getRegistryCodeItems";
import {CodeItem} from "@/components/code-block-view";
import {RegistrySandpack} from "@/components/registry-sandpack";

type Props = {
    children: React.ReactNode;
    name?: string;
    code?: CodeItem[];
    hashId?: string; // for maximizable registry
    subtitle?: string; // for maximizable registry
    fullScreenDemo?: React.ReactNode; // new prop
};

export async function RegistryDemo({
                                       children,
                                       name,
                                       code,
                                       hashId,
                                       subtitle,
                                       fullScreenDemo,
                                   }: Props) {
    const registryItem = await getRegistryItem(name);
    const hasFiles = registryItem.files.length > 0;

    // if no code is provided, get it from the registry
    if (!code) {
        code = await getRegistryCodeItems({registryItem});
    }

    // fallback to children if fullScreenDemo not provided
    const demoForFullscreen = fullScreenDemo ?? children;

    return (
        <>
            <RegistrySandpack registryItem={registryItem}/>
            {/*    <Tabs defaultValue="preview" className="pt-6">*/}
            {/*    /!* demo header *!/*/}
            {/*    <div className="flex justify-between items-center">*/}
            {/*        <TabsList>*/}
            {/*            <TabsTrigger value="preview">Preview</TabsTrigger>*/}
            {/*            {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}*/}
            {/*        </TabsList>*/}
            {/*        <div>*/}
            {/*            <MaximizeRegistry*/}
            {/*                children={demoForFullscreen}*/}
            {/*                registryItem={registryItem}*/}
            {/*                code={code}*/}
            {/*                hashId={hashId}*/}
            {/*                subtitle={subtitle}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* preview *!/*/}
            {/*    <TabsContent value="preview">*/}
            {/*        <RegistryPreview children={children}/>*/}
            {/*    </TabsContent>*/}

            {/*    /!* code *!/*/}
            {/*    {hasFiles && (*/}
            {/*        <TabsContent value="code">*/}
            {/*            <CodeBlockView code={code.slice(0, 1)}/>*/}
            {/*        </TabsContent>*/}
            {/*    )}*/}
            {/*</Tabs>*/}
        </>
    );
}