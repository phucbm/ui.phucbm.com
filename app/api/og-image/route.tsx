// app/api/og-image/route.ts
import {OgImageRenderFn, renderOgImage} from "@phucbm/next-og-image";
import {OgImage} from "@/components/og-image";

export const runtime = "edge";

export async function GET(request: Request) {
    const origin = new URL(request.url).origin;
    const logoUrl = new URL("/images/icon.svg", origin).toString(); // /public/logo.png -> /logo.png

    const render: OgImageRenderFn = (props) => <OgImage {...props} logoUrl={logoUrl}/>;

    return renderOgImage(request, render, {width: 1200, height: 630});
}