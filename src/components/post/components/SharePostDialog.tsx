'use client'

import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronDown, Globe, Lock, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { Button } from '@/components/base/button'
import AutoResizeTextarea from '@/components/common/AutoResizeTextarea'
import SharedPostPreview from '@/components/post/components/SharedPostPreview'
import type { PostWithStatus, SharePostReq } from '@/core/types/post.type'
import { sharePostSchema, type SharePostFormValues } from '@/schema/sharePost.schema'
import {
    POST_ACTION_LABEL,
    POST_TEXT,
    POST_VISIBILITY,
    POST_VISIBILITY_DESCRIPTION,
    POST_VISIBILITY_LABEL,
} from '@/core/constants/post.constant'
import { useLingui } from '@lingui/react/macro'

const VISIBILITY_OPTIONS = [
    {
        value: POST_VISIBILITY.PUBLIC,
        label: POST_VISIBILITY_LABEL.public,
        description: POST_VISIBILITY_DESCRIPTION.public,
        icon: Globe,
    },
    {
        value: POST_VISIBILITY.FOLLOWERS,
        label: POST_VISIBILITY_LABEL.followers,
        description: POST_VISIBILITY_DESCRIPTION.followers,
        icon: Users,
    },
    {
        value: POST_VISIBILITY.PRIVATE,
        label: POST_VISIBILITY_LABEL.private,
        description: POST_VISIBILITY_DESCRIPTION.private,
        icon: Lock,
    },
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
    const visibilityRef = useRef<HTMLDivElement | null>(null)
    const [visibilityOpen, setVisibilityOpen] = useState(false)
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
    const currentOption =
        VISIBILITY_OPTIONS.find((option) => option.value === selectedVisibility) ?? VISIBILITY_OPTIONS[0]
    const CurrentIcon = currentOption.icon
    const originalPost = post?.shared_post ?? post
    const { t } = useLingui()
    useEffect(() => {
        if (!open) return

        reset({
            content: '',
            visibility: POST_VISIBILITY.PUBLIC,
        })
        setVisibilityOpen(false)
    }, [open, reset])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (visibilityRef.current && !visibilityRef.current.contains(event.target as Node)) {
                setVisibilityOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
                    <DialogTitle className="text-base">{t(POST_TEXT.SHARE_DIALOG_TITLE)}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleShare)} className="space-y-4">
                    <Controller
                        control={control}
                        name="content"
                        render={({ field }) => (
                            <AutoResizeTextarea
                                {...field}
                                placeholder={t(POST_TEXT.SHARE_PLACEHOLDER)}
                                className="min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:border-slate-300"
                            />
                        )}
                    />

                    {errors.content?.message ? <p className="text-xs text-red-500">{errors.content.message}</p> : null}

                    <div ref={visibilityRef} className="relative inline-block">
                        <button
                            type="button"
                            onClick={() => setVisibilityOpen((prev) => !prev)}
                            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            <CurrentIcon className="size-3.5 text-slate-400" />
                            {t(currentOption.label)}
                            <ChevronDown
                                className={`size-3 text-slate-400 transition-transform ${visibilityOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {visibilityOpen && (
                            <div className="absolute top-full left-0 z-10 mt-1.5 w-64 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md">
                                {VISIBILITY_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setValue('visibility', value, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            })
                                            setVisibilityOpen(false)
                                        }}
                                        className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-slate-50 ${
                                            selectedVisibility === value
                                                ? 'font-semibold text-slate-800'
                                                : 'text-slate-500'
                                        }`}
                                    >
                                        <Icon className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                                        <span>
                                            <span className="block">{t(label)}</span>
                                            <span className="mt-0.5 block text-[11px] leading-4 font-normal text-slate-400">
                                                {t(description)}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
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
                            {t(POST_ACTION_LABEL.CANCEL)}
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? t(POST_ACTION_LABEL.SHARING) : t(POST_ACTION_LABEL.SHARE)}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default SharePostDialog
