"use client"

import * as React from "react"
import {CheckIcon, ClipboardIcon} from "lucide-react"

import {useConfig} from "@/hooks/use-config"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"

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
        <div className="relative mt-6 max-h-[650px] overflow-x-auto rounded-xl bg-accent text-accent-foreground">
            <Tabs
                value={packageManager}
                onValueChange={(value) => {
                    setConfig({
                        ...config,
                        packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
                    })
                }}
            >
                <div className="flex items-center justify-between border-b border-border bg-accent px-3 pt-2.5">
                    <TabsList className="h-7 translate-y-[2px] gap-3 bg-transparent p-0 pl-1">
                        {entries.map(([key]) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="rounded-none border-b border-transparent !bg-transparent !shadow-none p-0 pb-1.5 font-mono text-sm text-muted-foreground data-[state=active]:font-bold"
                            >
                                {key}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="overflow-x-auto">
                    {entries.map(([key, value]) => (
                        <TabsContent key={key} value={key} className="mt-0">
              <pre className="px-4 p3-5">
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
                className="absolute right-2.5 top-2 z-10 h-6 w-6 [&_svg]:h-3 [&_svg]:w-3"
                onClick={copyCommand}
            >
                <span className="sr-only">Copy</span>
                {hasCopied ? <CheckIcon/> : <ClipboardIcon/>}
            </Button>
        </div>
    )
}
