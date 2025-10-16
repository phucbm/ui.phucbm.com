"use client";

import * as React from 'react';
import {useRef} from 'react';
import {useGSAP} from "@gsap/react";
import {calculatePointsOnCircle} from "@/registry/perxel/blocks/text-flower/lib/calculatePointsOnCircle";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {cn} from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);


export type TextFlowerProps = {
    /** Array of text strings to display as petals around the wheel. */
    texts: string[];

    /** Show markers for debugging. @default false */
    markers?: boolean;

    /** Additional class name(s) for customizing the wheel. @default undefined */
    wheelContainerClass?: string;

    /** Additional class name(s) for customizing the wheel. @default undefined */
    wheelClass?: string;

    /** Additional class name(s) for customizing the wheel. @default undefined */
    petalClass?: string;
};


export function TextFlower({texts, markers = false, wheelClass, wheelContainerClass, petalClass}: TextFlowerProps) {
    texts = texts ?? [
        "Make a song for my friend Earl.",
        "Make a song about the moon.",
        "Make a song about mom's cooking.",
        "Make a song for lunch.",
        "Make a song for your goldfish.",
        "Make a song about the dentist.",
        "Make a song about the Sunday Scaries.",
        "Make a song for your workout.",
        "Make a song for the hopdays.",
        "Make a song about mitochondria.",
        "Make a happy song.",
        "Make a song that feels how you feel.",
        "Make a song with Suno.",
    ];
    // texts = [...texts, ...texts];

    const scope = useRef<HTMLElement | null>(null);
    useGSAP(() => {
        const root = scope.current;
        if (!root) return;

        // const isWindowScroller = !root.closest('.overflow-auto');
        const scroller = root.closest('.overflow-auto') || window;

        const petals: NodeListOf<HTMLElement> = root.querySelectorAll('.petal');
        const wheelContainer: HTMLElement = root.querySelector('.wheel-container');
        const wheelPin = root.querySelector('.wheel-pin');
        const wheel: HTMLElement = root.querySelector('.wheel');

        updatePetalsPosition(petals, wheel);

        // rotate the wheel on scroll
        gsap.fromTo(wheel, {rotate: `50deg`}, {
            rotate: `-75deg`,
            duration: 1.5,
            scrollTrigger: {
                trigger: wheelContainer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                scroller
            }
        });

        // pin the wheel on screen
        ScrollTrigger.create({
            trigger: wheelContainer,           // the container that controls the timeline
            start: "top top",              // pin starts when top of wheelContainer hits top of viewport
            end: "bottom bottom",          // pin ends when bottom of wheelContainer hits bottom of viewport
            pin: wheelPin,         // the element to pin
            pinSpacing: false,             // IMPORTANT: set to false since wheelContainer already has height
            // markers: true,
            scroller
        });
    }, {scope});

    return (
        <section ref={scope} className="size-full">
            <div className={cn("wheel-container h-[300vh]", wheelContainerClass)}>
                <div className="wheel-pin fl-center overflow-hidden h-screen">
                    <div
                        className={cn("wheel aspect-square absolute left-0 top-1/2 -translate-y-1/2 rounded-full",
                            "w-[110vh] -translate-x-[90%]",
                            wheelClass)}>

                        {/*dev grid*/}
                        {markers &&
                            <div className="absolute size-full ring ring-blue-600 rounded-full">
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-[1px] bg-blue-600"></div>
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-[1px] bg-blue-600 rotate-90"></div>
                            </div>
                        }

                        {/*petals*/}
                        {texts.map((text, i) => (
                            <div key={i}
                                 className="petal absolute top-[var(--y)] left-[var(--x)] -translate-1/2 rotate-[var(--rotate)]">
                                <div
                                    className={cn(
                                        "absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 text-nowrap origin-[0_50%]",
                                        "text-[25px] @xl:text-[40px] @7xl:text-[80px]",
                                        petalClass)}>
                                    {text}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
}

function updatePetalsPosition(petals: NodeListOf<HTMLElement>, wheel: HTMLElement) {
    const startAngle = 9; // degree, starting at the top
    const points = calculatePointsOnCircle(petals.length * 2, wheel.offsetWidth / 2, startAngle);

    petals.forEach((petal, index) => {
        // petal
        petal.style.setProperty("--x", `${points[index].x}px`);
        petal.style.setProperty("--y", `${points[index].y}px`);
        petal.style.setProperty("--rotate", `${points[index].rotate + 10}deg`);
    });
}
