import {Head} from 'nextra/components'
import 'app/globals.css'
import {generatePageMetadata} from "@phucbm/next-og-image";
import {_metadata} from "@/lib/seo";

export const generateMetadata = generatePageMetadata({
    ..._metadata,
    canonicalPath: "/",
});

export default async function RootLayout({children}) {
    return (
        <html
            // Not required, but good for SEO
            lang="en"
            // Required to be set
            dir="ltr"
            // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
            suppressHydrationWarning
            style={{['--nextra-content-width' as any]: 'auto'}}
        >
        <Head>
            <script defer src="https://cloud.umami.is/script.js"
                    data-website-id="04f28117-bf34-4aa8-8db0-d1a26122aad2"></script>
        </Head>
        <body>
        {children}
        </body>
        </html>
    )
}