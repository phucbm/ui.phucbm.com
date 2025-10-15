import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryPreview} from "@/components/registry-preview";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {MaximizeRegistry} from "@/components/maximizable-registry";
import getRegistryCodeItems from "@/lib/getRegistryCodeItems";
import CodeBlockView from "@/components/code-block-view";

type Props = {
    children: React.ReactNode;
    name?: string;
    codeString?: string;
};

export async function RegistryDemo({children, name, codeString}: Props) {
    const registryItem = await getRegistryItem(name);
    const hasFiles = registryItem.files.length > 0;
    let code = await getRegistryCodeItems({registryItem});
    if (!!code.length && !!codeString) {
        // const codeString = jsxToString(children);
        code = [{language: 'tsx', filename: 'example.tsx', code: codeString}];
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