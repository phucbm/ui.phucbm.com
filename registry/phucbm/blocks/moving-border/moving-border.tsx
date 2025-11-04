"use client";
import * as React from 'react';
import {useRef} from 'react';
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {cn} from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

export type MovingBorderProps = {
    children: React.ReactNode;
    className?: string;
    outerClassName?: string;
    borderWidth?: number;
    gradientWidth?: number;
    radius?: number;
    duration?: number;
    colors?: string[];
};

export function MovingBorder({
                                 children,
                                 className,
                                 outerClassName,
                                 borderWidth = 1,
                                 radius = 15,
                                 gradientWidth,
                                 duration = 3,
                                 colors = ["#355bd2"]
                             }: MovingBorderProps) {
    const scope = useRef(null);
    useGSAP(
        () => {
            const root = scope.current as HTMLElement | null;
            if (!root) return;

            const movingGradient = root.querySelector<HTMLElement>(".moving-gradient");
            if (!movingGradient) return;

            let pathTl: gsap.core.Timeline | null = null;
            let colorTl: gsap.core.Timeline | null = null;

            // Function to create/update the path animation
            const updateAnimation = () => {
                // Kill existing timeline if it exists
                if (pathTl) {
                    pathTl.kill();
                }

                // Get current dimensions
                const rect = root.getBoundingClientRect();
                const width = rect.width - borderWidth * 2;
                const height = rect.height - borderWidth * 2;

                // Calculate the path points accounting for border radius
                const path = [
                    {x: radius, y: 0},
                    {x: width - radius, y: 0},
                    {x: width, y: radius},
                    {x: width, y: height - radius},
                    {x: width - radius, y: height},
                    {x: radius, y: height},
                    {x: 0, y: height - radius},
                    {x: 0, y: radius},
                    {x: radius, y: 0},
                ];

                // Create new timeline for path
                pathTl = gsap.timeline({
                    repeat: -1,
                    defaults: {ease: "none", duration: duration}
                });

                pathTl.to(movingGradient, {
                    motionPath: {
                        path: path,
                        fromCurrent: false,
                        curviness: 1.5,
                    }
                });
            };

            // Function to create color animation
            const setupColorAnimation = () => {
                if (colors.length <= 1) {
                    // Single color - just set it
                    root.style.setProperty('--color', colors[0]);
                    return;
                }

                // Multiple colors - animate through them
                colorTl = gsap.timeline({
                    repeat: -1,
                    defaults: {ease: "none", duration: duration / 2}
                });

                colors.forEach((color, index) => {
                    const nextColor = colors[(index + 1) % colors.length];
                    colorTl!.to(root, {'--color': nextColor});
                });
            };

            // Initial setup
            updateAnimation();
            setupColorAnimation();

            // Watch for size changes
            const resizeObserver = new ResizeObserver(() => {
                updateAnimation();
            });

            resizeObserver.observe(root);

            // Cleanup
            return () => {
                if (pathTl) {
                    pathTl.kill();
                }
                if (colorTl) {
                    colorTl.kill();
                }
                resizeObserver.disconnect();
            };
        },
        {scope, dependencies: [borderWidth, radius, gradientWidth, duration, colors]}
    );

    return (
        // wrapper
        <div ref={scope} className={cn(`wrapper relative overflow-hidden`, outerClassName)}
             style={{
                 ['--color' as any]: colors[0],
                 padding: `${borderWidth}px`,
                 borderRadius: `${radius + borderWidth}px`,
             }}>

            {/* moving gradient*/}
            <div className="moving-gradient aspect-square absolute top-0 left-0" style={{width: `${borderWidth}px`}}>
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full"
                    style={{
                        width: `${gradientWidth || borderWidth * 10}px`,
                        background: `radial-gradient(circle, var(--color) 0%, transparent 70%)`
                    }}>
                </div>
            </div>

            {/*inner*/}
            <div className={cn(`inner relative z-30 bg-white`, className)}
                 style={{
                     borderRadius: `${radius}px`,
                 }}>
                {children}
            </div>
        </div>
    );
}