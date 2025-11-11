import {Layout, Navbar} from 'nextra-theme-docs'
import {getPageMap} from 'nextra/page-map'
import 'app/globals.css'
import {Metadata} from "next";
import {IconBrandDiscord} from "@tabler/icons-react";
import {MyFooter} from "@/components/footer";
import {Search} from "nextra/components";

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
    return (
        <Layout
            // banner={banner}
            navbar={navbar}
            pageMap={await getPageMap()}
            footer={<MyFooter/>}
            editLink={null}
            feedback={{
                content: <div className="flex items-center gap-1">
                    Got questions? Join my <IconBrandDiscord className="w-5"/>
                </div>,
                link: "https://discord.gg/HnWtpWQRTt"
            }}
            search={<Search placeholder="Search components..."/>}
        >
            <div className="p-docs-container">
                {children}
            </div>
        </Layout>
    )
}