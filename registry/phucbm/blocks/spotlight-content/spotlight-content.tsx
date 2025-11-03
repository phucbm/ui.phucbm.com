"use client";

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getNormalizedMousePosition } from "normalized-mouse-position";
import clsx from "clsx";

gsap.registerPlugin(Observer);

export type SpotlightContentProps = {
  /** Background color or gradient for the spotlight area. @default "#fbbf24" */
  color?: string;
  /** Duration of the smooth motion in seconds. @default 0.4 */
  duration?: number;
  /** Easing function used for the tween animation. @default "power2.out" */
  ease?: string;
  /** Vertical clip range in percent [min, max]. @default [20, 70] */
  rangeY?: [number, number];
  /** Horizontal clip range in percent [min, max]. @default [20, 70] */
  rangeX?: [number, number];
  /** Reverse the X-axis direction when moving the mouse. @default true */
  reverseX?: boolean;
  /** Initial clip position before any mouse movement. @default {x:45, y:45} */
  initial?: { x: number; y: number };
  /** Additional class names applied to the root section. */
  className?: string;
};

export function SpotlightContent({
  color = "#fbbf24",
  duration = 0.4,
  ease = "power2.out",
  rangeY = [20, 70],
  rangeX = [20, 70],
  reverseX = true,
  initial = { x: 45, y: 45 },
  className,
}: SpotlightContentProps) {
  const scope = useRef<HTMLElement | null>(null);
  const clipDiv = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const el = clipDiv.current;
    if (!el) return;

    const mapRange = (
      v: number,
      inMin: number,
      inMax: number,
      outMin: number,
      outMax: number
    ) => ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

    const clipState = { x: initial.x, y: initial.y };
    const updateClipPath = () => {
      gsap.set(el, {
        clipPath: `polygon(74% 0, 100% 0, 100% 23%, ${clipState.x}% 100%, 0 100%, 0 ${clipState.y}%)`,
      });
    };

    const tweenX = gsap.quickTo(clipState, "x", {
      duration,
      ease,
      onUpdate: updateClipPath,
    });
    const tweenY = gsap.quickTo(clipState, "y", {
      duration,
      ease,
      onUpdate: updateClipPath,
    });

    updateClipPath();

    const observer = Observer.create({
      target: window,
      type: "pointer",
      onMove: ({ x = 0, y = 0 }) => {
        const pos = getNormalizedMousePosition({
          x,
          y,
          origin: "100% 0%",
          clamp: true,
        });

        const mappedX = reverseX ? 1 - Math.abs(pos.x) : Math.abs(pos.x);
        const clipX = mapRange(mappedX, 0, 1, rangeX[0], rangeX[1]);
        const clipY = mapRange(pos.y, 0, 1, rangeY[0], rangeY[1]);

        tweenX(clipX);
        tweenY(clipY);
      },
    });

    return () => observer.kill();
  }, [duration, ease, rangeX, rangeY, reverseX]);

  return (
    <section
      ref={scope}
      className={clsx("h-screen overflow-hidden", className)}
    >
      <div
        ref={clipDiv}
        className="h-full"
        style={{
          background: color,
          clipPath: `polygon(74% 0, 100% 0, 100% 23%, ${initial.x}% 100%, 0 100%, 0 ${initial.y}%)`,
        }}
      />
    </section>
  );
}
