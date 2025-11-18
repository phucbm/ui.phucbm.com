import {OgImageInput} from "@phucbm/next-og-image";
import {_metadata} from "@/lib/seo";

type Props = OgImageInput & { logoUrl?: string };

export function OgImage(props: Props) {
    const {siteName, title, description, logoUrl} = props;
    return (
        <div style={{
            display: "flex",
            width: `100%`,
            height: `100%`,
            borderBottom: `15px solid ${_metadata.themeColor}`,
            background:"#fff"
        }}>
            <div
                style={{
                    width: `100%`,
                    height: `100%`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "48px",
                    // color: "#fff",
                    // background: `linear-gradient(135deg, #000, ${_metadata.themeColor})`,
                }}
            >

                <div style={{display: "flex", alignItems: "center", gap: 16}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {logoUrl && <img src={logoUrl} alt="" width="70" height="70"/>}
                    {siteName &&
                        <div style={{fontSize: 50, fontWeight: 900, letterSpacing: "-0.02em"}}>{siteName}</div>}
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                    <h1 style={{fontSize: 100, fontWeight: 800, margin: 0, lineHeight: 1.05}}>{title}</h1>
                    {description && (
                        <p
                            style={{
                                fontSize: 40,
                                margin: "0 0 5px",
                                maxWidth: "1000px",
                                opacity: 0.95,
                            }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}