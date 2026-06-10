import FeedAction from '@/components/common/FeedAction'
import InlinePostEditor from '@/components/post/components/InlinePostEditor'
import OwnerActionMenu from '@/components/post/components/OwnerActionMenu'
import PostMediaViewer from '@/components/post/components/PostMediaViewer'
import { COMMENT_TEXT, POST_ACTION_LABEL, POST_TEXT } from '@/core/constants/post.constant'
import { LAYOUT_ALT } from '@/core/constants/layout.constant'
import type { PostMediaItem, PostWithStatus } from '@/core/types/post.type'
import { Heart } from 'lucide-react'

type Props = {
    commentId: string
    currentUserId?: string
    deletingPostId?: string | null
    editContent: string
    editMedia: PostMediaItem[]
    editingPostId: string | null
    isUpdatingPost: boolean
    isUploadingEditMedia: boolean
    pendingLikeIds: string[]
    reply: PostWithStatus
    onContentChange: (value: string) => void
    onDeletePost: (post: PostWithStatus) => void
    onEditCancel: () => void
    onEditMediaChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onEditMediaRemove: (index: number) => void
    onEditStart: (post: PostWithStatus) => void
    onEditSubmit: (postId: string) => void
    onLike: (targetId: string, isLiked: boolean) => void
    onReplyClick: (
        parentCommentId: string,
        username?: string,
        placement?: 'parent' | 'reply',
        targetPostId?: string,
    ) => void
}

const ReplyItem = ({
    commentId,
    currentUserId,
    deletingPostId,
    editContent,
    editMedia,
    editingPostId,
    isUpdatingPost,
    isUploadingEditMedia,
    pendingLikeIds,
    reply,
    onContentChange,
    onDeletePost,
    onEditCancel,
    onEditMediaChange,
    onEditMediaRemove,
    onEditStart,
    onEditSubmit,
    onLike,
    onReplyClick,
}: Props) => {
    const isEditingReply = editingPostId === reply.id
    const isReplyOwner = currentUserId === reply.author?.id

    return (
        <div className="flex gap-3">
            {reply.author?.avatar_url ? (
                <img
                    src={reply.author.avatar_url}
                    alt={reply.author.display_name || LAYOUT_ALT.AVATAR}
                    className="size-8 rounded-full object-cover"
                />
            ) : (
                <div className="size-8 rounded-full bg-slate-200" />
            )}

            <div className="min-w-0 flex-1">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">
                            {reply.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                        </p>

                        {isReplyOwner && (
                            <OwnerActionMenu
                                isDeleting={deletingPostId === reply.id}
                                onEdit={() => onEditStart(reply)}
                                onDelete={() => onDeletePost(reply)}
                            />
                        )}
                    </div>

                    {isEditingReply ? (
                        <InlinePostEditor
                            content={editContent}
                            media={editMedia}
                            placeholder={`${COMMENT_TEXT.REPLY_PLACEHOLDER_PREFIX} ${reply.author?.display_name ?? COMMENT_TEXT.REPLY_FALLBACK_TARGET}...`}
                            maxMediaHeightClass="max-h-56"
                            isSaving={isUpdatingPost}
                            isUploading={isUploadingEditMedia}
                            onContentChange={onContentChange}
                            onMediaChange={onEditMediaChange}
                            onMediaRemove={onEditMediaRemove}
                            onCancel={onEditCancel}
                            onSubmit={() => onEditSubmit(reply.id)}
                        />
                    ) : (
                        <>
                            {reply.content ? <p className="mt-1 text-sm text-slate-600">{reply.content}</p> : null}

                            <PostMediaViewer
                                media={reply.media}
                                alt={COMMENT_TEXT.REPLY_MEDIA_ALT}
                                maxHeightClass="max-h-56"
                                widthClass="w-1/2"
                            />
                        </>
                    )}
                </div>

                <div className="mt-2 flex items-center gap-3">
                    <FeedAction
                        icon={<Heart className="size-4 fill-current" />}
                        value={reply.likes_count}
                        active={reply.is_liked}
                        disabled={pendingLikeIds.includes(reply.id)}
                        handleOnClick={() => onLike(reply.id, reply.is_liked)}
                    />

                    <button
                        type="button"
                        onClick={() => onReplyClick(commentId, reply.author?.username, 'reply', reply.id)}
                        className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
                    >
                        {POST_ACTION_LABEL.REPLY}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReplyItem
