"use client"

import * as React from "react"

import {useConfig} from "@/hooks/use-config"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils";
import {CopyIcon} from "@/components/ui/copy";
import {CheckIcon} from "@/components/ui/check";

type Props = {
    npmCommand?: string
    yarnCommand?: string
    pnpmCommand?: string
    bunCommand?: string
}

export function CodeBlockCommand({
                                     npmCommand,
                                     yarnCommand,
                                     pnpmCommand,
                                     bunCommand,
                                 }: Props) {
    const [config, setConfig] = useConfig()
    const [hasCopied, setHasCopied] = React.useState(false)

    React.useEffect(() => {
        if (hasCopied) {
            const timer = setTimeout(() => setHasCopied(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [hasCopied])

    const packageManager = (config.packageManager || "pnpm") as
        | "pnpm"
        | "npm"
        | "yarn"
        | "bun"

    const tabs = React.useMemo(
        () => ({
            pnpm: pnpmCommand,
            npm: npmCommand,
            yarn: yarnCommand,
            bun: bunCommand,
        }),
        [npmCommand, pnpmCommand, yarnCommand, bunCommand]
    )

    const entries = React.useMemo(
        () => Object.entries(tabs).filter(([, v]) => Boolean(v)) as [string, string][],
        [tabs]
    )

    const copyCommand = React.useCallback(async () => {
        const command = tabs[packageManager]
        if (!command) return
        await navigator.clipboard.writeText(command)
        setHasCopied(true)
    }, [packageManager, tabs])

    return (
        <div className="relative mt-6 max-h-[650px] overflow-x-auto px-border">
            <Tabs
                value={packageManager}
                onValueChange={(value) => {
                    setConfig({
                        ...config,
                        packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
                    })
                }}
                className="gap-0"
            >
                <div className="flex items-center justify-between border-b border-border border-dashed px-3 py-2">
                    <TabsList className="h-7 translate-y-[2px] gap-3 bg-transparent p-0 pl-1">
                        {entries.map(([key]) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className={cn(
                                    "rounded-none border-b border-transparent !bg-transparent !shadow-none p-0 pb-1.5 font-mono text-sm text-muted-foreground cursor-pointer",
                                    "data-[state=active]:font-bold",
                                    "hover:text-primary"
                                )}
                            >
                                {key}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="overflow-x-auto">
                    {entries.map(([key, value]) => (
                        <TabsContent key={key} value={key} className="mt-0">
              <pre className="px-4 py-3">
                <code
                    className="relative font-mono text-sm leading-none"
                    data-language="bash"
                >
                  {value}
                </code>
              </pre>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>

            <Button
                size="icon"
                variant="ghost"
                className="absolute right-2.5 top-2 z-10 h-6 w-6 [&_svg]:h-3 [&_svg]:w-3 cursor-pointer"
                onClick={copyCommand}
            >
                <span className="sr-only">Copy</span>
                {hasCopied ? <CheckIcon/> : <CopyIcon/>}
            </Button>
        </div>
    )
}
