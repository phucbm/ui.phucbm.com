"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup,} from "@/components/ui/resizable";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

type Props = {
    children: React.ReactNode;
    height?: number;
};

export function RegistryPreview({children, height = 450}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const [panelWidth, setPanelWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const update = () => {
            const gw = containerRef.current?.offsetWidth ?? 0;
            const pw = panelRef.current?.offsetWidth ?? 0;
            setContainerWidth(gw);
            setPanelWidth(pw);
        };

        const panelEl = panelRef.current;
        const groupEl = containerRef.current;

        if (!panelEl || !groupEl) return;

        const roPanel = new ResizeObserver(update);
        const roGroup = new ResizeObserver(update);

        roPanel.observe(panelEl);
        roGroup.observe(groupEl);

        // Initial measurement (once refs are mounted)
        update();

        return () => {
            roPanel.disconnect();
            roGroup.disconnect();
        };
    }, []);

    // Convert 375px to percentage, clamp between 1–100
    const minSizePct = useMemo(() => {
        if (!containerWidth) return undefined;
        const pct = (375 / containerWidth) * 100;
        return Math.min(100, Math.max(1, pct));
    }, [containerWidth]);

    const atFullWidth =
        containerWidth > 0 && Math.abs(panelWidth - containerWidth) <= 5;

    return (
        <div data-component="demo-registry-client"
             ref={containerRef}
             className="group relative bg-accent rounded-md overflow-hidden"
        >
            <ResizablePanelGroup direction="horizontal" className="px-bg-pattern-transparent px-border">

                {/*main panel*/}
                <ResizablePanel defaultSize={100} minSize={minSizePct}>
                    <div ref={panelRef} className="relative h-full">
                        {!atFullWidth && (
                            <div
                                className={cn(
                                    "absolute top-1 left-1/2 -translate-x-1/2 z-10 opacity-0",
                                    "transition duration-200 scale-75 opacity-0",
                                    "group-hover:opacity-100 group-hover:scale-100"
                                )}
                            >
                                <Badge variant="secondary">{Math.round(panelWidth)}px</Badge>
                            </div>
                        )}
                        <div className="[&>*]:min-h-full" style={{height: `${height}px`}}>
                            {children}
                        </div>
                    </div>
                </ResizablePanel>

                {/*handle*/}
                <ResizableHandle
                    withHandle
                    className={cn(
                        "!border-dashed w-0 border-l !bg-transparent",
                        atFullWidth ? "border-transparent" : "border-border"
                    )}
                />

                {/*resize panel*/}
                <ResizablePanel
                    defaultSize={0}
                    className="px-bg-diagonal"
                />
            </ResizablePanelGroup>

            {/*border*/}
            <div className="z-20 absolute inset-0 px-border pointer-events-none"/>
        </div>
    );
}
