"use client";

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getNormalizedMousePosition } from "normalized-mouse-position";

gsap.registerPlugin(Observer);

export function SpotlightContent() {
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

    // --- Create smooth GSAP setters for clipX / clipY
    const clipState = { x: 45, y: 45 };
    const tweenX = gsap.quickTo(clipState, "x", {
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => updateClipPath(),
    });
    const tweenY = gsap.quickTo(clipState, "y", {
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => updateClipPath(),
    });

    const updateClipPath = () => {
      gsap.set(el, {
        clipPath: `polygon(74% 0, 100% 0, 100% 23%, ${clipState.x}% 100%, 0 100%, 0 ${clipState.y}%)`,
      });
    };

    // Initial render
    updateClipPath();

    // --- Mouse observer
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

        const reversedX = 1 - Math.abs(pos.x);
        const clipY = mapRange(pos.y, 0, 1, 20, 70);
        const clipX = mapRange(reversedX, 0, 1, 20, 70);

        // Smoothly animate to new target
        tweenX(clipX);
        tweenY(clipY);
      },
    });

    return () => observer.kill();
  }, []);

  return (
    <section ref={scope} className="h-screen overflow-hidden">
      <div
        ref={clipDiv}
        className="bg-amber-500 h-full"
        style={{
          clipPath:
            "polygon(74% 0, 100% 0, 100% 23%, 45% 100%, 0 100%, 0 45%)",
        }}
      ></div>
    </section>
  );
}
