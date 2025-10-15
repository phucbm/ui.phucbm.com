import {CodeBlockCommand} from "@/components/code-block-command";

type Props = {
    name: string;
};

export function AddRegistry({name}: Props) {
    const folder = process.env.NEXT_PUBLIC_REGISTRY_FOLDER || "r";
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${folder}/${name}.json`;
    return (
        <CodeBlockCommand
            pnpmCommand={`pnpm dlx shadcn@latest add ${url}`}
            npmCommand={`npx shadcn@latest add ${url}`}
            yarnCommand={`yarn shadcn@latest add ${url}`}
            bunCommand={`bunx --bun shadcn@latest add ${url}`}
        />
    );
}