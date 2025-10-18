"use client"

import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Image from "next/image"
import "./slide-carousel.css"
import { Button } from "@/components/ui/button"
import { checkBoundaries } from "@/registry/perxel/blocks/image-carousel/lib/checkBoundaries"
import { handleManualSlide } from "@/registry/perxel/blocks/image-carousel/lib/handleManualSlide"
import { useGSAP } from "@gsap/react"

export type ImageCarouselProps = {
  baseSpeed?: number
  hoverSlowdownRatio?: number
  autoSlide?: boolean
  infinite?: boolean
  manualNav?: boolean
  images?: string[]
}

const DEFAULT_IMAGES = [
  "/FadingTransition/medias/1.png",
  "/FadingTransition/medias/2.png",
  "/FadingTransition/medias/3.png",
  "/FadingTransition/medias/4.png",
  "/FadingTransition/medias/5.png",
]

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  baseSpeed = 1,
  hoverSlowdownRatio = 0.5,
  autoSlide = true,
  infinite = true,
  manualNav = false,
  images = DEFAULT_IMAGES,
}) => {
  const scope = useRef<HTMLDivElement | null>(null)
  const speedFactorRef = useRef(0.5)
  const baseSpeedRef = useRef(baseSpeed)
  const hoverSlowdownRatioRef = useRef(hoverSlowdownRatio)
  const normalSpeedRef = useRef(0.5)

  const autoSlideRef = useRef(autoSlide)
  const infiniteRef = useRef(infinite)

  const totalRef = useRef(0)
  const xToRef = useRef<((v: number) => void) | null>(null)
  const noWrapXToRef = useRef<((v: number) => void) | null>(null)
  const tickRef = useRef<((t: number, dt: number) => void) | null>(null)

  const slideRef = useRef<HTMLUListElement | null>(null)
  const slideItemWidthRef = useRef(0)
  const containerWidthRef = useRef(0)
  const totalWidthRef = useRef(0)

  const manualTweenRef = useRef<gsap.core.Tween | null>(null)
  const [isLeftDisabled, setIsLeftDisabled] = useState(false)
  const [isRightDisabled, setIsRightDisabled] = useState(false)

  // Keep refs in sync with prop changes
  useEffect(() => {
    baseSpeedRef.current = baseSpeed
  }, [baseSpeed])

  useEffect(() => {
    hoverSlowdownRatioRef.current = hoverSlowdownRatio
  }, [hoverSlowdownRatio])

  useEffect(() => {
    autoSlideRef.current = autoSlide
  }, [autoSlide])

  useEffect(() => {
    infiniteRef.current = infinite
    checkBoundaries(totalRef, totalWidthRef, containerWidthRef, infiniteRef, setIsLeftDisabled, setIsRightDisabled)
  }, [infinite])

  // === GSAP setup ===
  useGSAP(() => {
    const root = scope.current
    if (!root) return
  
    const slide = root.querySelector(".images") as HTMLUListElement | null
    const slideItem = root.querySelector(".slide-item:not(:first-child)") as HTMLElement | null
    const container = root.querySelector(".overflow-hidden") as HTMLElement | null
    if (!slide || !slideItem || !container) return
  
    slideRef.current = slide
  
    // === Reset position ===
    gsap.killTweensOf(slide)
    gsap.set(slide, { x: 0 })
    totalRef.current = 0
  
    // === Dimensions ===
    slideItemWidthRef.current = slideItem.clientWidth
    containerWidthRef.current = container.clientWidth
    totalWidthRef.current = slideItem.clientWidth * slide.querySelectorAll(".slide-item").length - 5
  
    const half = totalWidthRef.current / 2
    const wrap = gsap.utils.wrap(-half, 0)
  
    xToRef.current = gsap.quickTo(slide, "x", {
      duration: 0.1,
      ease: "power3",
      modifiers: { x: gsap.utils.unitize(wrap) },
    })
    noWrapXToRef.current = gsap.quickTo(slide, "x", { duration: 0.1, ease: "power3" })
  
    const tick = (_t: number, dt: number) => {
      if (!autoSlideRef.current) return
      const moveSpeed = baseSpeedRef.current * speedFactorRef.current
      let next = totalRef.current - dt * moveSpeed
  
      if (!infiniteRef.current) {
        const maxScroll = -(totalWidthRef.current - containerWidthRef.current)
        next = Math.max(maxScroll, next)
      }
  
      totalRef.current = next
      const fn = infiniteRef.current ? xToRef.current : noWrapXToRef.current
      fn?.(totalRef.current)
      checkBoundaries(totalRef, totalWidthRef, containerWidthRef, infiniteRef, setIsLeftDisabled, setIsRightDisabled)
    }
  
    gsap.ticker.add(tick)
  
    const onEnter = () => (speedFactorRef.current = normalSpeedRef.current * hoverSlowdownRatioRef.current)
    const onLeave = () => (speedFactorRef.current = normalSpeedRef.current)
  
    slide.addEventListener("mouseenter", onEnter)
    slide.addEventListener("mouseleave", onLeave)
  
    checkBoundaries(totalRef, totalWidthRef, containerWidthRef, infiniteRef, setIsLeftDisabled, setIsRightDisabled)
  
    return () => {
      slide.removeEventListener("mouseenter", onEnter)
      slide.removeEventListener("mouseleave", onLeave)
      gsap.ticker.remove(tick)
      manualTweenRef.current?.kill()
      gsap.killTweensOf(slide)
      xToRef.current = null
      noWrapXToRef.current = null
      slideRef.current = null
    }
  }, { dependencies: [infinite, autoSlide, baseSpeed, hoverSlowdownRatio] })
  
  // === Render ===
  return (
    <section className="slide-carousel" ref={scope}>
      {manualNav && (
        <div className="flex gap-2 items-center mb-3">
          <Button
            onClick={() =>
              handleManualSlide(
                "left",
                { slideItemWidthRef, containerWidthRef, totalWidthRef, totalRef, infiniteRef, manualTweenRef, xToRef, noWrapXToRef },
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
                { slideItemWidthRef, containerWidthRef, totalWidthRef, totalRef, infiniteRef, manualTweenRef, xToRef, noWrapXToRef },
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
          <span className="text-sm text-muted-foreground ml-2">Manual Navigation</span>
        </div>
      )}

      <div className="pin-height">
        <div className="overflow-hidden">
          <ul className="images">
            {images.map((src, i) => (
              <li key={`img-${i}`} className="slide-item aspect-card">
                <Image src={src} alt={`slide-${i}`} width={800} height={1000} className="media" priority={i < 2} />
              </li>
            ))}
            {infinite &&
              images.map((src, i) => (
                <li key={`dup-${i}`} className="slide-item aspect-card">
                  <Image src={src} alt={`slide-dup-${i}`} width={800} height={1000} className="media" />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { ImageCarousel }
