"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { exampleImages } from "@/utils/demo-images";

gsap.registerPlugin(Observer);

export type ImageCarouselProps = {
  /** Base speed factor of the auto-scrolling motion. Higher values make the carousel scroll faster. @default 1 */
  speed?: number;

  /** Ratio applied to slow down the carousel when hovering. 0.5 = half speed, 1 = same speed, >1 = faster on hover. @default 0.5 */
  hoverSlowdownRatio?: number;

  /** Whether the carousel should automatically slide without user interaction. If false, it stays static until dragged. @default true */
  autoSlide?: boolean;

  /** List of image objects to display in the carousel. Each must contain a valid `url` property. @default exampleImages (imported from ./utils/demo-images) */
  images?: { url: string }[];

  /** The width of each slide item. Accepts any valid CSS size unit (e.g. `"120px"`, `"10rem"`, `"20%"`). @default "8.3vw" */
  slideWidth?: string;

  /** The horizontal gap between slides. Accepts any valid CSS size unit. @default "35px" */
  slideGap?: string;

  /** Scroll direction of the carousel. `1` = scrolls right→left, `-1` = scrolls left→right. @default 1 */
  direction?: 1 | -1;
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  speed = 1,
  hoverSlowdownRatio = 0.5,
  autoSlide = true,
  images = exampleImages,
  slideWidth = "8.3vw",
  slideGap = "35px",
  direction = 1,
}) => {
  const scope = useRef<HTMLDivElement | null>(null);
  const [repeatCount, setRepeatCount] = useState(2); // how many times to duplicate image set

  const speedFactorRef = useRef(0.5);
  const baseSpeedRef = useRef(speed);
  const hoverSlowdownRatioRef = useRef(hoverSlowdownRatio);
  const normalSpeedRef = useRef(0.5);
  const autoSlideRef = useRef(autoSlide);
  const totalRef = useRef(0);
  const xToRef = useRef<((v: number) => void) | null>(null);

  // === keep refs updated ===
  useEffect(() => {
    baseSpeedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    hoverSlowdownRatioRef.current = hoverSlowdownRatio;
  }, [hoverSlowdownRatio]);
  useEffect(() => {
    autoSlideRef.current = autoSlide;
  }, [autoSlide]);

  // === GSAP setup ===
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const slide = root.querySelector(".images") as HTMLUListElement | null;
      const container = root.querySelector(
        ".overflow-hidden"
      ) as HTMLElement | null;
      if (!slide || !container) return;

      // Reset
      gsap.killTweensOf(slide);
      gsap.set(slide, { x: 0 });
      totalRef.current = 0;

      // === measure ===
      const items = Array.from(
        slide.querySelectorAll<HTMLElement>(".slide-item")
      );
      if (!items.length) return;

      const N = images.length;
      const firstSet = items.slice(0, N);

      const outerWidth = (el: HTMLElement) => {
        const rectW = el.getBoundingClientRect().width;
        const cs = getComputedStyle(el);
        const ml = parseFloat(cs.marginLeft) || 0;
        const mr = parseFloat(cs.marginRight) || 0;
        return rectW + ml + mr;
      };

      // measure one logical set width
      let setWidthMeasured = firstSet.reduce(
        (sum, el) => sum + outerWidth(el),
        0
      );
      const snap = gsap.utils.snap(0.5);
      setWidthMeasured = snap(setWidthMeasured);

      // dynamically calculate repeats
      const containerWidth = container.clientWidth;
      const repeats = Math.ceil(containerWidth / setWidthMeasured) + 2;
      setRepeatCount(repeats);

      // wrap exactly one logical set
      const wrap = gsap.utils.wrap(-setWidthMeasured, 0);
      xToRef.current = gsap.quickTo(slide, "x", {
        duration: 0.1,
        ease: "power3",
        modifiers: { x: gsap.utils.unitize(wrap) },
      });

      // === auto scroll ticker ===
      const tick = (_t: number, dt: number) => {
        if (!autoSlideRef.current) return;
        const moveSpeed = baseSpeedRef.current * speedFactorRef.current;
        totalRef.current -= dt * moveSpeed * direction;
        xToRef.current?.(totalRef.current);
      };
      gsap.ticker.add(tick);

      // === hover slowdown ===
      const onEnter = () => {
        speedFactorRef.current =
          normalSpeedRef.current * hoverSlowdownRatioRef.current;
      };
      const onLeave = () => {
        speedFactorRef.current = normalSpeedRef.current;
      };

      slide.addEventListener("mouseenter", onEnter);
      slide.addEventListener("mouseleave", onLeave);

      // === drag behavior ===
      const tl = gsap.timeline({ paused: true });
      const observer = Observer.create({
        target: slide,
        type: "pointer,touch",
        onPress: () => {
          tl.play();
        },
        onDrag: (self) => {
          totalRef.current += self.deltaX;
          xToRef.current?.(totalRef.current);
        },
        onRelease: () => {
          tl.reverse();
        },
        onStop: () => {
          tl.reverse();
        },
      });


      // cleanup
      return () => {
        slide.removeEventListener("mouseenter", onEnter);
        slide.removeEventListener("mouseleave", onLeave);
        gsap.ticker.remove(tick);
        observer.kill();
        gsap.killTweensOf(slide);
        xToRef.current = null;
      };
    },
    {
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
      ref={scope}
      style={
        {
          "--slide-w": slideWidth,
          "--slide-gap": slideGap,
        } as React.CSSProperties
      }
    >
      <div className="pin-height">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing">
          <ul className="images block whitespace-nowrap -mx-[calc(var(--slide-gap)/2)]">
            {Array.from({ length: repeatCount }).map((_, r) =>
              images.map((img, i) => (
                <li
                  key={`set-${r}-img-${i}`}
                  className="slide-item inline-block select-none w-[var(--slide-w)] mx-[calc(var(--slide-gap)/2)] aspect-square"
                >
                  <Image
                    src={img.url}
                    alt={`slide-${r}-${i}`}
                    width={800}
                    height={1000}
                    className="pointer-events-none h-full w-full object-cover bg-center"
                    priority={r === 0 && i < 2}
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
