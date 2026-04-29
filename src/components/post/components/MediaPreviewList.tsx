'use client'

import type { PostMediaItem } from '@/core/types/post.type'
import { X } from 'lucide-react'

type Props = {
    media: PostMediaItem[]
    onRemove?: (index: number) => void
}

const MediaPreviewList = ({ media, onRemove }: Props) => {
    if (media.length === 0) return null

    return (
        <div className="grid grid-cols-2 gap-3 px-4 pt-3">
            {media.map((item, index) => (
                <div
                    key={`${item.url}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                    {item.type === 'image' ? (
                        <img src={item.url} alt="preview" className="h-40 w-full object-cover" />
                    ) : (
                        <video src={item.url} className="h-40 w-full object-cover" />
                    )}

                    {onRemove && (
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default MediaPreviewList
