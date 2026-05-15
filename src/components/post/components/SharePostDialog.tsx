'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Globe, Lock, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { Button } from '@/components/base/button'
import AutoResizeTextarea from '@/components/common/AutoResizeTextarea'
import SharedPostPreview from '@/components/post/components/SharedPostPreview'
import type { PostWithStatus, SharePostReq } from '@/core/types/post.type'
import { sharePostSchema, type SharePostFormValues } from '@/schema/sharePost.schema'
import { POST_ACTION_LABEL, POST_TEXT, POST_VISIBILITY, POST_VISIBILITY_LABEL } from '@/core/constants/post.constant'

const VISIBILITY_OPTIONS = [
    { value: POST_VISIBILITY.PUBLIC, label: POST_VISIBILITY_LABEL.public, icon: Globe },
    { value: POST_VISIBILITY.FOLLOWERS, label: POST_VISIBILITY_LABEL.followers, icon: Users },
    { value: POST_VISIBILITY.PRIVATE, label: POST_VISIBILITY_LABEL.private, icon: Lock },
] as const

type Props = {
    post: PostWithStatus | null
    open: boolean
    isLoading?: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (postId: string, body: SharePostReq) => void
    onOpenOriginalPost?: (post: PostWithStatus['shared_post'] | PostWithStatus) => void
}

const SharePostDialog = ({ post, open, isLoading = false, onOpenChange, onSubmit, onOpenOriginalPost }: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SharePostFormValues>({
        resolver: yupResolver(sharePostSchema),
        defaultValues: {
            content: '',
            visibility: POST_VISIBILITY.PUBLIC,
        },
    })

    const selectedVisibility = watch('visibility')
    const originalPost = post?.shared_post ?? post

    useEffect(() => {
        if (!open) return

        reset({
            content: '',
            visibility: POST_VISIBILITY.PUBLIC,
        })
    }, [open, reset])

    if (!post || !originalPost) return null

    const handleShare = (values: SharePostFormValues) => {
        onSubmit(post.id, {
            content: values.content?.trim() || undefined,
            visibility: values.visibility ?? POST_VISIBILITY.PUBLIC,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-base">{POST_TEXT.SHARE_DIALOG_TITLE}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleShare)} className="space-y-4">
                    <Controller
                        control={control}
                        name="content"
                        render={({ field }) => (
                            <AutoResizeTextarea
                                {...field}
                                placeholder={POST_TEXT.SHARE_PLACEHOLDER}
                                className="min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:border-slate-300"
                            />
                        )}
                    />

                    {errors.content?.message ? <p className="text-xs text-red-500">{errors.content.message}</p> : null}

                    <div className="flex flex-wrap gap-2">
                        {VISIBILITY_OPTIONS.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    setValue('visibility', value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    })
                                }}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                    selectedVisibility === value
                                        ? 'border-slate-900 bg-slate-900 text-white'
                                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="size-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    <SharedPostPreview
                        post={originalPost}
                        onOpen={(selectedPost) => {
                            onOpenOriginalPost?.(selectedPost)
                        }}
                    />

                    <DialogFooter className="gap-2 border-t-0 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => onOpenChange(false)}
                        >
                            {POST_ACTION_LABEL.CANCEL}
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? POST_ACTION_LABEL.SHARING : POST_ACTION_LABEL.SHARE}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default SharePostDialog
