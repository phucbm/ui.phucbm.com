'use client'

import {useEffect, useState} from 'react';
import {JsDelivrPackages, JsDelivrPackage} from "@/registry/phucbm/blocks/jsdelivr/jsdelivr";
import {getJsDelivrPackages} from "@/registry/phucbm/lib/getJsDelivrPackages";

export default function Example() {
    const [packages, setPackages] = useState<JsDelivrPackage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getJsDelivrPackages('phucbm', 12, 10, 'month', false, 10)
            .then(data => {
                setPackages(data)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div className="h-screen flex items-center justify-center bg-slate-50">Loading...</div>
    }

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <JsDelivrPackages packages={packages}/>
        </div>
    );
}