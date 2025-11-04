'use client';

import {Magnetic} from "@/registry/phucbm/blocks/magnetic/magnetic";
import {useState} from "react";

interface MagneticPreset {
    name: string;
    distance: number;
    attraction: number;
    speed: number;
}

const PRESETS: MagneticPreset[] = [
    {name: 'Default', distance: 50, attraction: 0.3, speed: 0.1},
    {name: 'Strong Attraction', distance: 120, attraction: 0.2, speed: 0.15},
    {name: 'Quick & Subtle', distance: 80, attraction: 0.5, speed: 0.5},
];

export default function MagneticExample_02() {
    const [distance, setDistance] = useState(50);
    const [attraction, setAttraction] = useState(0.5);
    const [speed, setSpeed] = useState(0.1);
    const [activePreset, setActivePreset] = useState<string>('Default');

    const handlePresetClick = (preset: MagneticPreset) => {
        setActivePreset(preset.name);
        setDistance(preset.distance);
        setAttraction(preset.attraction);
        setSpeed(preset.speed);
    };

    return (
        <div className="h-screen overflow-hidden flex items-start justify-center bg-slate-50">
            <div className="w-[calc(100%-240px)] flex justify-center items-center h-screen">
                <Magnetic
                    distance={distance}
                    attraction={attraction}
                    speed={speed}
                    dev={true}
                >
                    <button
                        className="relative inline-flex items-center justify-center
                    px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white
                    font-bold uppercase
                    shadow-lg shadow-blue-500/50 transition-colors duration-200"
                    >
                        {(activePreset === 'Default' || !activePreset) ? "annoying button" : activePreset}
                    </button>
                </Magnetic>
            </div>

            {/* Control Panel */}
            <div className="w-[240px] p-3">
                <div className="bg-white rounded-xl p-3 shadow-xl max-h-[95vh] overflow-y-auto custom-scrollbar">
                    {/* Presets Section */}
                    <div className="mb-4">
                        <div className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Presets
                        </div>
                        <div className="flex flex-col gap-1">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handlePresetClick(preset)}
                                    className={`p-2 text-xs font-medium text-center leading-3.5 rounded-md border-[1.5px] transition-all ${
                                        activePreset === preset.name
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-gray-200 bg-white text-gray-900 hover:border-blue-500 hover:bg-blue-50'
                                    }`}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 my-3"/>

                    {/* Parameters Section */}
                    <div>
                        <div className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Parameters
                        </div>

                        {/* Distance Control */}
                        <div className="mb-2">
                            <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                <span>Distance</span>
                                <span className="font-semibold text-blue-500">{distance}px</span>
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="200"
                                step="5"
                                value={distance}
                                onChange={(e) => {
                                    setDistance(Number(e.target.value));
                                    setActivePreset('');
                                }}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                Range from element edges
                            </p>
                        </div>

                        {/* Attraction Control */}
                        <div className="mb-2">
                            <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                <span>Attraction</span>
                                <span className="font-semibold text-blue-500">{attraction.toFixed(1)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={attraction}
                                onChange={(e) => {
                                    setAttraction(Number(e.target.value));
                                    setActivePreset('');
                                }}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                Pull strength (0=weak, 1=strong)
                            </p>
                        </div>

                        {/* Speed Control */}
                        <div className="mb-2">
                            <label className="flex justify-between text-[0.7rem] text-gray-900 mb-1 font-medium">
                                <span>Speed</span>
                                <span className="font-semibold text-blue-500">{speed.toFixed(1)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={speed}
                                onChange={(e) => {
                                    setSpeed(Number(e.target.value));
                                    setActivePreset('');
                                }}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <p className="text-[0.65rem] text-gray-400 mt-1.5 leading-tight">
                                Speed (0=slow, 1=instant)
                            </p>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                .slider::-webkit-slider-thumb {
                    -webkit-appearance:none;
                    appearance:none;
                    width:12px;
                    height:12px;
                    border-radius:50%;
                    background:#3b82f6;
                    cursor:pointer;
                    box-shadow:0 1px 3px rgba(0, 0, 0, 0.15);
                }
                .slider::-moz-range-thumb {
                    width:12px;
                    height:12px;
                    border-radius:50%;
                    background:#3b82f6;
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