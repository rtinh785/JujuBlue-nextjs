'use client'

import PostCard from '@/components/post/PostCard'
import { PostWithStatus } from '@/core/types/post.type'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { useComments, useCreateComment } from '@/apis/posts/posts.query'
import { useEffect, useRef, useState } from 'react'

type Props = {
    post: PostWithStatus | null
    currentUserId?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    shouldFocusComment?: boolean
}

const PostDetailDialog = ({ post, currentUserId, open, onOpenChange, shouldFocusComment }: Props) => {
    const { data: comments, isLoading } = useComments(post?.id)
    const [commentContent, setCommentContent] = useState('')
    const commentInputRef = useRef<HTMLTextAreaElement | null>(null)
    const { mutateAsync: createComment, isPending: isCreatingComment } = useCreateComment(post?.id)

    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')

    const handleFocusCommentInput = () => {
        commentInputRef.current?.focus()
        commentInputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }

    const handleSubmitComment = async () => {
        const content = commentContent.trim()

        if (!content || !post?.id || isCreatingComment) return

        await createComment({ content })
        setCommentContent('')
    }

    const handleSubmitReply = async (parentPostId: string) => {
        const content = replyContent.trim()

        if (!content || !post?.id || isCreatingComment) return

        await createComment({
            content,
            parentPostId,
        })

        setReplyContent('')
        setReplyingToCommentId(null)
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
                                {post.author?.avatar_url ? (
                                    <img
                                        src={post.author.avatar_url}
                                        alt={post.author.display_name}
                                        className="size-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="size-9 rounded-full bg-slate-200" />
                                )}

                                <div className="flex-1 space-y-3">
                                    <textarea
                                        ref={commentInputRef}
                                        value={commentContent}
                                        onChange={(event) => setCommentContent(event.target.value)}
                                        placeholder="Viết bình luận..."
                                        rows={3}
                                        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition outline-none focus:border-slate-300"
                                    />

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSubmitComment}
                                            disabled={!commentContent.trim() || isCreatingComment}
                                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isCreatingComment ? 'Đang gửi...' : 'Bình luận'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="py-6 text-center text-sm text-slate-500">Đang tải bình luận...</div>
                        ) : comments && comments.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="space-y-3">
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
                                                    <p className="mt-1 text-sm text-slate-600">{comment.content}</p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyingToCommentId(comment.id)
                                                        setReplyContent('')
                                                    }}
                                                    className="mt-2 text-xs font-medium text-slate-500 transition hover:text-slate-700"
                                                >
                                                    Trả lời
                                                </button>
                                                {replyingToCommentId === comment.id && (
                                                    <div className="mt-3 ml-4 space-y-3">
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(event) => setReplyContent(event.target.value)}
                                                            placeholder={`Trả lời ${comment.author?.display_name ?? 'comment'}...`}
                                                            rows={2}
                                                            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition outline-none focus:border-slate-300"
                                                        />

                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setReplyingToCommentId(null)
                                                                    setReplyContent('')
                                                                }}
                                                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                                            >
                                                                Huỷ
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleSubmitReply(comment.id)}
                                                                disabled={!replyContent.trim() || isCreatingComment}
                                                                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {isCreatingComment ? 'Đang gửi...' : 'Trả lời'}
                                                            </button>
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

                                                                <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 px-4 py-3">
                                                                    <p className="text-sm font-semibold text-slate-900">
                                                                        {reply.author?.display_name ?? 'Unknown'}
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-slate-600">
                                                                        {reply.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
