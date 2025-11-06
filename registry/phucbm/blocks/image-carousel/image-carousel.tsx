"use client";

import React, {useRef, useState} from "react";
import gsap from "gsap";
import {Observer} from "gsap/Observer";
import {useResponsiveGSAP} from "responsive-gsap";
import {cn} from "@/registry/phucbm/lib/utils";

gsap.registerPlugin(Observer);

export type ImageCarouselProps = {
    /** List of image objects to display in the carousel. Each must contain a valid `url` property. @default exampleImages (imported from ./utils/demo-images) */
    images: { url: string, title?: string }[];

    /** Custom class for each item wrapper, useful when you want to tweak the size or gap. @default "" **/
    itemClass?: string;

    /** Duration in seconds for one complete loop of images at normal speed. Lower = faster. @default 20 */
    duration?: number;

    /** Duration in seconds for one complete loop when hovering. Lower = faster. @default 60 */
    hoverDuration?: number;

    /** Scroll direction of the carousel. `1` = scrolls right→left, `-1` = scrolls left→right. @default 1 */
    direction?: 1 | -1;

    /** Whether to enable drag/swipe interactions. @default true */
    drag?: boolean;

    /** Whether to enable hover slowdown behavior. @default true */
    hover?: boolean;
};

export function ImageCarousel(props: ImageCarouselProps) {
    const {
        duration = 20,
        itemClass = '',
        hoverDuration = 60,
        images,
        direction = -1,
        drag = true,
        hover = true,
    } = props;

    // Reference to the main carousel container element
    const scope = useRef<HTMLDivElement | null>(null);

    // Number of times to duplicate the image set to create seamless infinite scroll
    const [repeatCount, setRepeatCount] = useState(2);

    // Track whether user is currently hovering over the carousel
    const isHoveringRef = useRef(false);

    // Accumulated horizontal scroll distance (in pixels)
    const totalScrollDistanceRef = useRef(0);

    // GSAP quickTo function for optimized x-position updates with wrapping
    const animateToXPositionRef = useRef<((value: number) => void) | null>(null);

    useResponsiveGSAP({
        scope,
        observeResize: '.slide-container',
        setup: (root) => {
            if (!root) return;
            const slideContainer = root.querySelector(".slide-container") as HTMLUListElement | null;
            if (!slideContainer) return;

            // Clean up any existing animations and reset position
            gsap.killTweensOf(slideContainer);
            gsap.set(slideContainer, {x: 0});
            totalScrollDistanceRef.current = 0;

            const singleSetWidth = getSingleSetWidth(root, images.length);
            setRepeatCount(getRepeatCount(root, singleSetWidth));

            // Create a wrapping function that keeps x position within one set width
            // When we scroll past -singleSetWidth, it wraps back to 0 (seamless loop)
            const wrapXPosition = gsap.utils.wrap(0.5, -singleSetWidth);

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
                // Calculate current speed based on hover state
                // speed (px/ms) = distance (px) / time (ms)
                const activeDuration = isHoveringRef.current ? hoverDuration : duration;
                const currentSpeed = singleSetWidth / (activeDuration * 1000);

                // Update total scroll distance using current speed (pixels per millisecond)
                // deltaTime is in milliseconds
                totalScrollDistanceRef.current += deltaTime * currentSpeed * direction;

                // Apply the new position with wrapping
                animateToXPositionRef.current?.(totalScrollDistanceRef.current);
            };

            // Add the ticker to GSAP's main loop
            gsap.ticker.add(autoScrollTick);

            // === Hover slowdown behavior ===
            const hoverObserver = hover ? setupHoverBehavior(slideContainer, isHoveringRef) : null;

            // === Drag/swipe behavior ===
            const dragObserver = drag
                ? setupDragBehavior(slideContainer, totalScrollDistanceRef, animateToXPositionRef)
                : null;

            // === Cleanup function ===
            // Remove all event listeners and kill animations when component unmounts or dependencies change
            return {
                cleanup: () => {
                    gsap.ticker.remove(autoScrollTick);
                    if (dragObserver) dragObserver.kill();
                    if (hoverObserver) hoverObserver.kill();
                    gsap.killTweensOf(slideContainer);
                    animateToXPositionRef.current = null;
                }
            }
        },
    })

    return (
        <div ref={scope}>
            {/*Overflow container hides slides outside visible area and shows grab cursor*/}
            <div className={`slide-outer overflow-hidden ${drag ? 'cursor-grab active:cursor-grabbing' : ''}`}>

                {/* Main sliding container */}
                <ul className="slide-container flex relative">
                    {/* Render multiple sets of images for infinite scroll effect */}
                    {Array.from({length: repeatCount}).map((_, repeatIndex) =>
                        images.map((image, imageIndex) => (
                            <li
                                key={`set-${repeatIndex}-img-${imageIndex}`}
                                className={cn("slide-item select-none bg-gray-300 w-[var(--width)] min-w-[var(--width)]",
                                    "xl:[--width:15vw] lg:[--width:260px] [--width:120px]",
                                    "aspect-square lg:mr-8 mr-4",
                                    itemClass
                                )}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="pointer-events-none h-full w-full object-cover object-center"
                                    loading="lazy"
                                />
                            </li>
                        ))
                    )}
                </ul>

            </div>
        </div>
    );
}

