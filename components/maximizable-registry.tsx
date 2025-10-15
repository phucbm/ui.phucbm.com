"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useDialogHash} from "@/hooks/useDialogHash";
import {MaximizeIcon} from "@/components/ui/maximize";
import React, {useEffect, useRef, useState} from "react";
import {XIcon} from "@/components/ui/x";
import {KeyBoard} from "@/components/KeyBoard";
import {RegistryItem} from "@/lib/getRegistryItem";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CodeBlockView, {CodeItem} from "@/components/code-block-view";
import {cn} from "@/lib/utils";
import {RegistryInstall} from "@/components/registry-install";

type Props = {
    children: React.ReactNode;
    registryItem?: RegistryItem;
    code: CodeItem[];
    hashId?: string;
    subtitle?: string;
};

export function MaximizeRegistry({
                                     children,
                                     registryItem,
                                     code,
                                     subtitle,
                                     hashId = "preview",
                                 }: Props) {
    const {open, setOpen} = useDialogHash(hashId);
    const [tab, setTab] = useState('');
    const hasFiles = registryItem?.files?.length > 0;
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    // measure header height and update on resize or mutation
    useEffect(() => {
        const updateHeight = () => {
            const h = headerRef.current?.offsetHeight ?? 0;
            setHeaderHeight(h);
        };

        updateHeight(); // initial
        window.addEventListener("resize", updateHeight);

        // observe changes inside header (e.g. tabs wrap)
        const observer = new MutationObserver(updateHeight);
        if (headerRef.current) observer.observe(headerRef.current, {childList: true, subtree: true});

        return () => {
            window.removeEventListener("resize", updateHeight);
            observer.disconnect();
        };
    }, [tab]);

    return (
        <div data-component="maximizable-registry">
            <Dialog open={open} onOpenChange={setOpen}>
                {/* Inline button */}
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Maximize">
                        <MaximizeIcon className="h-4 w-4"/>
                    </Button>
                </DialogTrigger>

                <DialogContent
                    forceMount
                    showCloseButton={false}
                    className={cn(
                        "w-screen h-screen !max-w-none rounded-none border-none p-0 gap-0 overflow-hidden px-bg-pattern-transparent"
                    )}
                    style={{
                        // inject CSS var for use anywhere inside DialogContent
                        ["--header-height" as any]: `${headerHeight}px`,
                    }}
                >
                    <Tabs defaultValue="preview" className="w-screen" onValueChange={v => setTab(v)}>
                        <DialogHeader
                            ref={headerRef}
                            className="absolute top-0 left-0 w-full z-20 border-b px-bg-blur"
                        >
                            <div className="flex justify-between items-center px-4 py-2 w-full">
                                {/* header left */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 max-sm:w-2/3">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <DialogTitle>{registryItem?.title}</DialogTitle>
                                        {subtitle && <div>{subtitle}</div>}
                                    </div>
                                    <TabsList>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                        {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}
                                        <TabsTrigger value="installation">Installation</TabsTrigger>
                                    </TabsList>
                                </div>

                                {/* header right */}
                                <div className="flex justify-end items-center gap-4 max-sm:w-1/3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Close"
                                        onClick={() => setOpen(false)}
                                    >
                                        <KeyBoard keyName="ESC"/>
                                        <XIcon className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>

                        <TabsContent value="preview">
                            <div className="flex justify-center items-center @container h-screen">
                                {children}
                            </div>
                        </TabsContent>

                        {hasFiles && (
                            <TabsContent value="code" className="pt-[var(--header-height)] w-full">
                                <div className="container mx-auto px-4 pt-6">
                                    <CodeBlockView
                                        code={code}
                                        contentClassName="h-[calc(90vh-var(--header-height)-45px)] max-h-none"
                                    />
                                </div>
                            </TabsContent>
                        )}

                        <TabsContent
                            value="installation"
                            className="pt-[var(--header-height)] w-full"
                        >
                            <div className="container mx-auto px-4">
                                <RegistryInstall name={registryItem?.name || ""}/>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}