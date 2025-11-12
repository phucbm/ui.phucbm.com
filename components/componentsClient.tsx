'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Component } from '@/lib/getComponents';

type Props = {
    components: Component[];
    availableTags: string[];
};

export function ComponentsClient({ components, availableTags }: Props) {
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
            {/* Filter Section */}
            <div className="p-4 bg-gray-50 rounded-2xl shadow-sm flex flex-wrap items-center gap-3">
                {/* Always show "All" badge first */}
                <Badge
                    variant={selectedTags.size === 0 ? 'default' : 'outline'}
                    className="cursor-pointer transition-all duration-200 bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={() => toggleTag('All')}
                >
                    All
                </Badge>

                {availableTags.map(tag => (
                    <Badge
                        key={tag}
                        variant={selectedTags.has(tag) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all duration-200 ${
                            selectedTags.has(tag)
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                        {tagCounts[tag] > 0 && ` (${tagCounts[tag]})`}
                        {selectedTags.has(tag) && (
                            <span
                                className="ml-1 font-bold cursor-pointer"
                                onClick={e => {
                                    e.stopPropagation();
                                    toggleTag(tag);
                                }}
                            >
                ×
              </span>
                        )}
                    </Badge>
                ))}
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComponents.map(component => (
                    <Link
                        key={component.name}
                        href={component.url}
                        className="block p-5 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
                    >
                        <h3 className="text-lg font-semibold mb-2">{component.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {component.tags?.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5 rounded-full"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
