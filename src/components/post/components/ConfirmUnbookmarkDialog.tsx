'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { Button } from '@/components/base/button'
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                            <Bookmark className="h-4 w-4 text-red-500" />
                        </div>
                        <DialogTitle className="text-base">Xoá bookmark?</DialogTitle>
                    </div>
                </DialogHeader>

                <p className="text-sm leading-6 text-slate-500 pl-12">
                    Bài viết sẽ bị xoá khỏi danh sách đã lưu của bạn.
                </p>

                <DialogFooter className="gap-2 pt-2 border-t-0 !mt-0">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                    >
                        Huỷ
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        disabled={isLoading}
                        onClick={onConfirm}
                    >
                        {isLoading ? 'Đang xoá...' : 'Xoá bookmark'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmUnbookmarkDialog