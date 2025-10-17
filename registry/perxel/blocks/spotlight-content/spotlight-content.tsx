"use client";

import gsap from "gsap";
import Observer from "gsap/Observer";
import {useRef} from "react";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(Observer);

export type SpotlightContentProps = {};

export function SpotlightContent({}: SpotlightContentProps) {
    const scope = useRef<HTMLElement | null>(null);

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;


            const getAreaIndex = (x: number, num: number) =>
                Math.min(Math.floor(Math.max(0, Math.min(1, x)) * num), num - 1);

            const observer = Observer.create({
                target: window,
                type: "pointer",
                onMove: ({x = 0, y = 0}) => {

                },
            });

            return () => observer.kill();
        },
        {scope}
    );

    return (
        <section
            ref={scope}
            className=""
        >




        </section>
    );
}