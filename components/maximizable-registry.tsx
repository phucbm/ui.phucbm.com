"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useDialogHash} from "@/hooks/useDialogHash";
import {MaximizeIcon} from "@/components/ui/maximize";
import React from "react";
import {XIcon} from "@/components/ui/x";
import {KeyBoard} from "@/components/KeyBoard";
import {RegistryItem} from "@/lib/getRegistryItem";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import CodeBlockView, {CodeItem} from "@/components/code-block-view";
import {cn} from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    registryItem?: RegistryItem;
    code: CodeItem[],
};

export function MaximizeRegistry({children, registryItem, code}: Props) {
    const {open, setOpen, hash} = useDialogHash("preview"); // URL → …/#preview
    const hasFiles = registryItem.files.length > 0;
    
    return (
        <div data-component="maximizable-registry">
            <Dialog open={open} onOpenChange={setOpen}>
                {/* Inline button */}
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Maximize">
                        <MaximizeIcon className="h-4 w-4"/>
                    </Button>
                </DialogTrigger>

                <DialogContent forceMount
                               showCloseButton={false}
                               className={cn(
                                   "w-screen h-screen !max-w-none rounded-none border-none p-0 gap-0 overflow-hidden px-bg-pattern-transparent",
                               )}>


                    <Tabs defaultValue="preview" className="w-screen">

                        <DialogHeader
                            className="absolute top-0 left-0 w-full z-20 border-b px-bg-blur">
                            <div className="flex justify-between items-center px-4 py-2 w-full">
                                {/*header left*/}
                                <div className="flex items-center gap-4">
                                    <DialogTitle>{registryItem.title}</DialogTitle>
                                    <TabsList>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                        {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}
                                    </TabsList>
                                </div>

                                {/*header right*/}
                                <Button variant="ghost" size="sm" aria-label="Close" onClick={() => setOpen(false)}>
                                    <KeyBoard keyName="ESC"/>
                                    <XIcon className="h-4 w-4"/>
                                </Button>
                            </div>
                        </DialogHeader>

                        <TabsContent value="preview">

                            <div className="flex justify-center items-center @container h-screen">
                                {children}
                            </div>

                        </TabsContent>


                        {hasFiles &&
                            <TabsContent value="code" className="pt-[52px] w-full">
                                <CodeBlockView code={code} contentClassName="h-[calc(100vh-52px-45px)] max-h-none"/>
                            </TabsContent>
                        }


                    </Tabs>

                </DialogContent>
            </Dialog>
        </div>
    );
}
