import {RegistryItem} from "@/lib/getRegistryItem";
import {SandpackCodeEditor, SandpackLayout, SandpackProvider, SandpackProviderProps} from "@codesandbox/sandpack-react";
import {getSandpackFiles} from "@/lib/getSandpackFiles";
import {aquaBlue} from "@codesandbox/sandpack-themes";

type Props = {
    registryItem: RegistryItem
};

export async function SandpackExampleCode({registryItem}: Props) {
    const files = await getSandpackFiles({registryItem});

    const dependencies = {};

    registryItem.dependencies.forEach(dependency => {
        dependencies[dependency] = 'latest';
    })

    const height = 350;

    const sandpackProps = {
        theme: {aquaBlue},
        options: {
            externalResources: ["https://cdn.tailwindcss.com"],
            initMode: "lazy",
            classes: {
                "sp-tabs": "custom-tabs !bg-accent !border-dashed !border-b !border-border text-accent-foreground font-mono",
            },
        },
        customSetup: {
            dependencies: dependencies
        },
        files: files,
        style: {
            [`--sp-layout-height` as any]: `${height}px`
        }
    } as SandpackProviderProps;


    return (
        <div className="mt-6 px-border overflow-hidden">

            <SandpackProvider template="react-ts" {...sandpackProps}>
                <SandpackLayout className="!border-none">
                    <SandpackCodeEditor showLineNumbers={true} readOnly={true}/>
                </SandpackLayout>
            </SandpackProvider>

        </div>
    );
}