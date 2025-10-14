import {CodeBlockCommand} from "@/components/code-block-command";

type Props = {
    name: string;
};

export function AddRegistry({name}: Props) {
    return (
        <CodeBlockCommand
            pnpmCommand={`pnpm dlx shadcn@latest add ${name}`}
            npmCommand={`npx shadcn@latest add ${name}`}
            yarnCommand={`yarn shadcn@latest add ${name}`}
            bunCommand={`bunx --bun shadcn@latest add ${name}`}
        />
    );
}