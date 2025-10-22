"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./style.css";
import { splitTextIntoWords } from "./lib/splitTextIntoWords";

gsap.registerPlugin(ScrollTrigger);

export function WordByWord() {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const animeTextParagraphs =
      scope.current?.querySelectorAll(".anime-text p");
    if (!animeTextParagraphs || animeTextParagraphs.length === 0) return;

    const keywords = [
      // "matisse",
      // "fauvism",
      // "art",
      // "color",
      // "shape",
      // "emotion",
      // "realism",
    ];

    // Collect all words from all paragraphs
    const allWords: HTMLElement[] = [];

    // Split paragraphs
    animeTextParagraphs.forEach((p) => {
      const words = splitTextIntoWords(p as HTMLElement, keywords);
      if (words?.length) allWords.push(...words);
    });

    // Reveal now-hidden container
    animeTextParagraphs.forEach(
      (p) => ((p as HTMLElement).style.visibility = "visible")
    );

    if (allWords.length === 0) return;

    const wordHighlightBgColor = "60, 60, 60";

    ScrollTrigger.create({
      trigger: scope.current,
      pin: scope.current,
      start: "top 10%",
      end: "+=800",
      pinSpacing: true,
      markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalWords = allWords.length;

        allWords.forEach((word, index) => {
          const wordText = word.querySelector(
            ".word-text"
          ) as HTMLElement | null;
          if (!wordText) return;

          const progressTarget = 0.7;
          const revealProgress = Math.min(1, progress / progressTarget);

          const overlapWords = 30;
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

          const wordProgress =
            revealProgress <= adjustedStart
              ? 0
              : revealProgress >= adjustedEnd
              ? 1
              : (revealProgress - adjustedStart) / duration;

          // Fade-in
          word.style.opacity = String(wordProgress);

          // Background fading out
          const backgroundFadeStart =
            wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
          const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
          word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

          // Text reveal
          const textRevealThreshold = 0.9;
          const textRevealProgress =
            wordProgress >= textRevealThreshold
              ? (wordProgress - textRevealThreshold) / (1 - textRevealThreshold)
              : 0;
          wordText.style.opacity = String(Math.pow(textRevealProgress, 0.5));
        });
      },
    });
  });

  return (
    <section ref={scope} className="anime-text-container">
      <div className="container">
        <div className="anime-text">
          <p>
            Henri Matisse (1869→1954) was a French artist known for his vibrant
            use of color and bold, expressive shapes. A leading figure of the
            Fauvism movement, Matisse's work broke away from traditional
            representation, using vivid hues to convey emotion rather than
            realism.
          </p>

          <p>
            Henri Matisse (1869→1954) was a French artist known for his vibrant
            use of color and bold, expressive shapes. A leading figure of the
            Fauvism movement, Matisse's work broke away from traditional
            representation, using vivid hues to convey emotion rather than
            realism.
          </p>
        </div>
      </div>
    </section>
  );
}
