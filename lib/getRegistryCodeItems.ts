import {CodeItem} from "@/components/code-block-view";
import {RegistryItem} from "shadcn/schema";
import {getCodeItemFromPath} from "@/lib/getCodeItemFromPath";

/**
 * Reads all files listed in a registry item and returns an array of CodeItems.
 */
export async function getRegistryCodeItems({
                                               registryItem,
                                           }: {
    registryItem: RegistryItem;
}): Promise<CodeItem[]> {
    return Promise.all(
        registryItem.files.map((file) =>
            getCodeItemFromPath({path: file.path}).then((item) => ({
                ...item,
                // Preserve the filename or target name from the registry definition
                filename: file.target || item.filename,
            }))
        )
    );
}