import {RegistryItem} from "@/lib/getRegistryItem";
import path from "path";
import fs from "fs";

export default async function getRegistryCodeItems({registryItem}: { registryItem: RegistryItem }) {
    // Resolve all files listed in the registry item
    return await Promise.all(
        registryItem.files.map(async (file) => {
            const filePath = path.join(process.cwd(), file.path);
            const filename = path.basename(filePath);
            const ext = path.extname(filename).replace(".", ""); // e.g. "tsx", "css"

            const content = await fs.promises.readFile(filePath, "utf8");

            return {
                language: ext,
                filename,
                code: content,
            };
        })
    );
}