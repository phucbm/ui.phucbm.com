// import 'nextra-theme-docs/style.css'
import 'app/globals.css'
import {generatePageMetadata} from "@phucbm/next-og-image";
import {metadata} from "@/lib/seo";

export const generateMetadata = generatePageMetadata({
    ...metadata,
    canonicalPath: "/",
    // imageUrl: "/images/perxel.webp"
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
        >
        <body>
        {children}
        </body>
        </html>
    )
}