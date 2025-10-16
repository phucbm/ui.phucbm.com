import {CodeBlockCommand} from "@/components/code-block-command";
import {getRegistryUrl} from "@/lib/getRegistryUrl";

type Props = {
    name: string;
};

export function RegistryInstall({name}: Props) {
    const url = getRegistryUrl({name});
    return (
        <CodeBlockCommand
            pnpmCommand={`pnpm dlx shadcn@latest add ${url}`}
            npmCommand={`npx shadcn@latest add ${url}`}
            yarnCommand={`yarn shadcn@latest add ${url}`}
            bunCommand={`bunx --bun shadcn@latest add ${url}`}
        />
    );
}