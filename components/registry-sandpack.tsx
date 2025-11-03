import {RegistryItem} from "@/lib/getRegistryItem";
import {getRegistryCodeItems} from "@/lib/getRegistryCodeItems";
import {SandpackPreview, SandpackProvider} from "@codesandbox/sandpack-react";
import {RegistryPreview} from "@/components/registry-preview";
import {getExampleCodeForSandpack} from "@/lib/getExampleCodeForSandpack";

type Props = {
    registryItem: RegistryItem
};

export async function RegistrySandpack({registryItem}: Props) {
    const codeFiles = await getRegistryCodeItems({registryItem});

    const files = {
        '/App.js': {
            code: await getExampleCodeForSandpack(registryItem),
            active: true
        }
    };

    codeFiles.forEach(file => {
        files[file.filename] = file.code;
    })


    const dependencies = {};

    registryItem.dependencies.forEach(dependency => {
        dependencies[dependency] = 'latest';
    })

    const height = 500;
    return (
        <div className="mt-6">

            {/*<div className="flex justify-between items-center hidden">*/}
            {/*    <div>*/}
            {/*        Preview*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <SandPackFullScreen*/}
            {/*            options={{*/}
            {/*                externalResources: ["https://cdn.tailwindcss.com"],*/}
            {/*                initMode: "lazy",*/}
            {/*            }}*/}
            {/*            customSetup={{*/}
            {/*                dependencies: dependencies*/}
            {/*            }}*/}
            {/*            files={files}*/}
            {/*            registryItem={registryItem}*/}
            {/*            // code={code}*/}
            {/*            // hashId={hashId}*/}
            {/*            // subtitle={subtitle}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <SandpackProvider template="react"
                              options={{
                                  externalResources: ["https://cdn.tailwindcss.com"],
                                  initMode: "lazy",
                              }}
                              customSetup={{
                                  dependencies: dependencies
                              }}
                              files={files}
                              style={{[`--sp-layout-height` as any]: `${height}px`}}
            >

                <RegistryPreview children={<SandpackPreview showOpenInCodeSandbox={false}/>} height={height}/>

            </SandpackProvider>


        </div>
    );
}