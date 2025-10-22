import {generateDefinition, TSDoc} from "nextra/tsdoc";
import {getRegistryItem} from "@/lib/getRegistryItem";

export async function RegistryPropsTable({type, name}: { type?: string, name: string }) {
    const registryItem = await getRegistryItem(name);

    const propsType = type || `${registryItem.title.replaceAll(' ', '')}Props`;

    const definition = generateDefinition({
        code: `
import type { ${propsType} } from '@/${registryItem.files[0].path}'
export default ${propsType}
`,
    });

    return <TSDoc definition={definition}/>;
}
