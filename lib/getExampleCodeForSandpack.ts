import {RegistryItem} from "@/lib/getRegistryItem";
import {getCodeItemFromPath} from "@/lib/getCodeItemFromPath";

export async function getExampleCodeForSandpack(registryItem: RegistryItem) {
    const fileName = registryItem.name + '.tsx'
    const examplePath = registryItem.files[0].path.replace(fileName, `example.tsx`);
    let {code} = await getCodeItemFromPath({path: examplePath});

    code = code.replace(registryItem.files[0].path.replace('.tsx', ''),
        registryItem.files[0].target.replace('.tsx', ''));

    code = code.replace('@/', './');


    return code;
}