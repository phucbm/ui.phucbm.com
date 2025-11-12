'use client'

import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList,} from "@/components/ui/command";
import {addBasePath} from 'next/dist/client/add-base-path';
import {SearchIcon} from "lucide-react";
import {Command as CommandPrimitive} from "cmdk";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Component} from "@/lib/getComponents";
import {useRouter} from "next/navigation";

type Props = {
    placeholder?: string;
    components: Component[]
};

export function MySearch({placeholder = "Search components...", components}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PagefindResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const instanceId = useRef(Math.random().toString()).current;
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        if (activeSearchInstances.size > 0) {
            return; // Another instance exists, don't render
        }
        activeSearchInstances.add(instanceId);
        setCanRender(true);

        return () => {
            activeSearchInstances.delete(instanceId);
        };
    }, [instanceId]);

    useEffect(() => {
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

    useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
            setError("");
        }
    }, [open]);

    useEffect(() => {
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
        router.push(url);
        setOpen(false);
    };


    function SearchContent() {
        if (!query) return <SearchWelcome components={components} onSelect={handleResultClick}/>;
        if (error) return <SearchError message={error}/>;
        if (loading) return <SearchLoading/>;
        if (!results || results.length === 0) return <SearchNoResults/>;
        return <SearchResults results={results} query={query} onResultClick={handleResultClick}/>;
    }
    return (
        <>
            <SearchTrigger placeholder={placeholder} onClick={() => setOpen(true)}/>

            <CommandDialog open={open} onOpenChange={setOpen}
                           showCloseButton={false}
                           className="search-dialog border-4 border-slate-200 rounded-2xl overflow-hidden !max-w-[800px] bg-white">

                <SearchInput
                    placeholder={placeholder}
                    query={query}
                    onQueryChange={setQuery}
                />

                <CommandList className="h-96">
                    <SearchContent/>
                </CommandList>

            </CommandDialog>
        </>
    );
}


function SearchInput({
                         placeholder,
                         query,
                         onQueryChange,
                     }: {
    placeholder: string;
    query: string;
    onQueryChange: (value: string) => void;
}) {
    return (
        <div className="p-2">
            <div className="bg-input h-10 w-full flex items-center gap-2 rounded-lg px-3">
                <SearchIcon className="size-4 shrink-0 opacity-50"/>
                <CommandPrimitive.Input
                    data-slot="command-input"
                    className={cn(
                        "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    placeholder={placeholder}
                    value={query}
                    onValueChange={onQueryChange}
                />
            </div>
        </div>
    )
}


function SearchTrigger({placeholder, onClick}: { placeholder: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm
            bg-input text-foreground cursor-pointer
            border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
            <SearchIcon className="size-4"/>
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

function SearchNoResults() {
    return <CommandEmpty>No results found.</CommandEmpty>;
}

function SearchWelcome({components, onSelect}: { components: Component[], onSelect: (url: string) => void }) {
    return (
        <CommandGroup heading={`Components`}>
            {components.map(component => (
                <SearchItem
                    key={component.name}
                    url={component.url}
                    title={component.title}
                    description={component.description}
                    onSelect={() => onSelect(component.url)}
                />
            ))}
        </CommandGroup>
    );
}

function SearchResultItem({subResult, parentTitle, query, onSelect}: {
    subResult: PagefindResult['sub_results'][0];
    parentTitle: string;
    query: string;
    onSelect: () => void
}) {
    const cleanExcerpt = subResult.excerpt.replace(/<[^>]*>/g, '').substring(0, 100);

    return (
        <SearchItem url={subResult.url}
                    title={highlightQuery(subResult.title, query)}
                    description={<>{highlightQuery(cleanExcerpt, query)}...</>}
                    onSelect={onSelect}
                    value={`${parentTitle} ${subResult.title}`}
        />
    );
}

function SearchItem({url, title, description, onSelect, value}: {
    url: string;
    title: any | string;
    description: any | string;
    onSelect?: () => void;
    value?: string;
}) {
    return (
        <CommandItem onSelect={onSelect} value={value}>
            <Link href={url} className="flex flex-col gap-1 w-full">
                <div className="font-semibold">{title}</div>
                <div className="text-xs text-gray-600">
                    {description}
                </div>
            </Link>
        </CommandItem>
    )
}

function SearchResults({results, query, onResultClick}: {
    results: PagefindResult[];
    query: string;
    onResultClick: (url: string) => void
}) {
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
                            query={query}
                            onSelect={() => onResultClick(subResult.url)}
                        />
                    ))}
                </CommandGroup>
            ))}
        </>
    );
}

function highlightQuery(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? <mark key={index} className="bg-brand text-brand-foreground font-medium">{part}</mark> : part
    );
}


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