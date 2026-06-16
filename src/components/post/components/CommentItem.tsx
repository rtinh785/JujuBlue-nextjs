'use client'
import type { CommentItem, PostMediaItem, PostWithStatus } from '@/core/types/post.type'
import FeedAction from '@/components/common/FeedAction'
import { Heart } from 'lucide-react'
import { useLikePost, useUnlikePost, useUpdatePost, useUploadPostMedia } from '@/apis/posts/posts.query'
import { useState } from 'react'
import OwnerActionMenu from '@/components/post/components/OwnerActionMenu'
import InlinePostEditor from '@/components/post/components/InlinePostEditor'
import ReplyComposer from '@/components/post/components/ReplyComposer'
import PostMediaViewer from '@/components/post/components/PostMediaViewer'
import ReplyItem from '@/components/post/components/ReplyItem'
import { COMMENT_TEXT, POST_ACTION_LABEL, POST_TEXT } from '@/core/constants/post.constant'
import { LAYOUT_ALT } from '@/core/constants/layout.constant'
import { useLingui } from '@lingui/react/macro'

type Props = {
    comment: CommentItem
    replyingToCommentId: string | null
    replyContent: string
    isCreatingComment: boolean
    replyPlacement: 'parent' | 'reply' | null
    replyMedia: PostMediaItem[]
    isUploadingReplyMedia: boolean
    onReplyClick: (
        parentCommentId: string,
        username?: string,
        placement?: 'parent' | 'reply',
        targetPostId?: string,
    ) => void
    onReplyCancel: () => void
    onReplyChange: (value: string) => void
    onReplySubmit: () => void
    onReplyMediaChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onReplyMediaRemove: (index: number) => void
    currentUserId?: string
    deletingPostId?: string | null

    onDeletePost: (post: PostWithStatus) => void
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
    currentUserId,
    deletingPostId,

    onDeletePost,
}: Props) => {
    const [pendingLikeIds, setPendingLikeIds] = useState<string[]>([])

    const { mutateAsync: likePost } = useLikePost(comment.root_post_id ?? comment.id)
    const { mutateAsync: unlikePost } = useUnlikePost(comment.root_post_id ?? comment.id)

    const [editingPostId, setEditingPostId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
    const [editMedia, setEditMedia] = useState<PostMediaItem[]>([])

    const { mutateAsync: uploadPostMedia, isPending: isUploadingEditMedia } = useUploadPostMedia()
    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost()
    const { t } = useLingui()
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

    const handleStartEdit = (target: PostWithStatus) => {
        setEditingPostId(target.id)
        setEditContent(target.content ?? '')
        setEditMedia(target.media ?? [])
    }

    const handleCancelEdit = () => {
        setEditingPostId(null)
        setEditContent('')
        setEditMedia([])
    }

    const handleUploadEditMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])

        if (files.length === 0) return

        const res = await uploadPostMedia(files)
        setEditMedia((prev) => [...prev, ...res.data.media])

        event.target.value = ''
    }

    const handleSubmitEdit = async (postId: string) => {
        const content = editContent.trim()

        if ((!content && editMedia.length === 0) || isUpdatingPost || isUploadingEditMedia) return

        await updatePost({
            postId,
            body: {
                content,
                media: editMedia.length > 0 ? editMedia : null,
            },
            rootPostId: comment.root_post_id ?? comment.id,
        })

        handleCancelEdit()
    }

    const isCommentOwner = currentUserId === comment.author.id
    const isEditingComment = editingPostId === comment.id

    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                {comment.author?.avatar_url ? (
                    <img
                        src={comment.author.avatar_url}
                        alt={comment.author.display_name || LAYOUT_ALT.AVATAR}
                        className="size-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="size-9 rounded-full bg-slate-200" />
                )}

                <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-slate-100 px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">
                                {comment.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                            </p>

                            {isCommentOwner && (
                                <OwnerActionMenu
                                    isDeleting={deletingPostId === comment.id}
                                    onEdit={() => handleStartEdit(comment)}
                                    onDelete={() => onDeletePost(comment)}
                                />
                            )}
                        </div>

                        {isEditingComment ? (
                            <InlinePostEditor
                                content={editContent}
                                media={editMedia}
                                placeholder={t(COMMENT_TEXT.PLACEHOLDER)}
                                maxMediaHeightClass="max-h-64"
                                isSaving={isUpdatingPost}
                                isUploading={isUploadingEditMedia}
                                onContentChange={setEditContent}
                                onMediaChange={handleUploadEditMedia}
                                onMediaRemove={(index) => {
                                    setEditMedia((prev) => prev.filter((_, mediaIndex) => mediaIndex !== index))
                                }}
                                onCancel={handleCancelEdit}
                                onSubmit={() => handleSubmitEdit(comment.id)}
                            />
                        ) : (
                            <>
                                {comment.content ? (
                                    <p className="mt-1 text-sm text-slate-600">{comment.content}</p>
                                ) : null}

                                <PostMediaViewer
                                    media={comment.media}
                                    alt={t(COMMENT_TEXT.COMMENT_MEDIA_ALT)}
                                    maxHeightClass="max-h-64"
                                />
                            </>
                        )}
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
                            {t(POST_ACTION_LABEL.REPLY)}
                        </button>
                    </div>

                    {replyingToCommentId === comment.id && replyPlacement === 'parent' && (
                        <ReplyComposer
                            value={replyContent}
                            placeholder={`${COMMENT_TEXT.REPLY_PLACEHOLDER_PREFIX} ${comment.author?.display_name ?? COMMENT_TEXT.REPLY_FALLBACK_TARGET}...`}
                            media={replyMedia}
                            isCreating={isCreatingComment}
                            isUploadingMedia={isUploadingReplyMedia}
                            onChange={onReplyChange}
                            onSubmit={onReplySubmit}
                            onCancel={onReplyCancel}
                            onMediaChange={onReplyMediaChange}
                            onMediaRemove={onReplyMediaRemove}
                        />
                    )}

                    {comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <ReplyItem
                                    key={reply.id}
                                    commentId={comment.id}
                                    currentUserId={currentUserId}
                                    deletingPostId={deletingPostId}
                                    editContent={editContent}
                                    editMedia={editMedia}
                                    editingPostId={editingPostId}
                                    isUpdatingPost={isUpdatingPost}
                                    isUploadingEditMedia={isUploadingEditMedia}
                                    pendingLikeIds={pendingLikeIds}
                                    reply={reply}
                                    onContentChange={setEditContent}
                                    onDeletePost={onDeletePost}
                                    onEditCancel={handleCancelEdit}
                                    onEditMediaChange={handleUploadEditMedia}
                                    onEditMediaRemove={(index) => {
                                        setEditMedia((prev) => prev.filter((_, mediaIndex) => mediaIndex !== index))
                                    }}
                                    onEditStart={handleStartEdit}
                                    onEditSubmit={handleSubmitEdit}
                                    onLike={handleLikeTarget}
                                    onReplyClick={onReplyClick}
                                />
                            ))}
                        </div>
                    )}

                    {replyingToCommentId === comment.id && replyPlacement === 'reply' && (
                        <ReplyComposer
                            value={replyContent}
                            placeholder={`${COMMENT_TEXT.REPLY_PLACEHOLDER_PREFIX} ${comment.author?.display_name ?? COMMENT_TEXT.REPLY_FALLBACK_TARGET}...`}
                            media={replyMedia}
                            isCreating={isCreatingComment}
                            isUploadingMedia={isUploadingReplyMedia}
                            onChange={onReplyChange}
                            onSubmit={onReplySubmit}
                            onCancel={onReplyCancel}
                            onMediaChange={onReplyMediaChange}
                            onMediaRemove={onReplyMediaRemove}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CommentItem
