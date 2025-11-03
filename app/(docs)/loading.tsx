export default function Loading() {
    return (
        <div className="flex h-screen w-full bg-white">
            {/* Left Sidebar */}
            <aside className="w-64 border-r border-gray-200 p-4">
                <div className="space-y-4">
                    {/* Components Header */}
                    <div className="flex items-center space-x-2">
                        <div className="h-5 w-24 animate-pulse rounded bg-gray-200"/>
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200"/>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-8 w-full animate-pulse rounded bg-gray-100"
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center space-x-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200"/>
                        <div className="h-4 w-1 animate-pulse rounded bg-gray-200"/>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"/>
                    </div>

                    {/* Title */}
                    <div className="h-10 w-48 animate-pulse rounded bg-gray-200"/>

                    {/* Subtitle */}
                    <div className="h-5 w-64 animate-pulse rounded bg-gray-100"/>

                    {/* Demo Box */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-12">
                        <div className="flex items-center justify-center">
                            <div className="h-12 w-40 animate-pulse rounded-lg bg-gray-200"/>
                        </div>
                    </div>

                    {/* Live Playground Label */}
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-64 animate-pulse rounded bg-gray-100"/>
                        <div className="h-5 w-40 animate-pulse rounded bg-gray-100"/>
                    </div>

                    {/* Code Editor */}
                    <div className="rounded-lg border border-gray-200 bg-gray-900 p-6">
                        <div className="space-y-3">
                            {/* File Tabs */}
                            <div className="flex space-x-2 border-b border-gray-700 pb-2">
                                <div className="h-6 w-20 animate-pulse rounded bg-gray-700"/>
                                <div className="h-6 w-24 animate-pulse rounded bg-gray-800"/>
                            </div>

                            {/* Code Lines */}
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((line) => (
                                <div
                                    key={line}
                                    className="h-4 animate-pulse rounded bg-gray-800"
                                    style={{width: `${Math.random() * 40 + 60}%`}}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Installation Section */}
                    <div className="space-y-4 pt-8">
                        <div className="h-8 w-32 animate-pulse rounded bg-gray-200"/>
                        <div className="h-5 w-full animate-pulse rounded bg-gray-100"/>
                        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100"/>
                    </div>
                </div>
            </main>

            {/* Right Navigation */}
            <aside className="w-64 border-l border-gray-200 p-6">
                <div className="space-y-6">
                    {/* "On This Page" Header */}
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-200"/>

                    {/* Nav Items */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-4 w-full animate-pulse rounded bg-gray-100"
                                style={{width: `${Math.random() * 30 + 50}%`}}
                            />
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="space-y-3">
                            <div className="h-4 w-full animate-pulse rounded bg-gray-100"/>
                            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100"/>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}