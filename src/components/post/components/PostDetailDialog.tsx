'use client'

import PostCard from '@/components/post/PostCard'
import { PostWithStatus } from '@/core/types/post.type'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'

type Props = {
    post: PostWithStatus | null
    currentUserId?: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

const PostDetailDialog = ({ post, currentUserId, open, onOpenChange }: Props) => {
    if (!post) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] !max-w-[840px] overflow-y-auto p-0" showCloseButton>
                <DialogHeader className="border-b border-slate-100 px-4 py-4">
                    <DialogTitle>Bài viết của {post.author?.display_name ?? 'Unknown'}</DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <PostCard post={post} currentUserId={currentUserId} />

                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                        <p className="text-sm font-medium text-slate-600">Chưa có bình luận nào</p>
                        <p className="mt-1 text-xs text-slate-400">Hãy là người đầu tiên bình luận.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PostDetailDialog
