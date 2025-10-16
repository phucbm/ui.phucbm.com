"use client";

import './text-flower.css';

import * as React from 'react';
import {useRef} from 'react';
import {useGSAP} from "@gsap/react";
import {calculatePointsOnCircle} from "@/registry/perxel/blocks/text-flower/lib/calculatePointsOnCircle";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type TextFlowerProps = {};

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

export function TextFlower(props: TextFlowerProps) {
    const scope = useRef<HTMLElement | null>(null);
    useGSAP(() => {
        const root = scope.current;
        if (!root) return;

        // const isWindowScroller = !root.closest('.overflow-auto');
        const scroller = root.closest('.overflow-auto') || window;

        const petals: NodeListOf<HTMLElement> = root.querySelectorAll('.petal');
        const wheel: HTMLElement = root.querySelector('.wheel');
        const musicWheel: HTMLElement = root.querySelector('.music-wheel');
        const musicWheelSticky = root.querySelector('.music-wheel-sticky');

        updatePetalsPosition(petals, wheel);

        gsap.fromTo(wheel, {rotate: `50deg`}, {
            rotate: `-75deg`,
            // yoyo: true,
            // repeat: -1,
            duration: 1.5,
            // ease: 'power4.inOut',
            scrollTrigger: {
                trigger: musicWheel,
                start: 'top top',
                // end: 'bottom bottom',
                // markers: true,
                end: "+=3000px",
                scrub: true,
                scroller
            }
        });


        ScrollTrigger.create({
            trigger: musicWheel,           // the container that controls the timeline
            start: "top top",              // pin starts when top of musicWheel hits top of viewport
            end: "bottom bottom",          // pin ends when bottom of musicWheel hits bottom of viewport
            pin: musicWheelSticky,         // the element to pin
            pinSpacing: false,             // IMPORTANT: set to false since musicWheel already has height
            // markers: true,
            scroller
        });
    }, {scope})
    return (
        <section ref={scope} className="size-full">
            <div className="music-wheel">
                <div className="music-wheel-sticky fl-center">
                    <div className="wheel">
                        <div className="petal"><span>Make a song for my friend Earl.</span></div>
                        <div className="petal"><span>Make a song about the moon.</span></div>
                        <div className="petal"><span>Make a song about mom's cooking.</span></div>
                        <div className="petal"><span>Make a song for lunch.</span></div>
                        <div className="petal"><span>Make a song for your goldfish.</span></div>
                        <div className="petal"><span>Make a song about the dentist.</span></div>
                        <div className="petal"><span>Make a song about the Sunday Scaries.</span></div>
                        <div className="petal"><span>Make a song for your workout.</span></div>
                        <div className="petal"><span>Make a song for the hopdays.</span></div>
                        <div className="petal"><span>Make a song about mitochondria.</span></div>
                        <div className="petal"><span>Make a happy song.</span></div>
                        <div className="petal"><span>Make a song that feels how you feel.</span></div>
                        <div className="petal"><span>Make a song with Suno.</span></div>
                        <div className="petal"><span>Make a song for my friend Earl.</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
}