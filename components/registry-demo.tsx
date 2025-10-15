import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryPreview} from "@/components/registry-preview";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {MaximizeRegistry} from "@/components/maximizable-registry";
import {getRegistryCodeItems} from "@/lib/getRegistryCodeItems";
import CodeBlockView, {CodeItem} from "@/components/code-block-view";

type Props = {
    children: React.ReactNode;
    name?: string;
    code?: CodeItem[];
};

export async function RegistryDemo({children, name, code}: Props) {
    const registryItem = await getRegistryItem(name);
    const hasFiles = registryItem.files.length > 0;

    // if no code is provided, get it from the registry
    if (!code) {
        code = await getRegistryCodeItems({registryItem});
    }

    return (
        <>
            <Tabs defaultValue="preview" className="pt-6">

                {/*demo header*/}
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}
                    </TabsList>
                    <div><MaximizeRegistry children={children} registryItem={registryItem} code={code}/></div>
                </div>

                {/*preview*/}
                <TabsContent value="preview" className="">
                    <RegistryPreview
                        children={children}
                        registryItem={registryItem}
                    />
                </TabsContent>

                {/*code*/}
                {hasFiles &&
                    <TabsContent value="code">
                        <CodeBlockView code={code}/>
                    </TabsContent>
                }

            </Tabs>


        </>
    );
}