// ============================================================================
// Interaction Modifiers
// ============================================================================

/**
 * Sets up hover behavior to slow down the carousel
 * @param target - The container element to attach hover listeners to
 * @param isHoveringRef - Ref to track hover state
 * @returns Cleanup function to remove event listeners
 */
function setupHoverBehavior(
    target: HTMLElement,
    isHoveringRef: React.RefObject<boolean>
) {
    // touch only => no hover => disable hover behavior
    if (Observer.isTouch === 1) return;

    // Create an Observer that listens for pointer hover on the element
    return Observer.create({
        target: target,
        type: "pointer", // "pointer" covers mouse & stylus; use "pointer,touch" if you want touch hover behavior too
        // Called when pointer enters / moves over the target (debounce doesn't apply to onHover)
        onHover: () => {
            isHoveringRef.current = true;
        },
        // Called when pointer leaves the target
        onHoverEnd: () => {
            isHoveringRef.current = false;
        },
        // Optional: ignore certain children (eg. interactive controls)
        // ignore: ".no-hover",
        // Optional: set an id so you can find it later: id: "carousel-hover"
    });
}

/**
 * Sets up drag/swipe behavior for the carousel
 * @param target - The container element to make draggable
 * @param totalScrollDistanceRef - Ref containing the accumulated scroll distance
 * @param animateToXPositionRef - Ref containing the quickTo animation function
 * @returns The Observer instance
 */
function setupDragBehavior(
    target: HTMLElement,
    totalScrollDistanceRef: React.RefObject<number>,
    animateToXPositionRef: React.RefObject<((value: number) => void) | null>
) {
    let inertiaTween = null; // Track the inertia animation

    return Observer.create({
        target: target,
        type: "pointer,touch",

        // When drag starts - kill any ongoing inertia
        onPress: () => {
            if (inertiaTween) inertiaTween.kill();
        },

        // While dragging - update position
        onDrag: (observerInstance) => {
            totalScrollDistanceRef.current += observerInstance.deltaX;
            animateToXPositionRef.current?.(totalScrollDistanceRef.current);
        },

        // When drag ends - apply inertia based on velocity
        onRelease: (observerInstance) => {
            // Get the velocity from the drag (pixels per second)
            const velocityX = observerInstance.velocityX;

            // Calculate how far to coast based on velocity
            // Higher velocity = longer coast distance
            // 0 = shorter scroll, 1 = longer
            const inertiaDistance = velocityX * 0.1; // Adjust 0.3 for more/less inertia

            // Animate to the final position with easing
            inertiaTween = gsap.to(totalScrollDistanceRef, {
                current: totalScrollDistanceRef.current + inertiaDistance,
                duration: 0.5, // How long the coast lasts, smaller means stop scroll earlier, bigger means keep scroll longer
                ease: "power4.out", // Deceleration curve
                onUpdate: () => {
                    animateToXPositionRef.current?.(totalScrollDistanceRef.current);
                }
            });
        }
    });
}


/**
 * Calculate the outer width of an element including margins
 * This is needed because getBoundingClientRect doesn't include margins
 */
function getElementOuterWidth(element: HTMLElement) {
    const boundingWidth = element.getBoundingClientRect().width;
    const computedStyle = getComputedStyle(element);
    const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
    const marginRight = parseFloat(computedStyle.marginRight) || 0;
    return boundingWidth + marginLeft + marginRight;
}


/**
 * Measure dimensions for infinite scroll setup
 * @param root
 * @param originalImageCount
 */
function getSingleSetWidth(root: HTMLElement, originalImageCount: number) {
    // === Measure dimensions for infinite scroll setup ===
    const slideItems = Array.from(root.querySelectorAll<HTMLElement>(".slide-item"));
    if (!slideItems.length) return;

    // Get the first set of slides (one complete loop of images)
    const firstImageSet = slideItems.slice(0, originalImageCount);

    // Calculate the total width of one complete set of images
    let singleSetWidth = firstImageSet.reduce((totalWidth, element) => totalWidth + getElementOuterWidth(element), 0);

    // Snap to nearest 0.5px to avoid sub-pixel rendering issues
    singleSetWidth = gsap.utils.snap(0.5, singleSetWidth);

    return singleSetWidth;
}

/**
 * Calculate how many times to duplicate the image set for seamless infinite scroll
 * We need enough copies to fill the container width plus extra for smooth wrapping
 * @param root
 * @param singleSetWidth
 */
function getRepeatCount(root: HTMLElement, singleSetWidth: number): number {
    const slideOuter = root.querySelector(".slide-outer") as HTMLElement | null;

    const containerWidth = slideOuter.clientWidth;
    return Math.ceil(containerWidth / singleSetWidth) + 2;
}