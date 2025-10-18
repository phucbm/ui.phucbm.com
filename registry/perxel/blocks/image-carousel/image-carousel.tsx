"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { checkBoundaries } from "@/registry/perxel/blocks/image-carousel/lib/checkBoundaries";
import { handleManualSlide } from "@/registry/perxel/blocks/image-carousel/lib/handleManualSlide";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Observer);

export type ImageCarouselProps = {
  speed?: number;
  hoverSlowdownRatio?: number;
  autoSlide?: boolean;
  infinite?: boolean;
  manualNav?: boolean;
  images?: string[];
  slideWidth?: string;
  slideGap?: string;
  direction?: 1 | -1;
};

const DEFAULT_IMAGES = [
  "/FadingTransition/medias/1.png",
  "/FadingTransition/medias/2.png",
  "/FadingTransition/medias/3.png",
  "/FadingTransition/medias/4.png",
  "/FadingTransition/medias/5.png",
  "/FadingTransition/medias/4.png",
  "/FadingTransition/medias/5.png",
  "/FadingTransition/medias/4.png",
  "/FadingTransition/medias/5.png",
  "/FadingTransition/medias/4.png",
  "/FadingTransition/medias/5.png",
  "/FadingTransition/medias/5.png",
  "/FadingTransition/medias/5.png",
];

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  speed = 1,
  hoverSlowdownRatio = 0.5,
  autoSlide = true,
  images = DEFAULT_IMAGES,
  slideWidth = "120px",
  slideGap = "35px",
  direction = 1,

  infinite = true,
  manualNav = false,
}) => {
  const scope = useRef<HTMLDivElement | null>(null);
  const speedFactorRef = useRef(0.5);
  const baseSpeedRef = useRef(speed);
  const hoverSlowdownRatioRef = useRef(hoverSlowdownRatio);
  const normalSpeedRef = useRef(0.5);
  const autoSlideRef = useRef(autoSlide);
  const infiniteRef = useRef(infinite);

  const totalRef = useRef(0);
  const xToRef = useRef<((v: number) => void) | null>(null);
  const noWrapXToRef = useRef<((v: number) => void) | null>(null);
  const tickRef = useRef<((t: number, dt: number) => void) | null>(null);

  const slideRef = useRef<HTMLUListElement | null>(null);
  const slideItemWidthRef = useRef(0);
  const containerWidthRef = useRef(0);
  const totalWidthRef = useRef(0);

  const manualTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(false);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  // keep refs up-to-date
  useEffect(() => {
    baseSpeedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    hoverSlowdownRatioRef.current = hoverSlowdownRatio;
  }, [hoverSlowdownRatio]);
  // only initialize once from prop, don't override manual toggle
  useEffect(() => {
    autoSlideRef.current = autoSlide;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    infiniteRef.current = infinite;
    checkBoundaries(
      totalRef,
      totalWidthRef,
      containerWidthRef,
      infiniteRef,
      setIsLeftDisabled,
      setIsRightDisabled
    );
  }, [infinite]);

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

      slideRef.current = slide;

      // Reset
      gsap.killTweensOf(slide);
      gsap.set(slide, { x: 0 });
      totalRef.current = 0;

      // === PRECISE DOM MEASUREMENT ===
      const items = Array.from(
        slide.querySelectorAll<HTMLElement>(".slide-item")
      );
      if (!items.length) return;

      const N = images.length;
      const renderedCount = items.length; // N or 2N (if infinite)
      const firstSet = items.slice(0, Math.min(N, items.length));

      const outerWidth = (el: HTMLElement) => {
        const rectW = el.getBoundingClientRect().width;
        const cs = getComputedStyle(el);
        const ml = parseFloat(cs.marginLeft) || 0;
        const mr = parseFloat(cs.marginRight) || 0;
        return rectW + ml + mr;
      };

      // 1️⃣ measure logical set width
      let setWidthMeasured = 0;
      for (const el of firstSet) setWidthMeasured += outerWidth(el);

      // 2️⃣ measure entire rendered track width
      let renderedWidthMeasured = 0;
      for (const el of items) renderedWidthMeasured += outerWidth(el);

      // 3️⃣ measure actual step distance
      let stepMeasured = outerWidth(items[0]);
      if (items.length > 1) {
        const x0 = items[0].getBoundingClientRect().left;
        const x1 = items[1].getBoundingClientRect().left;
        const delta = Math.abs(x1 - x0);
        if (delta > 0) stepMeasured = delta;
      }

      // 4️⃣ tiny rounding to eliminate subpixel drift
      const snap = gsap.utils.snap(0.5);
      setWidthMeasured = snap(setWidthMeasured);
      renderedWidthMeasured = snap(renderedWidthMeasured);
      stepMeasured = snap(stepMeasured);

      // 5️⃣ update refs
      slideItemWidthRef.current = stepMeasured;
      containerWidthRef.current = container.clientWidth;
      totalWidthRef.current = renderedWidthMeasured;

      // 6️⃣ wrap exactly one logical set (fixes the “push”)
      const wrap = gsap.utils.wrap(-setWidthMeasured, 0);

      xToRef.current = gsap.quickTo(slide, "x", {
        duration: 0.1,
        ease: "power3",
        modifiers: { x: gsap.utils.unitize(wrap) },
      });

      noWrapXToRef.current = gsap.quickTo(slide, "x", {
        duration: 0.1,
        ease: "power3",
      });

      // === ticker ===
      const tick = (_t: number, dt: number) => {
        if (!autoSlideRef.current) return;
        const moveSpeed = baseSpeedRef.current * speedFactorRef.current;
        let next = totalRef.current - dt * moveSpeed * direction;
        if (!infiniteRef.current) {
          const maxScroll = -(
            totalWidthRef.current - containerWidthRef.current
          );
          next = Math.max(maxScroll, next);
        }

        totalRef.current = next;
        const fn = infiniteRef.current ? xToRef.current : noWrapXToRef.current;
        fn?.(totalRef.current);
        checkBoundaries(
          totalRef,
          totalWidthRef,
          containerWidthRef,
          infiniteRef,
          setIsLeftDisabled,
          setIsRightDisabled
        );
      };

      gsap.ticker.add(tick);

      // === hover slowdown ===
      const onEnter = () =>
        (speedFactorRef.current =
          normalSpeedRef.current * hoverSlowdownRatioRef.current);
      const onLeave = () => (speedFactorRef.current = normalSpeedRef.current);

      slide.addEventListener("mouseenter", onEnter);
      slide.addEventListener("mouseleave", onLeave);

      // ✅ === DRAG BEHAVIOR (added) ===
      let total = totalRef.current;

      let isDragging = false;
      const DRAG_THRESHOLD = 5;

      const observer = Observer.create({
        target: slide,
        type: "pointer,touch",

        onPress: () => {
          console.log("press");
          isDragging = false;

          // 1️⃣ Pause auto-slide
          autoSlideRef.current = false;

          // 2️⃣ Read the current x position precisely
          const currentX = gsap.getProperty(slide, "x") as number;

          // 3️⃣ Stop any active motion but DON'T kill quickTo yet
          gsap.set(slide, { x: currentX });
          totalRef.current = currentX;

          // 4️⃣ Re-create quickTo functions fresh (flush stale tweens)
          const wrap = gsap.utils.wrap(-totalWidthRef.current / 2, 0); // same range as before
          xToRef.current = gsap.quickTo(slide, "x", {
            duration: 0.1,
            ease: "power3",
            modifiers: { x: gsap.utils.unitize(wrap) },
          });
          noWrapXToRef.current = gsap.quickTo(slide, "x", {
            duration: 0.1,
            ease: "power3",
          });
        },

        onDrag: (self) => {
          const delta = Math.abs(self.x - self.startX);
          if (delta < DRAG_THRESHOLD) return;

          if (!isDragging) {
            isDragging = true;
            console.log("start drag");
          }

          totalRef.current += self.deltaX;
          const fn = infiniteRef.current
            ? xToRef.current
            : noWrapXToRef.current;
          fn?.(totalRef.current);
        },

        onRelease: () => {
          console.log("release");

          // 5️⃣ Resume auto-slide and keep the same xTo references
          gsap.delayedCall(0.1, () => {
            autoSlideRef.current = true;
          });
        },

        onStop: () => {
          console.log("stop");
          gsap.delayedCall(0.1, () => {
            autoSlideRef.current = true;
          });
        },
      });

      checkBoundaries(
        totalRef,
        totalWidthRef,
        containerWidthRef,
        infiniteRef,
        setIsLeftDisabled,
        setIsRightDisabled
      );

      // cleanup
      return () => {
        slide.removeEventListener("mouseenter", onEnter);
        slide.removeEventListener("mouseleave", onLeave);
        gsap.ticker.remove(tick);
        observer.kill(); // cleanup drag
        manualTweenRef.current?.kill();
        gsap.killTweensOf(slide);
        xToRef.current = null;
        noWrapXToRef.current = null;
        slideRef.current = null;
      };
    },
    {
      dependencies: [
        infinite,
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
      {/* Manual Nav */}
      {manualNav && (
        <div className="flex gap-2 items-center mb-3">
          <Button
            onClick={() =>
              handleManualSlide(
                "left",
                {
                  slideItemWidthRef,
                  containerWidthRef,
                  totalWidthRef,
                  totalRef,
                  infiniteRef,
                  manualTweenRef,
                  xToRef,
                  noWrapXToRef,
                },
                setIsLeftDisabled,
                setIsRightDisabled
              )
            }
            variant="outline"
            size="icon"
            disabled={isLeftDisabled}
          >
            ←
          </Button>
          <Button
            onClick={() =>
              handleManualSlide(
                "right",
                {
                  slideItemWidthRef,
                  containerWidthRef,
                  totalWidthRef,
                  totalRef,
                  infiniteRef,
                  manualTweenRef,
                  xToRef,
                  noWrapXToRef,
                },
                setIsLeftDisabled,
                setIsRightDisabled
              )
            }
            variant="outline"
            size="icon"
            disabled={isRightDisabled}
          >
            →
          </Button>
          <span className="text-sm text-muted-foreground ml-2">
            Manual Navigation
          </span>
        </div>
      )}

      {/* Carousel */}
      <div className="pin-height">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing">
          <ul className="images inline-block whitespace-nowrap -mx-[calc(var(--slide-gap)/2)]">
            {images.map((src, i) => (
              <li
                key={`img-${i}`}
                className="slide-item aspect-card inline-block w-[var(--slide-w)] mx-[calc(var(--slide-gap)/2)]"
              >
                <Image
                  src={src}
                  alt={`slide-${i}`}
                  width={800}
                  height={1000}
                  className="pointer-events-none user-select-none"
                  priority={i < 2}
                />
              </li>
            ))}
            {infinite &&
              images.map((src, i) => (
                <li
                  key={`dup-${i}`}
                  className="slide-item aspect-card inline-block w-[var(--slide-w)] mx-[calc(var(--slide-gap)/2)]"
                >
                  <Image
                    src={src}
                    alt={`slide-dup-${i}`}
                    width={800}
                    height={1000}
                    className="pointer-events-none user-select-none"
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { ImageCarousel };
