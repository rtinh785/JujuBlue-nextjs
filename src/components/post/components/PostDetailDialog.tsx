'use client'

import PostCard from '@/components/post/PostCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'
import type { PostMediaItem, PostWithStatus } from '@/core/types/post.type'
import { useComments, useCreateComment, useDeletePost, usePostById, useUploadPostMedia } from '@/apis/posts/posts.query'
import { useEffect, useRef, useState } from 'react'
import CommentItem from '@/components/post/components/CommentItem'

import MediaPickerButton from '@/components/post/components/MediaPickerButton'
import MediaPreviewList from '@/components/post/components/MediaPreviewList'
import { useMyProfile } from '@/apis/user/user.query'
import ConfirmActionDialog from '@/components/common/ConfirmActionDialog'
import { Trash2 } from 'lucide-react'
import { COMMENT_DIALOG, COMMENT_TEXT, POST_ACTION_LABEL, POST_TEXT } from '@/core/constants/post.constant'
import { LAYOUT_ALT } from '@/core/constants/layout.constant'
import { useLingui } from '@lingui/react/macro'

type Props = {
    post: PostWithStatus | null
    currentUserId?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    shouldFocusComment?: boolean
    onDeleted?: (postId: string) => void
}
type ReplyTarget = {
    parentCommentId: string
    targetPostId: string
    mentionUsername?: string
    placement: 'parent' | 'reply'
} | null

