"use client";

import gsap from "gsap";
import Observer from "gsap/Observer";
import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import {getNormalizedMousePosition} from "normalized-mouse-position";
import {applyRippleEffect} from "@phucbm/ripple-effect";

gsap.registerPlugin(Observer);

export type TextRippleProps = {
    /** Top line text (split into characters) */
    line1: string;
    /** Bottom line text (split into characters) */
    line2: string;
    /** Optional extra classes applied to the wrapper */
    className?: string;
};

export function TextRipple({line1, line2, className}: TextRippleProps) {
    const scope = useRef<HTMLElement | null>(null);

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const line1 = root.querySelectorAll(".hero-heading.is-top");
            const line2 = root.querySelectorAll(".hero-heading.is-bottom");
            const n = Math.max(line1.length, line2.length);
            if (!n) return;

            const getAreaIndex = (x: number, num: number) =>
                Math.min(Math.floor(Math.max(0, Math.min(1, x)) * num), num - 1);

            const observer = Observer.create({
                target: window,
                type: "pointer",
                onMove: ({x = 0, y = 0}) => {
                    const pos = getNormalizedMousePosition({x, y, origin: "0% 50%"});
                    const center = getAreaIndex(pos.x, n);

                    const anim = (val: number, i: number) => {
                        const s = 1 + val * 2.5 * Math.abs(pos.y);
                        gsap.to([line1[i], line2[i]].filter(Boolean), {scaleY: s, duration: 0.2, overwrite: "auto"});
                    };

                    applyRippleEffect({
                        length: n,
                        centerIndex: center,
                        rippleRadius: 6,
                        callback: anim,
                    });
                },
            });

            return () => observer.kill();
        },
        {scope}
    );

    return (
        <section
            ref={scope}
            className={`flex flex-col items-center justify-center
        w-full overflow-hidden
        font-bold leading-[0.7em] uppercase
         
         h-[400px] @7xl:h-screen
         text-[30px] @xl:text-[60px] @7xl:text-[100px]
         gap-2 @xl:gap-4
         
          ${className}
         `}
        >
            <div className="flex">
                {line1.split("").map((ch, i) => (
                    <div key={`t-${i}`}
                         className="hero-heading is-top text-[#06f] origin-bottom"
                    >
                        {ch}
                    </div>
                ))}
            </div>

            <div className="flex">
                {line2.split("").map((ch, i) => (
                    <div key={`c-${i}`}
                         className="hero-heading is-bottom text-[#0f8] origin-top"
                    >
                        {ch}
                    </div>
                ))}
            </div>
        </section>
    );
}