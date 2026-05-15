'use client'

import { Button } from '@/components/base/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { COMMON_ACTION_LABEL } from '@/core/constants/common.constant'

type Props = {
    open: boolean
    title: string
    description: string
    confirmText: string
    loadingText?: string
    isLoading?: boolean
    icon: React.ReactNode
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

const ConfirmActionDialog = ({
    open,
    title,
    description,
    confirmText,
    loadingText = confirmText,
    isLoading = false,
    icon,
    onOpenChange,
    onConfirm,
}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">{icon}</div>

                        <DialogTitle className="text-base">{title}</DialogTitle>
                    </div>
                </DialogHeader>

                <p className="pl-12 text-sm leading-6 text-slate-500">{description}</p>

                <DialogFooter className="!mt-0 gap-2 border-t-0 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                    >
                        {COMMON_ACTION_LABEL.CANCEL}
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        disabled={isLoading}
                        onClick={onConfirm}
                    >
                        {isLoading ? loadingText : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmActionDialog
