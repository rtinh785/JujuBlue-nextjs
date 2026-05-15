'use client'

import { useEffect, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { Button } from '@/components/base/button'
import type { PostMediaItem, PostWithStatus } from '@/core/types/post.type'
import { EditPostFormValues, editPostSchema } from '@/schema/editPost.schema'
import { useUploadPostMedia } from '@/apis/posts/posts.query'
import { formatPostTime } from '@/utils/helper'
import { ChevronDown, Globe, ImagePlus, Lock, Users, X } from 'lucide-react'
import {
    POST_ACTION_LABEL,
    POST_MEDIA_INPUT,
    POST_MEDIA_TYPE,
    POST_TEXT,
    POST_VISIBILITY,
    POST_VISIBILITY_LABEL,
} from '@/core/constants/post.constant'
import { LAYOUT_ALT } from '@/core/constants/layout.constant'

type Props = {
    post: PostWithStatus | null
    open: boolean
    isLoading?: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (body: EditPostFormValues & { media: PostMediaItem[] | null }) => void
}

const VISIBILITY_OPTIONS: {
    value: NonNullable<EditPostFormValues['visibility']>
    label: string
    icon: React.ElementType
}[] = [
    { value: POST_VISIBILITY.PUBLIC, label: POST_VISIBILITY_LABEL.public, icon: Globe },
    { value: POST_VISIBILITY.FOLLOWERS, label: POST_VISIBILITY_LABEL.followers, icon: Users },
    { value: POST_VISIBILITY.PRIVATE, label: POST_VISIBILITY_LABEL.private, icon: Lock },
]

const EditPostDialog = ({ post, open, isLoading = false, onOpenChange, onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<EditPostFormValues>({
        resolver: yupResolver(editPostSchema),
        defaultValues: {
            content: '',
            visibility: POST_VISIBILITY.PUBLIC,
        },
    })

    const [editingMedia, setEditingMedia] = useState<PostMediaItem[]>([])
    const [visibilityOpen, setVisibilityOpen] = useState(false)
    const visibilityRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Keep textarea height in sync with existing content when the dialog opens.
    useEffect(() => {
        if (!open || !textareaRef.current) return
        const el = textareaRef.current
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }, [open])

    const { mutateAsync: uploadPostMedia, isPending: isUploadingMedia } = useUploadPostMedia()
    const selectedVisibility = watch('visibility')
    const currentOption = VISIBILITY_OPTIONS.find((o) => o.value === selectedVisibility) ?? VISIBILITY_OPTIONS[0]
    const CurrentIcon = currentOption.icon

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (visibilityRef.current && !visibilityRef.current.contains(e.target as Node)) {
                setVisibilityOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleUploadMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])
        if (files.length === 0) return
        const res = await uploadPostMedia(files)
        setEditingMedia((prev) => [...prev, ...res.data.media])
        event.target.value = ''
    }

    const handleRemoveMedia = (indexToRemove: number) => {
        setEditingMedia((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleEditSubmit = (values: EditPostFormValues) => {
        onSubmit({
            ...values,
            media: editingMedia.length > 0 ? editingMedia : null,
        })
    }

    useEffect(() => {
        if (!post || !open) return
        reset({
            content: post.content ?? '',
            visibility: (post.visibility as EditPostFormValues['visibility']) ?? POST_VISIBILITY.PUBLIC,
        })
        setEditingMedia(post.media ?? [])
    }, [post, open, reset])

    if (!post) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] !max-w-[840px] overflow-y-auto p-0" showCloseButton>
                <DialogHeader className="border-b border-slate-100 px-4 py-4">
                    <DialogTitle>
                        {POST_TEXT.EDIT_DIALOG_TITLE_PREFIX} {post.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <form onSubmit={handleSubmit(handleEditSubmit)}>
                        <div className="flex items-start gap-3">
                            {post.author?.avatar_url ? (
                                <img
                                    src={post.author.avatar_url}
                                    alt={post.author.display_name || LAYOUT_ALT.AVATAR}
                                    className="size-11 rounded-full object-cover"
                                />
                            ) : (
                                <div className="size-11 rounded-full bg-slate-200" />
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900">
                                        {post.author?.display_name ?? POST_TEXT.UNKNOWN_AUTHOR}
                                    </span>
                                    {post.author?.username && (
                                        <span className="text-xs text-slate-400">@{post.author.username}</span>
                                    )}
                                    <span className="text-xs text-slate-300">{formatPostTime(post.created_at)}</span>
                                </div>

                                <div ref={visibilityRef} className="relative mt-2 inline-block">
                                    <button
                                        type="button"
                                        onClick={() => setVisibilityOpen((v) => !v)}
                                        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                    >
                                        <CurrentIcon className="size-3.5 text-slate-400" />
                                        {currentOption.label}
                                        <ChevronDown
                                            className={`size-3 text-slate-400 transition-transform ${visibilityOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {visibilityOpen && (
                                        <div className="absolute top-full left-0 z-10 mt-1.5 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md">
                                            {VISIBILITY_OPTIONS.map(({ value, label, icon: Icon }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => {
                                                        setValue('visibility', value, {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        })
                                                        setVisibilityOpen(false)
                                                    }}
                                                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-slate-50 ${
                                                        selectedVisibility === value
                                                            ? 'font-semibold text-slate-800'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    <Icon className="size-3.5 text-slate-400" />
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <textarea
                                    rows={1}
                                    placeholder={POST_TEXT.COMPOSER_PLACEHOLDER}
                                    className="mt-3 w-full resize-none overflow-hidden rounded-2xl px-4 pr-3 text-sm text-slate-700 transition outline-none focus:border-slate-300"
                                    onInput={(e) => {
                                        const el = e.currentTarget
                                        el.style.height = 'auto'
                                        el.style.height = `${el.scrollHeight}px`
                                    }}
                                    {...register('content')}
                                    ref={(el) => {
                                        register('content').ref(el)
                                        textareaRef.current = el
                                    }}
                                />

                                {errors.content?.message && (
                                    <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
                                )}
                            </div>
                        </div>

                        {editingMedia.length > 0 && (
                            <div className="mt-3 flex flex-col gap-2">
                                {editingMedia.map((item, index) => (
                                    <div
                                        key={`${item.url}-${index}`}
                                        className="group relative overflow-hidden rounded-2xl"
                                    >
                                        {item.type === POST_MEDIA_TYPE.IMAGE ? (
                                            <img
                                                src={item.url}
                                                alt={POST_TEXT.MEDIA_ALT}
                                                className="max-h-[500px] min-h-[200px] w-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={item.url}
                                                controls
                                                className="max-h-[500px] min-h-[200px] w-full object-cover"
                                            >
                                                <track kind="captions" />
                                            </video>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(index)}
                                            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <label className="flex size-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                                <ImagePlus className="size-4" />
                                <input
                                    type="file"
                                    accept={POST_MEDIA_INPUT.ACCEPT}
                                    multiple
                                    className="hidden"
                                    disabled={isUploadingMedia || isLoading}
                                    onChange={handleUploadMedia}
                                />
                            </label>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isLoading || isUploadingMedia}
                                    onClick={() => onOpenChange(false)}
                                >
                                    {POST_ACTION_LABEL.CANCEL}
                                </Button>
                                <Button type="submit" disabled={isLoading || isUploadingMedia}>
                                    {isLoading || isUploadingMedia
                                        ? POST_ACTION_LABEL.SAVING
                                        : POST_ACTION_LABEL.SAVE_CHANGES}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditPostDialog
