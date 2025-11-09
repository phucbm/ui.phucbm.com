import {DrawSVG} from "@/registry/phucbm/blocks/draw-svg/draw-svg";

export default function Example() {
    return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center
        gap-10 px-10 py-10 xl:gap-40 xl:py-40
        xl:[&_svg]:w-40 [&_svg]:w-32 xl:[&_svg]:h-40 [&_svg]:h-32 [&_svg]:text-blue-500
        ">

            <div className="grid grid-cols-2 gap-10 xl:gap-40">
                <DrawSVG duration={3}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-olympics">

                        <path d="M6 9m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        <path d="M18 9m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        <path d="M12 9m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        <path d="M9 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        <path d="M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                    </svg>
                </DrawSVG>
                <DrawSVG duration={3}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-cpu">

                        <path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z"/>
                        <path d="M9 9h6v6h-6z"/>
                        <path d="M3 10h2"/>
                        <path d="M3 14h2"/>
                        <path d="M10 3v2"/>
                        <path d="M14 3v2"/>
                        <path d="M21 10h-2"/>
                        <path d="M21 14h-2"/>
                        <path d="M14 21v-2"/>
                        <path d="M10 21v-2"/>
                    </svg>
                </DrawSVG>
                <DrawSVG duration={2} atOnce={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-aperture">
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                        <path d="M3.6 15h10.55"/>
                        <path d="M6.551 4.938l3.26 10.034"/>
                        <path d="M17.032 4.636l-8.535 6.201"/>
                        <path d="M20.559 14.51l-8.535 -6.201"/>
                        <path d="M12.257 20.916l3.261 -10.034"/>
                    </svg>
                </DrawSVG>

                <DrawSVG duration={2} atOnce={true}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.073 21c4.286 -2.756 5.9 -5.254 7.927 -9"/>
                        <path
                            d="M12.432 17.949c.863 1.544 2.589 1.976 4.13 1.112c1.54 -.865 1.972 -2.594 1.048 -4.138c-.185 -.309 -.309 -.556 -.494 -.74c.247 .06 .555 .06 .925 .06c1.726 0 2.959 -1.234 2.959 -2.963c0 -1.73 -1.233 -2.965 -3.02 -2.965c-.37 0 -.617 0 -.925 .062c.185 -.185 .308 -.432 .493 -.74c.863 -1.545 .431 -3.274 -1.048 -4.138c-1.541 -.865 -3.205 -.433 -4.13 1.111c-.185 .309 -.308 .556 -.432 .803c-.123 -.247 -.246 -.494 -.431 -.803c-.802 -1.605 -2.528 -2.038 -4.007 -1.173c-1.541 .865 -1.973 2.594 -1.048 4.137c.185 .31 .308 .556 .493 .741c-.246 -.061 -.555 -.061 -.924 -.061c-1.788 0 -3.021 1.235 -3.021 2.964c0 1.729 1.233 2.964 3.02 2.964"/>
                    </svg>
                </DrawSVG>

                <DrawSVG duration={5}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                        <path d="M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"/>
                        <path d="M6 12h4"/>
                        <path d="M14 12h4"/>
                        <path d="M15 7l-2 3"/>
                        <path d="M9 7l2 3"/>
                        <path d="M11 14l-2 3"/>
                        <path d="M13 14l2 3"/>
                        <path d="M10 5h4"/>
                        <path d="M10 19h4"/>
                        <path d="M17 17l2 -3"/>
                        <path d="M19 10l-2 -3"/>
                        <path d="M7 7l-2 3"/>
                        <path d="M5 14l2 3"/>
                    </svg>
                </DrawSVG>

                <DrawSVG>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path
                            d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/>
                    </svg>
                </DrawSVG>
                <DrawSVG duration={3}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-ikosaedr">

                        <path
                            d="M21 8.007v7.986a2 2 0 0 1 -1.006 1.735l-7 4.007a2 2 0 0 1 -1.988 0l-7 -4.007a2 2 0 0 1 -1.006 -1.735v-7.986a2 2 0 0 1 1.006 -1.735l7 -4.007a2 2 0 0 1 1.988 0l7 4.007a2 2 0 0 1 1.006 1.735"/>
                        <path d="M3.29 6.97l4.21 2.03"/>
                        <path d="M20.71 6.97l-4.21 2.03"/>
                        <path d="M20.7 17h-17.4"/>
                        <path d="M11.76 2.03l-4.26 6.97l-4.3 7.84"/>
                        <path d="M12.24 2.03q 2.797 4.44 4.26 6.97t 4.3 7.84"/>
                        <path d="M12 17l-4.5 -8h9z"/>
                        <path d="M12 17v5"/>
                    </svg>
                </DrawSVG>

                <DrawSVG reverse={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 11l4 4l-4 4m4 -4h-11a4 4 0 0 1 0 -8h1"/>
                    </svg>
                </DrawSVG>

                <DrawSVG reverse={true}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-fingerprint">

                        <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3"/>
                        <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6"/>
                        <path d="M12 11v2a14 14 0 0 0 2.5 8"/>
                        <path d="M8 15a18 18 0 0 0 1.8 6"/>
                        <path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95"/>
                    </svg>
                </DrawSVG>
            </div>

        </div>
    );
}