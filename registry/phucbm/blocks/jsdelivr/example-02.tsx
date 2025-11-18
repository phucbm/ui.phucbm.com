'use client'

import { useEffect, useState } from 'react'
import { JsDelivrPackages, JsDelivrPackage } from '@/registry/phucbm/blocks/jsdelivr/jsdelivr'
import { getPublicGithubRepos } from '@/registry/phucbm/lib/getPublicGithubRepos'
import { getJsDelivrPackages } from '@/registry/phucbm/lib/getJsDelivrPackages'

export default function Example02() {
    const [username, setUsername] = useState('phucbm')
    const [packages, setPackages] = useState<JsDelivrPackage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reposFound, setReposFound] = useState(0)
    const [packagesFound, setPackagesFound] = useState(0)

    useEffect(() => {
        // Debounce timer
        const timer = setTimeout(async () => {
            if (!username.trim()) {
                setPackages([])
                setReposFound(0)
                setPackagesFound(0)
                setError(null)
                return
            }

            setLoading(true)
            setError(null)
            setPackages([])

            try {
                // Fetch public repos from GitHub
                const repos = await getPublicGithubRepos(username, 20, 12)
                setReposFound(repos.length)

                if (repos.length === 0) {
                    setPackagesFound(0)
                    setLoading(false)
                    return
                }

                // Extract package names from repo names
                const packageNames = repos.map((repo: any) => repo.name)

                // Fetch jsDelivr stats for those packages
                const jsDelivrPackages = await getJsDelivrPackages(packageNames, username, 'month', 0)
                setPackagesFound(jsDelivrPackages.length)
                setPackages(jsDelivrPackages)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load packages')
                setPackagesFound(0)
            } finally {
                setLoading(false)
            }
        }, 1000) // 1 second debounce

        return () => clearTimeout(timer)
    }, [username])

    return (
        <div className="space-y-6 bg-slate-50 p-6 rounded-lg">
            {/* Input Section */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">GitHub Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500">
                    Fetches up to 20 public repositories and displays those published on jsDelivr
                </p>
            </div>

            {/* Stats Section */}
            {(reposFound > 0 || packagesFound > 0) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-blue-600 font-semibold">{reposFound}</p>
                        <p className="text-blue-700 text-xs">Repos Found</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-green-600 font-semibold">{packagesFound}</p>
                        <p className="text-green-700 text-xs">Packages on jsDelivr</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-slate-600">Loading...</div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-red-600 text-sm font-semibold">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Results Section */}
            {!loading && !error && packages.length > 0 && (
                <div className="space-y-4">
                    <div className="text-sm font-semibold text-slate-700">
                        jsDelivr Packages ({packages.length})
                    </div>
                    <JsDelivrPackages packages={packages} statsPeriod="month" showBandwidth={true} />
                </div>
            )}

            {/* No Results */}
            {!loading && !error && reposFound > 0 && packages.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-yellow-700 text-sm">
                        Found {reposFound} repositories, but none are published on jsDelivr.
                        This is normal - publish your repos to jsDelivr to see them here.
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && reposFound === 0 && username.trim() && (
                <div className="bg-slate-100 border border-slate-300 rounded p-4">
                    <p className="text-slate-600 text-sm">
                        No public repositories found for "{username}"
                    </p>
                </div>
            )}
        </div>
    )
}
