"use client";

import React, {useId, useRef} from "react";
import {cn} from "@/lib/utils";

type TooltipAlign = "top" | "bottom";

/**
 * Props for the Tooltip component
 */
export interface TooltipProps {
    /** Content to wrap with tooltip functionality */
    children: React.ReactNode;
    /** Tooltip content displayed on hover. @default undefined */
    tooltip?: string | React.ReactNode;
    /** Alignment of the tooltip relative to the element. @default "top" */
    tooltipAlign?: TooltipAlign;
    /** Custom CSS class for the wrapper */
    className?: string;
}

/**
 * Tooltip component that adds animated tooltip functionality to any element
 *
 * @example
 * ```tsx
 * <Tooltip tooltip="Click me" tooltipAlign="top">
 *   <button>Hover over me</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
                            tooltip,
                            tooltipAlign = "top",
                            className,
                            children,
                        }: TooltipProps) {
    const id = useId();
    const scope = useRef<HTMLDivElement>(null);

    // Generate random rotation once
    const rotation = React.useMemo(
        () => Math.floor(Math.random() * 11) - 5, // -5 → 5
        []
    );

    const tooltipStyle = React.useMemo(
        () => ({
            "--tooltip-rotation": `${rotation}deg`,
        } as React.CSSProperties),
        [rotation]
    );

    return (
        <>
            <style>{`
        @keyframes tooltip-enter-top {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.9) rotate(0deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(var(--tooltip-rotation));
          }
        }

        @keyframes tooltip-enter-bottom {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.9) rotate(0deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(var(--tooltip-rotation));
          }
        }

        @keyframes tooltip-exit {
          from {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          to {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
        }

        /* Default exit animation */
        .tooltip {
          opacity: 0;
          animation: tooltip-exit 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Enter on hover */
        .tooltip-wrapper:hover .tooltip {
          animation: tooltip-enter-top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .tooltip-wrapper[data-tooltip-align="bottom"]:hover .tooltip {
          animation: tooltip-enter-bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

    
        /* Show on active states */
        .tooltip-wrapper:hover .tooltip {
          opacity: 1;
        }
      `}</style>

            <div
                className={cn("tooltip-wrapper relative inline-block", className)}
                ref={scope}
                data-tooltip-align={tooltipAlign}
            >
                <div className="relative z-20" aria-describedby={tooltip ? id : undefined}>{children}</div>

                {tooltip && (
                    <div
                        id={id}
                        suppressHydrationWarning
                        role="tooltip"
                        style={tooltipStyle}
                        className={cn(
                            "tooltip absolute z-10 left-1/2 -translate-x-1/2 px-1 py-0.5 text-xs font-bold rounded bg-black text-white pointer-events-none whitespace-nowrap origin-center",
                            tooltipAlign === "top" && "bottom-full mb-1",
                            tooltipAlign === "bottom" && "top-full mt-1"
                        )}
                    >
                        {tooltip}
                    </div>
                )}
            </div>
        </>
    );
}