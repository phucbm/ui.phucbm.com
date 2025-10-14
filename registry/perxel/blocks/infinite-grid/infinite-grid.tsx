"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import "./infinite-grid.css";

const InfiniteGrid = () => {
  useEffect(() => {
    // Ensure scroll position restoration doesn't interfere
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    gsap.registerPlugin(Observer);

    const initEffect = () => {
      const root = document.querySelector(".mwg_effect026") as HTMLElement;
      if (!root) return;

      const container = root.querySelector(".container1") as HTMLElement;
      const wrapper = root.querySelector(".wrapper") as HTMLElement;
      if (!container || !wrapper) return;

      /** ───────────────────────────────
       *  🧩 Auto height sync logic (ResizeObserver)
       *  Keeps .mwg_effect026 matching .wrapper height
       *  even inside fixed/resizable layouts
       * ─────────────────────────────── */
      const updateHeight = () => {
        root.style.height = `${wrapper.offsetHeight}px`;
      };
      updateHeight(); // initial sync

      const ro = new ResizeObserver(updateHeight);
      ro.observe(wrapper);

      // ───────────────────────────────
      // GSAP setup
      // ───────────────────────────────
      const halfX = wrapper.clientWidth / 2;
      const wrapX = gsap.utils.wrap(-halfX, 0);
      const xTo = gsap.quickTo(wrapper, "x", {
        duration: 1.5,
        ease: "power4",
        modifiers: { x: gsap.utils.unitize(wrapX) },
      });

      const halfY = wrapper.clientHeight / 2;
      const wrapY = gsap.utils.wrap(-halfY, 0);
      const yTo = gsap.quickTo(wrapper, "y", {
        duration: 1.5,
        ease: "power4",
        modifiers: { y: gsap.utils.unitize(wrapY) },
      });

      const scaleToX = gsap.quickTo(container, "scaleX", {
        duration: 1.5,
        ease: "power4",
      });
      const scaleToY = gsap.quickTo(container, "scaleY", {
        duration: 1.5,
        ease: "power4",
      });

      // Scroll/touch/pointer interactions
      let incrX = 0,
        incrY = 0;
      let interactionTimeout: NodeJS.Timeout;

      const gsapObserver = Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        onChangeX: (self) => {
          incrX += self.event.type === "wheel" ? -self.deltaX : self.deltaX * 2;
          xTo(incrX);

          const clampScale = gsap.utils.clamp(-100, 100);
          const valSc = 1 - clampScale(self.deltaX / 200);
          scaleToX(valSc);

          clearTimeout(interactionTimeout);
          interactionTimeout = setTimeout(() => scaleToX(1), 66);
        },
        onChangeY: (self) => {
          incrY += self.event.type === "wheel" ? -self.deltaY : self.deltaY * 2;
          yTo(incrY);

          const clampScale = gsap.utils.clamp(-100, 100);
          const valSc = 1 - clampScale(self.deltaY / 200);
          scaleToY(valSc);

          clearTimeout(interactionTimeout);
          interactionTimeout = setTimeout(() => scaleToY(1), 66);
        },
        preventDefault: true,
      });

      // Clean up
      return () => {
        gsapObserver.kill();
        ro.disconnect();
      };
    };

    const onLoad = () => initEffect();

    if (document.readyState === "complete") {
      initEffect();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <section className="mwg_effect026">
      <div className="container1">
        <div className="wrapper">
          {[...Array(4)].map((_, i) => (
            <div className="content" key={i} aria-hidden={i !== 0}>
              {[
                "12",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "01",
                "13",
                "14",
                "15",
              ].map((num) => (
                <div className="media" key={num}>
                  <img src={`/InfiniteGrid/medias/${num}.png`} alt="" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteGrid;
