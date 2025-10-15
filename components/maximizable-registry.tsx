"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useDialogHash} from "@/hooks/useDialogHash";
import {MaximizeIcon} from "@/components/ui/maximize";
import React from "react";
import {XIcon} from "@/components/ui/x";
import {KeyBoard} from "@/components/KeyBoard";

type Props = { children: React.ReactNode };

export function MaximizableWithHash({children}: Props) {
    const {open, setOpen, hash} = useDialogHash("preview"); // URL → …/#preview

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Inline button */}
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Maximize">
                    <MaximizeIcon className="h-4 w-4"/>
                </Button>
            </DialogTrigger>

            <DialogContent forceMount
                           className="w-screen h-screen !max-w-none rounded-none border-none p-0 gap-0 overflow-hidden px-bg-pattern-transparent">
                <DialogHeader className="absolute top-0 left-0 w-full z-20 border-b px-bg-blur">
                    <div className="flex justify-between items-center px-4 py-2 w-full">
                        <DialogTitle>Enlarged view</DialogTitle>
                        <Button variant="ghost" size="sm" aria-label="Close" onClick={() => setOpen(false)}>
                            <KeyBoard keyName="ESC"/>
                            <XIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </DialogHeader>


                <div>
                    {children}
                </div>


            </DialogContent>
        </Dialog>
    );
}
