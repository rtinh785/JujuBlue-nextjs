'use client'

import { POST_MEDIA_TYPE, POST_TEXT } from '@/core/constants/post.constant'
import type { PostMediaItem } from '@/core/types/post.type'

type Props = {
    media?: PostMediaItem[] | null
    alt?: string
    maxHeightClass?: string
    widthClass?: string
}

const PostMediaViewer = ({
    media,
    alt = POST_TEXT.MEDIA_ALT,
    maxHeightClass = 'max-h-64',
    widthClass = 'w-full',
}: Props) => {
    if (!media || media.length === 0) return null

    return (
        <div className="mt-3 space-y-3">
            {media.map((item, index) => {
                const className = `${maxHeightClass} ${widthClass} rounded-2xl object-cover`

                if (item.type === POST_MEDIA_TYPE.IMAGE) {
                    return <img key={`${item.url}-${index}`} src={item.url} alt={alt} className={className} />
                }

                return (
                    <video key={`${item.url}-${index}`} src={item.url} controls className={className}>
                        <track kind="captions" />
                    </video>
                )
            })}
        </div>
    )
}

export default PostMediaViewer
