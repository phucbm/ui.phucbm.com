import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {getPageMap} from 'nextra/page-map'
// import 'nextra-theme-docs/style.css'
import 'app/globals.css'
import {Metadata} from "next";

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
            <img src="/images/general/icon.svg" alt="Logo" width={30} height={30} className="h-[30px] aspect-square"/>
            <span className="font-bold">ui/phucbm</span>
        </div>}
        // ... Your additional navbar options
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © ui/phucbm</Footer>

export default async function RootLayout({children}) {
    return (
        <Layout
            // banner={banner}
            navbar={navbar}
            pageMap={await getPageMap()}
            footer={footer}
            editLink={null}
            feedback={{
                content: "Questions? Drop me a message",
                link: "https://phucbm.com/connect"
            }}
        >
            <div className="p-docs-container">
                {children}
            </div>
        </Layout>
    )
}