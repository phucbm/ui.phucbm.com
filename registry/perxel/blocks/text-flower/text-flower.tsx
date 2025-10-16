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
    /** Array of text strings to display as petals around the circular wheel. Each string represents one petal. */
    texts: string[];

    /** Whether to show position markers for debugging and layout visualization. @default false */
    markers?: boolean;

    /** Additional class name(s) for the outer wheel container element. Useful for control the sticky length. @default undefined */
    wheelContainerClass?: string;

    /** Additional class name(s) for the wheel element. Useful for customizing position and size of the flower. @default undefined */
    wheelPositionClass?: string;

    /** Additional class name(s) for each individual petal element. Useful for customizing text style or hover effects. @default undefined */
    petalClass?: string;
};


export function TextFlower({
                               texts,
                               markers = false,
                               wheelPositionClass,
                               wheelContainerClass,
                               petalClass,
                           }: TextFlowerProps) {
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

    const scope = useRef<HTMLElement | null>(null);
    useGSAP(() => {
        const root = scope.current;
        if (!root) return;

        // change scroller in case placed inside another scroll
        const scroller = root.closest('.overflow-auto') || window;

        const petals: NodeListOf<HTMLElement> = root.querySelectorAll('.petal');
        const wheelContainer: HTMLElement = root.querySelector('.wheel-container');
        const wheelPin = root.querySelector('.wheel-pin');
        const wheel: HTMLElement = root.querySelector('.wheel-rotation');

        // Function to update everything
        const updateLayout = () => {
            updatePetalsPosition(petals, wheel);
            ScrollTrigger.refresh();
        };

        // Initial setup
        updateLayout();

        // Watch for size changes
        const resizeObserver = new ResizeObserver(() => {
            updateLayout();
        });

        resizeObserver.observe(root);
        resizeObserver.observe(wheel);

        // Your existing animations...
        const startRotation = 60;
        gsap.fromTo(wheel, {rotate: startRotation}, {
            rotate: startRotation - (360 * 0.55),
            duration: 1.5,
            scrollTrigger: {
                trigger: wheelContainer,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                scroller
            }
        });

        ScrollTrigger.create({
            trigger: wheelContainer,
            start: "top top",
            end: "bottom bottom",
            pin: wheelPin,
            pinSpacing: false,
            scroller
        });

        // Cleanup
        return () => {
            resizeObserver.disconnect();
        };
    }, {scope});

    return (
        <section ref={scope} className="size-full">
            <div className={cn("wheel-container h-[200vh] @7xl:h-[300vh]", wheelContainerClass)}>
                <div className="wheel-pin fl-center overflow-hidden h-screen relative">

                    {/*control position and size of the wheel*/}
                    <div
                        className={cn("aspect-square absolute left-0 top-1/2 -translate-y-1/2 rounded-full",
                            "w-[300px] @xl:w-[500px] @7xl:w-[110vh]",
                            "-translate-x-[90%]",
                            wheelPositionClass)}>

                        {/*control rotation*/}
                        <div className="wheel-rotation absolute size-full">

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
            </div>
        </section>
    );
}

function updatePetalsPosition(petals: NodeListOf<HTMLElement>, wheel: HTMLElement) {
    const startAngle = 9; // degree, starting at the top
    const points = calculatePointsOnCircle(petals.length * 1.5, wheel.offsetWidth / 2, startAngle);

    petals.forEach((petal, index) => {
        // petal
        petal.style.setProperty("--x", `${points[index].x}px`);
        petal.style.setProperty("--y", `${points[index].y}px`);
        petal.style.setProperty("--rotate", `${points[index].rotate + startAngle}deg`);
    });
}
