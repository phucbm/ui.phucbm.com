'use client'

import {CommandGroup, CommandItem} from "@/components/ui/command";
import Link from "next/link";

interface PageItem {
    title: string;
    url: string;
    parent?: string;
}

export function SearchWelcomePages({pages = [], onSelect}: { pages: PageItem[], onSelect?: (url: string) => void }) {
    if (pages.length === 0) {
        return null;
    }

    return (
        <CommandGroup heading="Pages">
            {pages.map(page => (
                <PageSearchItem
                    key={page.url}
                    url={page.url}
                    title={page.title}
                    parent={page.parent}
                    onSelect={() => onSelect?.(page.url)}
                />
            ))}
        </CommandGroup>
    );
}

function PageSearchItem({url, title, parent, onSelect}: {
    url: string;
    title: string;
    parent?: string;
    onSelect?: () => void;
}) {
    return (
        <CommandItem onSelect={onSelect} value={title}>
            {parent && (
                <>
                    <div className="parent-page text-muted-foreground text-xs">{parent}</div>
                    <div className="text-muted-foreground text-xs">/</div>
                </>
            )}
            <div>
                <Link href={url} className="flex flex-col gap-1 w-full">
                    <div className="font-semibold">{title}</div>
                </Link>
            </div>
        </CommandItem>
    );
}
