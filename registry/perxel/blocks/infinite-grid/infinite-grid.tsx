"use client"
import React, { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Observer } from "gsap/Observer"
import "./infinite-grid.css"

gsap.registerPlugin(Observer, useGSAP)

const InfiniteGrid = () => {
  const scope = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const container = root.querySelector(".container1") as HTMLElement
      if (!container) return

      const wrapper = root.querySelector(".wrapper") as HTMLElement
      if (!wrapper) return

      const closestWrapper = root.closest(".outer-wrapper")

      // === Dynamic wrap helpers (auto recalculated) ===
      let halfX = 0,
        halfY = 0
      let wrapX = (v: number) => v
      let wrapY = (v: number) => v

      const updateWraps = () => {
        halfX = wrapper.clientWidth / 2
        wrapX = gsap.utils.wrap(-halfX, 0)

        halfY = wrapper.clientHeight / 2
        wrapY = gsap.utils.wrap(-halfY, 0)
      }

      updateWraps()
      window.addEventListener("resize", updateWraps)
      window.addEventListener("load", updateWraps)

      // === Motion helpers ===
      const xTo = gsap.quickTo(wrapper, "x", {
        duration: 1.5,
        ease: "power4",
        modifiers: { x: gsap.utils.unitize((v) => wrapX(parseFloat(v))) },
      })

      const yTo = gsap.quickTo(wrapper, "y", {
        duration: 1.5,
        ease: "power4",
        modifiers: { y: gsap.utils.unitize((v) => wrapY(parseFloat(v))) },
      })

      const scaleToX = gsap.quickTo(container, "scaleX", {
        duration: 1.5,
        ease: "power4",
      })

      const scaleToY = gsap.quickTo(container, "scaleY", {
        duration: 1.5,
        ease: "power4",
      })

      // === State ===
      let incrX = 0,
        incrY = 0
      let interactionTimeout: NodeJS.Timeout

      // === GSAP Observer ===
      const gsapObserver = Observer.create({
        target: closestWrapper,
        type: "wheel,touch,pointer",
        preventDefault: true,

        onChangeX: (self) => {
          if (self.event.type === "wheel") {
            incrX -= self.deltaX
          } else {
            incrX += self.deltaX * 2
          }

          xTo(incrX)

          const rawScale = 1 - self.deltaX / 200
          const safeScale = gsap.utils.clamp(0.8, 1.2, rawScale)
          scaleToX(safeScale)

          clearTimeout(interactionTimeout)
          interactionTimeout = setTimeout(() => scaleToX(1), 66)
        },

        onChangeY: (self) => {
          if (self.event.type === "wheel") {
            incrY -= self.deltaY
          } else {
            incrY += self.deltaY * 2
          }

          yTo(incrY)

          const rawScale = 1 - self.deltaY / 200
          const safeScale = gsap.utils.clamp(0.8, 1.2, rawScale)
          scaleToY(safeScale)

          clearTimeout(interactionTimeout)
          interactionTimeout = setTimeout(() => scaleToY(1), 66)
        },
      })

      // === Cleanup automatically handled by useGSAP ===
      return () => {
        gsapObserver.kill()
        window.removeEventListener("resize", updateWraps)
        window.removeEventListener("load", updateWraps)
      }
    },
    { scope } // 🔥 Important: ties all animations and observers to this component only
  )

  return (
    <section className="mwg_effect026" ref={scope}>
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
  )
}

export default InfiniteGrid
