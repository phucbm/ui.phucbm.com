import {MagneticButton} from '@phucbm/magnetic-button';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';

export interface MagneticData {
    /** Horizontal offset from element center */
    deltaX: number;
    /** Vertical offset from element center */
    deltaY: number;
    /** Distance from mouse to nearest element edge */
    distance: number;
}

export type MagneticProps = {
    children: React.ReactNode;
    /** Defines the range within which the magnetic effect is active (in pixels) */
    distance?: number;
    /** Controls the strength of the magnetic pull (0 = weak, 1 = strong) */
    attraction?: number;
    /** Controls the speed of the magnetic movement (0 = slow, 1 = instant) */
    speed?: number;
    /** Callback fired when mouse enters the magnetic area */
    onEnter?: (data: MagneticData) => void;
    /** Callback fired when mouse exits the magnetic area */
    onExit?: (data: MagneticData) => void;
    /** CSS class added when the magnetic effect is active */
    activeClass?: string;
    /** Disable magnetic effect on touch devices (default: true) */
    disableOnTouch?: boolean;
    /** Show debug area visualization */
    dev?: boolean;
};

export function Magnetic({
                             children,
                             distance = 50,
                             attraction = 0.25,
                             speed = 0.1,
                             onEnter,
                             onExit,
                             activeClass,
                             disableOnTouch,
                             dev = false,
                         }: MagneticProps) {
    const scope = useRef(null);
    const instanceRef = useRef<any>(null);
    const [debugAreaSize, setDebugAreaSize] = useState({width: 0, height: 0});
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const root = scope.current as HTMLElement | null;
        if (!root) return;

        // Wrapped callbacks to track active state for debug
        const handleEnter = (data: MagneticData) => {
            setIsActive(true);
            onEnter?.(data);
        };

        const handleExit = (data: MagneticData) => {
            setIsActive(false);
            onExit?.(data);
        };

        const magneticInstance = new MagneticButton(root, {
            distance,
            attraction,
            speed,
            activeClass,
            disableOnTouch,
            onEnter: handleEnter,
            onExit: handleExit,
        });

        instanceRef.current = magneticInstance;

        // Get magnetized area size using the provided method
        if (dev && typeof magneticInstance.getMagnetizedArea === 'function') {
            const area = magneticInstance.getMagnetizedArea();
            setDebugAreaSize(area);
        }

        return () => {
            if (magneticInstance && typeof magneticInstance.destroy === 'function') {
                magneticInstance.destroy();
            }
        };
    }, [distance, attraction, speed, activeClass, disableOnTouch, onEnter, onExit, dev]);

    return (
        <span ref={scope} className="inline-block relative">
            {children}

            {dev && debugAreaSize.width > 0 && (
                <span
                    className="magnetic-debug-area"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${debugAreaSize.width}px`,
                        height: `${debugAreaSize.height}px`,
                        border: '2px dashed rgba(0, 113, 227, 0.3)',
                        borderRadius: '12px',
                        pointerEvents: 'none',
                        zIndex: -1,
                        background: isActive
                            ? 'radial-gradient(circle, rgba(0, 113, 227, 0.1) 0%, rgba(0, 113, 227, 0.05) 50%, rgba(0, 113, 227, 0) 100%)'
                            : 'radial-gradient(circle, rgba(134, 134, 139, 0.08) 0%, rgba(134, 134, 139, 0.04) 50%, rgba(134, 134, 139, 0) 100%)',
                        transition: 'background 0.3s ease, border-color 0.3s ease',
                        borderColor: isActive ? 'rgba(0, 113, 227, 0.5)' : 'rgba(0, 113, 227, 0.3)',
                    }}
                    aria-hidden="true"
                />
            )}
        </span>
    );
}