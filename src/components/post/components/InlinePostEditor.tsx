'use client'

import AutoResizeTextarea from '@/components/common/AutoResizeTextarea'
import MediaPickerButton from '@/components/post/components/MediaPickerButton'
import { POST_ACTION_LABEL, POST_MEDIA_TYPE, POST_TEXT } from '@/core/constants/post.constant'
import type { PostMediaItem } from '@/core/types/post.type'
import { X } from 'lucide-react'

type Props = {
    content: string
    media: PostMediaItem[]
    placeholder: string
    maxMediaHeightClass?: string
    isSaving: boolean
    isUploading: boolean
    onContentChange: (value: string) => void
    onMediaChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onMediaRemove: (index: number) => void
    onCancel: () => void
    onSubmit: () => void
}

const InlinePostEditor = ({
    content,
    media,
    placeholder,
    maxMediaHeightClass = 'max-h-64',
    isSaving,
    isUploading,
    onContentChange,
    onMediaChange,
    onMediaRemove,
    onCancel,
    onSubmit,
}: Props) => {
    const submitDisabled = (!content.trim() && media.length === 0) || isSaving || isUploading

    return (
        <div className="mt-3 space-y-3">
            <AutoResizeTextarea
                value={content}
                onChange={(event) => onContentChange(event.target.value)}
                placeholder={placeholder}
                className="min-h-6 w-full bg-transparent p-0 text-sm leading-6 text-slate-600 placeholder:text-slate-400"
            />

            {media.length > 0 ? (
                <div className="space-y-3">
                    {media.map((item, index) => (
                        <div key={`${item.url}-${index}`} className="group relative overflow-hidden rounded-2xl">
                            {item.type === POST_MEDIA_TYPE.IMAGE ? (
                                <img
                                    src={item.url}
                                    alt={POST_TEXT.EDIT_MEDIA_ALT}
                                    className={`${maxMediaHeightClass} w-full rounded-2xl object-cover`}
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    controls
                                    className={`${maxMediaHeightClass} w-full rounded-2xl object-cover`}
                                >
                                    <track kind="captions" />
                                </video>
                            )}

                            <button
                                type="button"
                                onClick={() => onMediaRemove(index)}
                                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="flex items-center justify-between">
                <MediaPickerButton onChange={onMediaChange} disabled={isUploading || isSaving} />

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        {POST_ACTION_LABEL.CANCEL}
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitDisabled}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? POST_ACTION_LABEL.SAVING : POST_ACTION_LABEL.SAVE_CHANGES}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InlinePostEditor
