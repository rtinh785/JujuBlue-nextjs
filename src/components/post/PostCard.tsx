import {
    useBookmarkPost,
    useDeletePost,
    useLikePost,
    useSharePost,
    useUnbookmarkPost,
    useUnlikePost,
    useUpdatePost,
} from '@/apis/posts/posts.query'
import ConfirmActionDialog from '@/components/common/ConfirmActionDialog'
import EditPostDialog from '@/components/post/components/EditPostDialog'
import OwnerActionMenu from '@/components/post/components/OwnerActionMenu'
import PostActions from '@/components/post/components/PostActions'
import PostBody from '@/components/post/components/PostBody'
import SharePostDialog from '@/components/post/components/SharePostDialog'
import { POST_DIALOG, POST_MESSAGE, POST_TEXT, POST_VISIBILITY_LABEL } from '@/core/constants/post.constant'
import { ROUTE_BUILDER } from '@/core/constants/route.constant'
import { Post, PostWithStatus, SharePostReq, UpdatePostReq } from '@/core/types/post.type'
import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatPostTime } from '../../utils/helper'
import { toast } from 'sonner'
import Link from 'next/link'
import { usePrefetchProfile } from '@/hooks/usePrefetchProfile'

type Props = {
    currentUserId?: string
    post: PostWithStatus
    onEdit?: (post: Post) => void
    onDelete?: (postId: string) => void
    onOpenDetail?: (post: PostWithStatus) => void
    onFocusCommentInput?: () => void
    onOpenComments?: (post: PostWithStatus) => void
}

const POST_ACTION_DEBOUNCE_MS = 1000

