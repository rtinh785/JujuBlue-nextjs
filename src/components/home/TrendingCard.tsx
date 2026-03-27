import React from 'react'

const trendingTopics = [
    {
        category: 'Technology · Trending',
        title: '#MinimalDesign',
        posts: '14.5k posts',
    },
    {
        category: 'Design · Trending',
        title: 'Typography Trends 2024',
        posts: '8,230 posts',
    },
    {
        category: 'Productivity · Trending',
        title: 'Deep Work',
        posts: '5,102 posts',
    },
]

const TrendingCard = () => {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">Trending</h2>

            <div className="mt-4 space-y-4">
                {trendingTopics.map((topic) => (
                    <div key={topic.title}>
                        <p className="text-xs text-slate-400">{topic.category}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{topic.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{topic.posts}</p>
                    </div>
                ))}
            </div>

            <button type="button" className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-600">
                Show more
            </button>
        </section>
    )
}

export default TrendingCard
