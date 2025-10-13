"use client"
import React, { useEffect, useRef, useState } from 'react'
import './slide-carousel.css'
import gsap from 'gsap';
import { Input } from "@/registry/perxel/ui/input"
import { Label } from "@/registry/perxel/ui/label"
import { Button } from "@/registry/perxel/ui/button"

const SlideCarousel = () => {
     // Speed factor stored in a ref so we can update it without re-initializing effect
     const DEFAULT_SLIDER_SPEED = 50; // percent (100% = speedFactor 1)
     const HOVER_SLOWDOWN_RATIO = 0.5; // 0-1 ratio, > 1 faster
     const BASE_SPEED = 1;
     const MANUAL_SLIDE_DISTANCE = 300; // pixels to move on arrow click
     const MANUAL_SLIDE_DURATION = 0.6; // duration in seconds for arrow click animation

     const speedFactorRef = useRef(DEFAULT_SLIDER_SPEED / 100);
     const baseSpeedRef = useRef(BASE_SPEED);
     const hoverSlowdownRatioRef = useRef(HOVER_SLOWDOWN_RATIO);
     const normalSpeedRef = useRef(DEFAULT_SLIDER_SPEED / 100);
     const [isAutoSlideEnabled, setIsAutoSlideEnabled] = useState(false);
     const isAutoSlideEnabledRef = useRef(false);
     const totalRef = useRef(0);
     const xToRef = useRef<((value: number) => void) | null>(null);
     const tickFuncRef = useRef<((time: number, dt: number) => void) | null>(null);
     const slideRef = useRef<HTMLElement | null>(null);
     const wrapRef = useRef<((value: number) => number) | null>(null);
     const isManuallyAnimatingRef = useRef(false);
     const manualAnimationRef = useRef<gsap.core.Tween | null>(null); // Store the manual animation tween

     const normalizeValue = (value: number) => value / 100;

     // Sync state to ref whenever it changes
     useEffect(() => {
          isAutoSlideEnabledRef.current = isAutoSlideEnabled;
     }, [isAutoSlideEnabled]);

     // Handle manual slide left with animation
     const handleSlideLeft = () => {
          if (xToRef.current) {
               // Kill any ongoing manual animation using the stored tween reference
               if (manualAnimationRef.current) {
                    manualAnimationRef.current.kill();
                    manualAnimationRef.current = null;
               }
               
               // Calculate new target position (same as original)
               const startValue = totalRef.current;
               const endValue = totalRef.current + MANUAL_SLIDE_DISTANCE;
               
               // Mark that we're manually animating
               isManuallyAnimatingRef.current = true;
               
               // Animate totalRef value from start to end
               manualAnimationRef.current = gsap.to({ value: startValue }, {
                    value: endValue,
                    duration: MANUAL_SLIDE_DURATION,
                    ease: "power2.out",
                    onUpdate: function() {
                         // Update totalRef and apply with xTo (just like the ticker does)
                         totalRef.current = this.targets()[0].value;
                         if (xToRef.current) {
                              xToRef.current(totalRef.current);
                         }
                    },
                    onComplete: () => {
                         // Ensure final value is exact
                         totalRef.current = endValue;
                         isManuallyAnimatingRef.current = false;
                         manualAnimationRef.current = null;
                    }
               });
          }
     };

     // Handle manual slide right with animation
     const handleSlideRight = () => {
          if (xToRef.current) {
               // Kill any ongoing manual animation using the stored tween reference
               if (manualAnimationRef.current) {
                    manualAnimationRef.current.kill();
                    manualAnimationRef.current = null;
               }
               
               // Calculate new target position (same as original)
               const startValue = totalRef.current;
               const endValue = totalRef.current - MANUAL_SLIDE_DISTANCE;
               
               // Mark that we're manually animating
               isManuallyAnimatingRef.current = true;
               
               // Animate totalRef value from start to end
               manualAnimationRef.current = gsap.to({ value: startValue }, {
                    value: endValue,
                    duration: MANUAL_SLIDE_DURATION,
                    ease: "power2.out",
                    onUpdate: function() {
                         // Update totalRef and apply with xTo (just like the ticker does)
                         totalRef.current = this.targets()[0].value;
                         if (xToRef.current) {
                              xToRef.current(totalRef.current);
                         }
                    },
                    onComplete: () => {
                         // Ensure final value is exact
                         totalRef.current = endValue;
                         isManuallyAnimatingRef.current = false;
                         manualAnimationRef.current = null;
                    }
               });
          }
     };

     useEffect(() => {
          const initEffect = () => {
               const slide = document.querySelector('.slide-carousel .images') as HTMLElement;
               const slideItem = document.querySelector('.slide-carousel .slide-item:not(:first-child)') as HTMLElement;
               const slideItems = document.querySelectorAll('.slide-carousel .slide-item') as NodeListOf<Element>;

               if (!slide || !slideItem) return;

               // Store slide reference for arrow buttons
               slideRef.current = slide;

               // Kill any existing GSAP animations on this element
               gsap.killTweensOf(slide);
               
               // Reset slide position to 0 immediately with clearProps
               gsap.set(slide, { x: 0, clearProps: "all" });
               
               // Reset total to 0 AFTER setting the slide position
               totalRef.current = 0;
               isManuallyAnimatingRef.current = false;

               // Why minus 5? => Because the first item has no padding-right
               // So if we don't minus 5, the total width will be wrong
               // And the half will be wrong => The carousel will not work
               const getTotalWidth = () => {
                    return slideItem.clientWidth * slideItems.length - 5;
               }

               const half = getTotalWidth() / 2;
               const wrap = gsap.utils.wrap(-half, 0);
               
               // Store wrap function for arrow buttons
               wrapRef.current = wrap;

               const xTo = gsap.quickTo(slide, "x", {
                    duration: 0.1,
                    ease: "power3",
                    modifiers: {
                         x: gsap.utils.unitize(wrap),
                    },
               });

               // Store xTo function in ref for arrow buttons
               xToRef.current = xTo;

               function tick(time: number, dt: number) {
                    // Only auto-slide if enabled AND not manually animating
                    if (isAutoSlideEnabledRef.current && !isManuallyAnimatingRef.current) {
                         totalRef.current -= speedFactorRef.current * (dt * baseSpeedRef.current);
                         xTo(totalRef.current);
                    }
               }

               // Store tick function reference
               tickFuncRef.current = tick;

               function handleMouseEnter() {
                    // Use the normal speed (not the current speed) to calculate slowdown
                    speedFactorRef.current = normalSpeedRef.current * hoverSlowdownRatioRef.current;
               }
               function handleMouseLeave() {
                    // Reset to normal speed
                    speedFactorRef.current = normalSpeedRef.current;
               }

               // Register listeners
               slide.addEventListener("mouseenter", handleMouseEnter);
               slide.addEventListener("mouseleave", handleMouseLeave);

               // Register GSAP ticker
               gsap.ticker.add(tick);

               // Cleanup on unmount
               return () => {
                    // Remove event listeners
                    slide.removeEventListener("mouseenter", handleMouseEnter);
                    slide.removeEventListener("mouseleave", handleMouseLeave);
                    
                    // Remove GSAP ticker using the stored reference
                    if (tickFuncRef.current) {
                         gsap.ticker.remove(tickFuncRef.current);
                         tickFuncRef.current = null;
                    }
                    
                    // Kill manual animation if exists
                    if (manualAnimationRef.current) {
                         manualAnimationRef.current.kill();
                         manualAnimationRef.current = null;
                    }
                    
                    // Kill all GSAP animations on this element
                    gsap.killTweensOf(slide);
                    
                    // Clear refs
                    xToRef.current = null;
                    slideRef.current = null;
                    wrapRef.current = null;
                    isManuallyAnimatingRef.current = false;
                    
                    // Reset both visual position and total ref
                    gsap.set(slide, { x: 0, clearProps: "all" });
                    totalRef.current = 0;
               };
          };

          let cleanup: (() => void) | undefined;

          const onLoad = () => {
               cleanup = initEffect();
          }

          if (document.readyState === 'complete') {
               cleanup = initEffect();
          } else {
               window.addEventListener('load', onLoad, { once: true });
          }

          // Return cleanup function
          return () => {
               window.removeEventListener('load', onLoad);
               if (cleanup) {
                    cleanup();
               }
          }
     }, []); // Empty dependency array - only run once on mount

     return (
          <div className="flex flex-col gap-2 py-5">
               <div className="p-5">
                    <div className="md:max-w-1/2 w-full">
                         <div className="flex gap-4 items-end mb-6 flex-wrap">
                              <div className="">
                                   <Label className="mb-2" htmlFor="base-speed">Base Speed</Label>
                                   <Input
                                        id="base-speed"
                                        type="number"
                                        onChange={(e) => {
                                             baseSpeedRef.current = Number(e.target.value);
                                        }}
                                        defaultValue={baseSpeedRef.current}
                                   />
                              </div>

                              <div className="">
                                   <Label className="mb-2" htmlFor="hover-slowdown-ratio">Hover Slowdown Ratio</Label>
                                   <Input
                                        id="hover-slowdown-ratio"
                                        type="number"
                                        onChange={(e) => {
                                             hoverSlowdownRatioRef.current = Number(e.target.value);
                                        }}
                                        defaultValue={hoverSlowdownRatioRef.current}
                                   />
                              </div>

                              <div className="">
                                   <Button
                                        onClick={() => setIsAutoSlideEnabled(!isAutoSlideEnabled)}
                                        variant={isAutoSlideEnabled ? "default" : "outline"}
                                   >
                                        {isAutoSlideEnabled ? "Auto Slide: ON" : "Auto Slide: OFF"}
                                   </Button>
                              </div>
                         </div>

                         <div className="flex gap-2 items-center">
                              <Button
                                   onClick={handleSlideLeft}
                                   variant="outline"
                                   size="icon"
                              >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 18-6-6 6-6"/>
                                   </svg>
                              </Button>
                              <Button
                                   onClick={handleSlideRight}
                                   variant="outline"
                                   size="icon"
                              >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6"/>
                                   </svg>
                              </Button>
                              <span className="text-sm text-muted-foreground ml-2">Manual Navigation</span>
                         </div>
                    </div>
               </div>

               <section className="slide-carousel">
                    <div className="pin-height">
                         <div className="overflow-hidden">
                              <ul className="images">
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/1.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/2.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/3.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/4.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/5.png" /></li>

                                   {/* Duplicated images */}
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/1.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/2.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/3.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/4.png" /></li>
                                   <li className="slide-item aspect-card"><img className="media" src="/FadingTransition/medias/5.png" /></li>
                              </ul>
                         </div>
                    </div>
               </section>
          </div>
     );
};

export default SlideCarousel;
