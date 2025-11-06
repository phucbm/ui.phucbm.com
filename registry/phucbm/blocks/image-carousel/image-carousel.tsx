"use client";

import React, {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {Observer} from "gsap/Observer";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(Observer);

export type ImageCarouselProps = {
    /** List of image objects to display in the carousel. Each must contain a valid `url` property. @default exampleImages (imported from ./utils/demo-images) */
    images: { url: string }[];

    /** Base speed factor of the auto-scrolling motion. Higher values make the carousel scroll faster. @default 1 */
    speed?: number;

    /** Ratio applied to slow down the carousel when hovering. 0.5 = half speed, 1 = same speed, >1 = faster on hover. @default 0.5 */
    hoverSlowdownRatio?: number;

    /** Whether the carousel should automatically slide without user interaction. If false, it stays static until dragged. @default true */
    autoSlide?: boolean;

    /** The width of each slide item. Accepts any valid CSS size unit (e.g. `"120px"`, `"10rem"`, `"20%"`). @default "8.3vw" */
    slideWidth?: string;

    /** The horizontal gap between slides. Accepts any valid CSS size unit. @default "35px" */
    slideGap?: string;

    /** Scroll direction of the carousel. `1` = scrolls right→left, `-1` = scrolls left→right. @default 1 */
    direction?: 1 | -1;
};

export function ImageCarousel(props: ImageCarouselProps) {
    const {
        speed = 1,
        hoverSlowdownRatio = 0.5,
        autoSlide = true,
        images,
        slideWidth = "8.3vw",
        slideGap = "35px",
        direction = 1,
    } = props;

    // Reference to the main carousel container element
    const carouselContainerRef = useRef<HTMLDivElement | null>(null);

    // Number of times to duplicate the image set to create seamless infinite scroll
    const [repeatCount, setRepeatCount] = useState(2);

    // Current speed multiplier (can be modified by hover interactions)
    const currentSpeedFactorRef = useRef(0.5);

    // Base speed provided by props (stored in ref to avoid recreation of effects)
    const baseSpeedRef = useRef(speed);

    // Hover slowdown ratio from props (stored in ref for ticker function access)
    const hoverSlowdownRatioRef = useRef(hoverSlowdownRatio);

    // Normal operating speed when not hovering
    const normalSpeedRef = useRef(0.5);

    // Auto-slide flag from props (stored in ref for ticker function access)
    const autoSlideEnabledRef = useRef(autoSlide);

    // Accumulated horizontal scroll distance (in pixels)
    const totalScrollDistanceRef = useRef(0);

    // GSAP quickTo function for optimized x-position updates with wrapping
    const animateToXPositionRef = useRef<((value: number) => void) | null>(null);

    // === Sync props to refs when they change ===
    // This allows the GSAP ticker and event handlers to access latest prop values
    useEffect(() => {
        baseSpeedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        hoverSlowdownRatioRef.current = hoverSlowdownRatio;
    }, [hoverSlowdownRatio]);

    useEffect(() => {
        autoSlideEnabledRef.current = autoSlide;
    }, [autoSlide]);

    // === Main GSAP animation setup ===
    useGSAP(
        () => {
            const rootElement = carouselContainerRef.current;
            if (!rootElement) return;

            // Get the sliding image list container
            const slideContainer = rootElement.querySelector(".images") as HTMLUListElement | null;

            // Get the overflow wrapper container
            const overflowContainer = rootElement.querySelector(
                ".overflow-hidden"
            ) as HTMLElement | null;

            if (!slideContainer || !overflowContainer) return;

            // Clean up any existing animations and reset position
            gsap.killTweensOf(slideContainer);
            gsap.set(slideContainer, {x: 0});
            totalScrollDistanceRef.current = 0;

            // === Measure dimensions for infinite scroll setup ===
            const slideItems = Array.from(
                slideContainer.querySelectorAll<HTMLElement>(".slide-item")
            );
            if (!slideItems.length) return;

            // Number of original images (before duplication)
            const originalImageCount = images.length;

            // Get the first set of slides (one complete loop of images)
            const firstImageSet = slideItems.slice(0, originalImageCount);

            /**
             * Calculate the outer width of an element including margins
             * This is needed because getBoundingClientRect doesn't include margins
             */
            const getElementOuterWidth = (element: HTMLElement) => {
                const boundingWidth = element.getBoundingClientRect().width;
                const computedStyle = getComputedStyle(element);
                const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
                const marginRight = parseFloat(computedStyle.marginRight) || 0;
                return boundingWidth + marginLeft + marginRight;
            };

            // Calculate the total width of one complete set of images
            let singleSetWidth = firstImageSet.reduce(
                (totalWidth, element) => totalWidth + getElementOuterWidth(element),
                0
            );

            // Snap to nearest 0.5px to avoid sub-pixel rendering issues
            const snapToHalfPixel = gsap.utils.snap(0.5);
            singleSetWidth = snapToHalfPixel(singleSetWidth);

            // Calculate how many times to duplicate the image set for seamless infinite scroll
            // We need enough copies to fill the container width plus extra for smooth wrapping
            const containerWidth = overflowContainer.clientWidth;
            const calculatedRepeatCount = Math.ceil(containerWidth / singleSetWidth) + 2;
            setRepeatCount(calculatedRepeatCount);

            // Create a wrapping function that keeps x position within one set width
            // When we scroll past -singleSetWidth, it wraps back to 0 (seamless loop)
            const wrapXPosition = gsap.utils.wrap(-singleSetWidth, 0);

            // Create an optimized animation function using GSAP's quickTo
            // This provides smooth, performant updates with wrapping behavior
            animateToXPositionRef.current = gsap.quickTo(slideContainer, "x", {
                duration: 0.1,
                ease: "power3",
                modifiers: {x: gsap.utils.unitize(wrapXPosition)},
            });

            // === Auto-scroll ticker function ===
            // This runs on every frame to create the continuous scroll effect
            const autoScrollTick = (_time: number, deltaTime: number) => {
                // Only auto-scroll if enabled
                if (!autoSlideEnabledRef.current) return;

                // Calculate movement speed based on base speed and current speed factor
                const currentMoveSpeed = baseSpeedRef.current * currentSpeedFactorRef.current;

                // Update total scroll distance (deltaTime is in seconds, multiply for smooth movement)
                totalScrollDistanceRef.current -= deltaTime * currentMoveSpeed * direction;

                // Apply the new position with wrapping
                animateToXPositionRef.current?.(totalScrollDistanceRef.current);
            };

            // Add the ticker to GSAP's main loop
            gsap.ticker.add(autoScrollTick);

            // === Hover slowdown behavior ===
            // Slow down carousel when user hovers over it
            const handleMouseEnter = () => {
                currentSpeedFactorRef.current =
                    normalSpeedRef.current * hoverSlowdownRatioRef.current;
            };

            // Return to normal speed when mouse leaves
            const handleMouseLeave = () => {
                currentSpeedFactorRef.current = normalSpeedRef.current;
            };

            slideContainer.addEventListener("mouseenter", handleMouseEnter);
            slideContainer.addEventListener("mouseleave", handleMouseLeave);

            // === Drag/swipe behavior ===
            // Create a timeline for potential drag animations (currently unused but set up for future)
            const dragTimeline = gsap.timeline({paused: true});

            // Set up GSAP Observer for drag/swipe interactions
            const dragObserver = Observer.create({
                target: slideContainer,
                type: "pointer,touch", // Handle both mouse and touch events
                onPress: () => {
                    // Play timeline when user starts dragging (placeholder for future animations)
                    dragTimeline.play();
                },
                onDrag: (observerInstance) => {
                    // Update scroll position based on drag delta
                    totalScrollDistanceRef.current += observerInstance.deltaX;
                    animateToXPositionRef.current?.(totalScrollDistanceRef.current);
                },
                onRelease: () => {
                    // Reverse timeline when user stops dragging
                    dragTimeline.reverse();
                },
                onStop: () => {
                    // Reverse timeline if drag is interrupted
                    dragTimeline.reverse();
                },
            });


            // === Cleanup function ===
            // Remove all event listeners and kill animations when component unmounts or dependencies change
            return () => {
                slideContainer.removeEventListener("mouseenter", handleMouseEnter);
                slideContainer.removeEventListener("mouseleave", handleMouseLeave);
                gsap.ticker.remove(autoScrollTick);
                dragObserver.kill();
                gsap.killTweensOf(slideContainer);
                animateToXPositionRef.current = null;
            };
        },
        {
            // Re-run setup when any of these dependencies change
            dependencies: [
                autoSlide,
                speed,
                hoverSlowdownRatio,
                slideGap,
                slideWidth,
                images.length,
                direction,
            ],
        }
    );


    return (
        <section
            className="slide-carousel"
            ref={carouselContainerRef}
            style={
                {
                    // CSS custom properties for dynamic slide dimensions
                    "--slide-w": slideWidth,
                    "--slide-gap": slideGap,
                } as React.CSSProperties
            }
        >
            <div className="pin-height">
                {/* Overflow container hides slides outside visible area and shows grab cursor */}
                <div className="overflow-hidden cursor-grab active:cursor-grabbing">
                    {/* Main sliding container - uses inline-block layout for horizontal alignment */}
                    <ul className="images block whitespace-nowrap -mx-[calc(var(--slide-gap)/2)]">
                        {/* Render multiple sets of images for infinite scroll effect */}
                        {Array.from({length: repeatCount}).map((_, repeatIndex) =>
                            images.map((image, imageIndex) => (
                                <li
                                    key={`set-${repeatIndex}-img-${imageIndex}`}
                                    className="slide-item inline-block select-none w-[var(--slide-w)] mx-[calc(var(--slide-gap)/2)] aspect-square"
                                >
                                    <img
                                        src={image.url}
                                        alt={`slide-${repeatIndex}-${imageIndex}`}
                                        width={800}
                                        height={1000}
                                        className="pointer-events-none h-full w-full object-cover bg-center"
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
};