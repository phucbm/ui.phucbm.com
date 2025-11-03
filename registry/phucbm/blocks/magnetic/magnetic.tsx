import {MagneticButton} from '@phucbm/magnetic-button';
import * as React from 'react';
import {useEffect, useRef} from 'react';

export type MagneticProps = {
    children: React.ReactNode;
    distance?: number;
    attraction?: number;
    speed?: number;
    onEnter?: (data: any) => void;
    onExit?: (data: any) => void;
};

export function Magnetic({
                             children,
                             distance = 50,
                             attraction = 0.25,
                             speed = 0.1,
                             onEnter,
                             onExit
                         }: MagneticProps) {
    const scope = useRef(null);

    useEffect(() => {
        const root = scope.current as HTMLElement | null;
        if (!root) return;

        const magneticInstance = new MagneticButton(root, {
            distance,
            attraction,
            speed,
        });

        return () => {
            if (magneticInstance && typeof (magneticInstance as any).destroy === 'function') {
                (magneticInstance as any).destroy();
            }
        };
    }, [distance, attraction, speed, onEnter, onExit]);

    return (
        <span ref={scope} className="inline-block">
            {children}
        </span>
    );
}