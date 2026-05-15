'use client'

import { BOOKMARK_TEXT } from '@/core/constants/bookmark.constant'
import { POST_TEXT } from '@/core/constants/post.constant'
import { PostWithStatus } from '@/core/types/post.type'
import { MoreHorizontal, Play } from 'lucide-react'

type Props = {
    post: PostWithStatus
    onOpenDetail: (post: PostWithStatus) => void
    onRequestUnbookmark: (post: PostWithStatus) => void
}

const BookmarkItem = ({ post, onOpenDetail, onRequestUnbookmark }: Props) => {
    const firstMedia = post.media?.[0]
    const authorName = post.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR
    const authorAvatar = post.author?.avatar_url

    const handleRequestUnbookmark = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onRequestUnbookmark(post)
    }

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={() => onOpenDetail(post)}
            className="group flex cursor-pointer gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:bg-slate-50"
        >
            <div className="h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {firstMedia?.type === 'image' ? (
                    <img src={firstMedia.url} alt={post.content} className="h-full w-full object-cover" />
                ) : firstMedia?.type === 'video' ? (
                    <div className="relative h-full w-full">
                        <video src={firstMedia.url} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-900">
                                <Play className="ml-0.5 size-5 fill-current" />
                            </div>
                        </div>
                    </div>
                ) : authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-semibold text-slate-500">
                        {authorName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-base leading-6 font-semibold text-slate-900">
                    {post.content || BOOKMARK_TEXT.EMPTY_POST_CONTENT}
                </p>

                <p className="mt-1 text-sm text-slate-500">{BOOKMARK_TEXT.POST_TYPE_LABEL}</p>

                <p className="mt-3 text-sm text-slate-600">
                    {BOOKMARK_TEXT.SAVED_FROM_AUTHOR_PREFIX}{' '}
                    <span className="font-semibold text-slate-900">{authorName}</span>
                </p>
            </div>

            <button
                type="button"
                onClick={handleRequestUnbookmark}
                className="h-fit rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreHorizontal className="size-5" />
            </button>
        </article>
    )
}

export default BookmarkItem
