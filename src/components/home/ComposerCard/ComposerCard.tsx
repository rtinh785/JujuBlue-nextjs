import { useMyProfile } from '@/apis/user/user.query'
import MyButton from '@/components/MyButton'
import { ImagePlus, Globe, Users, Lock, ChevronDown, X } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { composerSchema, type ComposerFormValues } from '../schema/composer.schema'
import { useCreatePost, useUploadPostMedia } from '@/apis/posts/posts.query'
import { toast } from 'sonner'

const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public', icon: Globe },
    { value: 'followers', label: 'Followers', icon: Users },
    { value: 'private', label: 'Private', icon: Lock },
] as const

const ComposerCard = () => {
    const { data: profile } = useMyProfile()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [visibilityOpen, setVisibilityOpen] = useState(false)
    const { mutateAsync: createPostMutation, isPending } = useCreatePost()
    const { mutateAsync: uploadMediaMutation, isPending: isUploadingMedia } = useUploadPostMedia()
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ComposerFormValues>({
        resolver: yupResolver(composerSchema),
        defaultValues: {
            content: '',
            media: null,
            visibility: 'public',
        },
    })

    const selectedMedia = watch('media')
    const selectedVisibility = watch('visibility')
    const mediaFiles = selectedMedia ? Array.from(selectedMedia) : []

    const currentOption = VISIBILITY_OPTIONS.find((o) => o.value === selectedVisibility) ?? VISIBILITY_OPTIONS[0]
    const CurrentIcon = currentOption.icon

    const handleChooseMedia = () => {
        fileInputRef.current?.click()
    }

    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('media', event.target.files, { shouldValidate: true })
    }

    const handleRemoveMedia = (indexToRemove: number) => {
        const newFiles = mediaFiles.filter((_, i) => i !== indexToRemove)
        if (newFiles.length === 0) {
            setValue('media', null, { shouldValidate: true })
            if (fileInputRef.current) fileInputRef.current.value = ''
        } else {
            const dt = new DataTransfer()
            newFiles.forEach((f) => dt.items.add(f))
            setValue('media', dt.files, { shouldValidate: true })
        }
    }

    const onSubmit = async (values: ComposerFormValues) => {
        const hasContent = !!values.content?.trim()
        const hasMedia = !!values.media && values.media.length > 0

        if (!hasContent && !hasMedia) {
            toast.error('Phải có nội dung hoặc media mới đăng được', { position: 'top-left' })
            return
        }

        let uploadedMedia: { url: string; type: 'image' | 'video' }[] | null = null

        if (values.media && values.media.length > 0) {
            const files = Array.from(values.media)
            const res = await uploadMediaMutation(files)
            uploadedMedia = res.data.media
        }

        await createPostMutation({
            content: values.content?.trim() || '',
            visibility: values.visibility,
            media: uploadedMedia,
        })

        reset({
            content: '',
            media: null,
            visibility: 'public',
        })

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setVisibilityOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
        >
            <div className="flex items-start gap-3">
                {profile?.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={profile.username}
                        className="size-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-gray-300" />
                )}

                <div className="min-w-0 flex-1">
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        {...register('content')}
                    />

                    {/* Visibility Dropdown */}
                    <div ref={dropdownRef} className="relative mt-3 inline-block">
                        <button
                            type="button"
                            onClick={() => setVisibilityOpen((prev) => !prev)}
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
                                            setValue('visibility', value, { shouldValidate: true })
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

                    {/* Media preview */}
                    {mediaFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            {mediaFiles.map((file, index) => {
                                const previewUrl = URL.createObjectURL(file)
                                const isImage = file.type.startsWith('image/')

                                return (
                                    <div key={`${file.name}-${index}`} className="group relative">
                                        {isImage ? (
                                            <img
                                                src={previewUrl}
                                                alt={file.name}
                                                className="max-h-[500px] min-h-[200px] w-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={previewUrl}
                                                controls
                                                className="max-h-[500px] min-h-[200px] w-full rounded-xl object-cover"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(index)}
                                            className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleChooseMedia}
                            className="flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                            <ImagePlus className="size-4" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleMediaChange}
                        />

                        <button
                            type="submit"
                            disabled={isPending || isUploadingMedia}
                            className="bg-primary rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {isPending || isUploadingMedia ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ComposerCard