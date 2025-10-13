// app/robots.ts
import type {MetadataRoute} from "next";

export default function robots(): MetadataRoute.Robots {
    const comingSoon = process.env.SHOW_COMING_SOON?.toLowerCase() === "true";

    return comingSoon
        ? {
            rules: [{userAgent: "*", disallow: "/"}],
        }
        : {
            rules: [{userAgent: "*", allow: "/"}],
            sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
        };
}