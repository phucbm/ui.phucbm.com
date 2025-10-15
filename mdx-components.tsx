import {useMDXComponents as getThemeComponents} from 'nextra-theme-docs';
import {RegistryInstall} from "@/components/registry-install";
import {RegistryDemo} from "@/components/registry-demo"
import {RegistryPropsTable} from "@/components/registry-props-table";
import {RegistryExample} from "@/components/registry-example";

// Get the default MDX components
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components: any) {
    return {
        ...themeComponents,
        ...components,
        RegistryInstall: RegistryInstall,
        RegistryDemo: RegistryDemo,
        RegistryPropsTable: RegistryPropsTable,
        RegistryExample: RegistryExample,
    }
}