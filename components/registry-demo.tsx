import {getRegistryItem} from "@/lib/getRegistryItem";
import {RegistryPreview} from "@/components/registry-preview";
import React from "react";
import RegistryCode from "@/components/registry-code";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

type Props = {
    children: React.ReactNode;
    name?: string;
};

export async function RegistryDemo(props: Props) {
    const registryItem = await getRegistryItem(props.name);
    const hasFiles = registryItem.files.length > 0;
    // const height = 450;
    return (
        <>
            <Tabs defaultValue="preview" className="pt-6">
                <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}
                </TabsList>

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
                        <RegistryCode registryItem={registryItem}/>
                    </TabsContent>
                }

            </Tabs>


        </>
    );
}