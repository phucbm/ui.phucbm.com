"use client";

import React, {useRef, useState} from "react";
import gsap from "gsap";
import {Observer} from "gsap/Observer";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(Observer);

export type ImageCarouselProps = {
    /** List of image objects to display in the carousel. Each must contain a valid `url` property. @default exampleImages (imported from ./utils/demo-images) */
    images: { url: string, title?: string }[];

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
        hoverDuration = 60,
        images,
        direction = 1,
        drag = true,
        hover = true,
    } = props;

    // Reference to the main carousel container element
    const scope = useRef<HTMLDivElement | null>(null);

    // Number of times to duplicate the image set to create seamless infinite scroll
    const [repeatCount, setRepeatCount] = useState(3);

    // Width of one complete set of images (calculated once, then used for speed calculations)
    const singleSetWidthRef = useRef(0);

    // Track whether user is currently hovering over the carousel
    const isHoveringRef = useRef(false);

    // Accumulated horizontal scroll distance (in pixels)
    const totalScrollDistanceRef = useRef(0);

    // GSAP quickTo function for optimized x-position updates with wrapping
    const animateToXPositionRef = useRef<((value: number) => void) | null>(null);


    // === Main GSAP animation setup ===
    useGSAP(
        () => {
            const rootElement = scope.current;
            if (!rootElement) return;

            // Get the sliding image list container
            const slideContainer = rootElement.querySelector(".images") as HTMLUListElement | null;

            // Get the overflow wrapper container
            const overflowContainer = rootElement.querySelector(".overflow-hidden") as HTMLElement | null;

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

            // Store the width for speed calculations
            singleSetWidthRef.current = singleSetWidth;

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
                // Calculate current speed based on hover state
                // speed (px/ms) = distance (px) / time (ms)
                const activeDuration = isHoveringRef.current ? hoverDuration : duration;
                const currentSpeed = singleSetWidthRef.current / (activeDuration * 1000);

                // Update total scroll distance using current speed (pixels per millisecond)
                // deltaTime is in milliseconds
                totalScrollDistanceRef.current -= deltaTime * currentSpeed * direction;

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
            return () => {
                gsap.ticker.remove(autoScrollTick);
                if (dragObserver) dragObserver.kill();
                if (hoverObserver) hoverObserver.kill();
                gsap.killTweensOf(slideContainer);
                animateToXPositionRef.current = null;
            };
        },
        {
            // Re-run setup when any of these dependencies change
            dependencies: [
                duration,
                hoverDuration,
                images.length,
                direction,
                drag,
                hover,
            ],
        }
    );


    return (
        <div className="" ref={scope}>
            <div className="pin-height ring ring-green-500">

                {/* Overflow container hides slides outside visible area and shows grab cursor */}
                <div className={`overflow-hidden ${drag ? 'cursor-grab active:cursor-grabbing' : ''}`}>

                    {/* Main sliding container - uses inline-block layout for horizontal alignment */}
                    <ul className="images flex gap-6 relative">
                        <div className="absolute inset-0 shadow-[inset_0_0_0_4px_blue]"></div>

                        {/* Render multiple sets of images for infinite scroll effect */}
                        {Array.from({length: repeatCount}).map((_, repeatIndex) =>
                            images.map((image, imageIndex) => (
                                <li
                                    key={`set-${repeatIndex}-img-${imageIndex}`}
                                    className="slide-item select-none
                                    min-w-[10vw] w-[10vw] aspect-square ring ring-blue-600 bg-gray-300"
                                >
                                    <img
                                        src={image.url}
                                        alt={image.title}
                                        className="pointer-events-none h-full w-full object-cover object-center"
                                        loading="eager"
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Interaction Modifiers
// ============================================================================

/**
 * Sets up hover behavior to slow down the carousel
 * @param slideContainer - The container element to attach hover listeners to
 * @param isHoveringRef - Ref to track hover state
 * @returns Cleanup function to remove event listeners
 */
function setupHoverBehavior(
    slideContainer: HTMLElement,
    isHoveringRef: React.RefObject<boolean>
) {
    // Create an Observer that listens for pointer hover on the element
    return Observer.create({
        target: slideContainer,
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
 * @param slideContainer - The container element to make draggable
 * @param totalScrollDistanceRef - Ref containing the accumulated scroll distance
 * @param animateToXPositionRef - Ref containing the quickTo animation function
 * @returns The Observer instance
 */
function setupDragBehavior(
    slideContainer: HTMLElement,
    totalScrollDistanceRef: React.RefObject<number>,
    animateToXPositionRef: React.RefObject<((value: number) => void) | null>
) {
    // Set up GSAP Observer for drag/swipe interactions
    return Observer.create({
        target: slideContainer,
        type: "pointer,touch", // Handle both mouse and touch events
        onDrag: (observerInstance) => {
            // Update scroll position based on drag delta
            totalScrollDistanceRef.current += observerInstance.deltaX;
            animateToXPositionRef.current?.(totalScrollDistanceRef.current);
        },
    });
}