import {JsDelivrPackage} from "@/registry/phucbm/blocks/jsdelivr/jsdelivr";

export async function getJsDelivrPackages(username: string,
                                    lastUpdatedMonths: number = 12,
                                    max: number = 10,
                                    statsPeriod: 'week' | 'month' | 'year' = 'month',
                                    hideZeroHits: boolean = false,
                                    minHits: number = 10) {
    try {
        console.log('getJsDelivrPackages')
        // First, get all GitHub repos
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=${max}`,
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
}