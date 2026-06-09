import Link from 'next/link'
import OwnerActionMenu from '@/components/post/components/OwnerActionMenu'
import { POST_TEXT, POST_VISIBILITY_LABEL } from '@/core/constants/post.constant'
import { ROUTE_BUILDER } from '@/core/constants/route.constant'
import type { PostWithStatus } from '@/core/types/post.type'
import { usePrefetchProfile } from '@/hooks/usePrefetchProfile'
import { formatPostTime } from '../../utils/helper'

type Props = {
    author?: PostWithStatus['author']
    createdAt: string
    visibility: PostWithStatus['visibility']
    isOwner: boolean
    isDeleting: boolean
    onEdit: () => void
    onDelete: () => void
}

const PostCardHeader = ({ author, createdAt, visibility, isOwner, isDeleting, onEdit, onDelete }: Props) => {
    const prefetchProfile = usePrefetchProfile()
    const authorId = author?.id
    const authorProfileHref = authorId ? ROUTE_BUILDER.profileDetail(authorId) : null

    return (
        <div className="flex items-start gap-3">
            {authorProfileHref && author?.avatar_url ? (
                <Link
                    href={authorProfileHref}
                    onMouseEnter={() => prefetchProfile(authorId)}
                    onFocus={() => prefetchProfile(authorId)}
                    onTouchStart={() => prefetchProfile(authorId)}
                    className="shrink-0 rounded-full"
                >
                    <img
                        src={author.avatar_url}
                        alt={author.display_name}
                        className="size-11 rounded-full object-cover"
                    />
                </Link>
            ) : (
                <div className="size-11 rounded-full bg-slate-200" />
            )}

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {authorProfileHref ? (
                            <Link
                                href={authorProfileHref}
                                onMouseEnter={() => prefetchProfile(authorId)}
                                onFocus={() => prefetchProfile(authorId)}
                                onTouchStart={() => prefetchProfile(authorId)}
                                className="text-sm font-semibold text-slate-900 transition hover:text-blue-600"
                            >
                                {author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                            </Link>
                        ) : (
                            <h3 className="text-sm font-semibold text-slate-900">
                                {author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                            </h3>
                        )}

                        {author?.username ? <span className="text-xs text-slate-400">@{author.username}</span> : null}

                        <span className="text-xs text-slate-300">{formatPostTime(createdAt)}</span>
                    </div>

                    {isOwner && <OwnerActionMenu isDeleting={isDeleting} onEdit={onEdit} onDelete={onDelete} />}
                </div>

                <p className="mt-[-4px] w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
                    {POST_VISIBILITY_LABEL[visibility]}
                </p>
            </div>
        </div>
    )
}

export default PostCardHeader
