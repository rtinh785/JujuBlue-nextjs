import { ASIDE_TEXT, TRENDING_TOPICS } from '@/core/constants/layout.constant'
import React from 'react'

const TrendingCard = () => {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">{ASIDE_TEXT.TRENDING}</h2>

            <div className="mt-4 space-y-4">
                {TRENDING_TOPICS.map((topic) => (
                    <div key={topic.title}>
                        <p className="text-xs text-slate-400">{topic.category}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{topic.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{topic.posts}</p>
                    </div>
                ))}
            </div>

            <button type="button" className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-600">
                {ASIDE_TEXT.SHOW_MORE}
            </button>
        </section>
    )
}

export default TrendingCard
