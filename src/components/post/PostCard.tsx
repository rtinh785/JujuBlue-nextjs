import FeedAction from '@/components/home/FeedAction'
import { Post } from '@/core/types/post.type'
import { MessageCircle, Repeat2, Heart, Share2 } from 'lucide-react'
import React from 'react'

type Props = {
    post: Post
    fallbackAuthor?: string
    fallbackHandle?: string
    fallbackAvatar?: string
}

const PostCard = ({ post, fallbackAuthor, fallbackHandle, fallbackAvatar }: Props) => {
    const author = post.author ?? fallbackAuthor ?? 'Unknown'
    const handle = post.handle ?? fallbackHandle ?? ''
    const avatar = post.avatar ?? fallbackAvatar ?? ''

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
                <img src={avatar} alt={author} className="size-11 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{author}</h3>
                        {handle ? <span className="text-xs text-slate-400">{handle}</span> : null}
                        <span className="text-xs text-slate-300">{post.time}</span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.content}</p>

                    {post.image && (
                        <img
                            src={post.image}
                            alt={author}
                            className="mt-4 h-[260px] w-full rounded-2xl object-cover sm:h-[340px]"
                        />
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <FeedAction icon={<Heart className="size-4 fill-current" />} value={post.likes} active />
                        <FeedAction icon={<MessageCircle className="size-4" />} value={post.comments} />
                        <FeedAction icon={<Repeat2 className="size-4" />} value={post.reposts} />

                        <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
                            <Share2 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PostCard
