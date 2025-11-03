import {CodeItem} from "@/components/code-block-view";
import {RegistryItem} from "@/lib/getRegistryItem";
import {getCodeItemFromPath} from "@/lib/getCodeItemFromPath";
import path from "path";

/**
 * Reads all files listed in a registry item (including example.tsx) and returns an array of CodeItems
 * with transformed import paths for Sandpack compatibility.
 */
export async function getSandpackFiles({
                                           registryItem,
                                       }: {
    registryItem: RegistryItem;
}): Promise<CodeItem[]> {
    const componentName = registryItem.name;

    // Find the main component file
    const mainFile = registryItem.files.find((file) =>
        file.path.endsWith(`${componentName}/${componentName}.tsx`)
    );

    if (!mainFile) {
        throw new Error(`Main component file not found for ${componentName}`);
    }

    // Get the directory of the main file
    const mainFileDir = path.dirname(mainFile.path);

    // Step 2: Read all registry files
    const registryCodeItems = await Promise.all(
        registryItem.files.map((file) => getCodeItemFromPath({path: file.path}))
    );

    // Step 2: Read example.tsx from the same directory as the main file
    const examplePath = `${mainFileDir}/example.tsx`;
    const exampleCodeItem = await getCodeItemFromPath({path: examplePath});

    // Step 3: Build mapping of registry paths to target paths
    const importMapping = new Map<string, string>();

    registryItem.files.forEach((file) => {
        // Remove file extension from target
        const ext = path.extname(file.target);
        const targetWithoutExt = ext ? file.target.slice(0, -ext.length) : file.target;

        // Remove file extension from file.path for the registry import
        const fileExt = path.extname(file.path);
        const filePathWithoutExt = fileExt ? file.path.slice(0, -fileExt.length) : file.path;

        // Create the registry import path (with @ alias)
        const registryImportPath = `@/${filePathWithoutExt}`;

        // Map to the target path (with @ alias)
        importMapping.set(registryImportPath, `@/${targetWithoutExt}`);
    });

    // Step 4: Transform import paths in code
    function transformImports(code: string): string {
        let transformedCode = code;

        importMapping.forEach((targetPath, registryPath) => {
            // Match both single and double quotes, and handle potential spaces
            const regex = new RegExp(
                `(['"])${registryPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`,
                'g'
            );
            transformedCode = transformedCode.replace(regex, `$1${targetPath}$1`);
        });

        return transformedCode;
    }

    // Step 5 & 6: Set correct filenames and transform code
    const result: CodeItem[] = [];

    // Add transformed registry files
    registryItem.files.forEach((file, index) => {
        result.push({
            language: registryCodeItems[index].language,
            filename: `${file.target}`,
            code: transformImports(registryCodeItems[index].code),
        });
    });

    // Add transformed example.tsx as App.tsx
    result.push({
        language: exampleCodeItem.language,
        filename: "App.tsx",
        code: transformImports(exampleCodeItem.code),
    });

    // Add tsconfig.json
    result.push({
        language: "json",
        filename: "tsconfig.json",
        code: `{
  "include": [
    "./**/*"
  ],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "lib": ["dom", "es2015"],
    "jsx": "react-jsx",
     "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}`,
    });

    return result;
}