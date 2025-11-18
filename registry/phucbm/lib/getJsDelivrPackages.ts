import {JsDelivrPackage} from "@/registry/phucbm/blocks/jsdelivr/jsdelivr";

/**
 * Fetch jsDelivr statistics for a list of package names
 * @param packageNames - Array of jsDelivr package names (e.g., ['draw-svg', 'svg-to-code'])
 * @param namespace - Optional GitHub username for gh/* packages (default: 'phucbm')
 * @param statsPeriod - Time period for statistics ('week' | 'month' | 'year')
 * @param minHits - Minimum hits required to display package
 * @returns Array of JsDelivrPackage with statistics, sorted by hits
 */
export async function getJsDelivrPackages(
    packageNames: string[],
    namespace: string = 'phucbm',
    statsPeriod: 'week' | 'month' | 'year' = 'month',
    minHits: number = 10
) {
    try {
        const jsDelivrPackages: JsDelivrPackage[] = []

        // Fetch stats for each package
        for (const packageName of packageNames) {
            try {
                // Fetch stats from jsDelivr
                const statsRes = await fetch(
                    `https://data.jsdelivr.com/v1/stats/packages/gh/${namespace}/${packageName}`,
                    {
                        next: {revalidate: 3600}
                    }
                )

                if (!statsRes.ok) {
                    console.warn(`Failed to fetch stats for ${packageName}: ${statsRes.status}`)
                    continue
                }

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
                    name: packageName,
                    description: statsData.description || null,
                    jsDelivrUrl: `https://www.jsdelivr.com/package/gh/${namespace}/${packageName}`,
                    githubUrl: `https://github.com/${namespace}/${packageName}`,
                    hits,
                    bandwidth,
                    rank: statsData.hits?.rank || 0,
                    prevRank: statsData.hits?.prev?.rank || 0
                })
            } catch (error) {
                console.warn(`Error fetching stats for ${packageName}:`, error)
                // Skip packages that fail
                continue
            }
        }

        // Sort by hits (descending) and filter by minimum hits
        return jsDelivrPackages
            .filter(pkg => pkg.hits >= minHits)
            .sort((a, b) => b.hits - a.hits)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error('Error fetching jsDelivr packages:', error)
        throw new Error(`Failed to fetch jsDelivr packages: ${errorMessage}`)
    }
}
