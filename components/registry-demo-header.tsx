"use client";

import React, {useState} from "react";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";
import {MaximizeRegistry} from "@/components/maximizable-registry";
import {Button} from "@/components/ui/button";
import {RefreshCWIcon} from "@/components/ui/refresh-cw";
import {RegistryItem} from "@/lib/getRegistryItem";
import {CodeItem} from "@/components/code-block-view";

type RegistryDemoHeaderProps = {
    hasFiles: boolean;
    registryItem: RegistryItem;
    code: CodeItem[];
    hashId?: string;
    subtitle?: string;
    demoForFullscreen: React.ReactNode;
};

export function RegistryDemoHeader({
                                       hasFiles,
                                       registryItem,
                                       code,
                                       hashId,
                                       subtitle,
                                       demoForFullscreen,
                                   }: RegistryDemoHeaderProps) {
    const [tab, setTab] = useState("preview");
    const showRefreshButton = true;

    const handleRefresh = () => {
        // Dispatch a custom event that RegistryPreview can listen to
        window.dispatchEvent(new CustomEvent("registry:refresh-preview"));
    };

    return (
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="preview" onClick={() => setTab("preview")}>
                    Preview
                </TabsTrigger>
                {hasFiles && (
                    <TabsTrigger value="code" onClick={() => setTab("code")}>
                        Code
                    </TabsTrigger>
                )}
            </TabsList>
            <div className="flex items-center gap-2">
                {/* Refresh Preview Button */}
                {showRefreshButton && tab === "preview" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Refresh preview layout"
                        onClick={handleRefresh}
                    >
                        <RefreshCWIcon/>
                    </Button>
                )}
                <MaximizeRegistry
                    children={demoForFullscreen}
                    registryItem={registryItem}
                    code={code}
                    hashId={hashId}
                    subtitle={subtitle}
                />
            </div>
        </div>
    );
}