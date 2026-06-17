import { useTrendingPosts } from '@/apis/posts/posts.query'

import { ASIDE_TEXT } from '@/core/constants/layout.constant'
import { PostWithStatus } from '@/core/types/post.type'

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

            <div className="mt-3 flex flex-col">
                {isLoading ? (
                    <div className="flex flex-col gap-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-2 py-2.5">
                                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : trendingPosts.length > 0 ? (
                    trendingPosts.map((post) => {
                        const interactions =
                            (post.likes_count ?? 0) + (post.comments_count ?? 0) + (post.shares_count ?? 0)

                        const content = post.content?.trim()
                        const authorName = post.author?.display_name?.trim()
                        const avatarUrl = post.author?.avatar_url
                        const title =
                            content || (authorName ? `Bài viết của ${authorName}` : 'Bài viết chưa có nội dung')
                        const thumbnail = post.media?.[0]

                        // Chữ viết tắt tên để làm avatar fallback, ví dụ "Nguyễn Văn A" -> "NA"
                        const initials = (() => {
                            if (!authorName) return '?'
                            const parts = authorName.split(/\s+/)
                            return parts.length === 1
                                ? parts[0].slice(0, 2).toUpperCase()
                                : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                        })()

                        // Map id -> 1 trong 6 cặp màu Tailwind cố định, để avatar không đổi màu mỗi lần render
                        const avatarColors = [
                            'bg-indigo-50 text-indigo-700',
                            'bg-teal-50 text-teal-700',
                            'bg-orange-50 text-orange-700',
                            'bg-pink-50 text-pink-700',
                            'bg-blue-50 text-blue-700',
                            'bg-amber-50 text-amber-700',
                        ]
                        const seed = post.author?.id ?? post.id
                        let hash = 0
                        for (let i = 0; i < seed.length; i++) {
                            hash = (hash << 5) - hash + seed.charCodeAt(i)
                            hash |= 0
                        }
                        const avatarColor = avatarColors[Math.abs(hash) % avatarColors.length]

                        return (
                            <button
                                key={post.id}
                                type="button"
                                className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50 active:bg-slate-100"
                                onClick={() => onOpenPost?.(post)}
                            >
                                {/* Ảnh/video thumbnail của post được ưu tiên hiển thị; nếu post không có
                                    media thì mới fallback về avatar người đăng (avatar_url, hoặc initials
                                    nếu user chưa có avatar). Icon tam giác trên video chỉ mang tính minh hoạ,
                                    không phát được khi bấm vào. */}
                                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                    {thumbnail ? (
                                        <>
                                            {thumbnail.type === 'video' ? (
                                                <video
                                                    src={thumbnail.url}
                                                    className="h-full w-full object-cover"
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <img
                                                    src={thumbnail.url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}
                                            {thumbnail.type === 'video' && (
                                                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-3.5 w-3.5 text-white"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M8 5v14l11-7L8 5Z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </>
                                    ) : avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={authorName || 'avatar'}
                                            className="h-full w-full rounded-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span
                                            className={`flex h-full w-full items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                                        >
                                            {initials}
                                        </span>
                                    )}
                                </span>

                                {/* Tên tác giả + excerpt nội dung, clamp 1 dòng để giữ list gọn */}
                                <span className="min-w-0 flex-1">
                                    <span className="truncate text-[13px] font-semibold text-slate-900">
                                        {authorName || 'Người dùng ẩn danh'}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[13px] text-slate-500">{title}</span>
                                </span>

                                {/* Điểm tương tác — icon ngôi sao, ví dụ 4 điểm thì hiện "4" + icon sao */}
                                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-slate-500">
                                    {interactions}
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-3.5 w-3.5 text-amber-400"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 2.5l2.69 6.07 6.6.58-5 4.36 1.53 6.49L12 16.77l-5.82 3.23 1.53-6.49-5-4.36 6.6-.58L12 2.5Z" />
                                    </svg>
                                </span>
                            </button>
                        )
                    })
                ) : (
                    <p className="px-1 py-2 text-xs text-slate-400">Chưa có bài viết nổi bật.</p>
                )}
            </div>
        </section>
    )
}

export default TrendingCard