const PostDetailDialog = ({ post, currentUserId, open, onOpenChange, shouldFocusComment, onDeleted }: Props) => {
    const postId = post?.id
    const { data: latestPost } = usePostById(postId)
    const { t } = useLingui()
    const displayPost = latestPost ?? post
    const { data: comments, isLoading } = useComments(postId)
    const [commentContent, setCommentContent] = useState('')
    const [commentMedia, setCommentMedia] = useState<PostMediaItem[]>([])
    const commentInputRef = useRef<HTMLTextAreaElement | null>(null)
    const { mutateAsync: createComment, isPending: isCreatingComment } = useCreateComment(postId)

    const { mutateAsync: uploadPostMedia, isPending: isUploadingCommentMedia } = useUploadPostMedia()

    const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null)
    const [replyContent, setReplyContent] = useState('')
    const [replyMedia, setReplyMedia] = useState<PostMediaItem[]>([])

    const [deletingPost, setDeletingPost] = useState<PostWithStatus | null>(null)
    const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()

    const handleFocusCommentInput = () => {
        commentInputRef.current?.focus()
        commentInputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }

    const { data: myProfile } = useMyProfile()

    const handleUploadCommentMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])

        if (files.length === 0) return

        const res = await uploadPostMedia(files)
        setCommentMedia((prev) => [...prev, ...res.data.media])

        event.target.value = ''
    }

    const handleUploadReplyMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])

        if (files.length === 0) return

        const res = await uploadPostMedia(files)
        setReplyMedia((prev) => [...prev, ...res.data.media])

        event.target.value = ''
    }

    const handleRemoveReplyMedia = (indexToRemove: number) => {
        setReplyMedia((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleRemoveCommentMedia = (indexToRemove: number) => {
        setCommentMedia((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmitComment = async () => {
        const content = commentContent.trim()

        if ((!content && commentMedia.length === 0) || !postId || isCreatingComment) return

        await createComment({
            content,
            media: commentMedia,
        })

        setCommentContent('')
        setCommentMedia([])
    }

    const openReplyComposer = (
        parentCommentId: string,
        username?: string,
        placement: 'parent' | 'reply' = 'parent',
        targetPostId = parentCommentId,
    ) => {
        setReplyTarget({
            parentCommentId,
            targetPostId,
            mentionUsername: username,
            placement,
        })

        setReplyContent(username ? `@${username} ` : '')
        setReplyMedia([])
    }

    const handleSubmitReply = async () => {
        const content = replyContent.trim()

        if ((!content && replyMedia.length === 0) || !postId || !replyTarget?.parentCommentId || isCreatingComment)
            return

        await createComment({
            content,
            media: replyMedia,
            parentPostId: replyTarget.targetPostId,
        })

        setReplyContent('')
        setReplyTarget(null)
        setReplyMedia([])
    }

    const handleDeleteCommentPost = async () => {
        if (!deletingPost || !postId || isDeletingPost) return

        await deletePost({
            postId: deletingPost.id,
            rootPostId: postId,
        })

        setDeletingPost(null)
    }

    useEffect(() => {
        if (!open || !shouldFocusComment) return

        const timeout = window.setTimeout(() => {
            handleFocusCommentInput()
        }, 100)

        return () => window.clearTimeout(timeout)
    }, [open, shouldFocusComment])

    if (!displayPost) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] !max-w-[840px] overflow-y-auto p-0" showCloseButton>
                <DialogHeader className="border-b border-slate-100 px-4 py-4">
                    <DialogTitle>
                        {t(POST_TEXT.DETAIL_TITLE_PREFIX)}{' '}
                        {displayPost.author?.display_name ?? t(POST_TEXT.UNKNOWN_AUTHOR)}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <PostCard
                        post={displayPost}
                        currentUserId={currentUserId}
                        onFocusCommentInput={handleFocusCommentInput}
                        onDelete={(postId) => {
                            onDeleted?.(postId)
                            onOpenChange(false)
                        }}
                    />

                    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                        <h3 className="text-sm font-semibold text-slate-900">{t(COMMENT_TEXT.SECTION_TITLE)}</h3>
                        <div className="mt-4 border-t border-slate-100 pt-4">
                            <div className="flex gap-3">
                                {myProfile?.avatar_url ? (
                                    <img
                                        src={myProfile.avatar_url}
                                        alt={myProfile.display_name || LAYOUT_ALT.AVATAR}
                                        className="size-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="size-9 rounded-full bg-slate-200" />
                                )}

                                <div className="flex-1">
                                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                        <textarea
                                            ref={commentInputRef}
                                            value={commentContent}
                                            onChange={(event) => setCommentContent(event.target.value)}
                                            placeholder={t(COMMENT_TEXT.PLACEHOLDER)}
                                            rows={2}
                                            className="max-h-40 w-full resize-none overflow-y-auto px-4 py-3 text-sm text-slate-700 outline-none"
                                        />
                                        <MediaPreviewList media={commentMedia} onRemove={handleRemoveCommentMedia} />

                                        <div className="flex items-center justify-between px-4 pt-1 pb-2">
                                            <MediaPickerButton
                                                onChange={handleUploadCommentMedia}
                                                disabled={isUploadingCommentMedia || isCreatingComment}
                                            />

                                            <button
                                                type="button"
                                                onClick={handleSubmitComment}
                                                disabled={
                                                    (!commentContent.trim() && commentMedia.length === 0) ||
                                                    isCreatingComment ||
                                                    isUploadingCommentMedia
                                                }
                                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isCreatingComment
                                                    ? t(POST_ACTION_LABEL.SENDING)
                                                    : t(POST_ACTION_LABEL.COMMENT)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="py-6 text-center text-sm text-slate-500">{t(COMMENT_TEXT.LOADING)}</div>
                        ) : comments && comments.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        currentUserId={currentUserId}
                                        replyingToCommentId={replyTarget?.parentCommentId ?? null}
                                        replyPlacement={replyTarget?.placement ?? null}
                                        replyContent={replyContent}
                                        replyMedia={replyMedia}
                                        isCreatingComment={isCreatingComment}
                                        isUploadingReplyMedia={isUploadingCommentMedia}
                                        onReplyClick={openReplyComposer}
                                        onReplyCancel={() => {
                                            setReplyTarget(null)
                                            setReplyContent('')
                                            setReplyMedia([])
                                        }}
                                        onReplyChange={setReplyContent}
                                        onReplySubmit={handleSubmitReply}
                                        onReplyMediaChange={handleUploadReplyMedia}
                                        onReplyMediaRemove={handleRemoveReplyMedia}
                                        onDeletePost={setDeletingPost}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-sm font-medium text-slate-600">{t(COMMENT_TEXT.EMPTY_TITLE)}</p>
                                <p className="mt-1 text-xs text-slate-400">{t(COMMENT_TEXT.EMPTY_DESCRIPTION)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

            <ConfirmActionDialog
                open={!!deletingPost}
                title={t(COMMENT_DIALOG.DELETE_TITLE)}
                description={t(COMMENT_DIALOG.DELETE_DESCRIPTION)}
                confirmText={t(COMMENT_DIALOG.DELETE_CONFIRM)}
                loadingText={t(COMMENT_DIALOG.DELETE_LOADING)}
                isLoading={isDeletingPost}
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                onOpenChange={(open) => {
                    if (!open) setDeletingPost(null)
                }}
                onConfirm={handleDeleteCommentPost}
            />
        </Dialog>
    )
}

export default PostDetailDialog
