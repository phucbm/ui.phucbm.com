"use client"
import React, { useEffect, useRef } from 'react'
import './slide-carousel.css'
import gsap from 'gsap';
import { Input } from "@/registry/perxel/ui/input"
import { Label } from "@/registry/perxel/ui/label"

const SlideCarousel = () => {
     // Speed factor stored in a ref so we can update it without re-initializing effect
     const DEFAULT_SLIDER_SPEED = 50; // percent (100% = speedFactor 1)
     const HOVER_SLOWDOWN_RATIO = 0.5; // 0-1 ratio, > 1 faster
     const BASE_SPEED = 1;

     const speedFactorRef = useRef(DEFAULT_SLIDER_SPEED / 100);
     const baseSpeedRef = useRef(BASE_SPEED);
     const hoverSlowdownRatioRef = useRef(HOVER_SLOWDOWN_RATIO);
     const normalSpeedRef = useRef(DEFAULT_SLIDER_SPEED / 100); // Store the normal speed separately
     const marks = [0, 1, 2];

     const normalizeValue = (value: number) => value / 100;

     useEffect(() => {
          const initEffect = () => {
               let total = 0;

               const slide = document.querySelector('.slide-carousel .images') as HTMLElement;
               const slideItem = document.querySelector('.slide-carousel .slide-item:not(:first-child)') as HTMLElement;
               const slideItems = document.querySelectorAll('.slide-carousel .slide-item') as NodeListOf<Element>;

               // Why minus 5? => Because the first item has no padding-right
               // So if we don't minus 5, the total width will be wrong
               // And the half will be wrong => The carousel will not work
               const getTotalWidth = () => {
                    return slideItem.clientWidth * slideItems.length - 5;
               }
               if (!slide) return;

               const half = getTotalWidth() / 2;
               const wrap = gsap.utils.wrap(-half, 0);

               const xTo = gsap.quickTo(slide, "x", {
                    duration: 0.1,
                    ease: "power3",
                    modifiers: {
                         x: gsap.utils.unitize(wrap),
                    },
               });


               function tick(time: number, dt: number) {
                    total -= speedFactorRef.current * (dt * baseSpeedRef.current);
                    xTo(total);
               }

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
                    slide.removeEventListener("mouseenter", handleMouseEnter);
                    slide.removeEventListener("mouseleave", handleMouseLeave);
                    gsap.ticker.remove(tick);
                    // Immediately reset slide position when component unmounts
                    gsap.set(slide, { x: 0, clearProps: "transform" });
               };
          };

          const onLoad = () => initEffect()

          if (document.readyState === 'complete') {
               initEffect()
          } else {
               window.addEventListener('load', onLoad, { once: true })
          }

          return () => {
               window.removeEventListener('load', onLoad)
          }
     }, []);

     return (
          <div className="flex flex-col gap-2 py-5">
               <div className="p-5">
                    <div className="md:max-w-1/2 w-full">
                         <div className="flex gap-2 items-center mb-6">
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
