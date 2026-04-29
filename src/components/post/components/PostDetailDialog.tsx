'use client'

import PostCard from '@/components/post/PostCard'
import { PostMediaItem, PostWithStatus } from '@/core/types/post.type'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { useComments, useCreateComment, useUploadPostMedia } from '@/apis/posts/posts.query'

import { useEffect, useRef, useState } from 'react'
import CommentItem from '@/components/post/components/CommentItem'

import MediaPickerButton from '@/components/post/components/MediaPickerButton'
import MediaPreviewList from '@/components/post/components/MediaPreviewList'
import { useMyProfile } from '@/apis/user/user.query'

type Props = {
    post: PostWithStatus | null
    currentUserId?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    shouldFocusComment?: boolean
}
type ReplyTarget = {
    parentCommentId: string
    mentionUsername?: string
    placement: 'parent' | 'reply'
} | null

const PostDetailDialog = ({ post, currentUserId, open, onOpenChange, shouldFocusComment }: Props) => {
    const { data: comments, isLoading } = useComments(post?.id)
    const [commentContent, setCommentContent] = useState('')
    const [commentMedia, setCommentMedia] = useState<PostMediaItem[]>([])
    const commentInputRef = useRef<HTMLTextAreaElement | null>(null)
    const { mutateAsync: createComment, isPending: isCreatingComment } = useCreateComment(post?.id)
    const { mutateAsync: uploadPostMedia, isPending: isUploadingCommentMedia } = useUploadPostMedia()

    const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null)
    const [replyContent, setReplyContent] = useState('')
    const [replyMedia, setReplyMedia] = useState<PostMediaItem[]>([])

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

        if ((!content && commentMedia.length === 0) || !post?.id || isCreatingComment) return

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
    ) => {
        setReplyTarget({
            parentCommentId,
            mentionUsername: username,
            placement,
        })

        setReplyContent(username ? `@${username} ` : '')
        setReplyMedia([])
    }

    const handleSubmitReply = async () => {
        const content = replyContent.trim()

        if ((!content && replyMedia.length === 0) || !post?.id || !replyTarget?.parentCommentId || isCreatingComment)
            return

        await createComment({
            content,
            media: replyMedia,
            parentPostId: replyTarget.parentCommentId,
        })

        setReplyContent('')
        setReplyTarget(null)
        setReplyMedia([])
    }

    useEffect(() => {
        if (!open || !shouldFocusComment) return

        const timeout = window.setTimeout(() => {
            handleFocusCommentInput()
        }, 100)

        return () => window.clearTimeout(timeout)
    }, [open, shouldFocusComment])

    if (!post) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] !max-w-[840px] overflow-y-auto p-0" showCloseButton>
                <DialogHeader className="border-b border-slate-100 px-4 py-4">
                    <DialogTitle>Bài viết của {post.author?.display_name ?? 'Unknown'}</DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <PostCard post={post} currentUserId={currentUserId} onFocusCommentInput={handleFocusCommentInput} />

                    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                        <h3 className="text-sm font-semibold text-slate-900">Bình luận</h3>
                        <div className="mt-4 border-t border-slate-100 pt-4">
                            <div className="flex gap-3">
                                {myProfile?.avatar_url ? (
                                    <img
                                        src={myProfile.avatar_url}
                                        alt={myProfile.display_name}
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
                                            placeholder="Viết bình luận..."
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
                                                {isCreatingComment ? 'Đang gửi...' : 'Bình luận'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="py-6 text-center text-sm text-slate-500">Đang tải bình luận...</div>
                        ) : comments && comments.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
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
                                 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-sm font-medium text-slate-600">Chưa có bình luận nào</p>
                                <p className="mt-1 text-xs text-slate-400">Hãy là người đầu tiên bình luận.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PostDetailDialog
