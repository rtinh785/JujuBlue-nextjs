'use client'

import MediaPickerButton from '@/components/post/components/MediaPickerButton'
import MediaPreviewList from '@/components/post/components/MediaPreviewList'
import { POST_ACTION_LABEL } from '@/core/constants/post.constant'
import type { PostMediaItem } from '@/core/types/post.type'
import { useLingui } from '@lingui/react/macro'

type Props = {
    value: string
    placeholder: string
    media: PostMediaItem[]
    isCreating: boolean
    isUploadingMedia: boolean
    onChange: (value: string) => void
    onSubmit: () => void
    onCancel: () => void
    onMediaChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onMediaRemove: (index: number) => void
}

const ReplyComposer = ({
    value,
    placeholder,
    media,
    isCreating,
    isUploadingMedia,
    onChange,
    onSubmit,
    onCancel,
    onMediaChange,
    onMediaRemove,
}: Props) => {
    const submitDisabled = (!value.trim() && media.length === 0) || isCreating || isUploadingMedia
    const { t } = useLingui()
    return (
        <div className="mt-3 ml-4 space-y-3">
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                rows={2}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition outline-none focus:border-slate-300"
            />

            <MediaPreviewList media={media} onRemove={onMediaRemove} />

            <div className="flex items-center justify-between gap-2">
                <MediaPickerButton onChange={onMediaChange} disabled={isUploadingMedia || isCreating} />

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        {t(POST_ACTION_LABEL.CANCEL)}
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={submitDisabled}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isCreating ? t(POST_ACTION_LABEL.SENDING) : t(POST_ACTION_LABEL.REPLY)}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReplyComposer
