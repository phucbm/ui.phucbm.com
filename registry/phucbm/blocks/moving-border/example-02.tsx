'use client';

import {MovingBorder} from "@/registry/phucbm/blocks/moving-border/moving-border";
import {useEffect, useRef, useState} from "react";

export default function MovingBorderExample_02() {
    const [isCircle, setIsCircle] = useState(true);
    const [radius, setRadius] = useState(10);
    const [borderWidth, setBorderWidth] = useState(4);
    const [gradientWidth, setGradientWidth] = useState(150);
    const [duration, setDuration] = useState(4);
    const [colors, setColors] = useState(["#84b5ff", "#dad7f8", "#cb92ff"]);
    const [newColor, setNewColor] = useState("#ff6b6b");

    // Debounced values for rendering
    const [debouncedRadius, setDebouncedRadius] = useState(radius);
    const [debouncedBorderWidth, setDebouncedBorderWidth] = useState(borderWidth);
    const [debouncedGradientWidth, setDebouncedGradientWidth] = useState(gradientWidth);
    const [debouncedDuration, setDebouncedDuration] = useState(duration);

    // Debounce timers
    const radiusTimer = useRef<NodeJS.Timeout | null>(null);
    const borderWidthTimer = useRef<NodeJS.Timeout | null>(null);
    const gradientWidthTimer = useRef<NodeJS.Timeout | null>(null);
    const durationTimer = useRef<NodeJS.Timeout | null>(null);

    // Debounce radius
    useEffect(() => {
        if (radiusTimer.current) clearTimeout(radiusTimer.current);
        radiusTimer.current = setTimeout(() => {
            setDebouncedRadius(radius);
        }, 100);
        return () => {
            if (radiusTimer.current) clearTimeout(radiusTimer.current);
        };
    }, [radius]);

    // Debounce border width
    useEffect(() => {
        if (borderWidthTimer.current) clearTimeout(borderWidthTimer.current);
        borderWidthTimer.current = setTimeout(() => {
            setDebouncedBorderWidth(borderWidth);
        }, 100);
        return () => {
            if (borderWidthTimer.current) clearTimeout(borderWidthTimer.current);
        };
    }, [borderWidth]);

    // Debounce gradient width
    useEffect(() => {
        if (gradientWidthTimer.current) clearTimeout(gradientWidthTimer.current);
        gradientWidthTimer.current = setTimeout(() => {
            setDebouncedGradientWidth(gradientWidth);
        }, 100);
        return () => {
            if (gradientWidthTimer.current) clearTimeout(gradientWidthTimer.current);
        };
    }, [gradientWidth]);

    // Debounce duration
    useEffect(() => {
        if (durationTimer.current) clearTimeout(durationTimer.current);
        durationTimer.current = setTimeout(() => {
            setDebouncedDuration(duration);
        }, 100);
        return () => {
            if (durationTimer.current) clearTimeout(durationTimer.current);
        };
    }, [duration]);

    const handleAddColor = () => {
        if (colors.length < 10) {
            setColors([...colors, newColor]);
        }
    };

    const handleRemoveColor = (index: number) => {
        if (colors.length > 1) {
            setColors(colors.filter((_, i) => i !== index));
        }
    };

    const handleColorChange = (index: number, value: string) => {
        const updatedColors = [...colors];
        updatedColors[index] = value;
        setColors(updatedColors);
    };

    return (
        <div className="flex justify-center items-center flex-wrap h-screen bg-emerald-50">
            <div className="w-[calc(100%-240px)] flex justify-center items-center">
                {/* Moving Border Element */}
                <MovingBorder
                    key={isCircle ? 'circle' : 'square'}
                    isCircle={isCircle}
                    {...(!isCircle && {radius: debouncedRadius})}
                    borderWidth={debouncedBorderWidth}
                    gradientWidth={debouncedGradientWidth}
                    duration={debouncedDuration}
                    colors={colors}
                >
                    <div
                        className="w-[200px] aspect-square bg-accent overflow-hidden flex justify-center items-center"
                        style={{
                            borderRadius: isCircle ? '50%' : `${debouncedRadius}px`
                        }}
                    >
                        <img
                            className="object-cover w-full h-full"
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJrZ3NlejZ4ZXlvaDRnbTR1b2VmcG1waGM1Y3hvNGU4aGE0aHcweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BkNnO2qmCWTQuac/giphy.gif"
                            alt="A blurry photo of white flowers in a field"
                        />
                    </div>
                </MovingBorder>
            </div>

            {/* Control Panel */}
            <div className="w-[240px] p-3">
                <div className="bg-white rounded-xl p-3 shadow-xl max-h-[95vh] overflow-y-auto custom-scrollbar">
                    {/* Shape Toggle Section */}
                    <div className="mb-4">
                        <div className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Shape
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 font-medium">Circle Mode</span>
                            <button
                                onClick={() => setIsCircle(!isCircle)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isCircle ? 'bg-emerald-500' : 'bg-gray-200'
                                }`}
                            >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    isCircle ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 my-3"/>

                    {/* Parameters Section */}
                    <div>
                        <div className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Parameters
                        </div>

                        {/* Radius Control - Only shown when not circle */}
                        {!isCircle && (
                            <div className="mb-2">
                                <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                    <span>Radius</span>
                                    <span className="font-semibold text-emerald-500">{radius}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    step="1"
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                    Border radius for corners
                                </p>
                            </div>
                        )}

                        {/* Border Width Control */}
                        <div className="mb-2">
                            <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                <span>Border Width</span>
                                <span className="font-semibold text-emerald-500">{borderWidth}px</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={borderWidth}
                                onChange={(e) => setBorderWidth(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                Thickness of the border
                            </p>
                        </div>

                        {/* Gradient Width Control */}
                        <div className="mb-2">
                            <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                <span>Gradient Width</span>
                                <span className="font-semibold text-emerald-500">{gradientWidth}px</span>
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="400"
                                step="10"
                                value={gradientWidth}
                                onChange={(e) => setGradientWidth(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                Width of gradient effect
                            </p>
                        </div>

                        {/* Duration Control */}
                        <div className="mb-2">
                            <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                <span>Duration</span>
                                <span className="font-semibold text-emerald-500">{duration}s</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                Animation speed (lower=faster)
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 my-3"/>

                    {/* Colors Section */}
                    <div>
                        <div className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Colors
                        </div>

                        {/* Color List */}
                        <div className="space-y-2 mb-3">
                            {colors.map((color, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        className="w-8 aspect-square rounded cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded font-mono"
                                    />
                                    <button
                                        onClick={() => handleRemoveColor(index)}
                                        disabled={colors.length === 1}
                                        className={`p-1.5 rounded ${
                                            colors.length === 1
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-red-500 hover:bg-red-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Color */}
                        {colors.length < 10 && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-8 aspect-square rounded cursor-pointer border border-gray-200"
                                />
                                <input
                                    type="text"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded font-mono"
                                    placeholder="#ff6b6b"
                                />
                                <button
                                    onClick={handleAddColor}
                                    className="p-1.5 rounded text-emerald-500 hover:bg-emerald-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 4v16m8-8H4"/>
                                    </svg>
                                </button>
                            </div>
                        )}

                        <p className="text-[0.65rem] text-gray-400 mt-2 leading-tight">
                            {colors.length < 10
                                ? `Add up to ${10 - colors.length} more color(s)`
                                : 'Maximum colors reached'}
                        </p>
                    </div>
                </div>

                <style jsx>{`
                    .slider::-webkit-slider-thumb {
                        -webkit-appearance:none;
                        appearance:none;
                        width:12px;
                        height:12px;
                        border-radius:50%;
                        background:#10b981;
                        cursor:pointer;
                        box-shadow:0 1px 3px rgba(0, 0, 0, 0.15);
                    }
                    .slider::-moz-range-thumb {
                        width:12px;
                        height:12px;
                        border-radius:50%;
                        background:#10b981;
                        cursor:pointer;
                        border:none;
                        box-shadow:0 1px 3px rgba(0, 0, 0, 0.15);
                    }

                    /* Scrollbar */
                    .custom-scrollbar::-webkit-scrollbar {
                        width:5px;
                        height:8px; /* Height for horizontal scrollbar */
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background:#f1f5f9; /* Light gray track */
                        border-radius:4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background:#10b981; /* Emerald green thumb */
                        border-radius:4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background:#059669; /* Darker emerald on hover */
                    }

                    /* Firefox */
                    .custom-scrollbar {
                        scrollbar-width:thin;
                        scrollbar-color:#10b981 #f1f5f9;
                    }
                `}</style>
            </div>
        </div>
    );
}