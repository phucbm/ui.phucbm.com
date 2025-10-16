// RegistryDemo.tsx (Server Component)
import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryPreview} from "@/components/registry-preview";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {MaximizeRegistry} from "@/components/maximizable-registry";
import {getRegistryCodeItems} from "@/lib/getRegistryCodeItems";
import CodeBlockView, {CodeItem} from "@/components/code-block-view";
import {RegistryDemoHeader} from "@/components/registry-demo-header";

type Props = {
    children: React.ReactNode;
    name?: string;
    code?: CodeItem[];
    hashId?: string;
    subtitle?: string;
    fullScreenDemo?: React.ReactNode;
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
        <Tabs defaultValue="preview" className="pt-6">
            {/* demo header with client-side refresh */}
            <RegistryDemoHeader
                hasFiles={hasFiles}
                registryItem={registryItem}
                code={code}
                hashId={hashId}
                subtitle={subtitle}
                demoForFullscreen={demoForFullscreen}
            />

            {/* preview */}
            <TabsContent value="preview">
                <RegistryPreview children={children} registryItem={registryItem}/>
            </TabsContent>

            {/* code */}
            {hasFiles && (
                <TabsContent value="code">
                    <CodeBlockView code={code}/>
                </TabsContent>
            )}
        </Tabs>
    );
}