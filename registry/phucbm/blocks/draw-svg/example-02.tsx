"use client";
import {DrawSVG} from "@/registry/phucbm/blocks/draw-svg/draw-svg";
import {useRef, useState} from "react";

type SavedSvg = {
    id: string;
    name: string;
    size: number;
    content: string;
};

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

    // saved svgs list (max 6)
    const [savedSvgs, setSavedSvgs] = useState<SavedSvg[]>([]);

    const addSavedSvg = (content: string, name = "unnamed.svg", size = 0) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
        setSavedSvgs(prev => {
            const next = [...prev, {id, name, size, content}];
            // FIFO max 6
            if (next.length > 6) next.shift();
            return next;
        });
    };

    const handleFile = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setSvgContent(content);
                setFileName(file.name);
                setFileSize(file.size);
                // store to saved list
                addSavedSvg(content, file.name, file.size);
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
            const trimmed = pasteValue.trim();
            setSvgContent(trimmed);
            // if there's an existing fileName keep it; otherwise assign pasted.svg
            const newName = fileName || "pasted.svg";
            setFileName(newName);
            setFileSize(new Blob([trimmed]).size);
            // store as new saved entry
            addSavedSvg(trimmed, newName, new Blob([trimmed]).size);
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

    const activateSaved = (id: string) => {
        const item = savedSvgs.find(s => s.id === id);
        if (!item) return;
        setSvgContent(item.content);
        setFileName(item.name);
        setFileSize(item.size);
    };

    const removeSaved = (id: string) => {
        setSavedSvgs(prev => prev.filter(s => s.id !== id));
        // if removing the active one, clear active view (or keep - here we clear)
        const current = savedSvgs.find(s => s.id === id);
        if (current && svgContent === current.content) {
            setSvgContent("");
            setFileName("");
            setFileSize(0);
        }
    };

    return (
        <div
            className={`min-h-screen bg-red-50 flex items-center justify-center p-3 transition-colors ${
                isDragging ? 'bg-blue-50' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <div className="w-full h-full flex gap-3 relative">
                {/* SVG Preview Section - Always visible */}
                <div
                    className="flex-1 relative flex items-center justify-center cursor-pointer"
                    onClick={!svgContent ? handleClick : undefined}
                >
                    {!svgContent ? (
                        <div className="flex flex-col items-center justify-center pointer-events-none">
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
                            <p className="text-gray-600 text-center text-sm mb-1">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-gray-400 text-xs">SVG files</p>
                        </div>
                    ) : (
                        <div className="[&_svg]:w-32 [&_svg]:h-32 [&_svg]:text-blue-500">
                            <DrawSVG
                                key={`${duration}-${reverse}-${loop}-${atOnce}-${svgContent.length}`}
                                duration={duration}
                                reverse={reverse}
                                loop={loop}
                                atOnce={atOnce}
                            >
                                <div dangerouslySetInnerHTML={{__html: svgContent}}/>
                            </DrawSVG>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".svg"
                        onChange={handleFileInput}
                        className="hidden"
                    />
                </div>

                {/* Controls Panel - Always visible */}
                <div className="w-52 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 flex flex-col">
                    <div className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Controls</h3>
                        <div className="flex gap-1.5">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPasteValue(svgContent);
                                    setIsPasteDialogOpen(true);
                                }}
                                className="flex-1 px-2 py-1.5 bg-blue-500 text-white rounded text-[10px] font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                </svg>
                                View SVG
                            </button>
                            {svgContent && (
                                <button
                                    onClick={handleClear}
                                    className="w-7 h-7 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center flex-shrink-0"
                                    aria-label="Clear SVG"
                                    title="Clear SVG"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* File Info */}
                    {svgContent ? (
                        <div
                            className="flex items-center gap-1.5 text-[10px] text-gray-600 pb-2 mb-2 border-b border-gray-200">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg>
                            <span className="font-medium truncate">{fileName}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{formatFileSize(fileSize)}</span>
                        </div>
                    ) : (
                        <div className="text-[10px] text-gray-400 pb-2 mb-2 border-b border-gray-200 text-center">
                            No SVG loaded
                        </div>
                    )}

                    <div className={`space-y-3 flex-1 ${!svgContent ? 'opacity-40 pointer-events-none' : ''}`}>
                        {/* Duration Range */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-medium text-gray-700">Duration</label>
                                <span className="text-[10px] text-gray-600 font-mono">{duration.toFixed(1)}s</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={duration}
                                onChange={(e) => setDuration(parseFloat(e.target.value))}
                                disabled={!svgContent}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="space-y-1.5">
                            {/* Reverse Toggle */}
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <label className="text-[10px] font-medium text-gray-700 cursor-pointer"
                                       htmlFor="reverse">
                                    Reverse
                                </label>
                                <button
                                    id="reverse"
                                    role="switch"
                                    aria-checked={reverse}
                                    onClick={() => setReverse(!reverse)}
                                    disabled={!svgContent}
                                    className={`
                                        relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:cursor-not-allowed
                                        ${reverse ? 'bg-blue-500' : 'bg-gray-300'}
                                    `}
                                >
                                    <span
                                        className={`
                                            inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                                            ${reverse ? 'translate-x-4' : 'translate-x-0.5'}
                                        `}
                                    />
                                </button>
                            </div>

                            {/* Loop Toggle */}
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <label className="text-[10px] font-medium text-gray-700 cursor-pointer"
                                       htmlFor="loop">
                                    Loop
                                </label>
                                <button
                                    id="loop"
                                    role="switch"
                                    aria-checked={loop}
                                    onClick={() => setLoop(!loop)}
                                    disabled={!svgContent}
                                    className={`
                                        relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:cursor-not-allowed
                                        ${loop ? 'bg-blue-500' : 'bg-gray-300'}
                                    `}
                                >
                                    <span
                                        className={`
                                            inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                                            ${loop ? 'translate-x-4' : 'translate-x-0.5'}
                                        `}
                                    />
                                </button>
                            </div>

                            {/* At Once Toggle */}
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <label className="text-[10px] font-medium text-gray-700 cursor-pointer"
                                       htmlFor="atOnce">
                                    At Once
                                </label>
                                <button
                                    id="atOnce"
                                    role="switch"
                                    aria-checked={atOnce}
                                    onClick={() => setAtOnce(!atOnce)}
                                    disabled={!svgContent}
                                    className={`
                                        relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:cursor-not-allowed
                                        ${atOnce ? 'bg-blue-500' : 'bg-gray-300'}
                                    `}
                                >
                                    <span
                                        className={`
                                            inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                                            ${atOnce ? 'translate-x-4' : 'translate-x-0.5'}
                                        `}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Saved SVGs grid */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-[10px] text-gray-600 mb-1">Saved</div>
                        {savedSvgs.length === 0 ? (
                            <div className="text-[10px] text-gray-400">No saved SVGs</div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {savedSvgs.map(item => (
                                    <div key={item.id} className="relative group">
                                        <button
                                            onClick={() => activateSaved(item.id)}
                                            title={item.name}
                                            className="w-full h-10 cursor-pointer rounded border border-gray-200 overflow-hidden flex items-center justify-center bg-white"
                                        >
                                            <div
                                                className="w-full h-full flex items-center justify-center p-1"
                                                // small thumbnail - allow inner svg to scale
                                                dangerouslySetInnerHTML={{__html: item.content}}
                                            />
                                        </button>

                                        {/* remove button */}
                                        <button
                                            onClick={() => removeSaved(item.id)}
                                            className="
                                            opacity-0 group-hover:opacity-100 cursor-pointer
                                            absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors"
                                            title="Remove"
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isPasteDialogOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setIsPasteDialogOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold text-gray-900">
                                {svgContent ? 'View / Edit SVG Code' : 'Paste SVG Code'}
                            </h3>
                            <button
                                onClick={() => setIsPasteDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <textarea
                            value={pasteValue}
                            onChange={(e) => setPasteValue(e.target.value)}
                            placeholder="Paste your SVG code here..."
                            className="flex-1 min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-xs"
                        />

                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => {
                                    setIsPasteDialogOpen(false);
                                    setPasteValue("");
                                }}
                                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasteApply}
                                disabled={!pasteValue.trim()}
                                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {svgContent ? 'Update' : 'Apply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
