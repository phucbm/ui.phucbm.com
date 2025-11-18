import {Suspense} from 'react'
import {IconSearch} from "@tabler/icons-react";
import {JsDelivrPackages, JsDelivrPackagesSkeleton} from "@/registry/phucbm/blocks/jsdelivr/jsdelivr";

export default function JsDelivrExample() {
    return (
        <div className="space-y-6 p-6">
            {/* Search Info */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <IconSearch className="w-4 h-4"/>
                </div>
                <input
                    type="text"
                    placeholder="Enter GitHub username..."
                    defaultValue="phucbm"
                    disabled
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-2">
                    This demo shows packages from <code>phucbm</code>. In a real app, this would be interactive.
                </p>
            </div>

            {/* Results with Suspense */}
            <div>
                <h3 className="text-sm font-semibold mb-3">jsDelivr Packages</h3>
                <Suspense fallback={<JsDelivrPackagesSkeleton/>}>
                    <JsDelivrPackages
                        username="phucbm"
                        max={10}
                        statsPeriod="month"
                        showBandwidth={false}
                        showRankText={true}
                    />
                </Suspense>
            </div>
        </div>
    )
}
