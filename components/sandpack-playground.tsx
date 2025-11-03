import {
    SandpackCodeEditor,
    SandpackFileExplorer,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
    SandpackProviderProps
} from "@codesandbox/sandpack-react";

type Props = {
    sandpackProps?: SandpackProviderProps;
};

export function SandpackPlayground({sandpackProps}: Props) {
    return (
        <div className="">
            <SandpackProvider
                template="react-ts"
                {...sandpackProps}
                style={{
                    [`--sp-layout-height` as any]: `100vh`
                }}
            >

                <SandpackLayout>
                    <SandpackFileExplorer/>
                    <SandpackCodeEditor closableTabs={true}
                                        showTabs={true}
                                        showLineNumbers={true}
                                        showRunButton={true}
                    />
                    <SandpackPreview showOpenInCodeSandbox={false}/>
                </SandpackLayout>

            </SandpackProvider>
        </div>
    );
}