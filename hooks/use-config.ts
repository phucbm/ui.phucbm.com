// https://github.com/shadcn-ui/ui/blob/main/apps/www/hooks/use-config.ts
import {useAtom} from "jotai"
import {atomWithStorage} from "jotai/utils"

type Config = {
    packageManager: "npm" | "yarn" | "pnpm" | "bun"
}

const configAtom = atomWithStorage<Config>("config", {
    packageManager: "pnpm",
})

export function useConfig() {
    return useAtom(configAtom)
}