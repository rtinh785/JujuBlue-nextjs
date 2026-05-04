'use client'

import { useEffect, useRef, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { Button } from '@/components/base/button'
import type { PostMediaItem, PostWithStatus } from '@/core/types/post.type'
import { EditPostFormValues, editPostSchema } from '@/components/post/schema/edit-post.schema'
import { useUploadPostMedia } from '@/apis/posts/posts.query'
import { formatPostTime } from '@/utils/helper'
import { ChevronDown, Globe, ImagePlus, Lock, Users, X } from 'lucide-react'

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
    { value: 'public', label: 'Public', icon: Globe },
    { value: 'followers', label: 'Followers', icon: Users },
    { value: 'private', label: 'Private', icon: Lock },
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
            visibility: 'public',
        },
    })

    const [editingMedia, setEditingMedia] = useState<PostMediaItem[]>([])
    const [visibilityOpen, setVisibilityOpen] = useState(false)
    const visibilityRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Auto-resize textarea khi dialog mở với nội dung có sẵn
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
            visibility: (post.visibility as EditPostFormValues['visibility']) ?? 'public',
        })
        setEditingMedia(post.media ?? [])
    }, [post, open, reset])

    if (!post) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] !max-w-[840px] overflow-y-auto p-0" showCloseButton>
                <DialogHeader className="border-b border-slate-100 px-4 py-4">
                    <DialogTitle>Chỉnh sửa bài viết của {post.author?.display_name ?? 'Unknown'}</DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <form onSubmit={handleSubmit(handleEditSubmit)}>
                        <div className="flex items-start gap-3">
                            {post.author?.avatar_url ? (
                                <img
                                    src={post.author.avatar_url}
                                    alt={post.author.display_name}
                                    className="size-11 rounded-full object-cover"
                                />
                            ) : (
                                <div className="size-11 rounded-full bg-slate-200" />
                            )}

                            <div className="min-w-0 flex-1">
                                {/* Author meta */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900">
                                        {post.author?.display_name ?? 'Unknown'}
                                    </span>
                                    {post.author?.username && (
                                        <span className="text-xs text-slate-400">@{post.author.username}</span>
                                    )}
                                    <span className="text-xs text-slate-300">{formatPostTime(post.created_at)}</span>
                                </div>

                                {/* Visibility dropdown */}
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

                                {/* Textarea */}
                                <textarea
                                    rows={1}
                                    placeholder="Bạn đang nghĩ gì?"
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

                        {/* ✅ Media preview kéo ra ngoài flex, chiếm full width */}
                        {editingMedia.length > 0 && (
                            <div className="mt-3 flex flex-col gap-2">
                                {editingMedia.map((item, index) => (
                                    <div
                                        key={`${item.url}-${index}`}
                                        className="group relative overflow-hidden rounded-2xl"
                                    >
                                        {item.type === 'image' ? (
                                            <img
                                                src={item.url}
                                                alt="post media"
                                                className="max-h-[500px] min-h-[200px] w-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={item.url}
                                                controls
                                                className="max-h-[500px] min-h-[200px] w-full object-cover"
                                            />
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

                        {/* Toolbar */}
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <label className="flex size-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                                <ImagePlus className="size-4" />
                                <input
                                    type="file"
                                    accept="image/*,video/*"
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
                                    Huỷ
                                </Button>
                                <Button type="submit" disabled={isLoading || isUploadingMedia}>
                                    {isLoading || isUploadingMedia ? 'Đang lưu...' : 'Lưu thay đổi'}
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