const PostCard = ({
    post,
    currentUserId,
    onEdit,
    onDelete,
    onOpenDetail,
    onFocusCommentInput,
    onOpenComments,
}: Props) => {
    const [displayPost, setDisplayPost] = useState(post)
    const prefetchProfile = usePrefetchProfile()

    const isOwner = currentUserId === displayPost.author?.id
    const authorProfileHref = displayPost.author?.id ? ROUTE_BUILDER.profileDetail(displayPost.author.id) : null
    const isOriginalSharedPostMissing = displayPost.was_shared_post && !displayPost.shared_post
    const shareDisabledReason = isOriginalSharedPostMissing ? POST_MESSAGE.SHARE_UNAVAILABLE : undefined

    // Like / bookmark
    const { mutateAsync: likeMutation } = useLikePost()
    const { mutateAsync: unlikeMutation } = useUnlikePost()
    const { mutateAsync: bookmarkMutation } = useBookmarkPost()
    const { mutateAsync: unbookmarkMutation } = useUnbookmarkPost()
    const likeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const bookmarkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const syncedLikeRef = useRef(post.is_liked)
    const syncedLikesCountRef = useRef(post.likes_count)
    const syncedBookmarkRef = useRef(post.is_bookmark)

    // Delete
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()

    // Edit
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost()

    // Share
    const [shareDialogOpen, setShareDialogOpen] = useState(false)
    const { mutateAsync: sharePost, isPending: isSharingPost } = useSharePost()

    const handleUnavailableShare = () => {
        toast.error(POST_MESSAGE.SHARE_UNAVAILABLE, {
            position: 'top-left',
        })
    }

    const handleOpenDetail = () => {
        if (!currentUserId) return

        onOpenDetail?.(displayPost)
    }

    const handleCommentClick = () => {
        if (!currentUserId) return

        if (onFocusCommentInput) {
            onFocusCommentInput()
            return
        }

        if (onOpenComments) {
            onOpenComments(displayPost)
            return
        }

        onOpenDetail?.(displayPost)
    }

    const handleOpenSharedPost = (sharedPost: PostWithStatus['shared_post']) => {
        if (!sharedPost || !currentUserId) return

        onOpenDetail?.(sharedPost as PostWithStatus)
    }

    const handleLike = () => {
        let nextIsLiked = false

        setDisplayPost((prev) => {
            nextIsLiked = !prev.is_liked

            return {
                ...prev,
                is_liked: nextIsLiked,
                likes_count: Math.max((prev.likes_count ?? 0) + (nextIsLiked ? 1 : -1), 0),
            }
        })

        if (likeTimerRef.current) {
            clearTimeout(likeTimerRef.current)
        }

        likeTimerRef.current = setTimeout(() => {
            void syncLikeStatus(nextIsLiked)
        }, POST_ACTION_DEBOUNCE_MS)
    }

    const handleBookmark = () => {
        let nextIsBookmarked = false

        setDisplayPost((prev) => {
            nextIsBookmarked = !prev.is_bookmark

            return {
                ...prev,
                is_bookmark: nextIsBookmarked,
            }
        })

        if (bookmarkTimerRef.current) {
            clearTimeout(bookmarkTimerRef.current)
        }

        bookmarkTimerRef.current = setTimeout(() => {
            void syncBookmarkStatus(nextIsBookmarked)
        }, POST_ACTION_DEBOUNCE_MS)
    }

    const syncLikeStatus = async (nextIsLiked: boolean) => {
        if (nextIsLiked === syncedLikeRef.current) return

        try {
            if (nextIsLiked) {
                await likeMutation(displayPost.id)
            } else {
                await unlikeMutation(displayPost.id)
            }

            syncedLikesCountRef.current = Math.max(syncedLikesCountRef.current + (nextIsLiked ? 1 : -1), 0)
            syncedLikeRef.current = nextIsLiked
        } catch {
            setDisplayPost((prev) => ({
                ...prev,
                is_liked: syncedLikeRef.current,
                likes_count: syncedLikesCountRef.current,
            }))
        }
    }

    const syncBookmarkStatus = async (nextIsBookmarked: boolean) => {
        if (nextIsBookmarked === syncedBookmarkRef.current) return

        try {
            if (nextIsBookmarked) {
                await bookmarkMutation(displayPost.id)
            } else {
                await unbookmarkMutation(displayPost.id)
            }

            syncedBookmarkRef.current = nextIsBookmarked
        } catch {
            setDisplayPost((prev) => ({
                ...prev,
                is_bookmark: syncedBookmarkRef.current,
            }))
        }
    }

    const handleOpenDeleteDialog = () => {
        setDeleteDialogOpen(true)
    }

    const handleDeletePost = async () => {
        if (isDeletingPost) return

        await deletePost({ postId: displayPost.id })
        onDelete?.(displayPost.id)
        setDeleteDialogOpen(false)
    }

    const handleOpenEditDialog = () => {
        onEdit?.(displayPost)
        setEditDialogOpen(true)
    }

    const handleUpdatePost = async (body: UpdatePostReq) => {
        if (isUpdatingPost) return

        await updatePost({
            postId: displayPost.id,
            body,
        })

        setEditDialogOpen(false)
    }

    const handleOpenShareDialog = () => {
        if (!currentUserId) return

        setShareDialogOpen(true)
    }

    const handleSharePost = async (postId: string, body: SharePostReq) => {
        if (isSharingPost) return

        await sharePost({
            postId,
            body,
        })

        setShareDialogOpen(false)
    }

    useEffect(() => {
        setDisplayPost(post)
        syncedLikeRef.current = post.is_liked
        syncedLikesCountRef.current = post.likes_count
        syncedBookmarkRef.current = post.is_bookmark
    }, [post])

    useEffect(() => {
        return () => {
            if (likeTimerRef.current) {
                clearTimeout(likeTimerRef.current)
            }

            if (bookmarkTimerRef.current) {
                clearTimeout(bookmarkTimerRef.current)
            }
        }
    }, [])

    return (
        <>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-3">
                    {authorProfileHref && displayPost.author?.avatar_url ? (
                        <Link
                            href={authorProfileHref}
                            onMouseEnter={() => prefetchProfile(displayPost.author?.id)}
                            onFocus={() => prefetchProfile(displayPost.author?.id)}
                            onTouchStart={() => prefetchProfile(displayPost.author?.id)}
                            className="shrink-0 rounded-full"
                        >
                            <img
                                src={displayPost.author.avatar_url}
                                alt={displayPost.author.display_name}
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
                                        onMouseEnter={() => prefetchProfile(displayPost.author?.id)}
                                        onFocus={() => prefetchProfile(displayPost.author?.id)}
                                        onTouchStart={() => prefetchProfile(displayPost.author?.id)}
                                        className="text-sm font-semibold text-slate-900 transition hover:text-blue-600"
                                    >
                                        {displayPost.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                                    </Link>
                                ) : (
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        {displayPost.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                                    </h3>
                                )}

                                {displayPost.author?.username ? (
                                    <span className="text-xs text-slate-400">@{displayPost.author.username}</span>
                                ) : null}

                                <span className="text-xs text-slate-300">{formatPostTime(displayPost.created_at)}</span>
                            </div>

                            {isOwner && (
                                <OwnerActionMenu
                                    isDeleting={isDeletingPost}
                                    onEdit={handleOpenEditDialog}
                                    onDelete={handleOpenDeleteDialog}
                                />
                            )}
                        </div>

                        <p className="mt-[-4px] w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
                            {POST_VISIBILITY_LABEL[displayPost.visibility]}
                        </p>
                    </div>
                </div>

                <PostBody
                    post={displayPost}
                    canOpenDetail={!!currentUserId}
                    onOpenDetail={handleOpenDetail}
                    onOpenSharedPost={handleOpenSharedPost}
                />

                <PostActions
                    likesCount={displayPost.likes_count}
                    commentsCount={displayPost.comments_count}
                    sharesCount={displayPost.shares_count ?? 0}
                    isLiked={displayPost.is_liked}
                    isBookmarked={displayPost.is_bookmark}
                    isSharePending={isSharingPost}
                    canInteract={!!currentUserId}
                    shareDisabledReason={shareDisabledReason}
                    onLike={handleLike}
                    onComment={handleCommentClick}
                    onShare={isOriginalSharedPostMissing ? handleUnavailableShare : handleOpenShareDialog}
                    onBookmark={handleBookmark}
                />
            </article>

            <ConfirmActionDialog
                open={deleteDialogOpen}
                title={POST_DIALOG.DELETE_TITLE}
                description={POST_DIALOG.DELETE_DESCRIPTION}
                confirmText={POST_DIALOG.DELETE_CONFIRM}
                loadingText={POST_DIALOG.DELETE_LOADING}
                isLoading={isDeletingPost}
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeletePost}
            />

            <EditPostDialog
                post={displayPost}
                open={editDialogOpen}
                isLoading={isUpdatingPost}
                onOpenChange={setEditDialogOpen}
                onSubmit={handleUpdatePost}
            />

            <SharePostDialog
                post={displayPost}
                open={shareDialogOpen}
                isLoading={isSharingPost}
                onOpenChange={setShareDialogOpen}
                onSubmit={handleSharePost}
                onOpenOriginalPost={handleOpenSharedPost}
            />
        </>
    )
}

export default PostCard
