import {RegistryItem} from "@/lib/getRegistryItem";
import {
    SandpackCodeEditor,
    SandpackFileExplorer,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider
} from "@codesandbox/sandpack-react";
import {RegistryPreview} from "@/components/registry-preview";
import {getSandpackFiles} from "@/lib/getSandpackFiles";

type Props = {
    registryItem: RegistryItem
};

export async function RegistrySandpack({registryItem}: Props) {
    const sandpackFiles = await getSandpackFiles({registryItem});

    const files = {};

    sandpackFiles.forEach(file => {
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

            <SandpackProvider template="react-ts"
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

                <SandpackLayout>
                    <SandpackFileExplorer/>
                    <SandpackCodeEditor/>
                </SandpackLayout>

            </SandpackProvider>


        </div>
    );
}