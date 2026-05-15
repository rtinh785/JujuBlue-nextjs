'use client'

import PostMediaViewer from '@/components/post/components/PostMediaViewer'
import { LAYOUT_ALT } from '@/core/constants/layout.constant'
import { POST_TEXT } from '@/core/constants/post.constant'
import type { SharedPostItem } from '@/core/types/post.type'

type Props = {
    post: SharedPostItem
    onOpen?: (post: SharedPostItem) => void
}

const SharedPostPreview = ({ post, onOpen }: Props) => {
    const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onOpen?.(post)
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    event.stopPropagation()
                    onOpen?.(post)
                }
            }}
            className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-50"
        >
            <div className="flex items-start gap-3 p-3">
                {post.author?.avatar_url ? (
                    <img
                        src={post.author.avatar_url}
                        alt={post.author.display_name || LAYOUT_ALT.AVATAR}
                        className="size-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="size-9 rounded-full bg-slate-200" />
                )}

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                        {post.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                    </p>
                    <p className="text-xs text-slate-400">@{post.author?.username}</p>

                    {post.content ? (
                        <p className="mt-2 text-sm leading-6 whitespace-pre-line text-slate-700">{post.content}</p>
                    ) : null}
                </div>
            </div>

            {post.media && post.media.length > 0 ? (
                <div className="px-3 pb-3">
                    <PostMediaViewer media={post.media} />
                </div>
            ) : null}
        </div>
    )
}

export default SharedPostPreview
