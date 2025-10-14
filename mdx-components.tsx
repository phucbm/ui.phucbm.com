import {useMDXComponents as getThemeComponents} from 'nextra-theme-docs';
import {AddRegistry} from "@/components/add-registry";
import {DemoRegistry} from "@/components/demo-registry"

// Get the default MDX components
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components: any) {
    return {
        ...themeComponents,
        ...components,
        AddRegistry,
        DemoRegistry
    }
}