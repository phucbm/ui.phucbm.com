'use client';

import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {Component} from '@/lib/getComponents';
import {cn} from "@/lib/utils";

type Props = {
    components: Component[];
    availableTags: string[];
    max?: number;
    totalCount?: number;
};

export function ComponentsClient({ components, availableTags, max = 9, totalCount = 0 }: Props) {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    // On mount, read hash from URL and initialize selected tags
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = decodeURIComponent(window.location.hash.replace('#', ''));
        if (hash) {
            const tagsFromHash = hash.split(',');
            setSelectedTags(new Set(tagsFromHash.filter(tag => availableTags.includes(tag))));
        }
    }, [availableTags]);

    // Update URL hash whenever selectedTags changes
    useEffect(() => {
        const hash = Array.from(selectedTags).join(',');
        if (typeof window !== 'undefined') {
            if (hash) {
                window.history.replaceState(null, '', `#${encodeURIComponent(hash)}`);
            } else {
                window.history.replaceState(null, '', window.location.pathname);
            }
        }
    }, [selectedTags]);

    // Filter components based on selected tags (AND logic)
    const filteredComponents = useMemo(() => {
        if (selectedTags.size === 0) return components;

        return components.filter(comp => {
            if (!comp.tags || comp.tags.length === 0) return false;
            return Array.from(selectedTags).every(tag => comp.tags.includes(tag));
        });
    }, [components, selectedTags]);

    // Limit displayed components to max
    const displayedComponents = useMemo(() => {
        return filteredComponents.slice(0, max);
    }, [filteredComponents, max]);

    // Check if there are more components than max
    const hasMore = filteredComponents.length > max;

    // Dynamic tag counts based on currently filtered components
    const tagCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        availableTags.forEach(tag => {
            const count = filteredComponents.filter(comp => comp.tags?.includes(tag)).length;
            counts[tag] = count;
        });
        return counts;
    }, [filteredComponents, availableTags]);

    const toggleTag = (tag: string) => {
        if (tag === 'All') {
            setSelectedTags(new Set());
            return;
        }
        const newTags = new Set(selectedTags);
        newTags.has(tag) ? newTags.delete(tag) : newTags.add(tag);
        setSelectedTags(newTags);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="heading-2">
                    {hasMore ? `Showing ${displayedComponents.length} out of ${filteredComponents.length} components` : `Showing ${filteredComponents.length} components`}
                </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Always show "All" badge first */}
                <button
                    className={cn(`cursor-pointer transition-all duration-200
                    px-border bg-accent px-3 py-1
                    font-mono text-sm hover:text-brand
                    `,
                        selectedTags.size === 0 && '!border-brand text-brand bg-brand/10'
                    )}
                    onClick={() => toggleTag('All')}
                >
                    All
                </button>

                {availableTags.map(tag => {
                    const count = tagCounts[tag] || 0;
                    const isSelected = selectedTags.has(tag);
                    const isDisabled = count === 0;

                    return (
                        <button
                            key={tag}
                            className={cn(`cursor-pointer transition-all duration-200 px-border bg-accent px-3 py-1 capitalize
                    font-mono text-sm hover:text-brand`,
                                isSelected && '!border-brand text-brand bg-brand/10',
                                isDisabled && 'opacity-50 pointer-events-none'
                            )}
                            onClick={() => !isDisabled && toggleTag(tag)}
                        >
                            {tag} <span className="inline-block min-w-[20px] text-center">({count})</span>
                        </button>
                    );
                })}

            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedComponents.map(component => (
                    <Link
                        key={component.name}
                        href={component.url}
                        className="px-5 py-4 !rounded-xl transition-all duration-300 px-border bg-brand/10 hover:!border-brand hover:-translate-y-[2px]
                        flex flex-col justify-between gap-5
                        "
                    >
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{component.title}</h3>
                            <div className="text-sm">{component.description}</div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {component.tags?.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 rounded-full bg-accent capitalize"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <Link
                    href="/components"
                    className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:border-primary hover:bg-accent transition-colors"
                >
                    View all components
                </Link>
            )}
        </div>
    );
}
