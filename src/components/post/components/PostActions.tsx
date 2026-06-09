import FeedAction from '@/components/common/FeedAction'
import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react'

type Props = {
    likesCount?: number | null
    commentsCount?: number | null
    sharesCount?: number | null
    isLiked?: boolean
    isBookmarked?: boolean
    isSharePending?: boolean
    canInteract?: boolean
    shareDisabledReason?: string
    onLike?: () => void
    onComment?: () => void
    onShare?: () => void
    onBookmark?: () => void
}

const PostActions = ({
    likesCount,
    commentsCount,
    sharesCount,
    isLiked = false,
    isBookmarked = false,
    isSharePending = false,
    canInteract = false,
    shareDisabledReason,
    onLike,
    onComment,
    onShare,
    onBookmark,
}: Props) => {
    return (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <FeedAction
                icon={<Heart className="size-4 fill-current" />}
                value={likesCount ?? 0}
                active={isLiked}
                handleOnClick={canInteract ? onLike : undefined}
            />

            <FeedAction
                icon={<MessageCircle className="size-4" />}
                value={commentsCount ?? 0}
                handleOnClick={canInteract ? onComment : undefined}
            />

            <div title={shareDisabledReason}>
                <FeedAction
                    icon={<Repeat2 className="size-4" />}
                    value={sharesCount ?? 0}
                    disabled={isSharePending}
                    handleOnClick={canInteract ? onShare : undefined}
                />
            </div>

            <FeedAction
                icon={<Bookmark className="size-4" />}
                active={isBookmarked}
                handleOnClick={canInteract ? onBookmark : undefined}
            />
        </div>
    )
}

export default PostActions
