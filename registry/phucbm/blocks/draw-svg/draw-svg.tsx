"use client";
import * as React from 'react';
import {ReactNode, useRef} from 'react';
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {DrawSVGPlugin} from "gsap/DrawSVGPlugin";
import {useGSAP} from "@gsap/react";
import TimelineVars = gsap.TimelineVars;

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export type DrawSVGProps = {
    /** React children containing the SVG element to animate */
    children: ReactNode;
    /** Additional CSS classes to apply to the wrapper div */
    className?: string;
    /** GSAP Timeline configuration. Overrides defaults when provided. @default
     *   { scrollTrigger: {
     *   start: "top 80%",
     *   end: "top 50%",
     *   toggleActions: "play none none reverse"
     *  }}*/
    timelineConfig?: TimelineVars;
    /** Total duration of the animation in seconds. @default 1.5 */
    duration?: number;
    /** Animate paths in reverse (from drawn to hidden). @default false */
    reverse?: boolean;
    /** Enable infinite looping with yoyo effect. @default false */
    loop?: boolean;
    /** Animate all paths simultaneously instead of sequentially. @default false */
    atOnce?: boolean;
    /** Callback fired when the GSAP timeline is ready for manual control */
    onTimelineReady?: (timeline: gsap.core.Timeline) => void;
};

export function DrawSVG({
                            children,
                            timelineConfig,
                            className,
                            duration = 1.5,
                            reverse = false,
                            loop = false,
                            atOnce = false,
                            onTimelineReady
                        }: DrawSVGProps) {
    const scope = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            let paths = Array.from(root.querySelectorAll<SVGPathElement>("svg path"));
            if (paths.length === 0) return;

            // hide paths
            gsap.set(paths, {opacity: 0});

            // filter hidden path
            paths = paths.filter(path => {
                const stroke = path.getAttribute("stroke");
                const fill = path.getAttribute("fill");
                return !(stroke === "none" && fill === "none");
            });


            const defaultTimelineConfig: TimelineVars = {
                scrollTrigger: {
                    trigger: root,
                    start: "top 80%",
                    end: "top 50%",
                    toggleActions: "play none none reverse",
                },
                ...(loop && {yoyo: true, repeat: -1})
            };

            const tl = gsap.timeline(
                onTimelineReady
                    ? (timelineConfig || {})
                    : (timelineConfig || defaultTimelineConfig)
            );
            tl.set(root, {opacity: 1});

            // draw paths
            paths.forEach((path) => {
                tl.set(path, {opacity: 1}, atOnce ? 0 : undefined);
                tl.fromTo(
                    path,
                    {drawSVG: reverse ? "100% 100%" : "0 0"},
                    {
                        drawSVG: reverse ? "100% 0" : "0 100%",
                        duration: atOnce ? duration : getPathProportionalDuration(duration, paths, path)
                    },
                    atOnce ? 0 : undefined
                );
            });

            if (onTimelineReady) onTimelineReady(tl);

            // set duration
            tl.duration(duration)

            return () => {
                tl.kill();
            };
        },
        {scope}
    );

    return <div ref={scope} className={className} style={{opacity: 0}}>{children}</div>;
}

function getPathProportionalDuration(duration: number, paths: SVGPathElement[] | NodeListOf<SVGPathElement>, path: SVGPathElement) {
    const maxLength = Math.max(...Array.from(paths).map(p => p.getTotalLength()));
    const durationPerPath = duration / paths.length;

    const pathLength = path.getTotalLength();
    return (pathLength / maxLength) * durationPerPath;
}