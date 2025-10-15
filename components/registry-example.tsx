import * as React from "react";
import {RegistryDemo} from "@/components/registry-demo";
import {getRegistryItem} from "@/lib/getRegistryItem";
import {getCodeItemFromPath} from "@/lib/getCodeItemFromPath";

type Props = { name: string };

/**
 * Loads "@/registry/perxel/blocks/${name}/example"
 * expecting a named export `Example` (client or server is fine).
 */
export async function RegistryExample({name}: Props) {
    // Optional: still fetch meta or files if you need them
    const registryItem = await getRegistryItem(name);

    // Dynamic import with a constrained path so bundlers can include matches.
    // If your examples are .tsx, keep the comment hints to help webpack.
    let Example: React.ComponentType | null;
    try {
        const mod = await import(
            /* webpackInclude: /example(\.tsx|\.jsx|\.ts|\.js)$/ */
            /* webpackMode: "lazy" */
            `@/registry/perxel/blocks/${name}/example`
            );

        // Prefer named export `Example`, but gracefully fall back to default.
        Example = (mod as any).Example ?? (mod as any).default ?? null;
    } catch {
        Example = null;
    }

    if (!Example) {
        // You can style this however you like
        return (
            <div className="text-sm text-muted-foreground">
                Example component not found for “{name}”.
            </div>
        );
    }

    const file = registryItem.files[0];
    const examplePath = `${file.path.replace(`${registryItem.name}.tsx`, `example.tsx`)}`;
    const exampleCode = await getCodeItemFromPath({path: examplePath});

    // replace import path, this is example for user to copy so we do not show internal import path
    const internalPath = file.path.replace('.tsx', '');
    const targetPath = file.target.replace('.tsx', '');
    exampleCode.code = exampleCode.code.replace(internalPath, targetPath);

    const code = [exampleCode];

    return (
        <RegistryDemo name={name} code={code}>
            <Example/>
        </RegistryDemo>
    );
}
