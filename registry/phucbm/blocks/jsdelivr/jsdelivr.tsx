import {cache} from 'react'
import {IconActivity, IconCaretDownFilled, IconCaretUpFilled} from "@tabler/icons-react";

export type JsDelivrPackagesProps = {
    /** GitHub username to fetch repositories from */
    username: string
    /** Show repos updated within this many months @default 12 */
    lastUpdatedMonths?: number
    /** Maximum number of packages to display @default 10 */
    max?: number
    /** Time period for statistics aggregation @default 'month' */
    statsPeriod?: 'week' | 'month' | 'year'
    /** Hide packages with zero hits @default false */
    hideZeroHits?: boolean
    /** Display bandwidth usage statistics @default false */
    showBandwidth?: boolean
    /** Show "Xth most popular" text @default true */
    showRankText?: boolean
    /** Minimum hits required to display package @default 10 */
    minHits?: number
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

// Cache the fetch function
const getJsDelivrPackages = cache(async (
    username: string,
    lastUpdatedMonths: number = 12,
    max: number = 10,
    statsPeriod: 'week' | 'month' | 'year' = 'month',
    hideZeroHits: boolean = false,
    minHits: number = 10
) => {
    try {
        // First, get all GitHub repos
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`,
            {
                next: {revalidate: 3600}
            }
        )

        if (!reposRes.ok) throw new Error('Failed to fetch repos')

        const repos = await reposRes.json()

        // Calculate the cutoff date
        const cutoffDate = new Date()
        cutoffDate.setMonth(cutoffDate.getMonth() - lastUpdatedMonths)

        // Filter repos updated within the time range
        const recentRepos = repos.filter((repo: any) => {
            const updatedDate = new Date(repo.updated_at)
            return updatedDate >= cutoffDate
        })

        // Check each repo on jsDelivr and get stats
        const jsDelivrPackages: JsDelivrPackage[] = []

        for (const repo of recentRepos) {
            try {
                // Fetch stats for the package directly
                const statsRes = await fetch(
                    `https://data.jsdelivr.com/v1/stats/packages/gh/${username}/${repo.name}`,
                    {
                        next: {revalidate: 3600}
                    }
                )

                if (statsRes.ok) {
                    const statsData = await statsRes.json()

                    // Calculate stats based on period from the dates object
                    let hits = 0
                    let bandwidth = 0

                    if (statsData.hits?.dates && statsData.bandwidth?.dates) {
                        const hitDates = Object.entries(statsData.hits.dates)
                        const bandwidthDates = Object.entries(statsData.bandwidth.dates)

                        // Determine how many days to sum based on period
                        let daysToSum = 30 // default month
                        if (statsPeriod === 'week') {
                            daysToSum = 7
                        } else if (statsPeriod === 'year') {
                            daysToSum = 365
                        }

                        // Sum the last N days
                        const recentHitDates = hitDates.slice(-daysToSum)
                        const recentBandwidthDates = bandwidthDates.slice(-daysToSum)

                        hits = recentHitDates.reduce((sum, [_, value]) => sum + (value as number), 0)
                        bandwidth = recentBandwidthDates.reduce((sum, [_, value]) => sum + (value as number), 0)
                    }

                    jsDelivrPackages.push({
                        name: repo.name,
                        description: repo.description,
                        jsDelivrUrl: `https://www.jsdelivr.com/package/gh/${username}/${repo.name}`,
                        githubUrl: repo.html_url,
                        hits,
                        bandwidth,
                        rank: statsData.hits?.rank || 0,
                        prevRank: statsData.hits?.prev?.rank || 0
                    })
                }
            } catch (error) {
                // Skip repos that fail
                continue
            }
        }

        // Sort by hits (descending) and filter by minimum hits
        return jsDelivrPackages
            .filter(pkg => pkg.hits >= minHits)
            .sort((a, b) => b.hits - a.hits)
            .slice(0, max)
    } catch (error) {
        console.error('Error fetching jsDelivr packages:', error)
        return []
    }
})

// Format numbers for display
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
}

// Format bandwidth (bytes to human readable)
function formatBandwidth(bytes: number): string {
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

// Format ordinal numbers (1st, 2nd, 3rd, etc.)
function formatOrdinal(num: number): string {
    // Format number with commas
    const formattedNum = num.toLocaleString('en-US')

    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) {
        return formattedNum + "st"
    }
    if (j === 2 && k !== 12) {
        return formattedNum + "nd"
    }
    if (j === 3 && k !== 13) {
        return formattedNum + "rd"
    }
    return formattedNum + "th"
}

// Default item renderer component
function DefaultItemRenderer(pkg: JsDelivrPackage, periodText: string, showRankText: boolean, showBandwidth: boolean) {
    return (
        <a
            href={pkg.jsDelivrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
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

export async function JsDelivrPackages({
                                                   username,
                                                   lastUpdatedMonths = 12,
                                                   max = 10,
                                                   statsPeriod = 'month',
                                                   hideZeroHits = false,
                                                   showBandwidth = false,
                                                   showRankText = true,
                                                   minHits = 10,
                                                   renderItem
                                               }: JsDelivrPackagesProps) {
    const packages = await getJsDelivrPackages(username, lastUpdatedMonths, max, statsPeriod, hideZeroHits, minHits)

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

// Export skeleton component for loading states
export function JsDelivrPackagesSkeleton() {
    return (
        <ul className="space-y-4 not-prose">
            {[...Array(3)].map((_, i) => (
                <li key={i}>
                    <div className="p-4 rounded-lg border border-border bg-muted/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-5 w-32 bg-muted rounded animate-pulse"/>
                            <div className="h-4 w-24 bg-muted rounded animate-pulse"/>
                            <div className="h-4 w-12 bg-muted rounded animate-pulse"/>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-muted rounded animate-pulse"/>
                            <div className="h-4 w-2/3 bg-muted rounded animate-pulse"/>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}