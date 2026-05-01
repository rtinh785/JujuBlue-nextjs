'use client'

import ConfirmActionDialog from '@/components/common/ConfirmActionDialog'
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
            title="Xoá bookmark?"
            description="Bài viết sẽ bị xoá khỏi danh sách đã lưu của bạn."
            confirmText="Xoá bookmark"
            loadingText="Đang xoá..."
            isLoading={isLoading}
            icon={<Bookmark className="h-4 w-4 text-red-500" />}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
        />
    )
}

export default ConfirmUnbookmarkDialog
