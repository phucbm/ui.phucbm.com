import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {ComponentsSideBar} from "@/components/components-side-bar";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ComponentsSideBar/>
            <main>
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    )
}