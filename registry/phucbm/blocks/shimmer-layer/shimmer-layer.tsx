export interface ShimmerLayerProps {
    /** Width of each shine stripe in pixels. @default 10 */
    width?: number;
    /** Skew angle of the shine effect in degrees. @default -12 */
    skew?: number;
    /** Duration of the shine animation in milliseconds. @default 650 */
    duration?: number;
    /** Color of the shine effect. @default "#fff" */
    color?: string;
}

export function ShimmerLayer({
                                 width = 10,
                                 skew = -12,
                                 duration = 650,
                                 color = '#fff'
                             }: ShimmerLayerProps) {
    return (
        <>
            <style>{`
                @keyframes shine {
                    0% {
                        right:100%; left:auto; opacity:0;
                    }
                    50% {
                       opacity:0.4;
                    }
                    to {
                       right:-100%; left:auto; opacity:0;
                    }
                }
            `}</style>

            <i className="absolute top-1/2 right-full h-[150%] z-20 pointer-events-none opacity-0 blur-lg
            group-hover/shimmer:[animation:shine_600ms_ease-in-out]
            "
               style={{
                   width: `${width * 4}px`,
                   transform: `translate(-50%,-50%) skewX(${skew}deg)`,
                   background: `repeating-linear-gradient(to right, ${color}, ${color} ${width}px, transparent ${width}px, transparent ${width * 2.5}px)`,
                   animationDuration: `${duration}ms`
               }}
            >
            </i>
        </>
    );
}