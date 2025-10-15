import fs from "fs";
import path from "path";
import {CodeItem} from "@/components/code-block-view";

/**
 * Reads a file from a given path and returns a CodeItem.
 */
export async function getCodeItemFromPath({path: filePath}: { path: string }): Promise<CodeItem> {
    const absolutePath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

    const filename = path.basename(absolutePath);
    const ext = path.extname(filename).replace(".", ""); // e.g. "tsx", "css"

    const code = await fs.promises.readFile(absolutePath, "utf8");

    return {
        language: ext,
        filename,
        code,
    };
}