import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {Head} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
// import 'nextra-theme-docs/style.css'
import 'app/globals.css'
import {generatePageMetadata} from "@phucbm/next-og-image";
import {metadata} from "@/lib/seo";

export const generateMetadata = generatePageMetadata({
    ...metadata,
    canonicalPath: "/",
    // imageUrl: "/images/perxel.webp"
});

// const banner = <Banner storageKey="some-key">This template was created with 🩸 and 💦 by <Link href="https://github.com/phucbm">PHUCBM</Link> 🐧</Banner>
const navbar = (
    <Navbar
        logo={<div className="flex items-center justify-start gap-2">
            <img src="/images/general/icon.svg" alt="Logo" width={20} height={20} className="h-[20px] aspect-square"/>
            <span className="font-bold">PERXEL</span>
        </div>}
        // ... Your additional navbar options
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Perxel UI</Footer>

export default async function RootLayout({children}) {
    return (
        <html
            // Not required, but good for SEO
            lang="en"
            // Required to be set
            dir="ltr"
            // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
            suppressHydrationWarning
        >
        <Head
            // ... Your additional head options
        >
            <link rel="shortcut icon" href="/images/general/icon.svg"/>
            {/* Your additional tags should be passed as `children` of `<Head>` element */}
        </Head>
        <body>
        <Layout
            // banner={banner}
            navbar={navbar}
            pageMap={await getPageMap()}
            docsRepositoryBase="https://github.com/phucbm/ui.perxel.com/tree/main"
            footer={footer}
        >
            {children}
        </Layout>
        </body>
        </html>
    )
}