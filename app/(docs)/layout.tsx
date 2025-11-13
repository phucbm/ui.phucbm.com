import {Layout, Navbar} from 'nextra-theme-docs'
import {getPageMap} from 'nextra/page-map'
import 'app/globals.css'
import {Metadata} from "next";
import {IconBrandDiscord} from "@tabler/icons-react";
import {MyFooter} from "@/components/footer";
import {MySearch} from "@/components/search";
import {getPagesFromPageMap} from "@/lib/getPagesFromPageMap";

export const metadata: Metadata = {
    title: {
        absolute: '',
        template: '%s - ui/phucbm'
    }
}

// const banner = <Banner storageKey="some-key">This template was created with 🩸 and 💦 by <Link href="https://github.com/phucbm">PHUCBM</Link> 🐧</Banner>
const navbar = (
    <Navbar
        logo={<div className="flex items-center justify-start gap-2">
            <img src="/images/icon.svg" alt="Logo" width={30} height={30} className="h-[30px] aspect-square"/>
            <span className="font-bold">ui/phucbm</span>
        </div>}
        // ... Your additional navbar options
    />
)

export default async function RootLayout({children}) {
    const pageMap = await getPageMap();

    return (
        <Layout
            // banner={banner}
            navbar={navbar}
            pageMap={pageMap}
            footer={<MyFooter/>}
            editLink={null}
            feedback={{
                content: <div className="flex items-center gap-1">
                    Got questions? Join my <IconBrandDiscord className="w-5"/>
                </div>,
                link: "https://discord.gg/HnWtpWQRTt"
            }}
            search={<MySearch pages={getPagesFromPageMap(pageMap)}/>}
        >
            <div className="p-docs-container relative z-[1]">
                {children}
            </div>
        </Layout>
    )
}