import {useMDXComponents as getThemeComponents} from 'nextra-theme-docs';
import {RegistryInstall} from "@/components/registry-install";
import {RegistryDemo} from "@/components/registry-demo"
import {RegistryPropsTable} from "@/components/registry-props-table";

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
    }
}