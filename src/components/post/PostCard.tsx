import {
    useBookmarkPost,
    useDeletePost,
    useLikePost,
    useSharePost,
    useUnbookmarkPost,
    useUnlikePost,
    useUpdatePost,
} from '@/apis/posts/posts.query'
import PostCardDialogs from '@/components/post/components/PostCardDialogs'
import PostCardHeader from '@/components/post/components/PostCardHeader'
import PostActions from '@/components/post/components/PostActions'
import PostBody from '@/components/post/components/PostBody'
import { POST_MESSAGE } from '@/core/constants/post.constant'
import { Post, PostWithStatus, SharePostReq, UpdatePostReq } from '@/core/types/post.type'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

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

    const isOwner = currentUserId === displayPost.author?.id
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
                <PostCardHeader
                    author={displayPost.author}
                    createdAt={displayPost.created_at}
                    visibility={displayPost.visibility}
                    isOwner={isOwner}
                    isDeleting={isDeletingPost}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleOpenDeleteDialog}
                />

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

            <PostCardDialogs
                post={displayPost}
                deleteDialogOpen={deleteDialogOpen}
                editDialogOpen={editDialogOpen}
                shareDialogOpen={shareDialogOpen}
                isDeletingPost={isDeletingPost}
                isUpdatingPost={isUpdatingPost}
                isSharingPost={isSharingPost}
                onDeleteDialogOpenChange={setDeleteDialogOpen}
                onEditDialogOpenChange={setEditDialogOpen}
                onShareDialogOpenChange={setShareDialogOpen}
                onConfirmDelete={handleDeletePost}
                onSubmitUpdate={handleUpdatePost}
                onSubmitShare={handleSharePost}
                onOpenOriginalPost={handleOpenSharedPost}
            />
        </>
    )
}

export default PostCard
