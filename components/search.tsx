'use client'

import * as React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {addBasePath} from 'next/dist/client/add-base-path';

type Props = {
    placeholder?: string;
};

declare global {
    interface Window {
        pagefind?: {
            debouncedSearch: <T>(query: string, options?: any) => Promise<{
                results: Array<{
                    data: () => Promise<T>;
                }>;
            } | null>;
            options: (options: { baseUrl: string }) => Promise<void>;
        };
    }
}

async function importPagefind() {
    if (window.pagefind) return;
    window.pagefind = await import(
        /* webpackIgnore: true */ addBasePath('/_pagefind/pagefind.js')
        );
    await window.pagefind.options({
        baseUrl: '/'
    });
}

type PagefindResult = {
    excerpt: string;
    meta: {
        title: string;
    };
    raw_url: string;
    sub_results: {
        excerpt: string;
        title: string;
        url: string;
    }[];
    url: string;
};
const activeSearchInstances = new Set<string>();

export function MySearch({placeholder = "Search..."}: Props) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<PagefindResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const instanceId = React.useRef(Math.random().toString()).current;
    const [canRender, setCanRender] = React.useState(false);

    React.useEffect(() => {
        if (activeSearchInstances.size > 0) {
            return; // Another instance exists, don't render
        }
        activeSearchInstances.add(instanceId);
        setCanRender(true);

        return () => {
            activeSearchInstances.delete(instanceId);
        };
    }, [instanceId]);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
            setError("");
        }
    }, [open]);

    React.useEffect(() => {
        const handleSearch = async (value: string) => {
            if (!value) {
                setResults([]);
                setError("");
                return;
            }

            setLoading(true);

            if (!window.pagefind) {
                try {
                    await importPagefind();
                } catch (err) {
                    setError("Failed to load search index.");
                    setLoading(false);
                    return;
                }
            }

            try {
                const response = await window.pagefind.debouncedSearch<PagefindResult>(value);
                if (!response) return;

                const data = await Promise.all(response.results.map(o => o.data()));

                const processedResults = data.map(newData => ({
                    ...newData,
                    sub_results: newData.sub_results.map(r => {
                        const url = r.url.replace(/\.html$/, '').replace(/\.html#/, '#');
                        return {...r, url};
                    })
                }));

                setResults(processedResults);
                setLoading(false);
                setError("");
            } catch (err) {
                setError("Search failed.");
                setLoading(false);
            }
        };

        handleSearch(query);
    }, [query]);

    if (!canRender) return null;

    const handleResultClick = (url: string) => {
        window.location.href = url;
        setOpen(false);
    };

    return (
        <>
            <SearchTrigger placeholder={placeholder} onClick={() => setOpen(true)}/>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder={placeholder}
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList className="max-h-96">
                    {error && <SearchError message={error}/>}
                    {loading && !error && <SearchLoading/>}
                    {!loading && !error && query && results.length === 0 && <SearchEmpty/>}
                    {!loading && !error && results.length > 0 && (
                        <SearchResults results={results} onResultClick={handleResultClick}/>
                    )}
                    {!loading && !error && !query && <SearchEmptyState/>}
                </CommandList>
            </CommandDialog>
        </>
    );
}


function SearchTrigger({placeholder, onClick}: { placeholder: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
            </svg>
            <span>{placeholder}</span>
            <kbd
                className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-xs text-gray-600">
                <span className="text-xs">⌘</span>K
            </kbd>
        </button>
    );
}

function SearchLoading() {
    return (
        <div className="py-6 text-center text-sm text-gray-500">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span className="ml-2">Searching...</span>
        </div>
    );
}

function SearchError({message}: { message: string }) {
    return (
        <div className="py-6 px-4 text-center text-sm text-red-500">
            {message}
        </div>
    );
}

function SearchEmpty() {
    return <CommandEmpty>No results found.</CommandEmpty>;
}

function SearchEmptyState() {
    return (
        <div className="py-6 px-4 text-center text-sm text-gray-500">
            Featured pages will appear here
        </div>
    );
}

function SearchResultItem({subResult, parentTitle, onSelect}: {
    subResult: PagefindResult['sub_results'][0];
    parentTitle: string;
    onSelect: () => void
}) {
    return (
        <CommandItem
            value={`${parentTitle} ${subResult.title}`}
            onSelect={onSelect}
        >
            <div className="flex flex-col gap-1 w-full">
                <div className="font-semibold">{subResult.title}</div>
                <div className="text-xs text-gray-600">
                    {subResult.excerpt.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </div>
            </div>
        </CommandItem>
    );
}

function SearchResults({results, onResultClick}: { results: PagefindResult[]; onResultClick: (url: string) => void }) {
    return (
        <>
            {results.map((result) => (
                <CommandGroup
                    key={result.url}
                    heading={result.meta.title}
                >
                    {result.sub_results.map((subResult) => (
                        <SearchResultItem
                            key={subResult.url}
                            subResult={subResult}
                            parentTitle={result.meta.title}
                            onSelect={() => onResultClick(subResult.url)}
                        />
                    ))}
                </CommandGroup>
            ))}
        </>
    );
}