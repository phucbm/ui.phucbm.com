import {useMDXComponents as getThemeComponents} from 'nextra-theme-docs';
import {RegistryInstall} from "@/components/registry-install";
import {RegistryDemo} from "@/components/registry-demo"
import {RegistryPropsTable} from "@/components/registry-props-table";
import {RegistryExample} from "@/components/registry-example";
import {OpenInV0Button} from "@/components/OpenInV0Button";
import {Callout, Steps} from "nextra/components";
import {Components} from "@/components/components";

// Get the default MDX components
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components: any) {
    return {
        ...themeComponents,
        ...components,
        Callout: Callout,
        Steps: Steps,
        RegistryInstall: RegistryInstall,
        RegistryDemo: RegistryDemo,
        RegistryPropsTable: RegistryPropsTable,
        RegistryExample: RegistryExample,
        OpenInV0Button: OpenInV0Button,
        Components: Components,
    }
}