"use client"
import React, {useRef} from "react"
import gsap from "gsap"
import {useGSAP} from "@gsap/react"
import {Observer} from "gsap/Observer"
import "./infinite-grid.css"

gsap.registerPlugin(Observer, useGSAP)

export interface InfiniteGridProps {
  /** Array of React nodes representing images, e.g.:
   *  [<div className="media"><img src="/..." /></div>, ...]
   */
  images: React.ReactNode[]
}

export const InfiniteGrid: React.FC<InfiniteGridProps> = ({images}) => {
  const scope = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      const container = root.querySelector(".container1") as HTMLElement
      const wrapper = root.querySelector(".wrapper") as HTMLElement
      if (!container || !wrapper) return

      // === Wrap helpers
      const halfX = wrapper.clientWidth / 2
      const wrapX = gsap.utils.wrap(-halfX, 0)
      const halfY = wrapper.clientHeight / 2
      const wrapY = gsap.utils.wrap(-halfY, 0)

      const xTo = gsap.quickTo(wrapper, "x", {
        duration: 1.5,
        ease: "power4",
        modifiers: { x: gsap.utils.unitize(wrapX) },
      })
      const yTo = gsap.quickTo(wrapper, "y", {
        duration: 1.5,
        ease: "power4",
        modifiers: { y: gsap.utils.unitize(wrapY) },
      })

      const scaleToX = gsap.quickTo(container, "scaleX", {
        duration: 1.5,
        ease: "power4",
      })
      const scaleToY = gsap.quickTo(container, "scaleY", {
        duration: 1.5,
        ease: "power4",
      })

      let incrX = 0,
        incrY = 0
      let interactionTimeout: NodeJS.Timeout

      // === GSAP Observer
      const gsapObserver = Observer.create({
          target: root,
        type: "wheel,touch,pointer",
        preventDefault: true,

        onChangeX: (self) => {
          incrX += self.event.type === "wheel" ? -self.deltaX : self.deltaX * 2
          xTo(incrX)

          const rawScale = 1 - self.deltaX / 200
          const safeScale = gsap.utils.clamp(0.8, 1.2, rawScale)
          scaleToX(safeScale)

          clearTimeout(interactionTimeout)
          interactionTimeout = setTimeout(() => scaleToX(1), 66)
        },

        onChangeY: (self) => {
          incrY += self.event.type === "wheel" ? -self.deltaY : self.deltaY * 2
          yTo(incrY)

          const rawScale = 1 - self.deltaY / 200
          const safeScale = gsap.utils.clamp(0.8, 1.2, rawScale)
          scaleToY(safeScale)

          clearTimeout(interactionTimeout)
          interactionTimeout = setTimeout(() => scaleToY(1), 66)
        },
      })

      // cleanup automatically handled by useGSAP
      return () => {
        gsapObserver.kill()
      }
    },
    { scope } // ← this ties all GSAP context & cleanup to this component instance
  )

  return (
    <div className="mwg_effect026_wrapper" ref={scope}>
      <section className="mwg_effect026">
        <div className="container1">
          <div className="wrapper">
            {[...Array(4)].map((_, i) => (
              <div className="content" key={i} aria-hidden={i !== 0}>
                {images.map((img, index) => (
                  <React.Fragment key={index}>{img}</React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
