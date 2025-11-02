import * as React from 'react';
import {RegistryItem} from "@/lib/getRegistryItem";
import {SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider,} from "@codesandbox/sandpack-react";
import {getRegistryCodeItems} from "@/lib/getRegistryCodeItems";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RegistryPreview} from "@/components/registry-preview";
import {SandPackFullScreen} from "@/components/registry-sandpack-fullscreen";

type Props = {
    registryItem: RegistryItem
};

export async function RegistrySandpack({registryItem}: Props) {
    const codeFiles = await getRegistryCodeItems({registryItem});
    console.log('codeFiles', codeFiles)
    const files = {
        '/App.js': 'import {TextRipple} from "./components/perxel/text-ripple.tsx";\n' +
            '\n' +
            'export default function Example() {\n' +
            '    return (\n' +
            '        <TextRipple line1="lorem ipsum" line2="dolor sit amet"/>\n' +
            '    );\n' +
            '}'
    };

    codeFiles.forEach(file => {
        files[file.filename] = file.code;
    })

    console.log('files', files)


    const dependencies = {};

    registryItem.dependencies.forEach(dependency => {
        dependencies[dependency] = 'latest';
    })
    console.log('dependencies', dependencies)
    return (
        <div>


            <Tabs defaultValue="preview" className="pt-6">
                    <div className="flex justify-between items-center">
                        <TabsList>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="code">Code</TabsTrigger>
                        </TabsList>
                        <div>
                            <SandPackFullScreen
                                options={{
                                    externalResources: ["https://cdn.tailwindcss.com"],
                                    initMode: "lazy",
                                }}
                                customSetup={{
                                    dependencies: dependencies
                                }}
                                files={files}
                                registryItem={registryItem}
                                // code={code}
                                // hashId={hashId}
                                // subtitle={subtitle}
                            />
                        </div>
                    </div>


                <SandpackProvider template="react"
                                  options={{
                                      externalResources: ["https://cdn.tailwindcss.com"],
                                      initMode: "lazy",
                                  }}
                                  customSetup={{
                                      dependencies: dependencies
                                  }}
                                  files={files}
                >

                    {/* preview */}
                    <TabsContent value="preview">
                        {/*<SandpackLayout>*/}
                        {/*    <SandpackPreview/>*/}
                        {/*</SandpackLayout>*/}
                        <RegistryPreview children={<SandpackPreview/>}/>
                    </TabsContent>

                    {/* code */}
                    <TabsContent value="code">
                        <SandpackLayout>
                            <SandpackCodeEditor showLineNumbers={true} readOnly={true}/>
                        </SandpackLayout>
                    </TabsContent>


                </SandpackProvider>
                </Tabs>

        </div>
    );
}