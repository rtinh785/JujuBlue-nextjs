import { useTrendingPosts } from '@/apis/posts/posts.query'

import { ASIDE_TEXT } from '@/core/constants/layout.constant'
import { PostWithStatus } from '@/core/types/post.type'

import { getPostInteractions, getTrendingPostTitle } from '@/utils/post'
import { useLingui } from '@lingui/react/macro'

type Props = {
    onOpenPost?: (post: PostWithStatus) => void
}

const TrendingCard = ({ onOpenPost }: Props) => {
    const { data: trendingPosts = [], isLoading } = useTrendingPosts()

    const { t } = useLingui()
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">{t(ASIDE_TEXT.TRENDING)}</h2>
            <p className="mt-1 text-xs text-slate-400">{t(ASIDE_TEXT.TRENDING_DESCRIPTION)}</p>

            <div className="mt-3 space-y-1">
                {isLoading ? (
                    <p className="text-xs text-slate-400">Loading trending posts...</p>
                ) : trendingPosts.length > 0 ? (
                    trendingPosts.map((post) => {
                        const interactions = getPostInteractions(post)

                        return (
                            <button
                                key={post.id}
                                type="button"
                                className="block w-full rounded-xl px-2 py-2 text-left transition hover:bg-slate-50"
                                onClick={() => onOpenPost?.(post)}
                            >
                                <p className="text-xs text-slate-400">Post - Trending</p>
                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-sm">
                                    <span className="truncate font-semibold text-slate-900">
                                        {getTrendingPostTitle(post)}
                                    </span>
                                    <span className="shrink-0 text-xs text-slate-400">
                                        - {interactions} {interactions === 1 ? 'interaction' : 'interactions'}
                                    </span>
                                </div>
                            </button>
                        )
                    })
                ) : (
                    <p className="text-xs text-slate-400">No trending posts yet.</p>
                )}
            </div>
        </section>
    )
}

export default TrendingCard
