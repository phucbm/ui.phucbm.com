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
import {aquaBlue} from "@codesandbox/sandpack-themes";

type Props = {
    registryItem: RegistryItem
};

export async function SandpackDemo({registryItem}: Props) {
    const files = await getSandpackFiles({registryItem});

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
                              theme={aquaBlue}
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