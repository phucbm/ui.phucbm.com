'use client'

import {useEffect, useState} from 'react';
import {JsDelivrPackage, JsDelivrPackages} from "@/registry/phucbm/blocks/jsdelivr/jsdelivr";
import {getJsDelivrPackages} from "@/registry/phucbm/lib/getJsDelivrPackages";

export default function Example() {
    const [packages, setPackages] = useState<JsDelivrPackage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // jsDelivr package names to display
    const names = [
        'flickity-responsive',
        'jquery-scroll-direction-plugin',
        'cursorjs',
        'scroll-snooper',
        'pia',
        'cuajs',
        'magnetic-button'
    ];

    useEffect(() => {
        getJsDelivrPackages(names, 'phucbm', 'month', 10)
            .then(data => {
                setPackages(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : 'Failed to load packages')
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div className="h-screen flex items-center justify-center bg-slate-50">Loading...</div>
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="text-red-600">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="bg-slate-50">
            <div className="max-w-[600px] mx-auto py-6">
                <JsDelivrPackages packages={packages}/>
            </div>
        </div>
    );
}