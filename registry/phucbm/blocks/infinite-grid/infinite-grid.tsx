"use client"
import React, {useRef} from "react"
import gsap from "gsap"
import {useGSAP} from "@gsap/react"
import {Observer} from "gsap/Observer"

gsap.registerPlugin(Observer, useGSAP)

export interface InfiniteGridProps {
    /** Array of images. **/
    images: {
        url: string;
        title: string;
    }[]
}

export function InfiniteGrid({images}: InfiniteGridProps) {
    const scope = useRef<HTMLDivElement | null>(null)
    const containerScale = useRef<HTMLDivElement | null>(null)

    useGSAP(
        () => {
            const root = scope.current
            const containerScaleElement = containerScale.current
            if (!root || !containerScale) return

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
                modifiers: {x: gsap.utils.unitize(wrapX)},
            })
            const yTo = gsap.quickTo(wrapper, "y", {
                duration: 1.5,
                ease: "power4",
                modifiers: {y: gsap.utils.unitize(wrapY)},
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
                onPress: () => {
                    containerScaleElement.style.scale = "1"
                },
                onRelease: () => {
                    containerScaleElement.style.scale = "1.1";
                },
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
        {scope}
    )

    return (
        <div ref={scope}>
            <div className="h-screen w-full overflow-hidden">
                <div ref={containerScale} className="scale-[1.1] transition-transform duration-300">
                    <div className="container1 h-full">
                        <div className="wrapper grid grid-cols-2 w-max will-change-transform">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    className="content pointer-events-none grid w-max grid-cols-5 gap-[5vw] p-[calc(5vw/2)] max-[900px]:gap-[20vw] max-[900px]:p-[calc(20vw/2)]"
                                    key={i}
                                    aria-hidden={i !== 0}
                                >
                                    {images.map(({url, title}, index) => (
                                        <div key={index}
                                             className="w-[50vw] md:w-[18vw] aspect-square select-none">
                                            <img src={url} alt={title}
                                                 className="w-full h-full object-cover"
                                                 loading="eager"/>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}