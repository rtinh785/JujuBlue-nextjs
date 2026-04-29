'use client'
import type { CommentItem, PostMediaItem } from '@/core/types/post.type'
import FeedAction from '@/components/home/FeedAction'
import { Heart } from 'lucide-react'
import { useLikePost, useUnlikePost } from '@/apis/posts/posts.query'
import { useState } from 'react'
import MediaPreviewList from '@/components/post/components/MediaPreviewList'
import MediaPickerButton from '@/components/post/components/MediaPickerButton'

type Props = {
    comment: CommentItem
    replyingToCommentId: string | null
    replyContent: string
    isCreatingComment: boolean
    replyPlacement: 'parent' | 'reply' | null
    replyMedia: PostMediaItem[]
    isUploadingReplyMedia: boolean
    replyMentionUsername?: string
    onReplyClick: (parentCommentId: string, username?: string, placement?: 'parent' | 'reply') => void
    onReplyCancel: () => void
    onReplyChange: (value: string) => void
    onReplySubmit: () => void
    onReplyMediaChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onReplyMediaRemove: (index: number) => void
}

const CommentItem = ({
    comment,
    replyingToCommentId,
    replyContent,
    isCreatingComment,
    replyPlacement,
    replyMedia,
    isUploadingReplyMedia,
    onReplyClick,
    onReplyCancel,
    onReplyChange,
    onReplySubmit,
    onReplyMediaChange,
    onReplyMediaRemove,
}: Props) => {
    const [pendingLikeIds, setPendingLikeIds] = useState<string[]>([])

    const { mutateAsync: likePost } = useLikePost(comment.root_post_id ?? comment.id)
    const { mutateAsync: unlikePost } = useUnlikePost(comment.root_post_id ?? comment.id)

    const handleLikeTarget = async (targetId: string, isLiked: boolean) => {
        if (pendingLikeIds.includes(targetId)) return

        setPendingLikeIds((prev) => [...prev, targetId])

        try {
            if (isLiked) {
                await unlikePost(targetId)
            } else {
                await likePost(targetId)
            }
        } finally {
            setPendingLikeIds((prev) => prev.filter((id) => id !== targetId))
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                {comment.author?.avatar_url ? (
                    <img
                        src={comment.author.avatar_url}
                        alt={comment.author.display_name}
                        className="size-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="size-9 rounded-full bg-slate-200" />
                )}

                <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-slate-100 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">
                            {comment.author?.display_name ?? 'Unknown'}
                        </p>

                        {comment.content ? <p className="mt-1 text-sm text-slate-600">{comment.content}</p> : null}

                        {comment.media && comment.media.length > 0 ? (
                            <div className="mt-3 space-y-3">
                                {comment.media.map((item, index) => {
                                    if (item.type === 'image') {
                                        return (
                                            <img
                                                key={`${item.url}-${index}`}
                                                src={item.url}
                                                alt="comment media"
                                                className="max-h-64 w-1/2 rounded-2xl object-cover"
                                            />
                                        )
                                    }

                                    return (
                                        <video
                                            key={`${item.url}-${index}`}
                                            src={item.url}
                                            controls
                                            className="max-h-64 w-1/2 rounded-2xl object-cover"
                                        />
                                    )
                                })}
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                        <FeedAction
                            icon={<Heart className="size-4 fill-current" />}
                            value={comment.likes_count}
                            active={comment.is_liked}
                            disabled={pendingLikeIds.includes(comment.id)}
                            handleOnClick={() => handleLikeTarget(comment.id, comment.is_liked)}
                        />

                        <button
                            type="button"
                            onClick={() => onReplyClick(comment.id, comment.author?.username, 'parent')}
                            className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
                        >
                            Reply
                        </button>
                    </div>

                    {replyingToCommentId === comment.id && replyPlacement === 'parent' && (
                        <div className="mt-3 ml-4 space-y-3">
                            <textarea
                                value={replyContent}
                                onChange={(event) => onReplyChange(event.target.value)}
                                placeholder={`Trả lời ${comment.author?.display_name ?? 'comment'}...`}
                                rows={2}
                                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition outline-none focus:border-slate-300"
                            />

                            <MediaPreviewList media={replyMedia} onRemove={onReplyMediaRemove} />

                            <div className="flex items-center justify-between gap-2">
                                <MediaPickerButton
                                    onChange={onReplyMediaChange}
                                    disabled={isUploadingReplyMedia || isCreatingComment}
                                />

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={onReplyCancel}
                                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Huỷ
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onReplySubmit}
                                        disabled={
                                            (!replyContent.trim() && replyMedia.length === 0) ||
                                            isCreatingComment ||
                                            isUploadingReplyMedia
                                        }
                                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isCreatingComment ? 'Đang gửi...' : 'Trả lời'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-3">
                                    {reply.author?.avatar_url ? (
                                        <img
                                            src={reply.author.avatar_url}
                                            alt={reply.author.display_name}
                                            className="size-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="size-8 rounded-full bg-slate-200" />
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {reply.author?.display_name ?? 'Unknown'}
                                            </p>

                                            {reply.content ? (
                                                <p className="mt-1 text-sm text-slate-600">{reply.content}</p>
                                            ) : null}

                                            {reply.media && reply.media.length > 0 ? (
                                                <div className="mt-3 space-y-3">
                                                    {reply.media.map((item, index) => {
                                                        if (item.type === 'image') {
                                                            return (
                                                                <img
                                                                    key={`${item.url}-${index}`}
                                                                    src={item.url}
                                                                    alt="reply media"
                                                                    className="max-h-56 w-1/2 rounded-2xl object-cover"
                                                                />
                                                            )
                                                        }

                                                        return (
                                                            <video
                                                                key={`${item.url}-${index}`}
                                                                src={item.url}
                                                                controls
                                                                className="max-h-56 w-1/2 rounded-2xl object-cover"
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="mt-2 flex items-center gap-3">
                                            <FeedAction
                                                icon={<Heart className="size-4 fill-current" />}
                                                value={reply.likes_count}
                                                active={reply.is_liked}
                                                disabled={pendingLikeIds.includes(reply.id)}
                                                handleOnClick={() => handleLikeTarget(reply.id, reply.is_liked)}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onReplyClick(comment.id, reply.author?.username, 'reply')
                                                }
                                                className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {replyingToCommentId === comment.id && replyPlacement === 'reply' && (
                        <div className="mt-3 ml-4 space-y-3">
                            <textarea
                                value={replyContent}
                                onChange={(event) => onReplyChange(event.target.value)}
                                placeholder={`Trả lời ${comment.author?.display_name ?? 'comment'}...`}
                                rows={2}
                                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition outline-none focus:border-slate-300"
                            />
                            <MediaPreviewList media={replyMedia} onRemove={onReplyMediaRemove} />
                            <div className="flex items-center justify-between gap-2">
                                <MediaPickerButton
                                    onChange={onReplyMediaChange}
                                    disabled={isUploadingReplyMedia || isCreatingComment}
                                />

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={onReplyCancel}
                                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Huỷ
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onReplySubmit}
                                        disabled={
                                            (!replyContent.trim() && replyMedia.length === 0) ||
                                            isCreatingComment ||
                                            isUploadingReplyMedia
                                        }
                                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isCreatingComment ? 'Đang gửi...' : 'Trả lời'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CommentItem
