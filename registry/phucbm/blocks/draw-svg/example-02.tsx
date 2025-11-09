"use client";
import {DrawSVG} from "@/registry/phucbm/blocks/draw-svg/draw-svg";
import {useRef, useState} from "react";

export default function DrawSVG_UploadSVG() {
    const [svgContent, setSvgContent] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
    const [pasteValue, setPasteValue] = useState("");
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // DrawSVG props
    const [duration, setDuration] = useState<number>(1.5);
    const [reverse, setReverse] = useState<boolean>(false);
    const [loop, setLoop] = useState<boolean>(true);
    const [atOnce, setAtOnce] = useState<boolean>(false);

    const handleFile = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setSvgContent(content);
                setFileName(file.name);
                setFileSize(file.size);
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handlePasteApply = () => {
        if (pasteValue.trim()) {
            setSvgContent(pasteValue.trim());
            setFileName("pasted.svg");
            setFileSize(new Blob([pasteValue.trim()]).size);
            setIsPasteDialogOpen(false);
            setPasteValue("");
        }
    };

    const handleClear = () => {
        setSvgContent("");
        setFileName("");
        setFileSize(0);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center gap-10 px-10 py-10">
            {!svgContent ? (
                <div className="w-full max-w-md space-y-4">
                    <div
                        onClick={handleClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        className={`
                            w-full h-64 
                            border-2 border-dashed rounded-lg
                            flex flex-col items-center justify-center
                            cursor-pointer transition-colors
                            ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                        }
                        `}
                    >
                        <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-gray-600 text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-gray-400 text-sm mt-1">SVG files</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".svg"
                            onChange={handleFileInput}
                            className="hidden"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-300"/>
                        <span className="text-gray-500 text-sm">or</span>
                        <div className="flex-1 h-px bg-gray-300"/>
                    </div>

                    <button
                        onClick={() => setIsPasteDialogOpen(true)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
                    >
                        Paste SVG Code
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
                    <div className="relative w-full">
                        <button
                            onClick={handleClear}
                            className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                            aria-label="Clear SVG"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div
                                className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                                <span className="font-medium truncate">{fileName}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">{formatFileSize(fileSize)}</span>
                            </div>

                            <div className="flex items-center justify-center">
                                <div
                                    className="xl:[&_svg]:h-40 xl:[&_svg]:w-40 [&_svg]:w-30 [&_svg]:h-30 [&_svg]:text-blue-500">
                                    <DrawSVG
                                        key={`${duration}-${reverse}-${loop}-${atOnce}`}
                                        duration={duration}
                                        reverse={reverse}
                                        loop={loop}
                                        atOnce={atOnce}
                                    >
                                        <div dangerouslySetInnerHTML={{__html: svgContent}}/>
                                    </DrawSVG>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Panel */}
                    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Animation Controls</h3>

                        <div className="space-y-6">
                            {/* Duration Range */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Duration
                                    </label>
                                    <span className="text-sm text-gray-600">{duration.toFixed(1)}s</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="5"
                                    step="0.1"
                                    value={duration}
                                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0.5s</span>
                                    <span>5s</span>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Reverse Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <label className="text-sm font-medium text-gray-700 cursor-pointer"
                                           htmlFor="reverse">
                                        Reverse
                                    </label>
                                    <button
                                        id="reverse"
                                        role="switch"
                                        aria-checked={reverse}
                                        onClick={() => setReverse(!reverse)}
                                        className={`
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${reverse ? 'bg-blue-500' : 'bg-gray-300'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${reverse ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </button>
                                </div>

                                {/* Loop Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <label className="text-sm font-medium text-gray-700 cursor-pointer" htmlFor="loop">
                                        Loop
                                    </label>
                                    <button
                                        id="loop"
                                        role="switch"
                                        aria-checked={loop}
                                        onClick={() => setLoop(!loop)}
                                        className={`
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${loop ? 'bg-blue-500' : 'bg-gray-300'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${loop ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </button>
                                </div>

                                {/* At Once Toggle */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <label className="text-sm font-medium text-gray-700 cursor-pointer"
                                           htmlFor="atOnce">
                                        At Once
                                    </label>
                                    <button
                                        id="atOnce"
                                        role="switch"
                                        aria-checked={atOnce}
                                        onClick={() => setAtOnce(!atOnce)}
                                        className={`
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${atOnce ? 'bg-blue-500' : 'bg-gray-300'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${atOnce ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isPasteDialogOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setIsPasteDialogOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Paste SVG Code</h3>
                            <button
                                onClick={() => setIsPasteDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <textarea
                            value={pasteValue}
                            onChange={(e) => setPasteValue(e.target.value)}
                            placeholder="Paste your SVG code here..."
                            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setIsPasteDialogOpen(false);
                                    setPasteValue("");
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasteApply}
                                disabled={!pasteValue.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}