import ConfirmActionDialog from '@/components/common/ConfirmActionDialog'
import EditPostDialog from '@/components/post/components/EditPostDialog'
import SharePostDialog from '@/components/post/components/SharePostDialog'
import { POST_DIALOG } from '@/core/constants/post.constant'
import type { PostWithStatus, SharePostReq, UpdatePostReq } from '@/core/types/post.type'
import { useLingui } from '@lingui/react/macro'
import { Trash2 } from 'lucide-react'

type Props = {
    post: PostWithStatus
    deleteDialogOpen: boolean
    editDialogOpen: boolean
    shareDialogOpen: boolean
    isDeletingPost: boolean
    isUpdatingPost: boolean
    isSharingPost: boolean
    onDeleteDialogOpenChange: (open: boolean) => void
    onEditDialogOpenChange: (open: boolean) => void
    onShareDialogOpenChange: (open: boolean) => void
    onConfirmDelete: () => void
    onSubmitUpdate: (body: UpdatePostReq) => void
    onSubmitShare: (postId: string, body: SharePostReq) => void
    onOpenOriginalPost: (sharedPost: PostWithStatus['shared_post']) => void
}

const PostCardDialogs = ({
    post,
    deleteDialogOpen,
    editDialogOpen,
    shareDialogOpen,
    isDeletingPost,
    isUpdatingPost,
    isSharingPost,
    onDeleteDialogOpenChange,
    onEditDialogOpenChange,
    onShareDialogOpenChange,
    onConfirmDelete,
    onSubmitUpdate,
    onSubmitShare,
    onOpenOriginalPost,
}: Props) => {
    const { t } = useLingui()
    return (
        <>
            <ConfirmActionDialog
                open={deleteDialogOpen}
                title={t(POST_DIALOG.DELETE_TITLE)}
                description={t(POST_DIALOG.DELETE_DESCRIPTION)}
                confirmText={t(POST_DIALOG.DELETE_CONFIRM)}
                loadingText={t(POST_DIALOG.DELETE_LOADING)}
                isLoading={isDeletingPost}
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
                onOpenChange={onDeleteDialogOpenChange}
                onConfirm={onConfirmDelete}
            />

            <EditPostDialog
                post={post}
                open={editDialogOpen}
                isLoading={isUpdatingPost}
                onOpenChange={onEditDialogOpenChange}
                onSubmit={onSubmitUpdate}
            />

            <SharePostDialog
                post={post}
                open={shareDialogOpen}
                isLoading={isSharingPost}
                onOpenChange={onShareDialogOpenChange}
                onSubmit={onSubmitShare}
                onOpenOriginalPost={onOpenOriginalPost}
            />
        </>
    )
}

export default PostCardDialogs
