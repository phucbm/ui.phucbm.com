import {IconActivity, IconCaretDownFilled, IconCaretUpFilled} from "@tabler/icons-react";
import {formatOrdinal} from "@/registry/phucbm/lib/formatOrdinal";

export type JsDelivrPackagesProps = {
    /** Fetched packages data */
    packages: JsDelivrPackage[]
    /** Time period for statistics aggregation @default 'month' */
    statsPeriod?: 'week' | 'month' | 'year'
    /** Display bandwidth usage statistics @default false */
    showBandwidth?: boolean
    /** Show "Xth most popular" text @default true */
    showRankText?: boolean
    /** Number of months used for fetching (for display message) @default 12 */
    lastUpdatedMonths?: number
    /** Custom renderer for each package item */
    renderItem?: (pkg: JsDelivrPackage, periodText: string) => React.ReactNode
}

export interface JsDelivrPackage {
    name: string
    description: string | null
    jsDelivrUrl: string
    githubUrl: string
    hits: number
    bandwidth: number
    rank: number
    prevRank: number
}

// Format numbers for display
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
}

// Format bandwidth (bytes to human readable)
export function formatBandwidth(bytes: number): string {
    if (bytes >= 1000000000) {
        return `${(bytes / 1000000000).toFixed(1)}GB`
    }
    if (bytes >= 1000000) {
        return `${(bytes / 1000000).toFixed(1)}MB`
    }
    if (bytes >= 1000) {
        return `${(bytes / 1000).toFixed(1)}KB`
    }
    return `${bytes}B`
}


// Default item renderer component
function DefaultItemRenderer(pkg: JsDelivrPackage, periodText: string, showRankText: boolean, showBandwidth: boolean) {
    return (
        <a
            href={pkg.jsDelivrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors bg-white"
        >
            {/* Title with badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                <h3 className="font-semibold text-base">{pkg.name}</h3>
                <span className="flex gap-1 items-center text-sm text-muted-foreground">
                    <IconActivity className="w-4 text-blue-500"/>
                    {formatNumber(pkg.hits)} hits {periodText}
                </span>
                {pkg.rank > 0 && (
                    <span className="inline-flex gap-1 items-center text-xs opacity-70">
                        #{formatNumber(pkg.rank)}
                        {pkg.prevRank > 0 && pkg.prevRank !== pkg.rank && (
                            <>
                                {pkg.rank < pkg.prevRank ? (
                                    <>
                                        <IconCaretUpFilled className="w-3 text-green-500"/>
                                        <span
                                            className="text-green-500">+{(pkg.prevRank - pkg.rank).toLocaleString('en-US')}</span>
                                    </>
                                ) : (
                                    <>
                                        <IconCaretDownFilled className="w-3 text-red-500"/>
                                        <span
                                            className="text-red-500">-{(pkg.rank - pkg.prevRank).toLocaleString('en-US')}</span>
                                    </>
                                )}
                            </>
                        )}
                    </span>
                )}
            </div>

            {/* Description and stats */}
            <div className="space-y-2">
                {pkg.description && (
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                )}
                {showRankText && pkg.rank > 0 && (
                    <p className="text-xs opacity-70">
                        The {formatOrdinal(pkg.rank)} most popular on jsDelivr
                    </p>
                )}
                {showBandwidth && (
                    <p className="text-xs opacity-70">
                        Bandwidth: {formatBandwidth(pkg.bandwidth)} {periodText}
                    </p>
                )}
            </div>
        </a>
    )
}

export function JsDelivrPackages({
                                      packages,
                                      lastUpdatedMonths = 12,
                                      statsPeriod = 'month',
                                      showBandwidth = true,
                                      showRankText = true,
                                      renderItem
                                  }: JsDelivrPackagesProps) {

    if (packages.length === 0) {
        return <div className="text-muted-foreground">No packages found on jsDelivr in the
            last {lastUpdatedMonths} months</div>
    }

    // Map period to display text
    const periodText = {
        'week': 'per week',
        'month': 'per month',
        'year': 'per year'
    }[statsPeriod]

    return (
        <ul className="space-y-4 not-prose">
            {packages.map(pkg => (
                <li key={pkg.name}>
                    {renderItem ? renderItem(pkg, periodText) : DefaultItemRenderer(pkg, periodText, showRankText, showBandwidth)}
                </li>
            ))}
        </ul>
    )
}