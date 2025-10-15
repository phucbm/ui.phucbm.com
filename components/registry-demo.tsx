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
};

export async function RegistryDemo(props: Props) {
    const registryItem = await getRegistryItem(props.name);
    const hasFiles = registryItem.files.length > 0;
    const code = await getRegistryCodeItems({registryItem});
    return (
        <>
            <Tabs defaultValue="preview" className="pt-6">

                {/*demo header*/}
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}
                    </TabsList>
                    <div><MaximizeRegistry children={props.children} registryItem={registryItem} code={code}/></div>
                </div>

                {/*preview*/}
                <TabsContent value="preview" className="">
                    <RegistryPreview
                        children={props.children}
                        registryItem={registryItem}
                        {...props}
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