"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { splitTextIntoWords } from "@/registry/perxel/blocks/word-by-word/lib/splitTextIntoWords";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated word-by-word scroll reveal text component.
 * Each word fades in sequentially while its highlight background fades out
 * as the user scrolls through the section.
 */
export type WordbyWordProps = {
  /** The text content to animate. Supports multiple paragraphs separated by "\n\n". @default textExample */
  text?: string;

  /** List of keywords to highlight with special styles. @default [] */
  keywords?: string[];

  /** Scroll distance that defines the total animation range. @default "+=800" */
  scrollRange?: string;

  /** Start position of the animation relative to the viewport. @default "top 10%" */
  start?: string;

  /** RGB string for the temporary highlight background of each word. @default "60, 60, 60" */
  highlightRGB?: string;

  /** Whether to show ScrollTrigger markers for debugging and tuning. @default false */
  debug?: boolean;

  /** Number of words to overlap when revealing. Larger overlap = smoother wave effect. @default 30 */
  overlapWords?: number;

  /** Percentage (0–1) of total scroll range used for word reveal animation. @default 0.7 */
  progressTarget?: number;

  /** Progress threshold (0–1) at which text opacity begins to reveal after background fades. @default 0.9 */
  textRevealThreshold?: number;

  /** Additional class name(s) for the outer container element. Useful for control the sticky length. @default undefined */
  className?: string;
};

// Example text (fallback when no text prop is provided)
const textExample = `Henri Matisse (1869→1954) was a French artist known for his vibrant use of color and bold, expressive shapes. 
A leading figure of the Fauvism movement, Matisse's work broke away from traditional representation, using vivid hues to convey emotion rather than realism.

His art continues to inspire artists around the world today.`;

// Example keyword list (optional)
const keywordsExample: string[] = [];

export function WordByWord({
  text = textExample,
  keywords = keywordsExample,
  scrollRange = "+=800",
  start = "top 10%",
  highlightRGB = "60, 60, 60",
  overlapWords = 30,
  progressTarget = 0.7,
  textRevealThreshold = 0.9,
  className,
}: WordbyWordProps) {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const paragraphs = scope.current?.querySelectorAll(".animate-text p");
    if (!paragraphs?.length) return;

    const allWords: HTMLElement[] = [];

    // === Split each paragraph into words ===
    paragraphs.forEach((p) => {
      const words = splitTextIntoWords(p, keywords);
      if (words?.length) allWords.push(...words);
    });

    // Make paragraphs visible once words are injected
    paragraphs.forEach((p) => ((p as HTMLElement).style.visibility = "visible"));
    if (!allWords.length) return;

    // === Scroll-driven animation logic ===
    ScrollTrigger.create({
      trigger: scope.current,
      pin: scope.current,
      start,
      end: scrollRange,
      pinSpacing: true,
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalWords = allWords.length;

        allWords.forEach((word, index) => {
          const wordText = word.querySelector(".word-text") as HTMLElement | null;
          if (!wordText) return;

          // 1️⃣ Normalize progress: only 0–progressTarget part of the scroll drives reveal
          const revealProgress = Math.min(1, progress / progressTarget);

          // 2️⃣ Compute overlap and scaling for staggered word timing
          const totalAnimationLength = 1 + overlapWords / totalWords;
          const wordStart = index / totalWords;
          const wordEnd = wordStart + overlapWords / totalWords;
          const timelineScale =
            1 /
            Math.min(
              totalAnimationLength,
              1 + (totalWords - 1) / totalWords + overlapWords / totalWords
            );

          const adjustedStart = wordStart * timelineScale;
          const adjustedEnd = wordEnd * timelineScale;
          const duration = adjustedEnd - adjustedStart;

          // 3️⃣ Calculate individual word progress based on scroll position
          const wordProgress =
            revealProgress <= adjustedStart
              ? 0
              : revealProgress >= adjustedEnd
              ? 1
              : (revealProgress - adjustedStart) / duration;

          // 4️⃣ Fade-in opacity for the entire word wrapper
          word.style.opacity = String(wordProgress);

          // 5️⃣ Fade-out highlight background near the end of each word’s reveal
          const backgroundFadeStart =
            wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
          const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
          word.style.backgroundColor = `rgba(${highlightRGB}, ${backgroundOpacity})`;

          // 6️⃣ Reveal the inner text once the background fades away
          const textRevealProgress =
            wordProgress >= textRevealThreshold
              ? (wordProgress - textRevealThreshold) / (1 - textRevealThreshold)
              : 0;
          wordText.style.opacity = String(Math.pow(textRevealProgress, 0.5));
        });
      },
    });
  });

  // Split text content by paragraph breaks (double newlines)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p, i) => (
      <p key={i} className="invisible">
        {p}
      </p>
    ));

  return (
    <section ref={scope} className={cn("anime-text-container w-full", className)}>
      <div className="container mx-auto px-4">
        <div className="animate-text relative leading-relaxed text-pretty">
          {paragraphs}
        </div>
      </div>
    </section>
  );
}
