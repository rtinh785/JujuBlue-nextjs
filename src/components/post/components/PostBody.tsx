import SharedPostPreview from '@/components/post/components/SharedPostPreview'
import { POST_MEDIA_TYPE, POST_TEXT } from '@/core/constants/post.constant'
import type { PostWithStatus } from '@/core/types/post.type'
import { useLingui } from '@lingui/react/macro'
import 'react-photo-view/dist/react-photo-view.css'
import { PhotoProvider, PhotoView } from 'react-photo-view'
type Props = {
    post: PostWithStatus
    canOpenDetail?: boolean
    onOpenDetail?: () => void
    onOpenSharedPost?: (sharedPost: PostWithStatus['shared_post']) => void
    enableImagePreview?: boolean
}

const PostBody = ({ post, canOpenDetail = false, onOpenDetail, onOpenSharedPost, enableImagePreview }: Props) => {
    const { t } = useLingui()
    return (
        <div className="mt-2">
            {post.content ? (
                <button
                    type="button"
                    onClick={canOpenDetail ? onOpenDetail : undefined}
                    className={`block w-full text-left text-sm leading-6 text-slate-600 ${
                        canOpenDetail ? 'cursor-pointer' : 'cursor-default'
                    }`}
                >
                    {post.content}
                </button>
            ) : null}

            {post.media && post.media.length > 0 ? (
                enableImagePreview ? (
                    <PhotoProvider>
                        <div className="mt-3 space-y-3">
                            {post.media.map((item, index) => {
                                if (item.type === POST_MEDIA_TYPE.IMAGE) {
                                    return (
                                        <PhotoView key={index} src={item.url}>
                                            <img
                                                src={item.url}
                                                alt={post.author.display_name || t(POST_TEXT.MEDIA_ALT)}
                                                onClick={canOpenDetail ? onOpenDetail : undefined}
                                                className={`max-h-[500px] min-h-[200px] w-full rounded-2xl object-cover ${
                                                    canOpenDetail ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                            />
                                        </PhotoView>
                                    )
                                }

                                return (
                                    <video
                                        key={`${item.url}-${index}`}
                                        src={item.url}
                                        onClick={canOpenDetail ? onOpenDetail : undefined}
                                        controls
                                        className={`max-h-[500px] min-h-[200px] w-full rounded-2xl object-cover ${
                                            canOpenDetail ? 'cursor-pointer' : 'cursor-default'
                                        }`}
                                    >
                                        <track kind="captions" />
                                    </video>
                                )
                            })}
                        </div>
                    </PhotoProvider>
                ) : (
                    <div className="mt-3 space-y-3">
                        {post.media.map((item, index) => {
                            if (item.type === POST_MEDIA_TYPE.IMAGE) {
                                return (
                                    <img
                                        key={`${item.url}-${index}`}
                                        src={item.url}
                                        alt={post.author.display_name || t(POST_TEXT.MEDIA_ALT)}
                                        onClick={canOpenDetail ? onOpenDetail : undefined}
                                        className={`max-h-[500px] min-h-[200px] w-full rounded-2xl object-cover ${
                                            canOpenDetail ? 'cursor-pointer' : 'cursor-default'
                                        }`}
                                    />
                                )
                            }

                            return (
                                <video
                                    key={`${item.url}-${index}`}
                                    src={item.url}
                                    onClick={canOpenDetail ? onOpenDetail : undefined}
                                    controls
                                    className={`max-h-[500px] min-h-[200px] w-full rounded-2xl object-cover ${
                                        canOpenDetail ? 'cursor-pointer' : 'cursor-default'
                                    }`}
                                >
                                    <track kind="captions" />
                                </video>
                            )
                        })}
                    </div>
                )
            ) : null}

            {post.shared_post ? (
                <SharedPostPreview post={post.shared_post} onOpen={onOpenSharedPost} />
            ) : post.was_shared_post ? (
                <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                    <p className="text-sm font-medium text-slate-500">{t(POST_TEXT.ORIGINAL_POST_UNAVAILABLE_TITLE)}</p>
                    <p className="mt-1 text-xs text-slate-400">{t(POST_TEXT.ORIGINAL_POST_UNAVAILABLE_DESCRIPTION)}</p>
                </div>
            ) : null}
        </div>
    )
}

export default PostBody
