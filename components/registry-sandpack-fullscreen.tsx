"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useDialogHash} from "@/hooks/useDialogHash";
import {MaximizeIcon} from "@/components/ui/maximize";
import React from "react";
import {RegistryItem} from "@/lib/getRegistryItem";
import {cn} from "@/lib/utils";
import {Sandpack} from "@codesandbox/sandpack-react";
import {KeyBoard} from "@/components/KeyBoard";
import {XIcon} from "@/components/ui/x";
import {aquaBlue} from "@codesandbox/sandpack-themes";

type Props = {
    // children: React.ReactNode;
    registryItem?: RegistryItem;
    // code: CodeItem[];
    hashId?: string;
    subtitle?: string;
    options?: any;
    customSetup?: any;
    files?: any;
};

export function SandPackFullScreen({
                                       // children,
                                       options,
                                       customSetup,
                                       files,
                                       registryItem,
                                       // code,
                                       subtitle,
                                       hashId = "preview",
                                   }: Props) {
    const {open, setOpen} = useDialogHash(hashId);

    return (
        <div data-component="maximizable-registry">
            <Dialog open={open} onOpenChange={setOpen}>
                {/* Inline button */}
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Maximize">
                        <MaximizeIcon/>
                    </Button>
                </DialogTrigger>

                <DialogContent
                    forceMount
                    showCloseButton={false}
                    className={cn(
                        "w-screen h-screen !max-w-none rounded-none border-none p-0 gap-0 overflow-hidden px-bg-pattern-transparent"
                    )}
                >

                    <DialogHeader
                        className="fixed top-2 right-2 z-20 px-bg-blur"
                    >
                        <div className="flex items-center gap-3">
                            <DialogTitle>{registryItem?.title}</DialogTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                aria-label="Close"
                                onClick={() => setOpen(false)}
                            >
                                <KeyBoard keyName="ESC"/>
                                <XIcon className="h-4 w-4"/>
                            </Button>
                        </div>
                    </DialogHeader>

                    <Sandpack
                        template="react"
                        theme={aquaBlue}
                        options={{
                            showLineNumbers: true,
                            editorWidthPercentage: 40,
                            classes: {
                                "sp-wrapper": "custom-wrapper h-screen [--sp-layout-height:100vh!important] [&_iframe]:px-bg-pattern-transparent",
                                "sp-layout": "custom-layout h-full",
                                "sp-tab-button": "custom-tab",
                            },
                            autorun: true,
                            autoReload: true,
                            initMode: "user-visible",
                            recompileMode: "delayed",
                            recompileDelay: 300,
                            ...options
                        }}
                        customSetup={customSetup}
                        files={files}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}