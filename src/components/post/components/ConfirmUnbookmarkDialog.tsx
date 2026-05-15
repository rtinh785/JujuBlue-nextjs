'use client'

import ConfirmActionDialog from '@/components/common/ConfirmActionDialog'
import { BOOKMARK_DIALOG } from '@/core/constants/bookmark.constant'
import { PostWithStatus } from '@/core/types/post.type'
import { Bookmark } from 'lucide-react'

type Props = {
    post: PostWithStatus | null
    open: boolean
    isLoading?: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

const ConfirmUnbookmarkDialog = ({ post, open, isLoading = false, onOpenChange, onConfirm }: Props) => {
    if (!post) return null

    return (
        <ConfirmActionDialog
            open={open}
            title={BOOKMARK_DIALOG.REMOVE_TITLE}
            description={BOOKMARK_DIALOG.REMOVE_DESCRIPTION}
            confirmText={BOOKMARK_DIALOG.REMOVE_CONFIRM}
            loadingText={BOOKMARK_DIALOG.REMOVE_LOADING}
            isLoading={isLoading}
            icon={<Bookmark className="h-4 w-4 text-red-500" />}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
        />
    )
}

export default ConfirmUnbookmarkDialog
