import {RegistryItem} from "shadcn/schema";
import {
    SandpackCodeEditor,
    SandpackFileExplorer,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
    SandpackProviderProps
} from "@codesandbox/sandpack-react";
import {RegistryPreview} from "@/components/registry-preview";
import {getSandpackFiles} from "@/lib/getSandpackFiles";
import {aquaBlue} from "@codesandbox/sandpack-themes";
import {IconCode, IconDeviceGamepad} from "@tabler/icons-react";
import {OpenInV0Button} from "@/components/OpenInV0Button";
import {getRegistryUrl} from "@/lib/getRegistryUrl";

type Props = {
    registryItem: RegistryItem;
    height?: number;
    editorHeight?: number;
    exampleFileName?: string;
    codeEditor?: boolean;
    resizable?: boolean;
};

async function SandpackDemo({
                                registryItem,
                                height = 400,
                                editorHeight = 300,
                                exampleFileName = "example",
                                codeEditor = true,
                                resizable = true
                            }: Props) {
    const files = await getSandpackFiles({registryItem, exampleFileName});

    const dependencies = {};

    registryItem.dependencies.forEach(dependency => {
        dependencies[dependency] = 'latest';
    })

    const sandpackProps = {
        theme: {aquaBlue},
        options: {
            externalResources: ["https://cdn.tailwindcss.com"],
            initMode: "user-visible",
        },
        customSetup: {
            dependencies: dependencies
        },
        files: files,
        style: {
            [`--sp-layout-height` as any]: `${height}px`
        }
    } as SandpackProviderProps;

    // example registry url
    const exampleRegistryUrl = getRegistryUrl({
        name: registryItem.name,
        fileNamePostfix: `-${exampleFileName}`
    });

    return (
        <div className="mt-6">

            <SandpackProvider key={registryItem.name} template="react-ts" {...sandpackProps}>

                <RegistryPreview children={<SandpackPreview showOpenInCodeSandbox={false}/>}
                                 height={height}
                                 resizable={resizable}/>

                {!codeEditor && (
                    <>
                        <div className="mt-2 text-sm text-slate-500 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <IconDeviceGamepad className="w-5"/> Interactive Playground
                            </div>
                            <div className="flex items-center gap-2">
                                <OpenInV0Button text="Open in" url={exampleRegistryUrl}/>
                            </div>
                        </div>
                    </>
                )}

                {
                    codeEditor && (
                        <>
                            <div className="mt-4 text-sm text-slate-500 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <IconCode className="w-5"/> Live Playground · Edit and see changes instantly
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Or edit with AI support by </span>
                                    <OpenInV0Button text="Open in" url={exampleRegistryUrl}/>
                                </div>
                            </div>

                            <SandpackLayout className="mt-2" style={{[`--sp-layout-height` as any]: `${editorHeight}px`}}>
                                <SandpackFileExplorer/>
                                <SandpackCodeEditor closableTabs={true}
                                                    showTabs={true}
                                                    showLineNumbers={true}
                                                    showRunButton={true}
                                />
                            </SandpackLayout>
                        </>
                    )
                }

            </SandpackProvider>

        </div>
    );
}

export default SandpackDemo